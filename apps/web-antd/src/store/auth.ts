import type { Recordable, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getAccessCodesApi, getUserInfoApi, loginApi, logoutApi } from '#/api';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    let userInfo: null | UserInfo = null;
    console.log('authLogin userInfo', userInfo);

    try {
      loginLoading.value = true;
      const loginApiRes_ = await loginApi(params);
      console.log('authLogin loginApiRes_', loginApiRes_);
      const accessToken = loginApiRes_.token;

      if (!accessToken) {
        throw new Error('Failed to get access token');
      }

      accessStore.setAccessToken(accessToken);

      // 单独捕获 fetchUserInfo 和 getAccessCodesApi 的错误
      let accessCodes, fetchUserInfoResult;
      try {
        [fetchUserInfoResult, accessCodes] = await Promise.all([
          fetchUserInfo(),
          getAccessCodesApi(),
        ]);
      } catch (error) {
        console.error('Failed to fetch user info or access codes:', error);
        throw error; // 重新抛出，让外层 catch 处理
      }

      userInfo = fetchUserInfoResult;
      userStore.setUserInfo(userInfo);
      accessStore.setAccessCodes(accessCodes);

      if (accessStore.loginExpired) {
        accessStore.setLoginExpired(false);
      } else {
        if (onSuccess) {
          try {
            await onSuccess();
          } catch (error) {
            console.error('onSuccess callback failed:', error);
          }
        } else {
          await router.push(
            userInfo.homePath || preferences.app.defaultHomePath,
          );
        }
      }

      if (userInfo?.realName) {
        notification.success({
          description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
          duration: 3,
          message: $t('authentication.loginSuccess'),
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      notification.error({
        message: $t('authentication.loginFailed'),
        // description: error?.message || $t('authentication.loginFailedDesc'),
        description: $t('authentication.loginFailed'),
      });
      throw error; // 允许调用方进一步处理
    } finally {
      loginLoading.value = false;
    }

    return { userInfo };
  }
  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout API failed:', error);
    }

    resetAllStores();
    accessStore.setLoginExpired(false);

    try {
      // 回登录页带上当前路由地址
      await router.replace({
        path: LOGIN_PATH,
        query: redirect
          ? { redirect: encodeURIComponent(router.currentRoute.value.fullPath) }
          : {},
      });
    } catch (error) {
      console.error('Route redirect failed:', error);
    }
  }

  async function fetchUserInfo() {
    try {
      const userInfo = await getUserInfoApi();
      userStore.setUserInfo(userInfo);
      return userInfo;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error; // 让调用方处理
    }
  }
  function $reset() {
    loginLoading.value = false;
  }
  const elementPermissionList = ref<string[]>([]);

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
    elementPermissionList,
  };
});

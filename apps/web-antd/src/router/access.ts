import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';

import { message } from 'ant-design-vue';

// import { getAllMenusApi } from '#/api';
import { getMenuListByRole } from '#/api/sys/menu';
import type { RouteItem } from '#/api/sys/model/menuModel';
import { array2tree } from '@axolo/tree-array';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';
import { useAuthStore } from '#/store';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };
  console.warn('generateAccess accessMode', preferences.app.accessMode);
  console.log('generateAccess options', options);

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({
        content: `${$t('common.loadingMenu')}...`,
        duration: 1.5,
      });
      // const menuData = await getAllMenusApi();
      const menuData = await getMenuListByRole();
      const authStore = useAuthStore();
      console.log('generateAccess menus data', menuData.data);

      authStore.authLogin;
      authStore.elementPermissionList = [];
      // menuData.data.forEach((item, index, arr) => {
      //   console.log('generateAccess item', item.meta);
      //   console.log('generateAccess index', index);
      //   console.log('generateAccess arr', arr);
      // });
      menuData.data.forEach((val, _idx, _arr) => {
        if (val.component === 'LAYOUT') {
          val.component = '';
        } else if (
          val.component === 'IFrame' &&
          val.meta.realPath !== '' &&
          val.meta.realPath !== undefined
        ) {
          val.meta.link = val.meta.realPath;
          val.type = 'link';
        } else if (
          val.component === 'IFrame' &&
          val.meta.frameSrc !== undefined &&
          val.meta.frameSrc !== ''
        ) {
          val.type = 'embedded';
        }

        val.meta.hideInMenu = val.meta.hideMenu as any;
        val.meta.hideInTab = val.meta.hideTab as any;
        val.meta.hideInBreadcrumb = val.meta.hideBreadcrumb as any;
        val.meta.keepAlive = !val.meta.ignoreKeepAlive as boolean;
        val.meta.maxNumOfOpenTab = val.meta.dynamicLevel as any;
        val.meta.affixTab = val.meta.affix as any;

        if (val.permission && val.permission !== '') {
          authStore.elementPermissionList.push(val.permission);
        }
      });

      const treeData: RouteItem[] = array2tree(
        menuData.data.filter((val) => val.path !== ''),
      ) as RouteItem[];
      treeData.forEach((val, idx, arr) => {
        if (val.component === '' && arr[idx]) {
          arr[idx].component = 'BasicLayout';
        }
      });
      console.log('generateAccess treeData', treeData);

      return treeData;
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };

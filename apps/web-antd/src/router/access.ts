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
import { arrayToTree } from 'performant-array-to-tree';
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
      console.log('generateAccess menus list', menuData.list);

      authStore.authLogin;
      authStore.elementPermissionList = [];
      // menuData.data.forEach((item, index, arr) => {
      //   console.log('generateAccess item', item.meta);
      //   console.log('generateAccess index', index);
      //   console.log('generateAccess arr', arr);
      // });
      menuData.list.forEach((val, _idx, _arr) => {
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

      console.log('generateAccess menuData', menuData);
      console.log('generateAccess menuData list', menuData.list);

      // const treeData: RouteItem[] = arrayToTree(
      //   menuData.list.filter((val) => val.path !== ''),
      //   {
      //     dataField: null, // 不使用额外的数据字段
      //   },
      // ) as RouteItem[];

      const treeData = arrayToTree(
        menuData.list
          .filter((item) => item.path)
          .map((item) => ({ ...item, parentId: item.parentId || null })),
        { dataField: null },
      ) as RouteItem[];
      // const listWithNullRoot = menuData.list.map((item) => ({
      //   ...item,
      //   parentId: item.parentId === 0 ? null : item.parentId,
      // }));
      // const treeData: RouteItem[] = arrayToTree(
      //   listWithNullRoot.filter((val) => val.path !== ''),
      //   { dataField: null },
      // ) as RouteItem[];
      console.log('generateAccess treeData111', treeData);

      treeData.forEach((val, idx, arr) => {
        if (val.component === '' && arr[idx]) {
          arr[idx].component = 'BasicLayout';
        }
      });
      console.log('generateAccess treeData222', treeData);

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

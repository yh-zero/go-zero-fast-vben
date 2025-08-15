<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { RoleInfo } from '#/api/sys/model/roleModel';

import { getRoleList, updateRole } from '#/api/sys/role';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { Page } from '@vben/common-ui';
import { Switch } from 'ant-design-vue';
import { h } from 'vue';

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入 角色名称',
      },
      fieldName: 'name',
      label: '角色名称',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<RoleInfo> = {
  checkboxConfig: {
    highlight: true,
  },
  columns: [
    { type: 'checkbox', width: 60 },
    { field: 'name', title: '角色名称' },
    {
      field: 'status',
      title: '状态',
      width: 80,
      slots: {
        default: (e) =>
          h(Switch, {
            checked: e.row.status === 1,
            onClick: () => {
              const newStatus = e.row.status === 1 ? 2 : 1;
              updateRole({ id: e.row.id, status: newStatus }).then(() => {
                e.row.status = newStatus;
              });
            },
          }),
      },
    },
    { field: 'defaultRouter', title: '默认登录页面' },
    { field: 'remark', title: '备注' },
    { field: 'createdAt', title: '创建时间', formatter: 'formatDateTime' },
  ],
  toolbarConfig: {
    // 是否显示搜索表单控制按钮
    // @ts-ignore 正式环境时有完整的类型声明
    search: true,
  },
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    currentPage: 1, // 默认当前页码
    pageSize: 10, // 默认每页条数
    pageSizes: [2, 10, 20, 50, 100], // 可选择的每页条数
    // layout: 'Total, sizes, prev, pager, next, jumper', // 分页器布局
    total: 0, // 总条数（通常由数据加载后设置）
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await getRoleList({
          a: '',
          pageNo: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        return res;
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({ formOptions, gridOptions });
</script>

<template>
  <Page autoContentHeight>
    <Grid> </Grid>
  </Page>
</template>

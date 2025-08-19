<script lang="ts" setup>
import type { RoleInfo } from '#/api/sys/model/roleModel';

import { useVbenModal } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';

import { updateRole } from '#/api/sys/role';

import { ref } from 'vue';

defineOptions({
  name: 'RoleForm',
});

const isUpdate = ref(false);
const record = ref();
const gridApi = ref();

async function onSubmit(values: Record<string, any>) {
  const res = await updateRole(values as RoleInfo);
  console.log('onSubmit res', res);
  gridApi.value.reload();
}

const [Model, modalApi] = useVbenModal({
  fullscreenButton: false,
  onConfirm: async () => {
    const validationResult = await formApi.validate();
    if (validationResult.valid) {
      await formApi.submitForm();
      modalApi.close();
    }
  },
  onOpenChange(isOpen: boolean) {
    console.log('isOpen', isOpen);
    isUpdate.value = modalApi.getData()?.operationType == 'edit' ? true : false;
    record.value = modalApi.getData()?.record || {};
    gridApi.value = modalApi.getData()?.gridApi || {};
    modalApi.setState({
      title: isUpdate.value ? '编辑角色' : '添加角色',
    });
    if (isOpen) {
      formApi.setValues(record.value);
    }
  },
});

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
    },
    {
      fieldName: 'name',
      label: '角色名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入 角色名称',
      },
    },
    {
      fieldName: 'defaultRouter',
      label: '默认登录页面',
      component: 'Input',
      componentProps: {
        placeholder: '请输入 默认登录页面',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入 备注',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'RadioButtonGroup',
      componentProps: {
        options: [
          { label: '正常', value: 1 },
          { label: '禁用', value: 2 },
        ],
      },
    },
  ],
  showDefaultActions: false,
  layout: 'vertical',
});
</script>

<template>
  <Model>
    <Form />
  </Model>
</template>

<template>
  <div>
    <ele-pro-table
      row-key="menuId"
      :columns="columns"
      :datasource="datasource"
      :lazy="true"
      :pagination="false"
      :show-overflow-tooltip="true"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { listMenus } from '@/api/system/menu';

  /** 表格列配置 */
  const columns = ref([
    {
      type: 'index',
      columnKey: 'index',
      width: 50,
      align: 'center'
    },
    {
      prop: 'title',
      label: '菜单名称',
      minWidth: 140
    },
    {
      prop: 'path',
      label: '路由地址',
      minWidth: 120
    },
    {
      prop: 'sortNumber',
      label: '排序',
      width: 100,
      align: 'center'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      minWidth: 110,
      align: 'center'
    }
  ]);

  /** 表格数据源 */
  const datasource = ({ where, parent }) => {
    return listMenus({ ...where, parentId: parent?.menuId || 0 });
  };
</script>

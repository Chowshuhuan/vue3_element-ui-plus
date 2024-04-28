<template>
  <div>
    <ele-pro-table
      row-key="dictId"
      :columns="columns"
      :datasource="datasource"
      :show-overflow-tooltip="true"
    >
      <template #action="{ row }">
        <el-link type="primary" :underline="false">修改</el-link>
        <el-divider direction="vertical" />
        <el-link type="danger" :underline="false" @click="removeDict(row)">
          删除
        </el-link>
      </template>
      <template #expand="{ row }">
        <child-table :dictId="row.dictId" />
      </template>
    </ele-pro-table>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { pageDictionaries } from '@/api/system/dictionary';
  import ChildTable from './child-table.vue';

  /** 表格列配置 */
  const columns = ref([
    {
      type: 'expand',
      columnKey: 'expand',
      width: 50,
      align: 'center',
      slot: 'expand',
      fixed: 'left'
    },
    {
      type: 'index',
      columnKey: 'index',
      width: 50,
      align: 'center',
      fixed: 'left'
    },
    {
      prop: 'dictName',
      label: '字典名称',
      sortable: 'custom',
      minWidth: 110
    },
    {
      prop: 'dictCode',
      label: '字典代码',
      sortable: 'custom',
      minWidth: 110
    },
    {
      prop: 'sortNumber',
      label: '排序号',
      sortable: 'custom',
      width: 120,
      align: 'center'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      sortable: 'custom',
      minWidth: 110
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 120,
      align: 'center',
      slot: 'action',
      fixed: 'right'
    }
  ]);

  /** 表格数据源 */
  const datasource = ({ page, limit, orders }) => {
    return pageDictionaries({ ...orders, page, limit });
  };

  /** 删除字典 */
  const removeDict = (row) => {
    EleMessage.error('删除: ' + row.dictName);
  };
</script>

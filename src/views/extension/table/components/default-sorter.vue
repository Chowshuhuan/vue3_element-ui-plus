<template>
  <div>
    <ele-pro-table
      ref="tableRef"
      row-key="userId"
      :columns="columns"
      :datasource="datasource"
      :default-sort="{ prop: 'createTime', order: 'descending' }"
      :show-overflow-tooltip="true"
    >
      <template #toolbar>
        <el-button type="primary" class="ele-btn-icon" @click="setSorter">
          改为账号排序
        </el-button>
        <el-button type="primary" class="ele-btn-icon" @click="resetAll">
          重置排序筛选
        </el-button>
      </template>
    </ele-pro-table>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { pageUsers } from '@/api/system/user';

  /** 表格实例 */
  const tableRef = ref(null);

  /** 表格列配置 */
  const columns = ref([
    {
      type: 'index',
      columnKey: 'index',
      width: 50,
      align: 'center'
    },
    {
      prop: 'username',
      label: '用户账号',
      sortable: 'custom',
      minWidth: 110
    },
    {
      prop: 'nickname',
      label: '用户名',
      sortable: 'custom',
      minWidth: 110
    },
    {
      prop: 'sexName',
      label: '性别',
      sortable: 'custom',
      width: 110,
      align: 'center',
      filterMultiple: false,
      filters: [
        {
          text: '男',
          value: '男'
        },
        {
          text: '女',
          value: '女'
        }
      ],
      filteredValue: ['男']
    },
    {
      prop: 'createTime',
      label: '创建时间',
      sortable: 'custom',
      minWidth: 140,
      align: 'center'
    }
  ]);

  /** 表格数据源 */
  const datasource = ({ page, limit, orders, filters }) => {
    return pageUsers({ ...orders, ...filters, page, limit });
  };

  /** 设置排序 */
  const setSorter = () => {
    tableRef.value?.sort?.('username', 'ascending');
  };

  /** 重置排序和筛选 */
  const resetAll = () => {
    tableRef.value?.clearSort?.();
    tableRef.value?.clearFilter?.();
    tableRef.value?.reload?.({ sorter: {}, filter: {} });
  };
</script>

<template>
  <div style="padding: 0 16px">
    <el-input v-model="dictDataName" />
    <el-button @click="search">搜索</el-button>
    <ele-pro-table
      ref="tableRef"
      row-key="dictDataId"
      :columns="dictDataColumns"
      :datasource="dictDataDatasource"
      :show-overflow-tooltip="true"
      :toolbar="false"
      :pagination="false"
      :empty-props="false"
    >
      <template #action="{ row: d }">
        <el-link type="primary" :underline="false">修改</el-link>
        <el-divider direction="vertical" />
        <el-link type="danger" :underline="false" @click="removeDictData(d)">
          删除
        </el-link>
      </template>
    </ele-pro-table>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { listDictionaryData } from '@/api/system/dictionary-data';

  const props = defineProps({
    dictId: Number
  });

  const dictDataName = ref('');

  const tableRef = ref(null);

  const search = () => {
    tableRef.value.reload({
      where: {
        dictDataName: dictDataName.value
      }
    });
  };

  /** 字典数据列配置 */
  const dictDataColumns = ref([
    {
      type: 'index',
      columnKey: 'index',
      width: 50,
      align: 'center'
    },
    {
      prop: 'dictDataName',
      label: '字典数据名称',
      sortable: 'custom',
      minWidth: 120
    },
    {
      prop: 'dictDataCode',
      label: '字典数据代码',
      sortable: 'custom',
      minWidth: 120
    },
    {
      prop: 'sortNumber',
      label: '排序号',
      sortable: 'custom',
      width: 110,
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
      slot: 'action'
    }
  ]);

  /** 字典数据数据源 */
  const dictDataDatasource = ({ where, orders }) => {
    return listDictionaryData({ ...where, ...orders, dictId: props.dictId });
  };

  /** 删除字典数据 */
  const removeDictData = (row) => {
    EleMessage.error('删除: ' + row.dictDataName);
  };
</script>

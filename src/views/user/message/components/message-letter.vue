<template>
  <div>
    <ele-pro-table
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :datasource="datasource"
      :show-overflow-tooltip="true"
      v-model:selections="selections"
      highlight-current-row
    >
      <template #toolbar>
        <el-button type="primary" class="ele-btn-icon" @click="readBatch">
          标记已读
        </el-button>
        <el-button type="danger" class="ele-btn-icon" @click="remove()">
          删除消息
        </el-button>
      </template>
      <template #status="{ row }">
        <ele-text v-if="row.status === 0" type="warning">未读</ele-text>
        <ele-text v-else-if="row.status === 1" type="info">已读</ele-text>
      </template>
      <template #action="{ row }">
        <el-link type="primary" :underline="false" @click="reply(row)">
          回复
        </el-link>
        <el-divider direction="vertical" style="margin: 0" />
        <el-link type="danger" :underline="false" @click="remove(row)">
          删除
        </el-link>
      </template>
    </ele-pro-table>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { pageLetters } from '@/api/example';

  const emit = defineEmits(['reload']);

  /** 表格实例 */
  const tableRef = ref(null);

  /** 表格列配置 */
  const columns = ref([
    {
      type: 'selection',
      columnKey: 'selection',
      width: 50,
      align: 'center',
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
      prop: 'title',
      label: '私信内容',
      minWidth: 110
    },
    {
      prop: 'time',
      label: '发送时间',
      width: 140,
      align: 'center'
    },
    {
      prop: 'status',
      label: '状态',
      width: 90,
      align: 'center',
      slot: 'status'
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 120,
      align: 'center',
      slot: 'action'
    }
  ]);

  /** 列表选中数据 */
  const selections = ref([]);

  /** 表格数据源 */
  const datasource = ({ page, limit, where, orders }) => {
    return pageLetters({ ...where, ...orders, page, limit });
  };

  /** 回复 */
  const reply = (row) => {
    console.log(JSON.stringify(row));
    EleMessage.success('点击了回复');
  };

  /** 删除 */
  const remove = (row) => {
    const rows = row == null ? selections.value : [row];
    if (!rows.length) {
      EleMessage.error('请至少选择一条数据');
      return;
    }
    EleMessage.error('点击了删除');
  };

  /** 标记已读 */
  const readBatch = () => {
    if (!selections.value.length) {
      EleMessage.error('请至少选择一条数据');
      return;
    }
    EleMessage.success('点击了标记已读');
    updateUnReadNum();
  };

  /** 触发更新未读数量事件 */
  const updateUnReadNum = () => {
    emit('reload');
  };
</script>

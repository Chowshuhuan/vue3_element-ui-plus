<template>
  <div style="padding-top: 8px">
    <ele-pro-table
      ref="tableRef"
      row-key="userId"
      :columns="columns"
      :datasource="data"
      :show-overflow-tooltip="true"
      :loading="loading"
      :pagination="false"
      class="sortable-table"
      @refresh="query"
    >
      <template #handle>
        <ele-text
          :icon="HolderOutlined"
          type="placeholder"
          class="sort-handle"
        />
      </template>
      <template #status="{ row }">
        <ele-dot v-if="row.status === 0" text="正常" size="8px" />
        <ele-dot
          v-else-if="row.status === 1"
          text="冻结"
          type="danger"
          :ripple="false"
          size="8px"
        />
      </template>
    </ele-pro-table>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import SortableJs from 'sortablejs';
  import { HolderOutlined } from '@/components/icons';
  import { listUsers } from '@/api/system/user';

  /** 排序实例 */
  let sortableIns = null;

  /** 表格实例 */
  const tableRef = ref(null);

  /** 表格列配置 */
  const columns = ref([
    {
      columnKey: 'handle',
      width: 58,
      align: 'center',
      slot: 'handle',
      fixed: 'left'
    },
    {
      prop: 'username',
      label: '用户账号',
      minWidth: 110
    },
    {
      prop: 'nickname',
      label: '用户名',
      minWidth: 110
    },
    {
      prop: 'sexName',
      label: '性别',
      width: 110,
      align: 'center'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      minWidth: 140,
      align: 'center'
    },
    {
      prop: 'status',
      label: '状态',
      width: 110,
      align: 'center',
      slot: 'status',
      fixed: 'right'
    }
  ]);

  /** 表格数据 */
  const data = ref([]);

  /** 请求状态 */
  const loading = ref(true);

  /** 请求数据 */
  const query = () => {
    loading.value = true;
    listUsers().then((list) => {
      data.value = list;
      loading.value = false;
    });
  };
  query();

  onMounted(() => {
    // 支持拖拽排序
    const tableEl = tableRef.value?.$el;
    if (!tableEl) {
      return;
    }
    const tbodyEl = tableEl.querySelector(
      '.el-table__inner-wrapper > .el-table__body-wrapper .el-table__body > tbody'
    );
    sortableIns = new SortableJs(tbodyEl, {
      animation: 300,
      draggable: '.el-table__row',
      handle: '.sort-handle',
      forceFallback: true,
      onUpdate: ({ oldDraggableIndex, newDraggableIndex }) => {
        if (
          typeof oldDraggableIndex === 'number' &&
          typeof newDraggableIndex === 'number'
        ) {
          const temp = [...data.value];
          temp.splice(
            newDraggableIndex,
            0,
            temp.splice(oldDraggableIndex, 1)[0]
          );
          data.value = temp;
          Array.from(
            tbodyEl.querySelectorAll('.el-table__row.hover-row')
          ).forEach((el) => {
            el.classList.remove('hover-row');
          });
        }
      },
      setData: () => {}
    });
  });

  onBeforeUnmount(() => {
    if (sortableIns) {
      sortableIns.destroy();
      sortableIns = null;
    }
  });
</script>

<style lang="scss" scoped>
  .sort-handle {
    cursor: move;
  }

  .sortable-table :deep(.el-table__row) {
    &.sortable-ghost {
      opacity: 0;
    }

    &.sortable-fallback {
      opacity: 1 !important;

      td.el-table__cell {
        background: var(--el-color-primary-light-8);
      }
    }
  }
</style>

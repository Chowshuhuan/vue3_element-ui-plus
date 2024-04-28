<template>
  <ele-card header="可搜索">
    <div style="max-width: 260px">
      <ele-table-select
        ref="selectRef"
        multiple
        clearable
        placeholder="请选择"
        value-key="userId"
        label-key="nickname"
        v-model="selectedValue"
        :table-props="tableProps"
        :popper-width="580"
        :cache-data="cacheData"
      >
        <template #topExtra>
          <demo-advanced-search @search="onSearch" />
        </template>
        <!-- 角色列 -->
        <template #roles="{ row }">
          <el-tag
            v-for="item in row.roles"
            :key="item.roleId"
            size="small"
            :disable-transitions="true"
          >
            {{ item.roleName }}
          </el-tag>
        </template>
      </ele-table-select>
    </div>
    <div style="margin-top: 14px">
      <el-button type="primary" @click="setValue">回显数据</el-button>
    </div>
  </ele-card>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import DemoAdvancedSearch from './demo-advanced-search.vue';
  import { pageUsers } from '@/api/system/user';

  /** 表格下拉选中值 */
  const selectedValue = ref([]);

  /** 选择框实例 */
  const selectRef = ref(null);

  /** 表格配置 */
  const tableProps = reactive({
    datasource: ({ page, limit, where, orders }) => {
      return pageUsers({ ...where, ...orders, page, limit });
    },
    columns: [
      {
        type: 'selection',
        columnKey: 'selection',
        width: 50,
        align: 'center',
        fixed: 'left',
        reserveSelection: true
      },
      {
        type: 'index',
        columnKey: 'index',
        width: 50,
        align: 'center',
        fixed: 'left'
      },
      {
        prop: 'username',
        label: '用户账号',
        sortable: 'custom'
      },
      {
        prop: 'nickname',
        label: '用户名',
        sortable: 'custom',
        slot: 'nickname'
      },
      {
        prop: 'sexName',
        label: '性别',
        sortable: 'custom',
        width: 80
      },
      {
        columnKey: 'roles',
        label: '角色',
        slot: 'roles'
      }
    ],
    showOverflowTooltip: true,
    toolbar: false,
    pagination: {
      pageSize: 6,
      layout: 'total, prev, pager, next, jumper',
      style: { padding: '0px' }
    },
    rowClickChecked: true
  });

  /** 缓存数据 */
  const cacheData = ref();

  /** 回显数据 */
  const setValue = () => {
    cacheData.value = [
      {
        userId: 40,
        nickname: '管理员'
      },
      {
        userId: 44,
        nickname: '用户四'
      },
      {
        userId: 45,
        nickname: '用户五'
      }
    ];
    selectedValue.value = [40, 44, 45];
  };

  /** 搜索 */
  const onSearch = (where) => {
    selectRef.value?.tableRef?.reload?.({ where, page: 1 });
  };
</script>

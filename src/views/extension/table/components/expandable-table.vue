<template>
  <div>
    <ele-pro-table
      row-key="userId"
      :columns="columns"
      :datasource="datasource"
      :show-overflow-tooltip="true"
    >
      <template #expand="{ row }">
        <div style="padding: 12px 16px 12px 32px">
          <div>
            <span>手机号码：</span>
            <span>{{ row.phone }}</span>
          </div>
          <div style="margin-top: 12px">
            <span>所属机构：</span>
            <span>{{ row.organizationName }}</span>
          </div>
          <div style="margin-top: 12px">
            <span>角&emsp;&emsp;色：</span>
            <span>
              <el-tag
                v-for="item in row.roles"
                :key="item.roleId"
                size="small"
                :disable-transitions="true"
              >
                {{ item.roleName }}
              </el-tag>
            </span>
          </div>
          <div style="margin-top: 12px">
            <span>状&emsp;&emsp;态：</span>
            <span>
              <ele-dot v-if="row.status === 0" text="正常" size="8px" />
              <ele-dot
                v-else-if="row.status === 1"
                text="冻结"
                type="danger"
                :ripple="false"
                size="8px"
              />
            </span>
          </div>
        </div>
      </template>
    </ele-pro-table>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { pageUsers } from '@/api/system/user';

  /** 表格列配置 */
  const columns = ref([
    {
      type: 'expand',
      columnKey: 'expand',
      width: 50,
      align: 'center',
      slot: 'expand'
    },
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
      prop: 'createTime',
      label: '创建时间',
      sortable: 'custom',
      minWidth: 110
    }
  ]);

  /** 表格数据源 */
  const datasource = ({ page, limit, orders }) => {
    return pageUsers({ ...orders, page, limit });
  };
</script>

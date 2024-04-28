<template>
  <div>
    <ele-pro-table
      :height="378"
      :virtual="true"
      row-key="userId"
      :columns="columns"
      :datasource="datasource"
      :show-overflow-tooltip="true"
      :pagination="{
        pageSize: 1000,
        pageSizes: [1000, 2000]
      }"
      :loading="loading"
      @refresh="onRefresh"
    >
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
      <template #expand="{ row }">
        <div style="padding: 12px 16px 12px 32px">
          <div>
            <span>角&emsp;&emsp;色：</span>
            <span>
              <el-tag
                v-for="item in row.roles"
                :key="item"
                size="small"
                :disable-transitions="true"
                style="margin-right: 6px"
              >
                {{ item }}
              </el-tag>
            </span>
          </div>
          <div style="margin-top: 12px">
            <span>出生日期：</span>
            <span>{{ row.birthday }}</span>
          </div>
          <div style="margin-top: 12px">
            <span>邮箱账户：</span>
            <span>{{ row.email }}</span>
          </div>
        </div>
      </template>
    </ele-pro-table>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import dayjs from 'dayjs';

  /** 表格列配置 */
  const columns = ref([
    {
      type: 'expand',
      columnKey: 'expand',
      width: 52,
      align: 'center',
      slot: 'expand',
      fixed: 'left'
    },
    {
      type: 'index',
      columnKey: 'index',
      width: 68,
      fixed: 'left'
    },
    {
      label: '用户账号',
      prop: 'username',
      minWidth: 160,
      sortable: 'custom'
    },
    {
      label: '用户名',
      prop: 'nickname',
      minWidth: 160,
      sortable: 'custom'
    },
    {
      label: '性别',
      prop: 'sex',
      width: 120,
      sortable: 'custom',
      align: 'center'
    },
    {
      label: '手机号码',
      prop: 'phone',
      minWidth: 160,
      sortable: 'custom'
    },
    {
      prop: 'status',
      label: '状态',
      width: 120,
      sortable: 'custom',
      slot: 'status'
    },
    {
      label: '创建时间',
      prop: 'createTime',
      minWidth: 180,
      sortable: 'custom'
    }
  ]);

  /** 表格数据源 */
  const datasource = ref([]);

  /** 数据请求状态 */
  const loading = ref(false);

  /** 刷新数据 */
  const onRefresh = () => {
    loading.value = true;
    setTimeout(() => {
      datasource.value = Array.from({ length: 2000 }).map((_, i) => {
        const userId = i + 1;
        const username = 'user-' + String(userId).padStart(6, '0');
        const random = Math.random();
        return {
          userId,
          username,
          nickname: '用户' + userId,
          sex: random < 0.5 ? '男' : '女',
          roles: [random < 0.3 ? '管理员' : '普通用户'],
          phone: String(12345678900 + userId),
          email: username + '@eleadmin.com',
          status: random < 0.2 ? 1 : 0,
          birthday: dayjs()
            .subtract(3 * userId, 'h')
            .format('YYYY-MM-DD'),
          createTime: dayjs()
            .subtract(45 * userId, 's')
            .format('YYYY-MM-DD HH:mm:ss')
        };
      });
      loading.value = false;
    }, 100);
  };

  onRefresh();
</script>

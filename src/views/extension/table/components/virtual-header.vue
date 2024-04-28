<template>
  <div>
    <ele-pro-table
      :height="418"
      :virtual="true"
      row-key="userId"
      :columns="columns"
      :datasource="datasource"
      :show-overflow-tooltip="true"
      :pagination="{
        pageSize: 1000,
        pageSizes: [1000, 2000]
      }"
      :border="true"
      :toolbar="{ theme: 'default' }"
      :loading="loading"
      :table-style="{ overflow: 'hidden' }"
      @refresh="onRefresh"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  const addresses = [
    ['浙江', '杭州', '西湖区'],
    ['江苏', '苏州', '姑苏区'],
    ['江西', '南昌', '青山湖区'],
    ['福建', '泉州', '丰泽区'],
    ['湖北', '武汉', '武昌区'],
    ['安徽', '黄山', '黄山区']
  ];

  /** 表格列配置 */
  const columns = ref([
    {
      type: 'index',
      columnKey: 'index',
      width: 68,
      align: 'center',
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
      label: '家庭住址',
      prop: 'address',
      align: 'center',
      children: [
        {
          label: '省份',
          prop: 'province',
          width: 120,
          sortable: 'custom'
        },
        {
          label: '城市',
          prop: 'city',
          width: 120,
          sortable: 'custom'
        },
        {
          label: '区域',
          prop: 'zone',
          width: 180,
          sortable: 'custom'
        }
      ]
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
        const index = Math.floor(
          Math.random() * (0 - addresses.length) + addresses.length
        );
        const [province, city, zone] = addresses[index];
        return {
          userId,
          username,
          nickname: '用户' + userId,
          createTime: dayjs()
            .subtract(45 * userId, 's')
            .format('YYYY-MM-DD HH:mm:ss'),
          province,
          city,
          zone
        };
      });
      loading.value = false;
    }, 100);
  };

  onRefresh();
</script>

<template>
  <div>
    <div class="option-wrapper">
      <option-item label="表头背景" :responsive="false">
        <el-switch v-model="toolbarBg" size="small" />
      </option-item>
      <option-item label="显示边框" :responsive="false">
        <el-switch v-model="border" size="small" />
      </option-item>
      <option-item label="显示斑马纹" :responsive="false">
        <el-switch v-model="stripe" size="small" />
      </option-item>
      <option-item label="显示表头" :responsive="false">
        <el-switch v-model="showHeader" size="small" />
      </option-item>
      <option-item label="显示表尾合计行" :responsive="false">
        <el-switch v-model="showSummary" size="small" />
      </option-item>
      <option-item label="行点击高亮" :responsive="false">
        <el-switch v-model="highlightCurrentRow" size="small" />
      </option-item>
      <option-item label="行点击勾选" :responsive="false">
        <el-switch v-model="rowClickChecked" size="small" />
      </option-item>
    </div>
    <ele-pro-table
      :height="418"
      :virtual="true"
      row-key="userId"
      :columns="columns"
      :datasource="datasource"
      :show-overflow-tooltip="true"
      :highlight-current-row="highlightCurrentRow"
      :row-click-checked="rowClickChecked"
      v-model:selections="selections"
      v-model:current="current"
      :pagination="{
        pageSize: 2000,
        pageSizes: [1000, 2000, 5000, 10000]
      }"
      :toolbar="{ theme: toolbarBg ? 'default' : 'plain' }"
      :loading="loading"
      :border="border"
      :stripe="stripe"
      :show-header="showHeader"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      @refresh="onRefresh"
      @filterChange="onFilterChange"
    >
      <template #toolbar>
        <el-button type="primary" class="ele-btn-icon" @click="getSelections">
          获取多选行数据
        </el-button>
        <el-button
          v-if="highlightCurrentRow"
          type="primary"
          class="ele-btn-icon"
          @click="getCurrent"
        >
          获取单选行数据
        </el-button>
      </template>
      <template #roles="{ row }">
        <el-tag
          v-for="item in row.roles"
          :key="item"
          size="small"
          :disable-transitions="true"
          style="margin-right: 6px"
        >
          {{ item }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <ele-dot v-if="row.status == 0" text="正常" size="8px" />
        <ele-dot
          v-else-if="row.status == 1"
          text="冻结"
          type="danger"
          :ripple="false"
          size="8px"
        />
      </template>
      <template #action="{ row }">
        <el-link type="primary" :underline="false" @click="openEdit(row)">
          修改
        </el-link>
        <el-divider direction="vertical" />
        <el-link type="danger" :underline="false" @click="remove(row)">
          删除
        </el-link>
      </template>
    </ele-pro-table>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import { EleMessage } from 'ele-admin-plus/es';
  import OptionItem from '@/views/extension/avatar/components/option-item.vue';

  /** 表格列配置 */
  const columns = ref([
    {
      type: 'selection',
      columnKey: 'selection',
      width: 52,
      align: 'center',
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
      label: '角色',
      prop: 'roles',
      slot: 'roles',
      minWidth: 160,
      filters: [
        { text: '管理员', value: '管理员' },
        { text: '普通用户', value: '普通用户' },
        { text: '游客', value: '游客' }
      ],
      filterMultiple: true
    },
    {
      label: '手机号码',
      prop: 'phone',
      minWidth: 160,
      sortable: 'custom'
    },
    {
      label: '邮箱',
      prop: 'email',
      minWidth: 180,
      sortable: 'custom'
    },
    {
      prop: 'status',
      label: '状态',
      width: 120,
      sortable: 'custom',
      slot: 'status',
      align: 'center',
      headerAlign: 'left',
      filters: [
        { text: '正常', value: '0' },
        { text: '冻结', value: '1' }
      ],
      filterMultiple: false
    },
    {
      label: '出生日期',
      prop: 'birthday',
      width: 160,
      align: 'center',
      sortable: 'custom'
    },
    {
      label: '创建时间',
      prop: 'createTime',
      minWidth: 140,
      sortable: 'custom'
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 160,
      align: 'center',
      slot: 'action',
      fixed: 'right'
    }
  ]);

  /** 表格数据源 */
  const datasource = ref([]);

  /** 数据请求状态 */
  const loading = ref(false);

  /** 表格多选选中数据 */
  const selections = ref([]);

  /** 表格单选选中数据 */
  const current = ref(null);

  /** 更多配置 */
  const toolbarBg = ref(false);
  const border = ref(false);
  const stripe = ref(false);
  const showHeader = ref(true);
  const showSummary = ref(true);
  const highlightCurrentRow = ref(false);
  const rowClickChecked = ref(false);

  /** 打开编辑弹窗 */
  const openEdit = (row) => {
    EleMessage.success('编辑:' + row.nickname);
  };

  /** 删除单个 */
  const remove = (row) => {
    EleMessage.error('删除:' + row.nickname);
  };

  let database;

  /** 刷新数据 */
  const onRefresh = () => {
    loading.value = true;
    setTimeout(() => {
      if (database) {
        loading.value = false;
        return;
      }
      database = Array.from({ length: 10000 }).map((_, i) => {
        const userId = i + 1;
        const username = 'user-' + String(userId).padStart(6, '0');
        const random = Math.random();
        return {
          userId,
          username,
          nickname: '用户' + userId,
          sex: random < 0.8 ? '男' : '女',
          roles: [random < 0.3 ? '管理员' : '普通用户'],
          phone: String(12345678900 + userId),
          email: username + '@eleadmin.com',
          status: random < 0.2 ? '1' : '0',
          birthday: dayjs()
            .subtract(3 * userId, 'h')
            .format('YYYY-MM-DD'),
          createTime: dayjs()
            .subtract(45 * userId, 's')
            .format('YYYY-MM-DD HH:mm:ss')
        };
      });
      datasource.value = database;
      loading.value = false;
    }, 100);
  };

  /** 表尾合计行 */
  const getSummaries = ({ columns, data }) => {
    const sums = [];
    columns.forEach((column, i) => {
      if (column.property === 'sex') {
        const num = data.filter((d) => d.sex == '女').length;
        sums[i] = ((num / data.length) * 100).toFixed(2) + '% (女)';
      } else if (column.property === 'status') {
        sums[i] = data.filter((d) => d.status == '1').length + ' (冻结)';
      } else if (column.property === 'username') {
        sums[i] = '合计';
      }
    });
    return sums;
  };

  /** 列筛选改变事件 */
  const onFilterChange = (filters) => {
    loading.value = true;
    setTimeout(() => {
      let result = [...database];
      Object.keys(filters).forEach((key) => {
        const filterValue = filters[key];
        if (filterValue && filterValue.length) {
          result = result.filter((d) => {
            if (Array.isArray(d[key])) {
              return d[key].some((t) => filterValue.includes(t));
            }
            return filterValue.includes(d[key]);
          });
        }
      });
      datasource.value = result;
      loading.value = false;
    }, 100);
  };

  /** 获取多选行数据 */
  const getSelections = () => {
    console.log(JSON.stringify(selections.value));
    EleMessage.success(
      '共 ' + selections.value.length + ' 条数据已打印在控制台'
    );
  };

  /** 获取选中行数据 */
  const getCurrent = () => {
    console.log(JSON.stringify(current.value));
    if (!current.value) {
      EleMessage.success('未选中任何数据');
    } else {
      EleMessage.success(current.value.nickname + '的数据已打印在控制台');
    }
  };

  onRefresh();
</script>

<style lang="scss" scoped>
  .option-wrapper {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    padding-top: 12px;

    :deep(.option-item) {
      margin: 0 20px 8px 0;

      .option-item-label + .option-item-body {
        padding-left: 4px;
      }
    }
  }
</style>

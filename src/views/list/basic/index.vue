<template>
  <ele-page hide-footer :flex-table="fixedHeight" style="min-height: 600px">
    <!-- 搜索表单 -->
    <search-form @search="onSearch" />
    <ele-card :flex-table="fixedHeight" :body-style="{ paddingBottom: 0 }">
      <!-- 提示信息 -->
      <ele-alert
        show-icon
        :closable="false"
        :style="{ marginBottom: toolDefault ? '12px' : '4px' }"
      >
        <template #title>
          <span>已选择&nbsp;</span>
          <ele-text strong type="primary" tag="span">
            {{ selections.length }}
          </ele-text>
          <span>&nbsp;项数据&emsp;</span>
          <span>其中冻结状态的用户有 </span>
          <b>{{ selections.filter((d) => d.status === 1).length }} 个 &emsp;</b>
          <el-link
            type="primary"
            :underline="false"
            style="vertical-align: 0px"
            @click="clearChoose"
          >
            清空
          </el-link>
        </template>
      </ele-alert>
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="userId"
        :columns="columns"
        :datasource="datasource"
        v-model:current="current"
        v-model:selections="selections"
        :show-overflow-tooltip="true"
        highlight-current-row
        row-click-checked
        :border="bordered"
        :toolbar="{ theme: toolDefault ? 'default' : 'plain' }"
        :default-sort="{ prop: 'createTime', order: 'ascending' }"
        :footer-style="{ paddingBottom: '20px' }"
        @done="onDone"
      >
        <template #toolbar>
          <el-button
            type="primary"
            :icon="PlusOutlined"
            class="ele-btn-icon"
            @click="openEdit()"
          >
            新建
          </el-button>
          <ele-dropdown
            :disabled="!selections.length"
            :items="[
              {
                title: '批量修改',
                command: 'edit',
                icon: EditOutlined
              },
              {
                title: '批量禁用',
                command: 'disabled',
                icon: MinusCircleOutlined
              },
              {
                title: '批量删除',
                command: 'del',
                icon: DeleteOutlined,
                danger: true,
                divided: true
              }
            ]"
            :icon-props="{ size: 15 }"
            placement="bottom-start"
            style="margin-left: 12px"
            @command="onDropClick"
          >
            <el-button :disabled="!selections.length" class="ele-btn-icon">
              <span>批量操作</span>
              <el-icon :size="12" style="margin: 0 -4px 0 2px">
                <ArrowDown />
              </el-icon>
            </el-button>
          </ele-dropdown>
        </template>
        <!-- 表头工具按钮 -->
        <template #tools>
          <div style="display: flex; align-items: center; flex-wrap: wrap">
            <div>边框&nbsp;</div>
            <el-switch v-model="bordered" size="small" />
            <el-divider direction="vertical" />
            <div>表头背景&nbsp;</div>
            <el-switch v-model="toolDefault" size="small" />
            <el-divider direction="vertical" />
            <div>高度铺满&nbsp;</div>
            <el-switch v-model="fixedHeight" size="small" />
            <el-divider direction="vertical" />
          </div>
        </template>
        <!-- 头像列 -->
        <template #avatar="{ row }">
          <el-avatar
            v-if="row.avatar"
            :src="row.avatar"
            :size="32"
            @click.stop=""
            style="vertical-align: -8px"
          />
          <el-avatar
            v-else
            :size="32"
            style="background: #1677ff; vertical-align: -8px"
            @click.stop=""
          >
            {{
              row.nickname && row.nickname.length > 2
                ? row.nickname.substring(row.nickname.length - 2)
                : row.nickname
            }}
          </el-avatar>
        </template>
        <!-- 状态列 -->
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
        <!-- 角色列 -->
        <template #roles="{ row }">
          <el-tag
            v-for="item in row.roles"
            :key="item.roleId"
            size="small"
            :disable-transitions="true"
            style="margin-right: 6px"
          >
            {{ item.roleName }}
          </el-tag>
        </template>
        <!-- 操作列 -->
        <template #action="{ row }">
          <el-link
            type="primary"
            :underline="false"
            @click.stop="openEdit(row)"
          >
            修改
          </el-link>
          <el-divider direction="vertical" />
          <el-link type="danger" :underline="false" @click.stop="remove(row)">
            删除
          </el-link>
        </template>
        <!-- 用户名表头 -->
        <template #nicknameHeader="{ column }">
          <div style="display: flex; align-items: center">
            <div style="flex: 1; overflow: hidden; text-overflow: ellipsis">
              {{ column.label }}
            </div>
            <nickname-filter @search="onNicknameFilter" />
          </div>
        </template>
      </ele-pro-table>
    </ele-card>
  </ele-page>
</template>

<script setup>
  import { ref, reactive, computed, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import { useI18n } from 'vue-i18n';
  import {
    PlusOutlined,
    ArrowDown,
    EditOutlined,
    MinusCircleOutlined,
    DeleteOutlined
  } from '@/components/icons';
  import { usePageTab } from '@/utils/use-page-tab';
  import { useDictData } from '@/utils/use-dict-data';
  import SearchForm from './components/search-form.vue';
  import NicknameFilter from './components/nickname-filter.vue';
  import { pageUsers } from '@/api/system/user';

  const { t } = useI18n();
  const { push } = useRouter();
  const { removePageTab } = usePageTab();

  /** 性别字典数据 */
  const [sexDicts] = useDictData(['sex']);

  /** 表格实例 */
  const tableRef = ref(null);

  /** 用户名筛选值 */
  const nicknameFilterValue = ref('');

  /** 表格搜索参数 */
  const lastWhere = reactive({});

  /** 表格列配置 */
  const columns = computed(() => {
    return [
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
        columnKey: 'avatar',
        prop: 'avatar',
        label: t('list.basic.table.avatar'),
        width: 100,
        align: 'center',
        slot: 'avatar'
      },
      {
        prop: 'username',
        label: t('list.basic.table.username'),
        minWidth: 110,
        sortable: 'custom'
      },
      {
        prop: 'nickname',
        label: t('list.basic.table.nickname'),
        minWidth: 110,
        sortable: 'custom',
        headerSlot: 'nicknameHeader'
      },
      {
        prop: 'organizationName',
        label: t('list.basic.table.organizationName'),
        minWidth: 110,
        sortable: 'custom'
      },
      {
        prop: 'phone',
        label: t('list.basic.table.phone'),
        minWidth: 110,
        sortable: 'custom'
      },
      {
        prop: 'email',
        label: t('list.basic.table.email'),
        minWidth: 110,
        sortable: 'custom'
      },
      {
        columnKey: 'roles',
        label: t('list.basic.table.roles'),
        minWidth: 110,
        slot: 'roles',
        hideInTable: true
      },
      {
        columnKey: 'sex',
        prop: 'sexName',
        label: t('list.basic.table.sexName'),
        width: 110,
        align: 'center',
        sortable: 'custom',
        filters: sexDicts.value.map((d) => {
          return { text: d.dictDataName, value: d.dictDataCode };
        }),
        filterMultiple: false
      },
      {
        prop: 'createTime',
        label: t('list.basic.table.createTime'),
        minWidth: 110,
        sortable: 'custom'
      },
      {
        prop: 'status',
        label: t('list.basic.table.status'),
        width: 110,
        sortable: 'custom',
        align: 'center',
        slot: 'status',
        filters: [
          { text: '正常', value: '0' },
          { text: '冻结', value: '1' }
        ],
        filterMultiple: false
      },
      {
        columnKey: 'action',
        label: t('list.basic.table.action'),
        width: 130,
        align: 'center',
        showOverflowTooltip: false,
        resizable: false,
        slot: 'action',
        fixed: 'right'
      }
    ];
  });

  /** 表格选中数据 */
  const selections = ref([]);

  /** 表格单选选中数据 */
  const current = ref(null);

  /** 表格是否显示边框 */
  const bordered = ref(false);

  /** 表头工具栏风格 */
  const toolDefault = ref(false);

  /** 表格固定高度 */
  const fixedHeight = ref(true);

  /** 表格数据源 */
  const datasource = ({ page, limit, where, orders, filters }) => {
    return pageUsers({ ...where, ...orders, ...filters, page, limit });
  };

  /** 表格数据请求完成事件 */
  const onDone = () => {
    // 回显 id 为 45、47、48 的数据的复选框
    nextTick(() => {
      const ids = [45, 47, 48];
      tableRef.value?.setSelectedRowKeys?.(ids);
    });
  };

  /** 搜索事件 */
  const onSearch = (where) => {
    Object.assign(lastWhere, where);
    doReload();
  };

  /** 刷新表格 */
  const reload = (where) => {
    tableRef.value?.reload?.({ page: 1, where });
  };

  /** 清空选择 */
  const clearChoose = () => {
    tableRef.value?.clearSelection?.();
  };

  /** 编辑 */
  const openEdit = (row) => {
    const path = row ? `/list/basic/edit/${row.userId}` : '/list/basic/add';
    removePageTab({ key: path });
    nextTick(() => {
      push(path);
    });
  };

  /** 删除 */
  const remove = (row) => {
    ElMessageBox.confirm(`确定要删除“${row.username}”吗?`, '系统提示', {
      type: 'warning',
      draggable: true
    })
      .then(() => {
        EleMessage.success('点击了删除');
      })
      .catch(() => {});
  };

  /** 下拉按钮点击 */
  const onDropClick = (command) => {
    if (command === 'del') {
      EleMessage.error('点击了批量删除');
    } else if (command === 'edit') {
      EleMessage.info({ message: '点击了批量修改', plain: true });
    } else if (command === 'disabled') {
      EleMessage.info({ message: '点击了批量禁用', plain: true });
    }
  };

  /** 表格搜索 */
  const doReload = () => {
    if (nicknameFilterValue.value) {
      reload({
        ...lastWhere,
        nickname: nicknameFilterValue.value
      });
    } else {
      reload(lastWhere);
    }
  };

  /** 用户名筛选事件 */
  const onNicknameFilter = (nickname) => {
    nicknameFilterValue.value = nickname;
    doReload();
  };
</script>

<script>
  export default {
    name: 'ListBasic'
  };
</script>

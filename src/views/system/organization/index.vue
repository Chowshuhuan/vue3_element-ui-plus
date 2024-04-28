<template>
  <ele-page
    flex-table
    :multi-card="false"
    hide-footer
    style="min-height: 420px"
  >
    <ele-card
      flex-table
      :body-style="{ padding: '0 0 0 16px', overflow: 'hidden' }"
    >
      <ele-split-panel
        ref="splitRef"
        flex-table
        size="256px"
        allow-collapse
        :custom-style="{ borderWidth: '0 1px 0 0', padding: '16px 0' }"
        :body-style="{ padding: '16px 16px 0 0', overflow: 'hidden' }"
        :style="{ height: '100%', overflow: 'visible' }"
      >
        <div style="padding: 0 16px 12px 0">
          <el-input
            clearable
            :maxlength="20"
            v-model="keywords"
            placeholder="输入机构名称搜索"
            :prefix-icon="SearchOutlined"
          />
        </div>
        <div style="margin-bottom: 12px">
          <el-button
            type="primary"
            class="ele-btn-icon"
            :icon="PlusOutlined"
            @click="openEdit()"
          >
            新建
          </el-button>
          <el-button
            type="warning"
            :disabled="!current"
            class="ele-btn-icon"
            :icon="EditOutlined"
            @click="openEdit(current)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            :disabled="!current"
            class="ele-btn-icon"
            :icon="DeleteOutlined"
            @click="remove"
          >
            删除
          </el-button>
        </div>
        <ele-loading
          :loading="loading"
          :style="{ flex: 1, paddingRight: '16px', overflow: 'auto' }"
        >
          <el-tree
            ref="treeRef"
            :data="data"
            highlight-current
            node-key="organizationId"
            :props="{ label: 'organizationName' }"
            :expand-on-click-node="false"
            :default-expand-all="true"
            :filter-node-method="filterNode"
            :style="{ '--ele-tree-item-height': '34px' }"
            @node-click="onNodeClick"
          />
        </ele-loading>
        <template #body>
          <org-user-list
            v-if="current"
            :organization-id="current.organizationId"
          />
        </template>
      </ele-split-panel>
    </ele-card>
    <org-edit
      v-model="showEdit"
      :data="editData"
      :organization-id="current?.organizationId"
      @done="query"
    />
  </ele-page>
</template>

<script setup>
  import { ref, nextTick, watch } from 'vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage, toTree } from 'ele-admin-plus/es';
  import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined
  } from '@/components/icons';
  import { useMobile } from '@/utils/use-mobile';
  import OrgUserList from './components/org-user-list.vue';
  import OrgEdit from './components/org-edit.vue';
  import {
    listOrganizations,
    removeOrganization
  } from '@/api/system/organization';

  /** 是否是移动端 */
  const { mobile } = useMobile();

  /** 分割面板组件 */
  const splitRef = ref(null);

  /** 树组件 */
  const treeRef = ref(null);

  /** 加载状态 */
  const loading = ref(true);

  /** 树形数据 */
  const data = ref([]);

  /** 选中数据 */
  const current = ref(null);

  /** 机构搜索关键字 */
  const keywords = ref('');

  /** 是否显示表单弹窗 */
  const showEdit = ref(false);

  /** 编辑回显数据 */
  const editData = ref(null);

  /** 查询 */
  const query = () => {
    loading.value = true;
    listOrganizations()
      .then((list) => {
        loading.value = false;
        data.value = toTree({
          data: list,
          idField: 'organizationId',
          parentIdField: 'parentId'
        });
        nextTick(() => {
          onNodeClick(data.value[0]);
        });
      })
      .catch((e) => {
        loading.value = false;
        EleMessage.error(e.message);
      });
  };

  /** 选择数据 */
  const onNodeClick = (row) => {
    // 移动端自动收起左侧
    if (current.value != null && mobile.value) {
      splitRef.value?.toggleCollapse?.(true);
    }
    if (row && row.organizationId) {
      current.value = row;
      treeRef.value?.setCurrentKey?.(row.organizationId);
    } else {
      current.value = null;
    }
  };

  /** 打开编辑弹窗 */
  const openEdit = (item) => {
    editData.value = item ?? null;
    showEdit.value = true;
  };

  /** 删除 */
  const remove = () => {
    const row = current.value;
    if (!row) {
      return;
    }
    ElMessageBox.confirm(`确定要删除“${row.organizationName}”吗?`, '系统提示', {
      type: 'warning',
      draggable: true
    })
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        removeOrganization(row.organizationId)
          .then((msg) => {
            loading.close();
            EleMessage.success(msg);
            query();
          })
          .catch((e) => {
            loading.close();
            EleMessage.error(e.message);
          });
      })
      .catch(() => {});
  };

  /** 树过滤方法 */
  const filterNode = (value, data) => {
    if (value) {
      return !!(data.organizationName && data.organizationName.includes(value));
    }
    return true;
  };

  /** 树过滤 */
  watch(keywords, (value) => {
    treeRef.value?.filter?.(value);
  });

  query();
</script>

<script>
  export default {
    name: 'SystemOrganization'
  };
</script>

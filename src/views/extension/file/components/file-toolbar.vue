<template>
  <ele-toolbar theme="plain" class="demo-file-toolbar">
    <el-upload
      action=""
      :show-upload-list="false"
      :before-upload="onUpload"
      style="display: inline-block; vertical-align: middle"
    >
      <el-button type="primary" class="ele-btn-icon" :icon="UploadOutlined">
        上传
      </el-button>
    </el-upload>
    <el-button
      class="ele-btn-icon"
      :icon="FolderAddOutlined"
      style="margin-left: 12px"
      @click="openFolderAdd"
    >
      新建文件夹
    </el-button>
    <el-button
      plain
      type="danger"
      :icon="DeleteOutlined"
      :disabled="!selections.length"
      class="ele-btn-icon hidden-xs-only"
      @click="removeBatch"
    >
      删除
    </el-button>
    <template #tools>
      <!-- 搜索框 -->
      <div style="max-width: 240px" class="hidden-sm-and-down">
        <el-input
          v-model="search"
          placeholder="搜索您的文件"
          :prefix-icon="SearchOutlined"
        />
      </div>
      <!-- 显示方式切换 -->
      <el-icon class="demo-file-tool" @click="toggleShowType">
        <TableOutlined v-if="grid" />
        <AppstoreOutlined v-else />
      </el-icon>
    </template>
  </ele-toolbar>
  <!-- 新建文件夹弹窗 -->
  <folder-edit
    v-model="folderAddVisible"
    :parent-id="parentId"
    @done="onDone"
  />
</template>

<script setup>
  import { ref } from 'vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import {
    UploadOutlined,
    FolderAddOutlined,
    DeleteOutlined,
    SearchOutlined,
    TableOutlined,
    AppstoreOutlined
  } from '@/components/icons';
  import { uploadFile } from '@/api/system/file';
  import { addUserFile, removeUserFiles } from '@/api/system/user-file';
  import FolderEdit from './folder-edit.vue';

  const props = defineProps({
    /** 是否网格展示 */
    grid: Boolean,
    /** 选中数据 */
    selections: Array,
    /** 父级id */
    parentId: Number
  });

  const emit = defineEmits(['update:grid', 'done']);

  /** 搜索关键字 */
  const search = ref('');

  /** 新建文件夹弹窗是否打开 */
  const folderAddVisible = ref(false);

  /** 上传 */
  const onUpload = (file) => {
    if (file.size / 1024 / 1024 > 100) {
      EleMessage.error('大小不能超过 100MB');
      return false;
    }
    const loading = EleMessage.loading('上传中..');
    uploadFile(file)
      .then((data) => {
        addUserFile({
          name: data.name,
          isDirectory: 0,
          parentId: props.parentId,
          path: data.path,
          length: data.length,
          contentType: data.contentType
        })
          .then(() => {
            loading.close();
            EleMessage.success('上传成功');
            onDone();
          })
          .catch((e) => {
            loading.close();
            EleMessage.error(e.message);
          });
      })
      .catch((e) => {
        loading.close();
        EleMessage.error(e.message);
      });
    return false;
  };

  /** 打开新建文件夹弹窗 */
  const openFolderAdd = () => {
    folderAddVisible.value = true;
  };

  /** 批量删除 */
  const removeBatch = () => {
    const rows = props.selections;
    ElMessageBox.confirm(
      '确定要删除“' + rows.map((d) => d.name).join(', ') + '”吗?',
      '系统提示',
      { type: 'warning', draggable: true }
    )
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        removeUserFiles(rows.map((d) => d.id))
          .then((msg) => {
            loading.close();
            EleMessage.success(msg);
            onDone();
          })
          .catch((e) => {
            loading.close();
            EleMessage.error(e.message);
          });
      })
      .catch(() => {});
  };

  /** 完成刷新列表数据 */
  const onDone = () => {
    emit('done');
  };

  /** 显示方式切换 */
  const toggleShowType = () => {
    emit('update:grid', !props.grid);
  };
</script>

<style lang="scss" scoped>
  .demo-file-toolbar :deep(.el-upload-list) {
    display: none;
  }

  /* 图标按钮 */
  .demo-file-tool {
    font-size: 18px;
    margin-left: 16px;
    cursor: pointer;
  }
</style>

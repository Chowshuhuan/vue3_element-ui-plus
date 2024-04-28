<template>
  <ele-page>
    <div class="form-builder">
      <div class="form-builder-side">
        <ele-card
          header="表单配置"
          :body-style="{ minHeight: '360px', padding: '16px' }"
        >
          <div style="display: flex; align-items: center">
            <div style="flex-shrink: 0">标题宽度：</div>
            <div style="flex: 1">
              <el-select v-model="config.labelWidth" class="ele-fluid">
                <el-option
                  v-for="item in labelWidthOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div style="flex-shrink: 0">&emsp;显示列数：</div>
            <div style="flex: 1">
              <el-select v-model="config.grid" class="ele-fluid">
                <el-option
                  v-for="item in gridOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div style="margin: 12px 0">
            <el-button
              type="primary"
              class="ele-btn-icon"
              :icon="PlusOutlined"
              @click="add"
            >
              添加表单项
            </el-button>
            <el-button
              type="primary"
              class="ele-btn-icon"
              :icon="CodeOutlined"
              @click="showPreview = true"
            >
              生成代码
            </el-button>
            <ele-popconfirm
              :width="220"
              placement="top-end"
              content="确定要清空所有表单项吗？"
              :popper-options="{
                modifiers: [{ name: 'offset', options: { offset: [20, 6] } }]
              }"
              @confirm="items = []"
            >
              <template #reference>
                <el-button
                  type="danger"
                  class="ele-btn-icon"
                  :icon="DeleteOutlined"
                >
                  清空
                </el-button>
              </template>
            </ele-popconfirm>
          </div>
          <ele-table class="items-table">
            <thead style="position: sticky; top: 0; z-index: 2">
              <tr>
                <th style="width: 38px"></th>
                <th style="text-align: center">表单项</th>
                <th style="text-align: center">字段名</th>
                <th style="width: 98px"></th>
              </tr>
            </thead>
            <vue-draggable
              tag="tbody"
              item-key="key"
              v-model="items"
              :animation="300"
              handle=".sort-handle"
              :set-data="() => void 0"
              :force-fallback="true"
            >
              <template #item="{ element }">
                <tr>
                  <td
                    :style="{
                      textAlign: 'center',
                      paddingLeft: 0,
                      paddingRight: 0,
                      width: '38px'
                    }"
                  >
                    <ele-text
                      size="md"
                      :icon="DragOutlined"
                      type="placeholder"
                      class="sort-handle"
                    />
                  </td>
                  <td>{{ element.prop }}</td>
                  <td>{{ element.label }}</td>
                  <td style="text-align: center; width: 98px">
                    <el-link
                      type="primary"
                      :underline="false"
                      @click="edit(element)"
                    >
                      配置
                    </el-link>
                    <el-divider direction="vertical" style="margin: 0 2px" />
                    <ele-popconfirm
                      :width="220"
                      placement="top-end"
                      :content="`确定要移除“${element.label}”吗？`"
                      :popper-options="{
                        modifiers: [
                          { name: 'offset', options: { offset: [20, 6] } }
                        ]
                      }"
                      @confirm="remove(element)"
                    >
                      <template #reference>
                        <el-link type="danger" :underline="false">
                          移除
                        </el-link>
                      </template>
                    </ele-popconfirm>
                  </td>
                </tr>
              </template>
            </vue-draggable>
          </ele-table>
        </ele-card>
      </div>
      <div class="form-builder-body">
        <form-preview
          ref="formPreviewRef"
          :key="formKey"
          :labelWidth="config.labelWidth"
          :grid="config.grid"
          :items="items"
          :data="formState"
          @unmount="onFormUnmount"
        />
      </div>
    </div>
    <item-add v-model="showAdd" @done="save" />
    <item-edit
      v-model="showEdit"
      :data="current"
      :grid="config.grid"
      @done="save"
    />
    <code-preview
      v-model="showPreview"
      :labelWidth="config.labelWidth"
      :grid="config.grid"
      :items="items"
    />
  </ele-page>
</template>

<script setup>
  import { ref, reactive, watch } from 'vue';
  import VueDraggable from 'vuedraggable';
  import { EleMessage } from 'ele-admin-plus/es';
  import {
    PlusOutlined,
    CodeOutlined,
    DeleteOutlined,
    DragOutlined
  } from '@/components/icons';
  import {
    labelWidthOptions,
    gridOptions,
    getColProps,
    getColSpan
  } from './components/util';
  import ItemAdd from './components/item-add.vue';
  import ItemEdit from './components/item-edit.vue';
  import CodePreview from './components/code-preview.vue';
  import FormPreview from './components/form-preview.vue';

  /** 表单配置 */
  const config = reactive({
    labelWidth: 80,
    grid: 2
  });

  /** 表单项 */
  const items = ref(
    [
      { label: '用户账号', prop: 'username', type: 'input', required: true },
      { label: '用户名', prop: 'nickname', type: 'input', required: true },
      {
        label: '性别',
        prop: 'sex',
        type: 'dictSelect',
        props: { code: 'sex' },
        required: true
      },
      {
        label: '角色',
        prop: 'roles',
        type: 'multipleSelect',
        options: [
          { label: '管理员', value: 1 },
          { label: '普通用户', value: 2 },
          { label: '游客', value: 3 }
        ],
        required: true
      },
      { label: '邮箱', prop: 'email', type: 'input', required: true },
      { label: '手机号', prop: 'phone', type: 'input', required: true },
      { label: '出生日期', prop: 'birthday', type: 'date', required: true },
      {
        label: '登录密码',
        prop: 'password',
        type: 'input',
        props: { clearable: false, showPassword: true, type: 'password' },
        required: true
      },
      {
        label: '个人简介',
        prop: 'introduction',
        type: 'textarea',
        colProps: { span: 24 }
      }
    ].map((d, i) => {
      return { ...d, key: `i-${i}` };
    })
  );

  /** 表单预览组件实例 */
  const formPreviewRef = ref(null);

  /** 用于更新表单组件 */
  const formKey = ref(0);

  /** 表单数据缓存 */
  const formState = ref({});

  /** 添加弹窗 */
  const showAdd = ref(false);

  /** 配置弹窗 */
  const showEdit = ref(false);

  /** 代码预览弹窗 */
  const showPreview = ref(false);

  /** 当前编辑数据 */
  const current = ref(null);

  /** 添加表单项 */
  const add = () => {
    showAdd.value = true;
  };

  /** 移除表单项 */
  const remove = (item) => {
    const index = items.value.indexOf(item);
    items.value.splice(index, 1);
  };

  /** 打开表单项配置弹窗 */
  const edit = (item) => {
    current.value = item;
    showEdit.value = true;
  };

  /** 保存表单项配置 */
  const save = (data) => {
    const index = items.value.findIndex((item) => item.key === data.key);
    const old = items.value.find((item) => item.prop === data.prop);
    if (index === -1) {
      if (old != null) {
        EleMessage.error(`字段名${data.prop}已经存在`);
        return;
      }
      formPreviewRef.value?.resetFields?.(data.prop);
      items.value.push(data);
      showAdd.value = false;
      formKey.value++;
      return;
    }
    if (old != null && old.key !== data.key) {
      EleMessage.error(`字段名${data.prop}已经存在`);
      return;
    }
    formPreviewRef.value?.resetFields?.(data.prop);
    items.value[index] = data;
    showEdit.value = false;
    formKey.value++;
  };

  /** 表单组件销毁事件 */
  const onFormUnmount = (form) => {
    formState.value = form;
  };

  /** 更新表单项跨列的值 */
  watch(
    () => config.grid,
    (grid, old) => {
      items.value.forEach((item) => {
        if (item.colProps && item.colProps.span) {
          const span = getColSpan(old, item.colProps.span);
          if (span > grid) {
            item.colProps = void 0;
          } else {
            const colProps = getColProps(grid, span);
            if (colProps == null) {
              item.colProps = void 0;
            } else {
              Object.assign(item.colProps, colProps);
            }
          }
        }
      });
    }
  );
</script>

<script>
  export default {
    name: 'FormBuild'
  };
</script>

<style lang="scss" scoped>
  .form-builder {
    display: flex;
    align-items: flex-start;
  }

  .form-builder-side {
    flex-shrink: 0;
    width: 360px;
  }

  .form-builder-body {
    flex: 1;
    margin-left: 16px;
  }

  @media screen and (max-width: 1200px) {
    .form-builder {
      display: block;
    }

    .form-builder-side {
      width: 100%;
    }

    .form-builder-body {
      margin-left: 0;
    }
  }

  //
  .items-table {
    table-layout: fixed;

    .sort-handle {
      cursor: move;
    }

    tr.sortable-ghost {
      opacity: 0;
    }

    tr.sortable-fallback {
      opacity: 1 !important;
      display: table !important;
      table-layout: fixed !important;

      td {
        background: var(--el-color-primary-light-8);
      }
    }
  }
</style>

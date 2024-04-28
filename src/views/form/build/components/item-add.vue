<template>
  <ele-drawer
    :size="980"
    title="添加表单项"
    :append-to-body="true"
    style="max-width: 100%"
    :model-value="modelValue"
    :body-style="{
      padding: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }"
    @update:modelValue="updateModelValue"
  >
    <div class="cover-wrapper">
      <ele-check-card
        :items="items"
        v-model="form.type"
        :row="{ gutter: 20 }"
        item-class="item-cover-wrap"
        :style="{ padding: '20px 20px 0 20px' }"
      >
        <template #item="{ item }">
          <div class="item-cover">
            <component :is="item.cover" />
          </div>
          <div>{{ item.label }}</div>
        </template>
      </ele-check-card>
    </div>
    <div style="display: flex; align-items: center; padding: 16px 20px">
      <div style="flex-shrink: 0">标题：</div>
      <div style="flex: 1">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.label"
          placeholder="请输入标题"
        />
      </div>
      <div style="flex-shrink: 0">&emsp;字段名：</div>
      <div style="flex: 1">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.prop"
          placeholder="请输入字段名"
        />
      </div>
    </div>
    <template #footer>
      <el-button @click="updateModelValue(false)">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </ele-drawer>
</template>

<script setup>
  import { watch } from 'vue';
  import { useFormData } from '@/utils/use-form-data';
  import { itemTypes, getOptionsAndProps } from './util';
  import { covers } from './covers';
  let id = 1;

  const emit = defineEmits(['done', 'update:modelValue']);

  const props = defineProps({
    /** 弹窗是否打开 */
    modelValue: Boolean
  });

  // 数据
  const items = itemTypes.map((d) => {
    return { ...d, col: { md: 6, sm: 8, xs: 12 }, cover: covers[d.value] };
  });

  /** 配置项表单数据 */
  const [form, resetFields, assignFields] = useFormData({
    key: void 0,
    label: '',
    prop: '',
    type: void 0,
    props: '',
    options: ''
  });

  /** 保存表单项配置 */
  const save = () => {
    id++;
    //updateModelValue(false);
    const { options, props } = getOptionsAndProps(form.type);
    emit('done', {
      ...form,
      props: props ? JSON.parse(props) : void 0,
      options: options ? JSON.parse(options) : void 0,
      required: true
    });
  };

  /** 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue) {
        const key = String(id).padStart(2, '0');
        assignFields({
          key,
          prop: 'f' + key,
          label: '字段' + key,
          type: 'input'
        });
      } else {
        resetFields();
      }
    }
  );
</script>

<style lang="scss" scoped>
  .cover-wrapper {
    flex: 1;
    overflow: auto;
    background: var(--el-bg-color-page);

    :deep(.ele-check-card-group .item-cover-wrap.ele-check-card) {
      font-size: 13px;
      padding: 6px 12px;
      margin: 0 0 20px 0;
      background: var(--el-bg-color);
      border: 2px solid transparent;
      transition: all 0.24s;

      &.is-checked {
        border-color: var(--el-color-primary);
      }

      &:hover {
        transform: translateY(-6px);
        box-shadow: var(--el-box-shadow-light);
      }
    }

    .item-cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 174px;
      height: 120px;
      margin: 0 auto;
    }
  }
</style>

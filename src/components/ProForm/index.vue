<!-- 高级表单 -->
<template>
  <ElForm
    ref="formRef"
    :model="model"
    :labelWidth="labelWidth"
    :statusIcon="statusIcon"
    :size="size"
    :disabled="disabled"
    @submit.prevent=""
  >
    <slot name="topExtra"></slot>
    <template v-if="!grid">
      <template v-for="item in items">
        <ProFormItem
          v-if="item.prop"
          :key="item.key ?? item.prop"
          :item="item"
          :model="model"
          :rules="rules"
          @updateValue="(value) => updateValue(item.prop, value)"
        >
          <template
            v-for="name in Object.keys($slots).filter(
              (k) =>
                !['default', 'footer', 'topExtra', 'bottomExtra'].includes(k)
            )"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </ProFormItem>
      </template>
      <ProFormFooter
        v-if="footer"
        :footerProps="footerProps"
        :footerSlots="footerSlots"
        :submitText="submitText"
        :resetText="resetText"
        @submit="submit"
        @reset="reset"
      >
        <template
          v-for="name in Object.keys($slots).filter(
            (k) => !['default', 'topExtra', 'bottomExtra'].includes(k)
          )"
          #[name]="slotProps"
        >
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </ProFormFooter>
    </template>
    <ElRow v-else v-bind="rowProps">
      <template v-for="item in items">
        <ElCol
          v-if="item.prop"
          :key="item.key ?? item.prop"
          v-bind="{
            ...(grid === true ? { span: 12 } : grid),
            ...(item.colProps || {})
          }"
        >
          <ProFormItem
            :item="item"
            :model="model"
            :rules="rules"
            @updateValue="(value) => updateValue(item.prop, value)"
          >
            <template
              v-for="name in Object.keys($slots).filter(
                (k) =>
                  !['default', 'footer', 'topExtra', 'bottomExtra'].includes(k)
              )"
              #[name]="slotProps"
            >
              <slot :name="name" v-bind="slotProps || {}"></slot>
            </template>
          </ProFormItem>
        </ElCol>
      </template>
      <ElCol v-if="footer" v-bind="footerColProps || {}">
        <ProFormFooter
          :footerProps="footerProps"
          :footerSlots="footerSlots"
          :submitText="submitText"
          :resetText="resetText"
          @submit="submit"
          @reset="reset"
        >
          <template
            v-for="name in Object.keys($slots).filter(
              (k) => !['default', 'topExtra', 'bottomExtra'].includes(k)
            )"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </ProFormFooter>
      </ElCol>
    </ElRow>
    <slot name="bottomExtra"></slot>
  </ElForm>
</template>

<script setup>
  import { ref } from 'vue';
  import ProFormItem from './components/pro-form-item.vue';
  import ProFormFooter from './components/pro-form-footer.vue';

  const props = defineProps({
    /** 表单数据 */
    model: {
      type: Object,
      required: true
    },
    /** 验证规则 */
    rules: Object,
    /** 标签长度 */
    labelWidth: {
      type: [String, Number],
      default: '80px'
    },
    /** 是否显示校验结果图标 */
    statusIcon: Boolean,
    /** 尺寸 */
    size: String,
    /** 是否禁用 */
    disabled: Boolean,
    /** 表单项 */
    items: {
      type: Array,
      required: true
    },
    /** 是否栅格布局 */
    grid: [Boolean, Object],
    /** ElRow属性 */
    rowProps: Object,
    /** 是否需要底栏 */
    footer: Boolean,
    /** 底栏ElFormItem属性 */
    footerProps: Object,
    /** 底栏ElFormItem插槽 */
    footerSlots: Object,
    /** 底栏ElCol属性 */
    footerColProps: {
      type: Object,
      default: () => {
        return { span: 24 };
      }
    },
    /** 提交按钮文本 */
    submitText: {
      type: String,
      default: '提交'
    },
    /** 重置按钮文本 */
    resetText: {
      type: String,
      default: '重置'
    }
  });

  const emit = defineEmits(['updateValue', 'submit', 'reset']);

  /** 表单实例 */
  const formRef = ref(null);

  /** 更新值 */
  const updateValue = (prop, value) => {
    emit('updateValue', prop, value);
  };

  /** 提交 */
  const submit = () => {
    formRef.value?.validate?.((valid) => {
      if (valid) {
        emit('submit', props.model);
      }
    });
  };

  /** 重置 */
  const reset = () => {
    resetFields();
    emit('reset');
  };

  /** 验证表单 */
  const validate = (callback) => {
    if (!formRef.value) {
      throw new Error('formRef is null');
    }
    return formRef.value.validate(callback);
  };

  /** 验证表单某个字段 */
  const validateField = (props, callback) => {
    if (!formRef.value) {
      throw new Error('formRef is null');
    }
    return formRef.value.validateField(props, callback);
  };

  /** 重置表单 */
  const resetFields = (props) => {
    if (!formRef.value) {
      throw new Error('formRef is null');
    }
    return formRef.value.resetFields(props);
  };

  /** 滚动到指定字段 */
  const scrollToField = (prop) => {
    if (!formRef.value) {
      throw new Error('formRef is null');
    }
    return formRef.value.scrollToField(prop);
  };

  /** 清理表单验证信息 */
  const clearValidate = (props) => {
    if (!formRef.value) {
      throw new Error('formRef is null');
    }
    return formRef.value.clearValidate(props);
  };

  defineExpose({
    formRef,
    validate,
    validateField,
    resetFields,
    scrollToField,
    clearValidate
  });
</script>

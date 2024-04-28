<!-- 表单底栏 -->
<template>
  <ElFormItem v-bind="footerProps || {}">
    <template
      v-for="name in Object.keys(footerSlots || {}).filter(
        (k) =>
          k !== 'footer' &&
          !!(footerSlots && footerSlots[k] && $slots[footerSlots[k]])
      )"
      #[name]="slotProps"
    >
      <slot :name="footerSlots?.[name]" v-bind="slotProps || {}"></slot>
    </template>
    <slot name="footer">
      <ElButton type="primary" @click="submit">{{ submitText }}</ElButton>
      <ElButton @click="reset">{{ resetText }}</ElButton>
    </slot>
  </ElFormItem>
</template>

<script setup>
  defineProps({
    /** 底栏ElFormItem属性 */
    footerProps: Object,
    /** 底栏ElFormItem插槽 */
    footerSlots: Object,
    /** 提交按钮文本 */
    submitText: String,
    /** 重置按钮文本 */
    resetText: String
  });

  const emit = defineEmits(['submit', 'reset']);

  /** 提交 */
  const submit = () => {
    emit('submit');
  };

  /** 重置 */
  const reset = () => {
    emit('reset');
  };
</script>

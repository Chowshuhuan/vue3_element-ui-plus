<template>
  <Card :style="cardStyle" />
</template>

<script setup>
  import { computed } from 'vue';
  import { Card } from './index';

  const props = defineProps({
    /** 是否选中 */
    checked: Boolean,
    /** 类型(1第一个, 2中间, 3最后一个) */
    type: {
      type: Number,
      required: true
    }
  });

  /** 样式 */
  const cardStyle = computed(() => {
    const style = { flex: 1 };
    if (props.type !== 1) {
      style.borderLeftWidth = 0;
    }
    if (props.type === 1 || props.type === 2) {
      style.borderTopRightRadius = 0;
      style.borderBottomRightRadius = 0;
    }
    if (props.type === 3 || props.type === 2) {
      style.borderTopLeftRadius = 0;
      style.borderBottomLeftRadius = 0;
    }
    if (props.checked) {
      style.background = 'var(--el-color-primary)';
      style.borderColor = 'var(--el-color-primary)';
      style['--el-fill-color'] = '#fff';
    }
    return style;
  });
</script>

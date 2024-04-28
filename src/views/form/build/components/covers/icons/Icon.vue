<template>
  <div
    :style="{
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--el-color-primary)',
      fontSize: '16px'
    }"
  >
    <slot>
      <component :is="name" width="1em" height="1em" :style="iconStyle" />
    </slot>
  </div>
</template>

<script setup>
  defineProps({
    name: String,
    iconStyle: Object
  });
</script>

<script>
  import {
    ArrowUp,
    CheckOutlined,
    CalendarOutlined,
    PlusOutlined,
    StarFilled,
    ClockCircleOutlined
  } from '@/components/icons';

  export default {
    components: {
      ArrowUp,
      CheckOutlined,
      CalendarOutlined,
      PlusOutlined,
      StarFilled,
      ClockCircleOutlined
    }
  };
</script>

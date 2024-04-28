<template>
  <div
    :style="{
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      border: checked
        ? '4px solid var(--el-color-primary)'
        : '1px solid var(--el-border-color)',
      background: checked ? '#fff' : 'none',
      boxSizing: 'border-box',
      margin: '0 8px 0 0'
    }"
  ></div>
</template>

<script setup>
  defineProps({
    checked: Boolean
  });
</script>

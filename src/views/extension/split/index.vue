<template>
  <ele-page
    hide-footer
    :flex-table="type !== 0"
    :multi-card="type === 0"
    :style="type === 0 ? void 0 : { minHeight: '420px' }"
  >
    <demo-basic v-if="type === 0" @change="onChange" />
    <demo-table v-else @change="onChange" />
  </ele-page>
</template>

<script setup>
  import { ref } from 'vue';
  import DemoBasic from './components/demo-basic.vue';
  import DemoTable from './components/demo-table.vue';

  const type = ref(0);

  const onChange = (value) => {
    type.value = value;
  };
</script>

<script>
  export default {
    name: 'ExtensionSplit'
  };
</script>

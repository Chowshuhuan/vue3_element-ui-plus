<template>
  <ele-page>
    <demo-basic />
    <demo-basic-page />
    <demo-multiple />
    <demo-advanced />
    <demo-virtual />
  </ele-page>
</template>

<script lang="ts" setup>
  import DemoBasic from './components/demo-basic.vue';
  import DemoBasicPage from './components/demo-basic-page.vue';
  import DemoMultiple from './components/demo-multiple.vue';
  import DemoAdvanced from './components/demo-advanced.vue';
  import DemoVirtual from './components/demo-virtual.vue';
</script>

<script lang="ts">
  export default {
    name: 'ExtensionTableSelect'
  };
</script>

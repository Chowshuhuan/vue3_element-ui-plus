<template>
  <ele-page>
    <demo-modal />
    <multiple-modal />
    <demo-drawer />
  </ele-page>
</template>

<script setup>
  import DemoModal from './components/demo-modal.vue';
  import MultipleModal from './components/multiple-modal.vue';
  import DemoDrawer from './components/demo-drawer.vue';
</script>

<script>
  export default {
    name: 'ExtensionDialog'
  };
</script>

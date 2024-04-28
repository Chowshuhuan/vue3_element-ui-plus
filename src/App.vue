<template>
  <el-config-provider :locale="elLocale">
    <ele-config-provider
      :locale="eleLocale"
      :map-key="MAP_KEY"
      :table="tableConfig"
      :license="LICENSE_CODE"
    >
      <ele-app>
        <router-view />
      </ele-app>
    </ele-config-provider>
  </el-config-provider>
</template>

<script setup>
  import { ref } from 'vue';
  import { useThemeStore } from '@/store/modules/theme';
  import { MAP_KEY, LICENSE_CODE } from '@/config/setting';
  import { useLocale } from '@/i18n/use-locale';

  // 恢复主题
  const themeStore = useThemeStore();
  themeStore.recoverTheme();

  // 国际化配置
  const { elLocale, eleLocale } = useLocale();

  // 高级表格全局配置
  const tableConfig = ref({
    response: {
      dataName: 'list',
      countName: 'count'
    }
  });
</script>

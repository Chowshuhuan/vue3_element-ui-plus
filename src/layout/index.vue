<template>
  <ele-pro-layout
    :menus="menus"
    :tabs="tabs"
    :collapse="collapse"
    :compact="compact"
    :maximized="maximized"
    :tab-bar="tabBar"
    :breadcrumb="layout === 'side'"
    :layout="layout"
    :sidebar-layout="sidebarLayout"
    :header-style="headerStyle"
    :sidebar-style="sidebarStyle"
    :tab-style="tabStyle"
    :fixed-header="fixedHeader"
    :fixed-sidebar="fixedSidebar"
    :fixed-body="fixedBody"
    :fluid="fluid"
    :logo-in-header="logoInHeader"
    :colorful-icon="colorfulIcon"
    :unique-opened="uniqueOpened"
    :fixed-home="fixedHome"
    :home-path="HOME_PATH"
    :redirectPath="REDIRECT_PATH"
    :locale="locale"
    :i18n="i18n"
    :tab-sortable="!mobileDevice"
    :tab-context-menu="mobileDevice ? false : { iconProps: { size: 15 } }"
    :tab-context-menus="tabContext"
    :nav-trigger="navTrigger"
    :box-trigger="boxTrigger"
    :item-trigger="itemTrigger"
    :keep-alive="TAB_KEEP_ALIVE"
    :transition-name="transitionName"
    :ellipsis-props="{ hideTimeout: 800 }"
    :responsive="responsive"
    @update:collapse="updateCollapse"
    @update:maximized="updateMaximized"
    @tabAdd="addPageTab"
    @tabClick="onTabClick"
    @tabRemove="removePageTab"
    @tabContextMenu="onTabContextMenu"
    @tabSortChange="setPageTabs"
    @bodySizeChange="onBodySizeChange"
  >
    <router-layout />
    <!-- logo -->
    <template #logo>
      <img src="/src/assets/logo.svg" style="width: 30px; height: 30px" />
      <h1 style="font-size: 17px; letter-spacing: 1px">{{ PROJECT_NAME }}</h1>
    </template>
    <!-- 顶栏左侧按钮 -->
    <template #left="{ sidebar }">
      <!-- 折叠侧栏 -->
      <header-tool v-if="sidebar" @click="updateCollapse(!collapse)">
        <el-icon style="transform: scale(1.14)">
          <MenuUnfoldOutlined v-if="collapse" />
          <MenuFoldOutlined v-else />
        </el-icon>
      </header-tool>
      <!-- 刷新 -->
      <header-tool
        v-if="layout === 'side'"
        class="hidden-sm-and-down"
        @click="reloadPageTab()"
      >
        <el-icon style="transform: scale(1.09)">
          <ReloadOutlined />
        </el-icon>
      </header-tool>
    </template>
    <!-- 顶栏右侧按钮 -->
    <template #right>
      <!-- 全屏切换 -->
      <header-tool class="hidden-sm-and-down" @click="toggleFullscreen">
        <el-icon style="transform: scale(1.18)">
          <CompressOutlined v-if="isFullscreen" style="stroke-width: 4" />
          <ExpandOutlined v-else style="stroke-width: 4" />
        </el-icon>
      </header-tool>
      <!-- 语言切换 -->
      <header-tool>
        <i18n-icon :icon-style="{ transform: 'scale(1.15)' }" />
      </header-tool>
      <!-- 消息通知 -->
      <header-tool>
        <header-notice />
      </header-tool>
      <!-- 用户信息 -->
      <header-tool>
        <header-user />
      </header-tool>
      <!-- 主题设置 -->
      <header-tool @click="openSetting">
        <el-icon>
          <MoreOutlined />
        </el-icon>
      </header-tool>
    </template>
    <!-- 页签栏右侧下拉菜单 -->
    <template #tabExtra="{ active }">
      <tab-dropdown
        :items="tabExtra"
        :dropdown-props="{ iconProps: { size: 15 } }"
        @menuClick="(key) => onTabDropdownMenu(key, active)"
      />
    </template>
    <!-- 折叠双侧栏一级 -->
    <template #boxBottom>
      <div :style="{ flexShrink: 0, padding: roundedTheme ? '4px 8px' : 0 }">
        <sidebar-tool style="height: 32px" @click="updateCompact(!compact)">
          <el-icon style="transform: scale(1.05)">
            <menu-unfold-outlined v-if="compact" />
            <menu-fold-outlined v-else />
          </el-icon>
        </sidebar-tool>
      </div>
    </template>
    <!-- 全局页脚 -->
    <template #footer>
      <page-footer />
    </template>
    <!-- 菜单图标 -->
    <template #icon="{ icon, item }">
      <el-icon v-if="icon" v-bind="item.meta?.props?.iconProps || {}">
        <component :is="icon" :style="item.meta?.props?.iconStyle" />
      </el-icon>
    </template>
    <!-- 页签标题 -->
    <template #tabTitle="{ label, item }">
      <el-icon
        v-if="item.meta?.icon"
        class="ele-tab-icon"
        v-bind="item.meta?.props?.iconProps || {}"
      >
        <component :is="item.meta.icon" :style="item.meta?.props?.iconStyle" />
      </el-icon>
      <span style="padding-left: 4px">{{ label }}</span>
    </template>
  </ele-pro-layout>
  <!-- 主题设置抽屉 -->
  <setting-drawer v-model="settingVisible" />
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useI18n } from 'vue-i18n';
  import {
    HeaderTool,
    SidebarTool,
    TabDropdown,
    requestFullscreen,
    exitFullscreen,
    checkFullscreen,
    EleMessage
  } from 'ele-admin-plus/es';
  import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReloadOutlined,
    ExpandOutlined,
    CompressOutlined,
    MoreOutlined,
    CloseOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    MinusCircleOutlined,
    CloseCircleOutlined
  } from '@/components/icons';
  import {
    PROJECT_NAME,
    HOME_PATH,
    REDIRECT_PATH,
    TAB_KEEP_ALIVE
  } from '@/config/setting';
  import { useUserStore } from '@/store/modules/user';
  import { useThemeStore } from '@/store/modules/theme';
  import { useMobileDevice } from '@/utils/use-mobile';
  import { usePageTab } from '@/utils/use-page-tab';
  import RouterLayout from '@/components/RouterLayout/index.vue';
  import HeaderUser from './components/header-user.vue';
  import HeaderNotice from './components/header-notice.vue';
  import I18nIcon from './components/i18n-icon.vue';
  import PageFooter from './components/page-footer.vue';
  import SettingDrawer from './components/setting-drawer.vue';

  const { push } = useRouter();
  const { t, locale } = useI18n();
  const {
    addPageTab,
    removePageTab,
    removeAllPageTab,
    removeLeftPageTab,
    removeRightPageTab,
    removeOtherPageTab,
    reloadPageTab,
    setPageTabs
  } = usePageTab();
  const { mobileDevice } = useMobileDevice();
  const userStore = useUserStore();
  const themeStore = useThemeStore();

  /** 菜单数据 */
  const { menus } = storeToRefs(userStore);

  /** 布局风格 */
  const {
    tabs,
    collapse,
    compact,
    maximized,
    tabBar,
    layout,
    sidebarLayout,
    headerStyle,
    sidebarStyle,
    tabStyle,
    fixedHeader,
    fixedSidebar,
    fixedBody,
    fluid,
    logoInHeader,
    colorfulIcon,
    transitionName,
    uniqueOpened,
    fixedHome,
    roundedTheme,
    navTrigger,
    boxTrigger,
    itemTrigger,
    responsive
  } = storeToRefs(themeStore);

  /** 是否全屏 */
  const isFullscreen = ref(false);

  /** 是否显示主题设置抽屉 */
  const settingVisible = ref(false);

  /** 页签右键菜单 */
  const tabContext = computed(() => {
    return [
      {
        title: t('layout.tabs.reload'),
        command: 'reload',
        icon: ReloadOutlined,
        iconStyle: { transform: 'scale(0.98)' }
      },
      {
        title: t('layout.tabs.close'),
        command: 'close',
        icon: CloseOutlined
      },
      {
        title: t('layout.tabs.closeLeft'),
        command: 'left',
        icon: ArrowLeftOutlined,
        divided: true
      },
      {
        title: t('layout.tabs.closeRight'),
        command: 'right',
        icon: ArrowRightOutlined
      },
      {
        title: t('layout.tabs.closeOther'),
        command: 'other',
        icon: MinusCircleOutlined,
        divided: true
      },
      {
        title: t('layout.tabs.closeAll'),
        command: 'all',
        icon: CloseCircleOutlined
      }
    ];
  });

  /** 页签栏右侧下拉菜单 */
  const tabExtra = computed(() => {
    const isMax = maximized.value;
    return [
      {
        title: t(`layout.tabs.${isMax ? 'fullscreenExit' : 'fullscreen'}`),
        command: 'fullscreen',
        icon: isMax ? CompressOutlined : ExpandOutlined
      },
      ...tabContext.value
    ];
  });

  /** 侧栏折叠切换 */
  const updateCollapse = (value) => {
    themeStore.setCollapse(value);
  };

  /** 双侧栏一级折叠切换 */
  const updateCompact = (value) => {
    themeStore.setCompact(value);
  };

  /** 内容区全屏切换 */
  const updateMaximized = (value) => {
    themeStore.setMaximized(value);
  };

  /** 页签点击事件 */
  const onTabClick = (option) => {
    const { key, active, item } = option;
    const path = item?.fullPath || key;
    if (key !== active && path) {
      push(path);
    }
  };

  /** 内容区尺寸改变事件 */
  const onBodySizeChange = ({ width }) => {
    themeStore.setContentWidth(width ?? null);
    isFullscreen.value = checkFullscreen();
  };

  /** 全屏切换 */
  const toggleFullscreen = () => {
    if (isFullscreen.value) {
      exitFullscreen();
      isFullscreen.value = false;
      return;
    }
    try {
      requestFullscreen();
      isFullscreen.value = true;
    } catch (e) {
      console.error(e);
      EleMessage.error('您的浏览器不支持全屏模式');
    }
  };

  /** 页签右键菜单点击事件 */
  const onTabContextMenu = (option) => {
    const { command, key, item, active } = option;
    if (command === 'reload') {
      reloadPageTab({ fullPath: item?.fullPath || key });
    } else if (command === 'close') {
      removePageTab({ key, active });
    } else if (command === 'left') {
      removeLeftPageTab({ key, active });
    } else if (command === 'right') {
      removeRightPageTab({ key, active });
    } else if (command === 'other') {
      removeOtherPageTab({ key, active });
    } else if (command === 'all') {
      removeAllPageTab({ key, active });
    }
  };

  /** 页签栏右侧下拉菜单点击事件 */
  const onTabDropdownMenu = (command, active) => {
    if (command === 'reload') {
      reloadPageTab();
    } else if (command === 'fullscreen') {
      updateMaximized(!maximized.value);
    } else {
      onTabContextMenu({ command, key: active, active });
    }
  };

  /** 菜单标题国际化 */
  const i18n = ({ menu, locale }) => {
    if (locale && menu?.meta?.lang && menu.meta.lang[locale]) {
      return menu.meta.lang[locale];
    }
  };

  /** 打开主题设置抽屉 */
  const openSetting = () => {
    settingVisible.value = true;
  };
</script>

<script>
  import * as MenuIcons from './menu-icons';

  export default {
    name: 'Layout',
    components: MenuIcons
  };
</script>

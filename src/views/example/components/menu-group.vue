<template>
  <ele-card header="菜单更多功能">
    <div style="margin-bottom: 10px; font-size: 16px">分组菜单</div>
    <div style="display: flex; flex-wrap: wrap">
      <el-button type="primary" @click="toGroup1" style="margin: 0 12px 12px 0">
        一级菜单变为分组形式
      </el-button>
      <el-button type="primary" @click="toGroup2" style="margin: 0 12px 12px 0">
        二级菜单变为分组形式
      </el-button>
    </div>
    <ele-text type="placeholder">
      <span>二级菜单可查看列表页面/卡片列表的效果, </span>
      <el-link type="primary" :underline="false" @click="resetMenu">
        重置菜单数据
      </el-link>
    </ele-text>
    <div style="margin: 22px 0 10px 0; font-size: 16px">菜单项触发模式</div>
    <el-space style="display: flex">
      <el-button
        type="primary"
        style="margin: 0 12px 12px 0"
        @click="setMenuTrigger('navTrigger', 'click')"
      >
        顶栏菜单使用事件触发
      </el-button>
      <el-link
        type="primary"
        :underline="false"
        @click="setMenuTrigger('navTrigger', 'route')"
      >
        重置
      </el-link>
    </el-space>
    <el-space style="display: flex">
      <el-button
        type="primary"
        style="margin: 0 12px 12px 0"
        @click="setMenuTrigger('boxTrigger', 'click')"
      >
        双侧栏一级菜单使用事件触发
      </el-button>
      <el-link
        type="primary"
        :underline="false"
        @click="setMenuTrigger('boxTrigger', 'route')"
      >
        重置
      </el-link>
    </el-space>
    <el-space style="display: flex">
      <el-button
        type="primary"
        style="margin: 0 12px 12px 0"
        @click="setMenuTrigger('itemTrigger', 'click')"
      >
        侧栏菜单使用事件触发
      </el-button>
      <el-link
        type="primary"
        :underline="false"
        @click="setMenuTrigger('itemTrigger', 'route')"
      >
        重置
      </el-link>
    </el-space>
    <ele-text type="placeholder">
      菜单默认使用 RouterLink 渲染，
      修改为事件触发后还提供了事件触发前的钩子可阻止默认的操作，
    </ele-text>
    <ele-text type="placeholder">
      混合导航或双侧栏时使用事件触发点击切换子菜单时就不会再默认打开第一个子菜单了。
    </ele-text>
  </ele-card>
</template>

<script setup>
  import { EleMessage } from 'ele-admin-plus/es';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/store/modules/user';
  import { useThemeStore } from '@/store/modules/theme';

  const userStore = useUserStore();
  const { menus } = storeToRefs(userStore);
  const tempMenus = JSON.parse(JSON.stringify(menus.value));

  /** 一级菜单变为分组形式 */
  const toGroup1 = () => {
    userStore.setMenus(
      tempMenus.map((m) => {
        const hasChild = !!m.children?.length;
        const meta = m.meta || {};
        return {
          ...m,
          meta: {
            ...meta,
            icon: hasChild ? null : meta.icon,
            props: {
              ...meta.props,
              group: hasChild
            }
          }
        };
      })
    );
  };

  /** 二级菜单变为分组形式 */
  const toGroup2 = () => {
    userStore.setMenus(
      tempMenus.map((m) => {
        return {
          ...m,
          children: m.children
            ? m.children.map((c) => {
                const hasChild = c.children
                  ? !!c.children.filter((t) => !t.meta?.hide).length
                  : false;
                const meta = c.meta || {};
                return {
                  ...c,
                  meta: {
                    ...meta,
                    icon: hasChild ? null : meta.icon,
                    props: {
                      ...meta.props,
                      group: hasChild
                    }
                  }
                };
              })
            : void 0
        };
      })
    );
  };

  /** 重置 */
  const resetMenu = () => {
    userStore.setMenus(JSON.parse(JSON.stringify(tempMenus)));
  };

  /** 修改菜单触发模式 */
  const themeStore = useThemeStore();
  const setMenuTrigger = (key, trigger) => {
    themeStore.setMenuItemTrigger(key, trigger);
    EleMessage.success('修改成功');
  };
</script>

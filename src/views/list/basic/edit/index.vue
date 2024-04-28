<template>
  <div>
    <ele-card style="border-radius: 0">
      <ele-text type="heading" size="lg">修改用户</ele-text>
      <ele-text type="placeholder" style="margin-top: 6px">
        修改用户基本信息后点击保存按钮
      </ele-text>
    </ele-card>
    <ele-page>
      <ele-card>
        <ele-loading :loading="loading">
          <edit-form v-if="user" :data="user" />
        </ele-loading>
      </ele-card>
    </ele-page>
  </div>
</template>

<script setup>
  import { ref, unref, onActivated } from 'vue';
  import { useRouter } from 'vue-router';
  import { EleMessage } from 'ele-admin-plus/es';
  import { usePageTab } from '@/utils/use-page-tab';
  import EditForm from '../components/edit-form.vue';
  import { getUser } from '@/api/system/user';
  const ROUTE_PATH = '/list/basic/edit';

  const { currentRoute } = useRouter();
  const { getRouteTabKey, setPageTab } = usePageTab();

  /** 查询状态 */
  const loading = ref(true);

  /** 用户信息 */
  const user = ref();

  /** 查询用户信息 */
  const query = () => {
    const { params } = unref(currentRoute);
    const id = Number(params.id);
    if (!id || isNaN(id)) {
      return;
    }
    getUser(id)
      .then((data) => {
        loading.value = false;
        user.value = data;
        setUserTabTitle();
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  };

  /** 修改页签标题 */
  const setUserTabTitle = () => {
    if (user.value && unref(currentRoute).path.startsWith(ROUTE_PATH)) {
      setPageTab({
        key: getRouteTabKey(),
        title: `编辑用户[${user.value.nickname}]`
      });
    }
  };

  onActivated(() => {
    setUserTabTitle();
  });

  query();
</script>

<script>
  export default {
    name: 'ListBasicEdit'
  };
</script>

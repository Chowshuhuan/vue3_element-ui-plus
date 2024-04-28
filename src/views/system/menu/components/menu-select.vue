<!-- 上级菜单选择下拉框 -->
<template>
  <el-tree-select
    clearable
    filterable
    :data="data"
    check-strictly
    default-expand-all
    node-key="menuId"
    :props="{ label: 'title' }"
    :placeholder="placeholder"
    :model-value="modelValue || void 0"
    class="ele-fluid"
    @update:modelValue="updateValue"
  />
</template>

<script setup>
  import { ref } from 'vue';
  import { EleMessage, toTree } from 'ele-admin-plus/es';
  import { listMenus } from '@/api/system/menu';

  const emit = defineEmits(['update:modelValue']);

  defineProps({
    /** 选中的菜单 */
    modelValue: [Number, String],
    /** 提示信息 */
    placeholder: {
      type: String,
      default: '请选择上级菜单'
    }
  });

  /** 菜单数据 */
  const data = ref([]);

  /** 更新选中数据 */
  const updateValue = (value) => {
    emit('update:modelValue', value || 0);
  };

  /** 获取菜单数据 */
  listMenus()
    .then((list) => {
      data.value = toTree({
        data: list,
        idField: 'menuId',
        parentIdField: 'parentId'
      });
    })
    .catch((e) => {
      EleMessage.error(e.message);
    });
</script>

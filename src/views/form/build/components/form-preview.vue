<template>
  <ele-card
    header="预览"
    :body-style="{ minHeight: '360px', padding: '20px 20px 4px 12px' }"
  >
    <pro-form
      ref="proFormRef"
      :model="form"
      :items="items"
      :footer="true"
      :label-width="labelWidth"
      :grid="grid === 1 ? false : { span: 24 / grid }"
      @updateValue="setFieldValue"
      @submit="onSubmit"
      @reset="resetFields"
    />
  </ele-card>
</template>

<script setup>
  import { ref, onBeforeUnmount, onMounted, nextTick, watch } from 'vue';
  import { useFormData } from '@/utils/use-form-data';
  import ProForm from '@/components/ProForm/index.vue';
  import { stringTypes, arrayTypes } from '@/components/ProForm/util';

  const emit = defineEmits(['unmount']);

  const props = defineProps({
    /** 表单标题宽度 */
    labelWidth: Number,
    /** 表单显示列数 */
    grid: Number,
    /** 表单项 */
    items: {
      type: Array,
      required: true
    },
    /** 表单缓存数据 */
    data: Object
  });

  /** 获取表单字段 */
  const init = {};
  props.items.forEach((item) => {
    if (item.type) {
      if ('sliderRange' === item.type) {
        init[item.prop] = [30, 60];
        return;
      }
      if (arrayTypes.includes(item.type)) {
        init[item.prop] = [];
        return;
      }
      if (stringTypes.includes(item.type)) {
        init[item.prop] = '';
        return;
      }
    }
    init[item.prop] = void 0;
  });

  /** 表单数据 */
  const [form, resetFields, assignFields, setFieldValue] = useFormData(init);

  /** 表单实例 */
  const proFormRef = ref(null);

  /** 提交 */
  const onSubmit = () => {
    console.log('form:', JSON.stringify(form));
  };

  /** 回显缓存数据 */
  onMounted(() => {
    if (props.data != null) {
      assignFields(props.data);
    }
    nextTick(() => {
      nextTick(() => {
        proFormRef.value?.clearValidate?.();
      });
    });
  });

  /** 销毁事件 */
  onBeforeUnmount(() => {
    emit('unmount', form);
  });

  watch(
    () => props.items,
    () => {
      nextTick(() => {
        nextTick(() => {
          proFormRef.value?.clearValidate?.();
        });
      });
    },
    { deep: true }
  );

  defineExpose({ resetFields });
</script>

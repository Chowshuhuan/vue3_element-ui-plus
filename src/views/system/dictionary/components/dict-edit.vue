<!-- 字典编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="460"
    :model-value="modelValue"
    :title="isUpdate ? '修改字典' : '添加字典'"
    @update:modelValue="updateModelValue"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      @submit.prevent=""
    >
      <el-form-item label="字典名称" prop="dictName">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.dictName"
          placeholder="请输入字典名称"
        />
      </el-form-item>
      <el-form-item label="字典值" prop="dictCode">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.dictCode"
          placeholder="请输入字典值"
        />
      </el-form-item>
      <el-form-item label="排序号" prop="sortNumber">
        <el-input-number
          :min="0"
          :max="9999"
          v-model="form.sortNumber"
          placeholder="请输入排序号"
          controls-position="right"
          class="ele-fluid"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          :rows="4"
          type="textarea"
          :maxlength="200"
          v-model="form.comments"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="updateModelValue(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        保存
      </el-button>
    </template>
  </ele-modal>
</template>

<script setup>
  import { ref, reactive, watch } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { useFormData } from '@/utils/use-form-data';
  import { addDictionary, updateDictionary } from '@/api/system/dictionary';

  const emit = defineEmits(['done', 'update:modelValue']);

  const props = defineProps({
    /** 弹窗是否打开 */
    modelValue: Boolean,
    /** 修改回显的数据 */
    data: Object
  });

  /** 是否是修改 */
  const isUpdate = ref(false);

  /** 提交状态 */
  const loading = ref(false);

  /** 表单实例 */
  const formRef = ref(null);

  /** 表单数据 */
  const [form, resetFields, assignFields] = useFormData({
    dictId: void 0,
    dictName: '',
    dictCode: '',
    sortNumber: void 0,
    comments: ''
  });

  /** 表单验证规则 */
  const rules = reactive({
    dictName: [
      {
        required: true,
        message: '请输入字典名称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    dictCode: [
      {
        required: true,
        message: '请输入字典值',
        type: 'string',
        trigger: 'blur'
      }
    ],
    sortNumber: [
      {
        required: true,
        message: '请输入排序号',
        type: 'number',
        trigger: 'blur'
      }
    ]
  });

  /** 保存编辑 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updateDictionary : addDictionary;
      saveOrUpdate(form)
        .then((msg) => {
          loading.value = false;
          EleMessage.success(msg);
          updateModelValue(false);
          emit('done');
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e.message);
        });
    });
  };

  /** 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue) {
        if (props.data) {
          assignFields(props.data);
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
        formRef.value?.clearValidate?.();
      }
    }
  );
</script>

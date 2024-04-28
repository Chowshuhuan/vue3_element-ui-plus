<template>
  <ele-drawer
    :size="430"
    title="表单项配置"
    :append-to-body="true"
    style="max-width: 100%"
    :model-value="modelValue"
    :body-style="{ paddingLeft: '10px' }"
    @update:modelValue="updateModelValue"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="92px"
      @submit.prevent=""
    >
      <el-form-item label="标题" prop="label">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.label"
          placeholder="请输入标题"
        />
      </el-form-item>
      <el-form-item label="字段名" prop="prop">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.prop"
          placeholder="请输入字段名"
        />
      </el-form-item>
      <el-form-item label="是否必填" prop="required">
        <el-radio-group v-model="form.required">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="itemProps">
        <el-input
          :rows="2"
          type="textarea"
          v-model="form.itemProps"
          placeholder="请输入 ElFormItem 属性"
        />
        <template #label>
          <ele-tooltip
            placement="top-start"
            :popperOptions="{
              modifiers: [{ name: 'offset', options: { offset: [-12, 10] } }]
            }"
          >
            <el-icon
              :size="15"
              style="align-self: center; margin-right: 4px; cursor: help"
            >
              <QuestionCircleOutlined style="opacity: 0.6" />
            </el-icon>
            <template #content>
              <div>配置 ElFormItem 组件的其它属性(JSON格式)，如：</div>
              <div>{"rules": [{"required": true, "type": "string", </div>
              <div>"message": "请输入标题", "trigger": "blur"}]}</div>
            </template>
          </ele-tooltip>
          <div>其它属性</div>
        </template>
      </el-form-item>
      <el-form-item label="组件类型" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择组件类型"
          class="ele-fluid"
          @change="onTypeChange"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="props">
        <el-input
          :rows="5"
          type="textarea"
          v-model="form.props"
          placeholder="请输入组件属性"
        />
        <template #label>
          <ele-tooltip
            placement="top-start"
            :popperOptions="{
              modifiers: [{ name: 'offset', options: { offset: [-12, 10] } }]
            }"
          >
            <el-icon
              :size="15"
              style="align-self: center; margin-right: 4px; cursor: help"
            >
              <QuestionCircleOutlined style="opacity: 0.6" />
            </el-icon>
            <template #content>
              <div>配置组件的属性(JSON格式)，如：</div>
              <div>{"clearable": false, "maxlength": 20}</div>
            </template>
          </ele-tooltip>
          <div>组件属性</div>
        </template>
      </el-form-item>
      <el-form-item label="所占列数" prop="colSpan">
        <el-select
          v-model="form.colSpan"
          placeholder="请选择所占列数"
          class="ele-fluid"
        >
          <el-option
            v-for="item in gridOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.value > grid"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="options">
        <el-input
          :rows="5"
          type="textarea"
          v-model="form.options"
          placeholder="请输入选项数据"
        />
        <template #label>
          <ele-tooltip
            placement="top-start"
            :popperOptions="{
              modifiers: [{ name: 'offset', options: { offset: [-12, 10] } }]
            }"
          >
            <el-icon
              :size="15"
              style="align-self: center; margin-right: 4px; cursor: help"
            >
              <QuestionCircleOutlined style="opacity: 0.6" />
            </el-icon>
            <template #content>
              <div>下拉或多选、单选等组件的选项数据(JSON格式)，如：</div>
              <div>
                [{"label": "男", "value": 1}, {"label": "女", "value": 2}]
              </div>
            </template>
          </ele-tooltip>
          <div>选项数据</div>
        </template>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" class="ele-fluid" @click="save">保存</el-button>
    </template>
  </ele-drawer>
</template>

<script setup>
  import { ref, reactive, watch } from 'vue';
  import { QuestionCircleOutlined } from '@/components/icons';
  import { useFormData } from '@/utils/use-form-data';
  import {
    gridOptions,
    itemTypes,
    getOptionsAndProps,
    getColProps,
    getColSpan
  } from './util';

  const emit = defineEmits(['done', 'update:modelValue']);

  const props = defineProps({
    /** 弹窗是否打开 */
    modelValue: Boolean,
    /** 修改回显的数据 */
    data: Object,
    /** 表单显示列数 */
    grid: Number
  });

  /** 配置项表单 */
  const formRef = ref(null);

  /** 配置项表单数据 */
  const [form, resetFields, assignFields] = useFormData({
    key: void 0,
    label: '',
    prop: '',
    required: false,
    itemProps: '',
    type: void 0,
    props: '',
    //colProps: '',
    options: '',
    colSpan: 1
  });

  /** 验证JSON格式 */
  const validateJSON = (value) => {
    if (value) {
      const msg = '请输入正确的JSON格式';
      try {
        const obj = JSON.parse(value);
        if (obj == null || typeof obj !== 'object') {
          return msg;
        }
      } catch (_e) {
        return msg;
      }
    }
  };

  /** 配置项表单验证规则 */
  const rules = reactive({
    label: [
      {
        required: true,
        type: 'string',
        message: '请输入标题',
        trigger: 'blur'
      }
    ],
    prop: [
      {
        required: true,
        type: 'string',
        message: '请输入字段名',
        trigger: 'blur'
      }
    ],
    itemProps: [
      {
        validator: (_rule, value, callback) => {
          callback(validateJSON(value));
        },
        trigger: 'blur'
      }
    ],
    props: [
      {
        validator: (_rule, value, callback) => {
          callback(validateJSON(value));
        },
        trigger: 'blur'
      }
    ],
    colProps: [
      {
        validator: (_rule, value, callback) => {
          callback(validateJSON(value));
        },
        trigger: 'blur'
      }
    ]
  });

  /** 组件类型下拉数据 */
  const typeOptions = ref(
    itemTypes.map((d) => {
      return { ...d, label: `${d.label}(${d.value})` };
    })
  );

  /** 组件类型选择改变 */
  const onTypeChange = (type) => {
    const { options, props } = getOptionsAndProps(type);
    form.props = props;
    form.options = options;
  };

  /** 保存表单项配置 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (valid) {
        //updateModelValue(false);
        emit('done', {
          key: form.key,
          label: form.label,
          prop: form.prop,
          type: form.type,
          required: form.required,
          itemProps: form.itemProps ? JSON.parse(form.itemProps) : void 0,
          props: form.props ? JSON.parse(form.props) : void 0,
          //colProps: form.colProps ? JSON.parse(form.colProps) : void 0,
          colProps: getColProps(props.grid, form.colSpan),
          options: form.options ? JSON.parse(form.options) : void 0
        });
      }
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
        const item = props.data;
        if (item) {
          assignFields({
            ...item,
            itemProps: item.itemProps
              ? JSON.stringify(item.itemProps, void 0, 2)
              : '',
            props: item.props ? JSON.stringify(item.props, void 0, 2) : '',
            //colProps: item.colProps ? JSON.stringify(item.colProps, void 0, 2) : '',
            options: item.options
              ? JSON.stringify(item.options, void 0, 2)
              : '',
            colSpan: getColSpan(props.grid, item.colProps?.span)
          });
        }
      } else {
        resetFields();
        formRef.value?.clearValidate?.();
      }
    }
  );
</script>

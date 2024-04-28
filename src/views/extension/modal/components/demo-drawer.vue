<template>
  <ele-card header="抽屉组件">
    <el-button type="primary" class="ele-btn-icon" @click="openDrawer1">
      打开抽屉
    </el-button>
    <el-button type="primary" class="ele-btn-icon" @click="openDrawer2">
      限制在主体区域
    </el-button>
  </ele-card>
  <ele-drawer
    :size="430"
    title="表单项配置"
    :append-to-body="true"
    style="max-width: 100%"
    v-model="visible1"
    :body-style="{ paddingBottom: '8px' }"
    @closed="cancelDrawer"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="70px"
      @submit.prevent=""
    >
      <el-form-item label="用户名" prop="nickname">
        <el-input
          clearable
          v-model="form.nickname"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          clearable
          v-model="form.sex"
          placeholder="请选择性别"
          class="ele-fluid"
        >
          <el-option value="男">男</el-option>
          <el-option value="女">女</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input clearable v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input clearable v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input
          :rows="4"
          type="textarea"
          v-model="form.introduction"
          placeholder="请输入个人简介"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelDrawer">取消</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </template>
  </ele-drawer>
  <ele-drawer
    :inner="true"
    :size="430"
    title="表单项配置"
    :append-to-body="true"
    style="max-width: 100%"
    v-model="visible2"
    :body-style="{ paddingBottom: '8px' }"
    @closed="cancelDrawer2"
  >
    <el-form
      ref="formRef2"
      :model="form2"
      :rules="rules2"
      label-width="70px"
      @submit.prevent=""
    >
      <el-form-item label="用户名" prop="nickname">
        <el-input
          clearable
          v-model="form2.nickname"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          clearable
          v-model="form2.sex"
          placeholder="请选择性别"
          class="ele-fluid"
        >
          <el-option value="男">男</el-option>
          <el-option value="女">女</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input clearable v-model="form2.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input clearable v-model="form2.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input
          :rows="4"
          type="textarea"
          v-model="form2.introduction"
          placeholder="请输入个人简介"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelDrawer2">取消</el-button>
      <el-button type="primary" @click="onSave2">保存</el-button>
    </template>
  </ele-drawer>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { useFormData } from '@/utils/use-form-data';

  /** 弹窗是否打开 */
  const visible1 = ref(false);

  const visible2 = ref(false);

  /** 打开弹窗 */
  const openDrawer1 = () => {
    visible1.value = true;
  };

  const openDrawer2 = () => {
    visible2.value = true;
  };

  /** 表单实例 */
  const formRef = ref(null);

  /** 表单数据 */
  const [form, resetFields] = useFormData({
    nickname: '',
    sex: void 0,
    phone: '',
    email: '',
    introduction: ''
  });

  /** 表单验证规则 */
  const rules = reactive({
    nickname: [
      {
        required: true,
        message: '请输入用户名',
        type: 'string',
        trigger: 'blur'
      }
    ],
    sex: [
      {
        required: true,
        message: '请选择性别',
        type: 'string',
        trigger: 'blur'
      }
    ],
    phone: [
      {
        required: true,
        message: '请输入手机号',
        type: 'string',
        trigger: 'blur'
      }
    ],
    email: [
      {
        required: true,
        message: '请输入邮箱',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  /** 关闭弹窗 */
  const cancelDrawer = () => {
    resetFields();
    formRef.value?.clearValidate?.();
    visible1.value = false;
  };

  /** 保存编辑 */
  const onSave = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      EleMessage.success('保存成功');
    });
  };

  /** 表单实例 */
  const formRef2 = ref(null);

  /** 表单数据 */
  const [form2, resetFields2] = useFormData({
    nickname: '',
    sex: void 0,
    phone: '',
    email: '',
    introduction: ''
  });

  /** 表单验证规则 */
  const rules2 = reactive({
    nickname: [
      {
        required: true,
        message: '请输入用户名',
        type: 'string',
        trigger: 'blur'
      }
    ],
    sex: [
      {
        required: true,
        message: '请选择性别',
        type: 'string',
        trigger: 'blur'
      }
    ],
    phone: [
      {
        required: true,
        message: '请输入手机号',
        type: 'string',
        trigger: 'blur'
      }
    ],
    email: [
      {
        required: true,
        message: '请输入邮箱',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  /** 关闭抽屉2 */
  const cancelDrawer2 = () => {
    resetFields2();
    formRef2.value?.clearValidate?.();
    visible2.value = false;
  };

  /** 保存编辑表单22 */
  const onSave2 = () => {
    formRef2.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      EleMessage.success('保存成功');
    });
  };
</script>

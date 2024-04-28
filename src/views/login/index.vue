<template>
  <div class="login-wrapper">
    <ele-card shadow="always" class="login-card">
      <div class="login-cover">
        <h1 class="login-title">EleAdmin Plus</h1>
        <h4 class="login-subtitle">界面美观组件丰富的中后台前端解决方案</h4>
      </div>
      <div class="login-body">
        <ele-text type="heading" style="font-size: 24px; margin-bottom: 18px">
          {{ t('login.title') }}
        </ele-text>
        <ele-segmented
          v-model="tabActive"
          :items="[
            { label: t('login.passwordType'), value: 1 },
            { label: t('login.qrcodeType'), value: 2 }
          ]"
          style="margin-bottom: 18px"
          @change="onTabChange"
        />
        <el-form
          v-if="tabActive == 1"
          ref="formRef"
          size="large"
          :model="form"
          :rules="rules"
          @keyup.enter="submit"
          @submit.prevent=""
        >
          <el-form-item prop="username">
            <el-input
              clearable
              v-model="form.username"
              :placeholder="t('login.username')"
              :prefix-icon="UserOutlined"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              show-password
              v-model="form.password"
              :placeholder="t('login.password')"
              :prefix-icon="LockOutlined"
            />
          </el-form-item>
          <el-form-item prop="code">
            <div class="login-captcha-group">
              <el-input
                clearable
                v-model="form.code"
                :placeholder="t('login.code')"
                :prefix-icon="ProtectOutlined"
              />
              <div class="login-captcha" @click="changeCaptcha">
                <img v-if="captcha" :src="captcha" />
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.remember">
              {{ t('login.remember') }}
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              size="large"
              type="primary"
              :loading="loading"
              style="width: 100%"
              @click="submit"
            >
              {{ t('login.login') }}
            </el-button>
          </el-form-item>
        </el-form>
        <div v-else class="login-qrcode-group">
          <ele-qr-code-svg
            :size="180"
            :margin="2"
            :value="qrcode"
            class="login-qrcode"
          />
          <div style="margin-top: 16px; cursor: pointer" @click="refreshQrCode">
            <el-icon :size="15" style="vertical-align: -2px; margin-right: 6px">
              <ReloadOutlined />
            </el-icon>
            <span>{{ t('login.refreshQrcode') }}</span>
          </div>
        </div>
      </div>
    </ele-card>
  </div>
</template>

<script setup>
  import { ref, reactive, unref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { EleMessage } from 'ele-admin-plus/es';
  import {
    UserOutlined,
    LockOutlined,
    ProtectOutlined,
    ReloadOutlined
  } from '@/components/icons';
  import { getToken } from '@/utils/token-util';
  import { usePageTab } from '@/utils/use-page-tab';
  import { login, getCaptcha } from '@/api/login';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const { currentRoute } = useRouter();
  const { goHomeRoute, cleanPageTabs } = usePageTab();

  /** 页签选中 */
  const tabActive = ref(1);

  /** 表单 */
  const formRef = ref();

  /** 加载状态 */
  const loading = ref(false);

  /** 表单数据 */
  const form = reactive({
    tenantId: 4, // 租户id, 不需要可去掉
    username: 'admin',
    password: 'admin',
    code: '',
    remember: true
  });

  /** 表单验证规则 */
  const rules = computed(() => {
    return {
      username: [
        {
          required: true,
          message: t('login.username'),
          type: 'string',
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          message: t('login.password'),
          type: 'string',
          trigger: 'blur'
        }
      ],
      code: [
        {
          required: true,
          message: t('login.code'),
          type: 'string',
          trigger: 'blur'
        }
      ]
    };
  });

  /** 图形验证码 */
  const captcha = ref('');

  /** 验证码内容, 实际项目去掉 */
  const text = ref('');

  /** 二维码 */
  const qrcode = ref('');

  /** 提交 */
  const submit = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return false;
      }
      if (form.code.toLowerCase() !== text.value) {
        EleMessage.error('验证码错误');
        return;
      }
      loading.value = true;
      login(form)
        .then((msg) => {
          EleMessage.success(msg);
          cleanPageTabs();
          goHome();
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e.message);
          changeCaptcha();
        });
    });
  };

  /** 获取图形验证码 */
  const changeCaptcha = () => {
    getCaptcha()
      .then((data) => {
        captcha.value = data.base64;
        // 实际项目后端一般会返回验证码的key而不是直接返回验证码的内容, 登录用key去验证, 可以根据自己后端接口修改
        text.value = data.text;
        // 自动回填验证码, 实际项目去掉
        form.code = data.text;
        formRef.value?.clearValidate?.();
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  };

  /** 刷新二维码 */
  const refreshQrCode = () => {
    qrcode.value = `https://api.eleadmin.com/v2/auth/login?code=${Date.now()}`;
  };

  /** 选项卡切换事件 */
  const onTabChange = (active) => {
    if (active === 2) {
      refreshQrCode();
    }
  };

  /** 跳转到首页 */
  const goHome = () => {
    const { query } = unref(currentRoute);
    goHomeRoute(query.from);
  };

  // 如果已登录直接进入首页
  if (getToken()) {
    goHome();
  } else {
    changeCaptcha();
  }
</script>

<style lang="scss" scoped>
  .login-wrapper {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url('/src/assets/login-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .login-card {
      width: 920px;
      max-width: 100%;
      overflow: hidden;

      :deep(.ele-card-body) {
        display: flex;
        padding: 0;
        height: 462px;
      }
    }
  }

  .login-cover {
    flex: 1;
    padding: 36px 8px;
    box-sizing: border-box;
    background-color: #1681fd;
    background-image: url('/src/assets/login-img.png');
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: contain;
    text-align: center;
  }

  .login-body {
    width: 400px;
    flex-shrink: 0;
    padding: 32px 48px 0 48px;
    box-sizing: border-box;

    :deep(.el-checkbox) {
      height: auto;

      .el-checkbox__label {
        color: inherit;
      }
    }

    :deep(.el-input__prefix-inner > .el-icon) {
      margin-right: 12px;
      transform: scale(1.16);
    }
  }

  /* 验证码 */
  .login-captcha-group {
    width: 100%;
    display: flex;
    align-items: center;

    :deep(.el-input) {
      flex: 1;
    }

    .login-captcha {
      flex-shrink: 0;
      width: 108px;
      height: 40px;
      margin-left: 8px;
      border-radius: var(--el-border-radius-base);
      border: 1px solid var(--el-border-color);
      transition: border 0.2s;
      box-sizing: border-box;
      background: #fff;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  /* 标题 */
  .login-title {
    color: rgba(255, 255, 255, 0.98);
    font-size: 26px;
    margin: 0 0 6px 0;
    font-weight: normal;
    font-family: 'AliPuHui';
    letter-spacing: 1.2px;
  }

  .login-subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    margin: 0;
    font-weight: normal;
    font-family: 'AliPuHui';
    letter-spacing: 4px;
  }

  /* 阿里巴巴普惠体 */
  @font-face {
    font-family: 'AliPuHui';
    font-weight: 300;
    src: (
      url('//at.alicdn.com/wf/webfont/jWZHcEP2lzge/5AfKUTWZEo8W.woff2')
        format('woff2'),
      url('//at.alicdn.com/wf/webfont/jWZHcEP2lzge/Dvhs41TtRdYF.woff')
        format('woff')
    );
    font-display: swap;
  }

  /* 二维码 */
  .login-qrcode-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
  }

  .login-qrcode {
    font-size: 0;
    display: inline-block;
    border: 1px solid #ddd;
    border-radius: var(--el-border-radius-base);
    overflow: hidden;
  }

  /* 小屏幕适应 */
  @media screen and (max-width: 680px) {
    .login-wrapper {
      padding: 0;
      display: block;
      background: #fff;

      .login-card {
        width: 100%;
        background: none;
        box-shadow: none;
        border-radius: 0;

        :deep(.ele-card-body) {
          display: block;
          height: auto;
        }
      }
    }

    .login-cover {
      padding: 24px 12px 100px 12px;
      background-size: auto 100px;
    }

    .login-body {
      width: 100%;
    }
  }
</style>

<style lang="scss">
  html.dark .login-wrapper {
    background: #000;
  }
</style>

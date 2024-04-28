<template>
  <ele-page>
    <ele-card header="消息提示">
      <option-item label="风格">
        <el-radio-group v-model="theme">
          <el-radio :label="0">默认</el-radio>
          <el-radio :label="1">简约</el-radio>
          <el-radio :label="2">原始</el-radio>
        </el-radio-group>
      </option-item>
      <option-item label="类型">
        <el-button @click="showMessage('success')">成功</el-button>
        <el-button @click="showMessage('warning')">警告</el-button>
        <el-button @click="showMessage('error')">错误</el-button>
        <el-button @click="showMessage('info')">信息</el-button>
      </option-item>
      <option-item label="加载">
        <el-button @click="showLoading()">打开</el-button>
        <el-button @click="showLoading(true)">带遮罩层</el-button>
        <el-button @click="showLoading(true, true)">居中显示</el-button>
      </option-item>
    </ele-card>
    <ele-card header="消息通知">
      <option-item label="使用">
        <el-button @click="showNotification()" class="ele-btn-icon">
          打开通知
        </el-button>
        <el-button @click="showNotification('success')" class="ele-btn-icon">
          带图标
        </el-button>
        <el-button @click="showNotification('info', 0)" class="ele-btn-icon">
          不自动关闭
        </el-button>
      </option-item>
      <option-item label="类型">
        <el-button @click="showNotification('success')">成功</el-button>
        <el-button @click="showNotification('warning')">警告</el-button>
        <el-button @click="showNotification('error')">错误</el-button>
        <el-button @click="showNotification('info')">信息</el-button>
      </option-item>
      <option-item label="位置">
        <el-button
          @click="showNotification('info', null, 'top-left')"
          class="ele-btn-icon"
        >
          TopLeft
        </el-button>
        <el-button
          @click="showNotification('info', null, 'bottom-left')"
          class="ele-btn-icon"
        >
          BottomLeft
        </el-button>
        <el-button
          @click="showNotification('info', null, 'bottom-right')"
          class="ele-btn-icon"
        >
          BottomRight
        </el-button>
      </option-item>
    </ele-card>
    <ele-card header="文本提示">
      <option-item label="使用">
        <ele-tooltip content="EleAdminPlus" placement="top" :offset="8">
          <el-button>Dark</el-button>
        </ele-tooltip>
        <ele-tooltip
          content="EleAdminPlus"
          placement="top"
          effect="light"
          :offset="8"
        >
          <el-button>Light</el-button>
        </ele-tooltip>
      </option-item>
      <option-item label="主题">
        <ele-tooltip
          content="EleAdminPlus"
          placement="top"
          effect="danger"
          :offset="8"
        >
          <el-button class="ele-btn-icon">错误</el-button>
        </ele-tooltip>
        <ele-tooltip
          content="EleAdminPlus"
          placement="top"
          effect="warning"
          :offset="8"
        >
          <el-button class="ele-btn-icon">警告</el-button>
        </ele-tooltip>
        <ele-tooltip
          content="EleAdminPlus"
          placement="top"
          effect="success"
          :offset="8"
        >
          <el-button class="ele-btn-icon">成功</el-button>
        </ele-tooltip>
        <ele-tooltip
          content="EleAdminPlus"
          placement="top"
          bg="linear-gradient( 135deg, #43CBFF 10%, #9708CC 100%)"
          arrow-bg="#7556E0"
          :offset="8"
        >
          <el-button class="ele-btn-icon">Custom</el-button>
        </ele-tooltip>
      </option-item>
      <option-item label="气泡">
        <ele-popover :width="180" trigger="click" title="这是标题" :offset="8">
          <template #reference>
            <el-button class="ele-btn-icon">Popover</el-button>
          </template>
          <div>This is content.</div>
          <div>This is content.</div>
        </ele-popover>
        <ele-popconfirm :width="190" :offset="8" title="确定要删除此用户吗?">
          <template #reference>
            <el-button class="ele-btn-icon">PopConfirm</el-button>
          </template>
        </ele-popconfirm>
        <ele-popconfirm
          :width="258"
          :offset="8"
          title="用户满意度调研"
          content="您在使用中是否对本产品还满意?"
          cancel-button-text="关闭"
          confirm-button-text="满意"
          :cancel-button-props="{ style: { order: -1, margin: '0 auto 0 0' } }"
        >
          <template #reference>
            <el-button class="ele-btn-icon">PopConfirm</el-button>
          </template>
          <template #action="{ cancel }">
            <el-button size="small" plain type="danger" @click="cancel()">
              投诉
            </el-button>
          </template>
        </ele-popconfirm>
      </option-item>
    </ele-card>
    <ele-card header="警告提示">
      <div style="margin-bottom: 8px">基本用法:</div>
      <el-row :gutter="16">
        <el-col :md="6" :sm="12" :xs="24">
          <ele-alert
            title="Info Text"
            show-icon
            style="margin-bottom: 12px"
            :effect="effect"
          />
        </el-col>
        <el-col :md="6" :sm="12" :xs="24">
          <ele-alert
            show-icon
            type="success"
            title="Success Text"
            style="margin-bottom: 12px"
            :effect="effect"
          />
        </el-col>
        <el-col :md="6" :sm="12" :xs="24">
          <ele-alert
            show-icon
            type="warning"
            title="Warning Text"
            style="margin-bottom: 12px"
            :effect="effect"
          />
        </el-col>
        <el-col :md="6" :sm="12" :xs="24">
          <ele-alert
            show-icon
            type="error"
            title="Error Text"
            style="margin-bottom: 12px"
            :effect="effect"
          />
        </el-col>
      </el-row>
      <div style="margin: 8px 0">文字描述:</div>
      <el-row :gutter="16">
        <el-col :md="6" :sm="12" :xs="24">
          <ele-alert
            show-icon
            title="Info Text"
            description="Info Description Info Description Info Description Info Description"
            style="margin-bottom: 12px"
            :effect="effect"
          />
        </el-col>
        <el-col :md="6" :sm="12" :xs="24">
          <ele-alert
            show-icon
            type="success"
            title="Success Text"
            description="Success Description Success Description Success Description"
            style="margin-bottom: 12px"
            :effect="effect"
          />
        </el-col>
        <el-col :md="6" :sm="12" :xs="24">
          <ele-alert
            show-icon
            type="warning"
            title="Warning Text"
            description="Warning Description Warning Description Warning Description"
            style="margin-bottom: 12px"
            :effect="effect"
          />
        </el-col>
        <el-col :md="6" :sm="12" :xs="24">
          <ele-alert
            show-icon
            type="error"
            title="Error Text"
            description="Error Description Error Description Error Description Error Description"
            style="margin-bottom: 12px"
            :effect="effect"
          />
        </el-col>
      </el-row>
      <div style="margin: 8px 0">嵌套使用、操作按钮:</div>
      <el-row :gutter="16">
        <el-col :md="6" :sm="24" :xs="24">
          <ele-alert
            show-icon
            title="嵌套使用"
            :closable="false"
            :effect="effect"
            :icon-props="{ style: { fontSize: '18px', marginTop: '3px' } }"
            style="margin-bottom: 12px"
          >
            <ele-alert
              show-icon
              type="error"
              title="Error Description Error Description"
              :effect="effect"
              :title-style="{ fontSize: '13px', lineHeight: '18px' }"
            />
          </ele-alert>
        </el-col>
        <el-col :md="6" :sm="24" :xs="24">
          <ele-alert
            show-icon
            title="Info Text"
            description="Info Description Info Description"
            :effect="effect"
            style="margin-bottom: 12px"
          >
            <template #action>
              <div
                :style="{
                  display: 'flex',
                  'flex-direction': 'column',
                  '--el-fill-color-light': 'rgba(0, 0, 0, 0.06)',
                  '--el-fill-color': 'rgba(0, 0, 0, 0.15)'
                }"
              >
                <el-button type="primary" size="small" style="width: 72px">
                  Accept
                </el-button>
                <el-button
                  :text="effect !== 'dark'"
                  :type="effect === 'dark' ? 'primary' : void 0"
                  size="small"
                  style="margin: 4px 0 0 0; width: 72px"
                >
                  Decline
                </el-button>
              </div>
            </template>
          </ele-alert>
        </el-col>
        <el-col :md="6" :sm="24" :xs="24">
          <ele-alert
            show-icon
            type="success"
            title="Success Text"
            :effect="effect"
            style="margin-bottom: 12px"
          >
            <template #action>
              <div
                :style="{
                  '--el-fill-color-light': 'rgba(0, 0, 0, 0.06)',
                  '--el-fill-color': 'rgba(0, 0, 0, 0.15)'
                }"
              >
                <el-button
                  :text="effect !== 'dark'"
                  :type="effect === 'dark' ? 'success' : void 0"
                  size="small"
                >
                  UNDO
                </el-button>
              </div>
            </template>
          </ele-alert>
        </el-col>
        <el-col :md="6" :sm="24" :xs="24">
          <ele-alert
            show-icon
            type="error"
            title="Error Text"
            :closable="false"
            :effect="effect"
            style="margin-bottom: 12px"
          >
            <template #action>
              <div
                :style="{
                  '--el-fill-color-light': 'rgba(0, 0, 0, 0.06)',
                  '--el-fill-color': 'rgba(0, 0, 0, 0.15)'
                }"
              >
                <el-button
                  :text="effect !== 'dark'"
                  :type="effect === 'dark' ? 'danger' : void 0"
                  size="small"
                  style="padding: 0 6px"
                >
                  UNDO
                </el-button>
              </div>
            </template>
          </ele-alert>
        </el-col>
      </el-row>
      <option-item label="主题风格">
        <el-radio-group v-model="effect">
          <el-radio label="light">light</el-radio>
          <el-radio label="dark">dark</el-radio>
        </el-radio-group>
      </option-item>
    </ele-card>
    <ele-card header="加载提示">
      <option-item label="状态" :responsive="false">
        <el-switch v-model="loading" size="small" />
      </option-item>
      <option-item label="尺寸" :responsive="false" style="margin: 6px 0 0 0">
        <el-radio-group v-model="loadingSize">
          <el-radio label="small">小型</el-radio>
          <el-radio label="default">默认</el-radio>
          <el-radio label="large">大型</el-radio>
        </el-radio-group>
      </option-item>
      <option-item label="文本" :responsive="false" style="margin: 2px 0 0 0">
        <el-radio-group v-model="loadingText">
          <el-radio label="">不显示</el-radio>
          <el-radio label="Loading...">显示</el-radio>
        </el-radio-group>
      </option-item>
      <option-item label="类型" :responsive="false" style="margin: 2px 0 0 0">
        <el-radio-group v-model="loadingType">
          <el-radio label="dot">圆点</el-radio>
          <el-radio label="circle">圆圈</el-radio>
        </el-radio-group>
      </option-item>
      <ele-loading
        :loading="loading"
        :size="loadingSize"
        :type="loadingType"
        :text="loadingText"
        :blur="true"
        style="padding: 20px 16px; max-width: 520px; position: relative"
      >
        <div style="font-size: 17px; max-height: 100%">Alert message title</div>
        <div style="word-break: break-all; margin-top: 4px; max-height: 100%">
          <span>Further details about the context of this alert.</span>
          <span>Further details about the context of this alert.</span>
          <span>Further details about the context of this alert.</span>
          <span>Further details about the context of this alert.</span>
          <span>Further details about the context of this alert.</span>
          <span>Further details about the context of this alert.</span>
          <span>Further details about the context of this alert.</span>
          <span>Further details about the context of this alert.</span>
        </div>
      </ele-loading>
    </ele-card>
  </ele-page>
</template>

<script setup>
  import { ref } from 'vue';
  import { ElNotification } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import OptionItem from '@/views/extension/avatar/components/option-item.vue';

  /** 主题风格 */
  const theme = ref(0);

  /** 打开消息 */
  const showMessage = (type) => {
    const messages = {
      success: '这是一条成功的提示',
      warning: '这是一条警告的提示',
      error: '这是一条错误的提示',
      info: '这是一条普通的提示'
    };
    EleMessage({
      type,
      message: messages[type],
      plain: theme.value === 1,
      original: theme.value === 2,
      showClose: true
    });
  };

  /** 打开加载提示 */
  const showLoading = (mask, centered) => {
    const loading = EleMessage.loading({
      message: '正在加载中..',
      plain: theme.value === 1,
      original: mask ? false : theme.value === 2,
      showClose: true,
      mask,
      centered
    });
    setTimeout(() => {
      loading.close();
    }, 3000);
  };

  /** 打开消息通知 */
  const showNotification = (type, duration, position) => {
    ElNotification({
      title: 'Notification Title',
      message:
        'This is the content of the notification. This is the content of the notification. ',
      type: type || '',
      duration: duration ?? 4500,
      position: position || 'top-right'
    });
  };

  /** 警告提示主题 */
  const effect = ref('light');

  /** 加载框显示状态 */
  const loading = ref(false);

  /** 加载框尺寸 */
  const loadingSize = ref('default');

  /** 加载框类型 */
  const loadingType = ref('dot');

  /** 加载框显示文本 */
  const loadingText = ref('');
</script>

<script>
  export default {
    name: 'ExtensionMessage'
  };
</script>

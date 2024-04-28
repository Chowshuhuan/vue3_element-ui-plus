<template>
  <ele-card header="基础用法">
    <div style="max-width: 260px">
      <ele-icon-select
        clearable
        filterable
        :data="icons"
        v-model="selectedIcon"
        placeholder="请选择"
      >
        <template #icon="{ icon }">
          <el-icon>
            <component :is="icon" />
          </el-icon>
        </template>
      </ele-icon-select>
    </div>
  </ele-card>
</template>

<script setup>
  import { ref } from 'vue';

  /** 选中值 */
  const selectedIcon = ref('');

  /** 图标数据 */
  const icons = ref([
    {
      title: '线框风格',
      children: [
        {
          title: 'System',
          icons: [
            'CheckCircleOutlined',
            'CloseCircleOutlined',
            'QuestionCircleOutlined',
            'UserOutlined',
            'SearchOutlined',
            'SettingOutlined',
            'HomeOutlined',
            'MessageOutlined',
            'EditOutlined',
            'DeleteOutlined',
            'PlusCircleOutlined',
            'MinusCircleOutlined'
          ]
        },
        {
          title: 'Arrow',
          icons: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
        },
        {
          title: 'Media',
          icons: ['VerticalRightOutlined', 'VerticalLeftOutlined']
        },
        {
          title: 'Other',
          icons: ['DashboardOutlined', 'CompassOutlined', 'ProtectOutlined']
        }
      ]
    },
    {
      title: '实底风格',
      children: [
        {
          title: 'System',
          icons: [
            'CheckCircleFilled',
            'CloseCircleFilled',
            'QuestionCircleFilled',
            'ExclamationCircleFilled',
            'FilterFilled'
          ]
        },
        {
          title: 'Arrow',
          icons: ['CaretUpFilled', 'CaretDownFilled']
        },
        {
          title: 'Media',
          icons: [
            'StepBackwardFilled',
            'StepForwardFilled',
            'PlayFilled',
            'PauseFilled'
          ]
        },
        {
          title: 'Other',
          icons: ['QqFilled', 'WechatFilled', 'AlipayFilled']
        }
      ]
    }
  ]);
</script>

<script>
  import * as BasicIcons from './basic-icons';

  export default {
    components: BasicIcons
  };
</script>

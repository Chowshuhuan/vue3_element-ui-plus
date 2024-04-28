<!-- eslint-disable vue/no-v-html -->
<template>
  <ele-drawer
    :size="980"
    title="代码预览"
    :append-to-body="true"
    style="max-width: 100%"
    :model-value="modelValue"
    :body-style="{ padding: '8px', height: '100%' }"
    @update:modelValue="updateModelValue"
  >
    <div class="code-view">
      <div class="code-header">
        <div class="code-tabs">
          <div
            :class="['code-tab', { 'is-active': !active }]"
            @click="active = 0"
          >
            ProForm
          </div>
          <div
            :class="['code-tab', { 'is-active': !!active }]"
            @click="active = 1"
          >
            ElForm
          </div>
        </div>
        <div class="code-tools">
          <ele-copyable
            :text="active ? data.el : data.pro"
            :iconProps="{ style: { color: '#d6dde3' } }"
            :tooltip="{
              placement: 'bottom',
              bg: '#383838',
              arrowBg: '#383838'
            }"
          />
          <ele-tooltip
            content="下载"
            placement="bottom"
            :offset="6"
            bg="#383838"
            arrow-bg="#383838"
          >
            <el-icon class="code-icon-tool" @click="onDownload">
              <DownloadOutlined />
            </el-icon>
          </ele-tooltip>
        </div>
      </div>
      <div class="code-body">
        <div class="code-line-numbers">
          <div v-for="n in active ? data.elLines : data.proLines" :key="n">{{
            n
          }}</div>
        </div>
        <pre v-html="active ? data.elHtml : data.proHtml"></pre>
      </div>
    </div>
  </ele-drawer>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import xml from 'highlight.js/lib/languages/xml';
  import { DownloadOutlined } from '@/components/icons';
  import { useFormData } from '@/utils/use-form-data';
  import { download } from '@/utils/common';
  import {
    stringTypes,
    numberTypes,
    arrayTypes,
    blurTypes,
    selectTypes,
    uploadTypes
  } from '@/components/ProForm/util';
  import {
    templateEngine,
    proTemplate,
    elTemplate,
    itemTemplate,
    treeDataCode,
    obj2Str
  } from './util';

  hljs.registerLanguage('vue', xml);

  const emit = defineEmits(['update:modelValue']);

  const props = defineProps({
    /** 弹窗是否打开 */
    modelValue: Boolean,
    /** 表单标题宽度 */
    labelWidth: Number,
    /** 表单显示列数 */
    grid: Number,
    /** 表单项 */
    items: Array
  });

  /** 数据 */
  const [data, resetData, assignData] = useFormData({
    pro: '',
    proHtml: '',
    proLines: [1],
    el: '',
    elHtml: '',
    elLines: [1]
  });

  /** 选项卡选中 */
  const active = ref(0);

  /** 下载 */
  const onDownload = () => {
    download(
      active.value ? data.el : data.pro,
      'index.vue',
      'text/plain;charset=utf-8'
    );
  };

  /** 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue) {
        const grid = props.grid == 1 ? false : { span: 24 / props.grid };
        const items = props.items.map((d) => {
          return { ...d, key: void 0 };
        });
        const templateData = {
          labelWidth: props.labelWidth,
          grid: grid,
          gridStr: obj2Str(grid),
          items: items,
          itemsStr: obj2Str(items),
          itemsCode: props.items.map((item) => {
            const code = templateEngine(itemTemplate, item);
            if (!grid) {
              return code;
            }
            return '    ' + code.split('\n').join('\n    ');
          }),
          stringTypes: stringTypes,
          numberTypes: numberTypes,
          arrayTypes: arrayTypes,
          blurTypes: blurTypes,
          selectTypes: selectTypes,
          uploadTypes: uploadTypes,
          treeDataCode: treeDataCode
        };
        const pro = templateEngine(proTemplate, templateData);
        const proHtml = hljs.highlight(pro, { language: 'vue' }).value;
        const proLines = proHtml.split('\n').map((_, i) => i + 1);
        const el = templateEngine(elTemplate, templateData);
        const elHtml = hljs.highlight(el, { language: 'vue' }).value;
        const elLines = elHtml.split('\n').map((_, i) => i + 1);
        assignData({ pro, proHtml, proLines, el, elHtml, elLines });
      } else {
        resetData();
      }
    }
  );
</script>

<style lang="scss" scoped>
  .code-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border: 1px solid #000;
    background: #1e1e1e;
    border-radius: 8px;
    overflow: hidden;
  }

  .code-body {
    flex: 1;
    color: #e6edf3;
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    align-items: flex-start;
    --ele-scrollbar-color: #5e5e5e;
    --ele-scrollbar-hover-color: #707070;

    & > pre {
      flex: 1;
      margin: 0;
      padding: 12px;
      box-sizing: border-box;
      font-family: monospace;
    }
  }

  .code-line-numbers {
    flex-shrink: 0;
    color: #8b949e;
    font-family: monospace;
    padding: 12px 0;
    min-width: 38px;
    background: #1e1e1e;
    border-right: 1px solid #000;
    box-sizing: border-box;
    text-align: center;
    user-select: none;
    position: sticky;
    left: 0;
  }

  .code-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #000;
    box-sizing: border-box;
  }

  .code-tools {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 6px 16px 6px 0;

    & > .ele-copyable {
      border-radius: 4px;
      background: #444444;
      transition: background-color 0.2s;

      :deep(.ele-copyable-icon) {
        padding: 4px;
        margin: 0;
      }

      &:hover {
        background: #707070;
      }
    }
  }

  .code-icon-tool {
    width: auto;
    height: auto;
    font-size: 15px;
    color: #d6dde3;
    background: #444444;
    padding: 4px;
    margin-left: 8px;
    border-radius: 4px;
    box-sizing: border-box;
    transition: background-color 0.2s;
    cursor: pointer;

    &:hover {
      background: #707070;
    }
  }

  .code-tabs {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .code-tab {
    height: 35px;
    line-height: 35px;
    color: #e6edf3;
    font-weight: bold;
    font-family: monospace;
    padding: 0 2px;
    margin: 0 0 0 16px;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }

    &.is-active {
      color: var(--el-color-primary);
      border-bottom-color: var(--el-color-primary);
    }
  }
</style>

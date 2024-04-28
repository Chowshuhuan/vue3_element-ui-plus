/**
 * ProForm代码生成模板
 */
export const proTemplate = `<template>
  <pro-form
    :model="form"
    :items="formItems"
    :label-width="<% d.labelWidth %>"
    :grid="<% d.gridStr %>"
    :footer="true"
    @updateValue="setFieldValue"
    @submit="onSubmit"
    @reset="resetFields"
  />
</template>

<script setup>
  import { useFormData } from '@/utils/use-form-data';
  import ProForm from '@/components/ProForm/index.vue';

  /** 表单数据 */
  const [form, resetFields, _, setFieldValue] = useFormData({<%# d.items.forEach(function(item,i){ %>
    <% item.prop %>: <% 'sliderRange' === item.type ? '[0, 0]': (d.arrayTypes.includes(item.type)?'[]':(d.stringTypes.includes(item.type)?"''":'void 0')) %><% i==(d.items.length-1)?'':',' %><%# }); %>
  });

  /** 表单项 */
  const formItems = ref(<% JSON.stringify(d.items, void 0, 2).split(String.fromCodePoint(10)).join(String.fromCodePoint(10)+'  ') %>);

  /** 提交 */
  const onSubmit = (form) => {
    console.log(form);
  };
</script>
`;

/**
 * ElForm代码生成模板
 */
export const elTemplate = `<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-width="<% d.labelWidth %>"
    @submit.prevent=""
  ><%# if(!d.grid){ d.itemsCode.forEach(function(item){ %><% item %><%# }); }else{ %>
    <el-row><%# d.itemsCode.forEach(function(item,i){ %>
      <el-col :span="<% d.items[i]&&d.items[i].colProps&&d.items[i].colProps.span?d.items[i].colProps.span:d.grid.span %>"><% item %>
      </el-col><%# }); %>
    </el-row><%# } %>
    <el-form-item>
      <el-button type="primary" @click="save">提交</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import { useFormData } from '@/utils/use-form-data';<%# if(d.items.some(function(item){return item.type=='imageUpload';})){ %>
  import ImageUpload from '@/components/ImageUpload/index.vue';<%# };if(d.items.some(function(item){return item.type=='fileUpload';})){ %>
  import FileUpload from '@/components/FileUpload/index.vue';<%# };if(d.items.some(function(item){return item.type=='regions';})){ %>
  import RegionsSelect from '@/components/RegionsSelect/index.vue';<%# };if(d.items.some(function(item){return item.type=='editor';})){ %>
  import TinymceEditor from '@/components/TinymceEditor/index.vue';<%# } %>

  /** 表单实例 */
  const formRef = ref(null);

  /** 表单数据 */
  const [form, resetFields, _assignFields] = useFormData({<%# d.items.forEach(function(item,i){ %>
    <% item.prop %>: <% 'sliderRange' === item.type ? '[0, 0]': (d.arrayTypes.includes(item.type)?'[]':(d.stringTypes.includes(item.type)?"''":'void 0')) %><% i==(d.items.length-1)?'':',' %><%# }); %>
  });

  /** 表单验证规则 */
  const rules = reactive({<%# d.items.filter(function(t){return t.required||d.uploadTypes.includes(t.type);}).forEach(function(item,i){ %>
    <% item.prop %>: [<%# if(item.required){ %>
      {
        required: true,
        message: '请<% d.selectTypes.includes(item.type)?'选择':(d.uploadTypes.includes(item.type)?'上传':'输入') %><% item.label %>',
        type: '<% d.arrayTypes.includes(item.type)?'array':(d.numberTypes.includes(item.type)?'number':'string') %>',
        trigger: '<% d.blurTypes.includes(item.type)?'blur':'change' %>'
      }<%# } %><% item.required&&d.uploadTypes.includes(item.type)?',':'' %><%# if(d.uploadTypes.includes(item.type)){ %>
      {
        type: '<% d.arrayTypes.includes(item.type)?'array':(d.numberTypes.includes(item.type)?'number':'string') %>',
        trigger: '<% d.blurTypes.includes(item.type)?'blur':'change' %>',
        validator: (_rule, value, callback) => {
          if (value && <% item.prop %>UploadRef.value && !<% item.prop %>UploadRef.value.isDone()) {
            return callback(new Error('<% item.label %>还未上传完毕'));
          }
          callback();
        }
      }<%# } %>
    ]<% i==(d.items.length-1)?'':',' %><%# }); %>
  });<%# d.items.forEach(function(item){ if(item.type=='autocomplete'){ %>

  /** <% item.label %>选项数据 */
  const <% item.prop %>FetchSuggestions = (keyword, callback) => {
    console.log('keyword:', keyword);
    callback([{ value: '选项一' }, { value: '选项二' }]);
  };<%# }else if(item.type=='cascader'){ %>

  /** <% item.label %>级联数据 */
  const <% item.prop %>CascaderOptions = ref(<% d.treeDataCode %>);

  /** <% item.label %>级联配置 */
  const <% item.prop %>CascaderProps = reactive({
    multiple: false,
    label: 'label',
    value: 'value'
  });<%# }else if(item.type=='treeSelect'||item.type=='treeMultipleSelect'){ %>

  /** <% item.label %>树数据 */
  const <% item.prop %>TreeData = ref(<% d.treeDataCode %>);<%# }else if(item.type=='virtualTreeSelect'||item.type=='virtualTreeMultipleSelect'){ %>

  /** <% item.label %>树配置 */
  const <% item.prop %>TreeProps = reactive({
    height: 266,
    expandOnClickNode: true,
    props: { value: 'value', label: 'label' },
    data: <% d.treeDataCode.split(String.fromCodePoint(10)).join(String.fromCodePoint(10)+'  ') %>
  });<%# }else if(item.type=='tableSelect'||item.type=='tableMultipleSelect'){ %>

  /** <% item.label %>表格配置 */
  const <% item.prop %>TableProps = reactive({
    datasource: [
      { userId: 1, username: '001', nickname: '用户一', sex: '男' },
      { userId: 2, username: '002', nickname: '用户二', sex: '女' },
      { userId: 3, username: '003', nickname: '用户三', sex: '女' },
      { userId: 4, username: '004', nickname: '用户四', sex: '男' },
      { userId: 5, username: '005', nickname: '用户五', sex: '女' }
    ],
    columns: [<%# if(item.type=='tableMultipleSelect'){ %>
      { type: 'selection', columnKey: 'selection', width: 48, align: 'center', reserveSelection: true },<%# } %>
      { type: 'index', columnKey: 'index', width: 48, align: 'center' },
      { prop: 'username', label: '账号' },
      { prop: 'nickname', label: '用户名' },
      { prop: 'sex', label: '性别' }
    ],
    showOverflowTooltip: true,<%# if(item.type=='tableMultipleSelect'){ %>
    rowClickChecked: true,<%# }else{ %>
    highlightCurrentRow: true,<%# } %>
    toolbar: false,
    pagination: {
      pageSize: 6,
      layout: 'total, prev, pager, next, jumper'
    },
    footerStyle: { padding: '0px' },
    rowStyle: { cursor: 'pointer' }
  });<%# }else if(item.type=='checkCard'||item.type=='multipleCheckCard'){ %>

  /** <% item.label %>选项数据 */
  const <% item.prop %>CheckCardItems = ref([
    { value: '选项一' },
    { value: '选项二' }
  ]);<%# }else if(d.uploadTypes.includes(item.type)){ %>

  /** 上传组件实例 */
  const <% item.prop %>UploadRef = ref(null);<%# } }); %>

  /** 保存编辑 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      console.log(form);
    });
  };

  /** 重置表单 */
  const reset = () => {
    resetFields();
    formRef.value?.resetFields?.();
  };
</script>
`;

/**
 * ElFormItem代码生成模板
 */
export const itemTemplate = `
    <el-form-item label="<% d.label %>" prop="<% d.prop %>">
      <%# if(d.type=='input'){ %><el-input
        clearable
        v-model="form.<% d.prop %>"
        placeholder="请输入<% d.label %>"
      /><%# }else if(d.type=='textarea'){ %><el-input
        :rows="4"
        type="textarea"
        v-model="form.<% d.prop %>"
        placeholder="请输入<% d.label %>"
      /><%# }else if(d.type=='select'){ %><el-select
        clearable
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        class="ele-fluid"
      ><%# (d.options||[]).forEach(function(opt){ %>
        <el-option label="<% opt.label %>" value="<% opt.value %>" /><%# }); %>
      </el-select><%# }else if(d.type=='multipleSelect'){ %><el-select
        clearable
        multiple
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        class="ele-fluid"
      ><%# (d.options||[]).forEach(function(opt){ %>
        <el-option label="<% opt.label %>" value="<% opt.value %>" /><%# }); %>
      </el-select><%# }else if(d.type=='radio'){ %><el-radio-group
        v-model="form.<% d.prop %>"
      ><%# (d.options||[]).forEach(function(opt){ %>
        <el-radio label="<% opt.value %>"><% opt.label %></el-radio><%# }); %>
      </el-radio-group><%# }else if(d.type=='radioButton'){ %><el-radio-group
        v-model="form.<% d.prop %>"
      ><%# (d.options||[]).forEach(function(opt){ %>
        <el-radio-button label="<% opt.value %>"><% opt.label %></el-radio-button><%# }); %>
      </el-radio-group><%# }else if(d.type=='checkbox'){ %><el-checkbox-group
        v-model="form.<% d.prop %>"
      ><%# (d.options||[]).forEach(function(opt){ %>
        <el-checkbox label="<% opt.value %>"><% opt.label %></el-checkbox><%# }); %>
      </el-checkbox-group><%# }else if(d.type=='checkboxButton'){ %><el-checkbox-group
        v-model="form.<% d.prop %>"
      ><%# (d.options||[]).forEach(function(opt){ %>
        <el-checkbox-button label="<% opt.value %>"><% opt.label %></el-checkbox-button><%# }); %>
      </el-checkbox-group><%# }else if(d.type=='date'){ %><el-date-picker
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        value-format="YYYY-MM-DD"
        class="ele-fluid"
      /><%# }else if(d.type=='datetime'){ %><el-date-picker
        type="datetime"
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        value-format="YYYY-MM-DD HH:mm:ss"
        class="ele-fluid"
      /><%# }else if(d.type=='daterange'){ %><el-date-picker
        type="daterange"
        v-model="form.<% d.prop %>"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        range-separator="-"
        :unlink-panels="true"
        value-format="YYYY-MM-DD"
        class="ele-fluid"
      /><%# }else if(d.type=='datetimerange'){ %><el-date-picker
        type="datetimerange"
        v-model="form.<% d.prop %>"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        range-separator="-"
        :unlink-panels="true"
        value-format="YYYY-MM-DD HH:mm:ss"
        class="ele-fluid"
      /><%# }else if(d.type=='time'){ %><el-time-picker
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        value-format="HH:mm:ss"
        class="ele-fluid"
      /><%# }else if(d.type=='timerange'){ %><el-time-picker
        is-range
        v-model="form.<% d.prop %>"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        range-separator="-"
        value-format="HH:mm:ss"
        class="ele-fluid"
      /><%# }else if(d.type=='timeSelect'){ %><el-time-select
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        class="ele-fluid"
      /><%# }else if(d.type=='switch'){ %><el-switch
        v-model="form.<% d.prop %>"
        :active-value="1"
        :inactive-value="0"
      /><%# }else if(d.type=='inputNumber'){ %><el-input-number
        v-model="form.<% d.prop %>"
        placeholder="请输入<% d.label %>"
        controls-position="right"
        class="ele-fluid"
      /><%# }else if(d.type=='autocomplete'){ %><el-autocomplete
        v-model="form.<% d.prop %>"
        placeholder="请输入<% d.label %>"
        :fetch-suggestions="<% d.prop %>FetchSuggestions"
        class="ele-fluid"
      /><%# }else if(d.type=='cascader'){ %><el-cascader
        clearable
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        :options="<% d.prop %>CascaderOptions"
        :props="<% d.prop %>CascaderProps"
        class="ele-fluid"
      /><%# }else if(d.type=='rate'){ %><el-rate
        v-model="form.<% d.prop %>"
      /><%# }else if(d.type=='slider'){ %><el-slider
        v-model="form.<% d.prop %>"
      /><%# }else if(d.type=='sliderRange'){ %><el-slider
        range
        v-model="form.<% d.prop %>"
      /><%# }else if(d.type=='treeSelect'){ %><el-tree-select
        clearable
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        :data="<% d.prop %>TreeData"
        :default-expand-all="true"
        node-key="value"
        :props="{ label: 'label' }"
        class="ele-fluid"
      /><%# }else if(d.type=='treeMultipleSelect'){ %><el-tree-select
        clearable
        multiple
        show-checkbox
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        :data="<% d.prop %>TreeData"
        :default-expand-all="true"
        node-key="value"
        :props="{ label: 'label' }"
        class="ele-fluid"
      /><%# }else if(d.type=='virtualTreeSelect'){ %><ele-tree-select
        clearable
        :popper-width="320"
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        :tree-props="<% d.prop %>TreeProps"
      /><%# }else if(d.type=='virtualTreeMultipleSelect'){ %><ele-tree-select
        clearable
        multiple
        :max-tag-count="1"
        :popper-width="320"
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        :tree-props="<% d.prop %>TreeProps"
      /><%# }else if(d.type=='tableSelect'){ %><ele-table-select
        clearable
        :popper-width="580"
        value-key="userId"
        label-key="nickname"
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        :table-props="<% d.prop %>TableProps"
      /><%# }else if(d.type=='tableMultipleSelect'){ %><ele-table-select
        clearable
        multiple
        :popper-width="580"
        value-key="userId"
        label-key="nickname"
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
        :table-props="<% d.prop %>TableProps"
      /><%# }else if(d.type=='checkCard'){ %><ele-check-card
        :items="<% d.prop %>CheckCardItems"
        v-model="form.<% d.prop %>"
        :style="{ display: 'flex', alignItems: 'flex-start' }"
        :item-style="{ padding: '8px 22px', margin: '0 12px 0 0', lineHeight: 'normal' }"
      /><%# }else if(d.type=='multipleCheckCard'){ %><ele-check-card
        multiple
        :items="<% d.prop %>CheckCardItems"
        v-model="form.<% d.prop %>"
        :style="{ display: 'flex', alignItems: 'flex-start' }"
        :item-style="{ padding: '8px 22px', margin: '0 12px 0 0', lineHeight: 'normal' }"
      /><%# }else if(d.type=='editTag'){ %><ele-edit-tag
        type="info"
        v-model="form.<% d.prop %>"
        :style="{ marginTop: '4px' }"
        :itemStyle="{ margin: '0 4px 4px 0' }"
        :buttonStyle="{ marginBottom: '4px' }"
        :inputTagStyle="{ marginBottom: '4px' }"
      /><%# }else if(d.type=='dictRadio'){ %><dict-data
        code="sex"
        type="radio"
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
      /><%# }else if(d.type=='dictSelect'){ %><dict-data
        code="sex"
        type="select"
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
      /><%# }else if(d.type=='dictCheckbox'){ %><dict-data
        code="sex"
        type="checkbox"
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
      /><%# }else if(d.type=='dictMultipleSelect'){ %><dict-data
        code="sex"
        type="multipleSelect"
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
      /><%# }else if(d.type=='imageUpload'){ %><image-upload
        ref="<% d.prop %>UploadRef"
        :limit="3"
        v-model="form.<% d.prop %>"
      /><%# }else if(d.type=='fileUpload'){ %><file-upload
        ref="<% d.prop %>UploadRef"
        :limit="6"
        v-model="form.<% d.prop %>"
      /><%# }else if(d.type=='regions'){ %><regions-select
        v-model="form.<% d.prop %>"
        placeholder="请选择<% d.label %>"
      /><%# }else if(d.type=='editor'){ %><tinymce-editor
        v-model="form.<% d.prop %>"
        :init="{ height: 380 }"
      /><%# } %>
    </el-form-item>`;

/**
 * 树组件构造数据代码
 */
export const treeDataCode = `[
    {
      label: '选项1',
      value: '1',
      children: [
        {
          label: '选项1-1',
          value: '1-1',
          children: [
            { label: '选项1-1-1', value: '1-1-1' },
            { label: '选项1-1-2', value: '1-1-2' }
          ]
        },
        {
          label: '选项1-2',
          value: '1-2',
          children: [
            { label: '选项1-2-1', value: '1-2-1' },
            { label: '选项1-2-2', value: '1-2-2' }
          ]
        }
      ]
    },
    {
      label: '选项2',
      value: '2',
      children: [
        {
          label: '选项2-1',
          value: '2-1',
          children: [
            { label: '选项2-1-1', value: '2-1-1' },
            { label: '选项2-1-2', value: '2-1-2' }
          ]
        },
        {
          label: '选项2-2',
          value: '2-2',
          children: [
            { label: '选项2-2-1', value: '2-2-1' },
            { label: '选项2-2-2', value: '2-2-2' }
          ]
        }
      ]
    }
  ]`;

/**
 * 模板引擎
 * @param template 模板
 * @param data 数据
 */
export function templateEngine(template, data = {}) {
  if (typeof template !== 'string' || !template) {
    return '';
  }
  const openCode = '<%';
  const closeCode = '%>';
  try {
    const jss = new RegExp('^' + openCode + '#', 'g');
    const jsse = new RegExp(closeCode + '$', 'g');
    const result = template
      .replace(new RegExp(openCode + '#', 'g'), openCode + '# ')
      .replace(new RegExp(closeCode + '}', 'g'), '} ' + closeCode)
      .replace(/\\/g, '\\\\')
      .replace(new RegExp(openCode + '!(.+?)!' + closeCode, 'g'), (str) => {
        return str
          .replace(new RegExp('^' + openCode + '!', 'g'), '')
          .replace(new RegExp('!' + closeCode, 'g'), '')
          .replace(new RegExp(openCode + '|' + closeCode, 'g'), (tag) => {
            return tag.replace(/(.)/g, '\\$1');
          });
      })
      .replace(/(?="|')/g, '\\')
      .replace(
        new RegExp(openCode + '#([\\s\\S])+?' + closeCode, 'g'),
        (str) => {
          return (
            '";' +
            str.replace(jss, '').replace(jsse, '').replace(/\\/g, '') +
            ';view+="'
          );
        }
      )
      .replace(new RegExp(openCode + '([^{#}])*?' + closeCode, 'g'), (str) => {
        if (str.replace(/\s/g, '') === openCode + closeCode) {
          return '';
        }
        let start = '"+(';
        str = str.replace(new RegExp(openCode + '|' + closeCode, 'g'), '');
        if (/^=/.test(str)) {
          str = str.replace(/^=/, '');
          start = '"+_escape_(';
        }
        return start + str.replace(/\\/g, '') + ')+"';
      })
      .replace(/\r\n/g, '\\r\\n" + "')
      .replace(/\n/g, '\\n" + "')
      .replace(/\r/g, '\\r" + "');
    return new Function(
      'd, _escape_',
      '"use strict";var view = "' + result + '";return view;'
    )(data, (str) => {
      return String(str || '')
        .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;');
    });
  } catch (e) {
    console.error('TemplateEngine Error: ', e, '\n' + (template || ''));
    return '';
  }
}

/**
 * 对象转字符串
 * @param obj 对象
 */
export function obj2Str(obj) {
  if (typeof obj === 'undefined') {
    return 'void 0';
  }
  if (obj === null) {
    return 'null';
  }
  if (Array.isArray(obj)) {
    const result = obj.map((v) => obj2Str(v));
    return `[ ${result.join(', ')} ]`;
  }
  if (typeof obj === 'object') {
    const result = [];
    Object.keys(obj).forEach((k) => {
      if (typeof obj[k] !== 'undefined') {
        result.push(`${k}: ${obj2Str(obj[k])}`);
      }
    });
    return `{ ${result.join(', ')} }`;
  }
  return JSON.stringify(obj).replace(/(^"|"$)/g, "'");
}

/**
 * 标题宽度选项
 */
export const labelWidthOptions = [
  { value: 52, label: '52px' },
  { value: 66, label: '66px' },
  { value: 80, label: '80px' },
  { value: 94, label: '94px' },
  { value: 108, label: '108px' },
  { value: 122, label: '122px' },
  { value: 136, label: '136px' }
];

/**
 * 显示列数选项
 */
export const gridOptions = [
  { value: 1, label: '1列' },
  { value: 2, label: '2列' },
  { value: 3, label: '3列' },
  { value: 4, label: '4列' },
  { value: 6, label: '6列' },
  { value: 8, label: '8列' }
];

/**
 * 表单项类型选项
 */
export const itemTypes = [
  { value: 'input', label: '输入框' },
  { value: 'textarea', label: '文本域' },
  { value: 'select', label: '下拉' },
  { value: 'multipleSelect', label: '下拉多选' },
  { value: 'radio', label: '单选' },
  { value: 'radioButton', label: '单选按钮' },
  { value: 'checkbox', label: '多选' },
  { value: 'checkboxButton', label: '多选按钮' },
  { value: 'date', label: '日期选择' },
  { value: 'datetime', label: '日期时间选择' },
  { value: 'daterange', label: '日期范围选择' },
  { value: 'datetimerange', label: '日期时间范围选择' },
  { value: 'time', label: '时间选择' },
  { value: 'timerange', label: '时间范围选择' },
  { value: 'timeSelect', label: '时间段选择' },
  { value: 'editTag', label: '标签输入' },
  { value: 'switch', label: '开关' },
  { value: 'rate', label: '评分' },
  { value: 'inputNumber', label: '数字输入框' },
  { value: 'cascader', label: '级联选择' },
  { value: 'treeSelect', label: '树下拉' },
  { value: 'treeMultipleSelect', label: '树下拉多选' },
  { value: 'virtualTreeSelect', label: '虚拟树下拉' },
  { value: 'virtualTreeMultipleSelect', label: '虚拟树下拉多选' },
  { value: 'tableSelect', label: '表格下拉' },
  { value: 'tableMultipleSelect', label: '表格下拉多选' },
  { value: 'checkCard', label: '可选卡片' },
  { value: 'multipleCheckCard', label: '多选卡片' },
  { value: 'autocomplete', label: '自动完成' },
  { value: 'imageUpload', label: '图片上传' },
  { value: 'fileUpload', label: '附件上传' },
  { value: 'regions', label: '省市区选择' },
  { value: 'dictRadio', label: '字典单选' },
  { value: 'dictCheckbox', label: '字典多选' },
  { value: 'dictSelect', label: '字典下拉' },
  { value: 'dictMultipleSelect', label: '字典下拉多选' },
  { value: 'slider', label: '滑块' },
  { value: 'sliderRange', label: '范围滑块' },
  { value: 'editor', label: '富文本' }
];

/**
 * 获取组件预设属性
 * @param type 组件类型
 */
export function getOptionsAndProps(type) {
  if (!type) {
    return { options: '', props: '' };
  }
  const treeData = new Function('"use strict";return (' + treeDataCode + ')')();
  if (
    [
      'select',
      'multipleSelect',
      'radio',
      'radioButton',
      'checkbox',
      'checkboxButton'
    ].includes(type)
  ) {
    return {
      options: JSON.stringify([
        { label: '选项一', value: 1 },
        { label: '选项二', value: 2 }
      ]),
      props: ''
    };
  }
  if ('autocomplete' === type) {
    return {
      options: JSON.stringify([{ value: '选项一' }, { value: '选项二' }]),
      props: ''
    };
  }
  if ('cascader' === type) {
    return {
      options: JSON.stringify(treeData),
      props: ''
    };
  }
  if ('tableSelect' === type || 'tableMultipleSelect' === type) {
    const props = {
      popperWidth: 580,
      valueKey: 'userId',
      labelKey: 'nickname',
      tableProps: {
        datasource: [
          { userId: 1, username: '001', nickname: '用户一', sex: '男' },
          { userId: 2, username: '002', nickname: '用户二', sex: '女' },
          { userId: 3, username: '003', nickname: '用户三', sex: '女' },
          { userId: 4, username: '004', nickname: '用户四', sex: '男' },
          { userId: 5, username: '005', nickname: '用户五', sex: '女' }
        ],
        columns: [
          { type: 'index', columnKey: 'index', width: 48, align: 'center' },
          { prop: 'username', label: '账号' },
          { prop: 'nickname', label: '用户名' },
          { prop: 'sex', label: '性别' }
        ],
        showOverflowTooltip: true,
        highlightCurrentRow: true,
        toolbar: false,
        pagination: {
          pageSize: 6,
          layout: 'total, prev, pager, next, jumper'
        },
        footerStyle: { padding: '0px' },
        rowStyle: { cursor: 'pointer' }
      }
    };
    if ('tableMultipleSelect' === type) {
      props.tableProps.columns.unshift({
        type: 'selection',
        columnKey: 'selection',
        width: 48,
        align: 'center',
        reserveSelection: true
      });
      props.tableProps.rowClickChecked = true;
      props.tableProps.highlightCurrentRow = void 0;
    }
    return {
      options: '',
      props: JSON.stringify(props)
    };
  }
  if (['virtualTreeSelect', 'virtualTreeMultipleSelect'].includes(type)) {
    return {
      options: '',
      props: JSON.stringify({
        popperWidth: 320,
        treeProps: {
          height: 266,
          data: treeData,
          props: { value: 'value', label: 'label' },
          expandOnClickNode: true
        },
        placement: 'bottom'
      })
    };
  }
  if (['treeSelect', 'treeMultipleSelect'].includes(type)) {
    const props = {
      defaultExpandAll: true,
      nodeKey: 'value',
      props: { label: 'label' }
    };
    if ('treeMultipleSelect' === type) {
      props.multiple = true;
      props.showCheckbox = true;
    }
    return {
      options: JSON.stringify(treeData),
      props: JSON.stringify(props)
    };
  }
  if (['checkCard', 'multipleCheckCard'].includes(type)) {
    return {
      options: JSON.stringify([{ value: '选项一' }, { value: '选项二' }]),
      props: JSON.stringify({
        style: { display: 'flex', alignItems: 'flex-start' },
        itemStyle: {
          padding: '8px 22px',
          margin: '0 12px 0 0',
          lineHeight: 'normal'
        }
      })
    };
  }
  if (
    ['dictRadio', 'dictSelect', 'dictCheckbox', 'dictMultipleSelect'].includes(
      type
    )
  ) {
    return {
      options: '',
      props: JSON.stringify({ code: 'sex' })
    };
  }
  if ('imageUpload' === type) {
    return {
      options: '',
      props: JSON.stringify({ limit: 3 })
    };
  }
  if ('fileUpload' === type) {
    return {
      options: '',
      props: JSON.stringify({ limit: 6 })
    };
  }
  if ('editor' === type) {
    return {
      options: '',
      props: JSON.stringify({ init: { height: 380 } })
    };
  }
  return { options: '', props: '' };
}

/**
 * 获取ElCol跨列属性
 * @param grid 显示列数
 * @param colSpan 所占列数
 */
export function getColProps(grid, colSpan) {
  if (grid === 1 || colSpan === 1) {
    return;
  }
  const span = 24 / grid;
  return { span: span * colSpan };
}

/**
 * 获取表单项所占列数
 * @param grid 显示列数
 * @param colSpan ElCol的span值
 */
export function getColSpan(grid, colSpan) {
  if (grid === 1 || colSpan == null) {
    return 1;
  }
  const span = 24 / grid;
  return colSpan / span;
}

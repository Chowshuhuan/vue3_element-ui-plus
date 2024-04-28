<!-- 表单项 -->
<template>
  <ElFormItem
    :label="item.label"
    v-bind="item.itemProps || {}"
    :prop="item.prop"
    :rules="itemRules"
  >
    <template
      v-for="name in Object.keys(item.itemSlots || {}).filter(
        (k) =>
          !!(item.itemSlots && item.itemSlots[k] && $slots[item.itemSlots[k]])
      )"
      #[name]="slotProps"
    >
      <slot :name="item.itemSlots?.[name]" v-bind="slotProps || {}"></slot>
    </template>
    <ElInput
      v-if="item.type === 'input'"
      :clearable="true"
      :placeholder="'请输入' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElInput>
    <ElInput
      v-else-if="item.type === 'textarea'"
      :rows="4"
      :placeholder="'请输入' + item.label"
      v-bind="item.props || {}"
      type="textarea"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElInput>
    <ElSelect
      v-else-if="item.type === 'select'"
      class="ele-fluid"
      :clearable="true"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
      <ElOption
        v-for="opt in item.options || []"
        :key="opt.key ?? opt.value"
        :label="opt.label"
        :value="opt.value"
        :disabled="opt.disabled"
      />
    </ElSelect>
    <ElSelect
      v-else-if="item.type === 'multipleSelect'"
      class="ele-fluid"
      :clearable="true"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      :multiple="true"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
      <ElOption
        v-for="opt in item.options || []"
        :key="opt.key ?? opt.value"
        :label="opt.label"
        :value="opt.value"
        :disabled="opt.disabled"
      />
    </ElSelect>
    <ElRadioGroup
      v-else-if="item.type === 'radio'"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <ElRadio
        v-for="opt in item.options || []"
        :key="opt.key ?? opt.value"
        :label="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </ElRadio>
    </ElRadioGroup>
    <ElRadioGroup
      v-else-if="item.type === 'radioButton'"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <ElRadioButton
        v-for="opt in item.options || []"
        :key="opt.key ?? opt.value"
        :label="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </ElRadioButton>
    </ElRadioGroup>
    <ElCheckboxGroup
      v-else-if="item.type === 'checkbox'"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <ElCheckbox
        v-for="opt in item.options || []"
        :key="opt.key ?? opt.value"
        :label="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </ElCheckbox>
    </ElCheckboxGroup>
    <ElCheckboxGroup
      v-else-if="item.type === 'checkboxButton'"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <ElCheckboxButton
        v-for="opt in item.options || []"
        :key="opt.key ?? opt.value"
        :label="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </ElCheckboxButton>
    </ElCheckboxGroup>
    <ElDatePicker
      v-else-if="item.type === 'date'"
      valueFormat="YYYY-MM-DD"
      class="ele-fluid"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElDatePicker>
    <ElDatePicker
      v-else-if="item.type === 'datetime'"
      valueFormat="YYYY-MM-DD HH:mm:ss"
      class="ele-fluid"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      type="datetime"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElDatePicker>
    <ElDatePicker
      v-else-if="item.type === 'daterange'"
      valueFormat="YYYY-MM-DD"
      rangeSeparator="-"
      startPlaceholder="开始日期"
      endPlaceholder="结束日期"
      :unlinkPanels="true"
      class="ele-fluid"
      type="daterange"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElDatePicker>
    <ElDatePicker
      v-else-if="item.type === 'datetimerange'"
      valueFormat="YYYY-MM-DD HH:mm:ss"
      rangeSeparator="-"
      startPlaceholder="开始时间"
      endPlaceholder="结束时间"
      :unlinkPanels="true"
      class="ele-fluid"
      v-bind="item.props || {}"
      type="datetimerange"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElDatePicker>
    <ElTimePicker
      v-else-if="item.type === 'time'"
      valueFormat="HH:mm:ss"
      class="ele-fluid"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElTimePicker>
    <ElTimePicker
      v-else-if="item.type === 'timerange'"
      valueFormat="HH:mm:ss"
      rangeSeparator="-"
      startPlaceholder="开始时间"
      end-placeholder="结束时间"
      class="ele-fluid"
      v-bind="item.props || {}"
      :isRange="true"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElTimePicker>
    <ElTimeSelect
      v-else-if="item.type === 'timeSelect'"
      class="ele-fluid"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    />
    <ElSwitch
      v-else-if="item.type === 'switch'"
      :active-value="1"
      :inactive-value="0"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElSwitch>
    <ElInputNumber
      v-else-if="item.type === 'inputNumber'"
      class="ele-fluid"
      controls-position="right"
      :placeholder="'请输入' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElInputNumber>
    <ElAutocomplete
      v-else-if="item.type === 'autocomplete'"
      class="ele-fluid"
      :fetchSuggestions="(_keyword, callback) => callback(item.options || [])"
      :placeholder="'请输入' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElAutocomplete>
    <ElCascader
      v-else-if="item.type === 'cascader'"
      class="ele-fluid"
      :clearable="true"
      :options="item.options || []"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElCascader>
    <ElRate
      v-else-if="item.type === 'rate'"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElRate>
    <ElSlider
      v-else-if="item.type === 'slider'"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElSlider>
    <ElSlider
      v-else-if="item.type === 'sliderRange'"
      v-bind="item.props || {}"
      :range="true"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElSlider>
    <ElTreeSelect
      v-else-if="item.type === 'treeSelect'"
      class="ele-fluid"
      :clearable="true"
      :data="item.options"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElTreeSelect>
    <ElTreeSelect
      v-else-if="item.type === 'treeMultipleSelect'"
      class="ele-fluid"
      :clearable="true"
      :data="item.options"
      :placeholder="'请选择' + item.label"
      :show-checkbox="true"
      v-bind="item.props || {}"
      :multiple="true"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ElTreeSelect>
    <EleTreeSelect
      v-else-if="item.type === 'virtualTreeSelect'"
      :clearable="true"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </EleTreeSelect>
    <EleTreeSelect
      v-else-if="item.type === 'virtualTreeMultipleSelect'"
      :clearable="true"
      :placeholder="'请选择' + item.label"
      :maxTagCount="1"
      v-bind="item.props || {}"
      :multiple="true"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </EleTreeSelect>
    <EleTableSelect
      v-else-if="item.type === 'tableSelect'"
      :clearable="true"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </EleTableSelect>
    <EleTableSelect
      v-else-if="item.type === 'tableMultipleSelect'"
      :clearable="true"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      :multiple="true"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </EleTableSelect>
    <EleCheckCard
      v-else-if="item.type === 'checkCard'"
      :items="item.options"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </EleCheckCard>
    <EleCheckCard
      v-else-if="item.type === 'multipleCheckCard'"
      :items="item.options"
      v-bind="item.props || {}"
      :multiple="true"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </EleCheckCard>
    <EleEditTag
      v-else-if="item.type === 'editTag'"
      type="info"
      :style="{ marginTop: '4px' }"
      :itemStyle="{ margin: '0 4px 4px 0' }"
      :buttonStyle="{ marginBottom: '4px' }"
      :inputTagStyle="{ marginBottom: '4px' }"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </EleEditTag>
    <DictData
      v-else-if="item.type === 'dictRadio'"
      code=""
      v-bind="item.props || {}"
      type="radio"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </DictData>
    <DictData
      v-else-if="item.type === 'dictSelect'"
      code=""
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      type="select"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </DictData>
    <DictData
      v-else-if="item.type === 'dictCheckbox'"
      code=""
      v-bind="item.props || {}"
      type="checkbox"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </DictData>
    <DictData
      v-else-if="item.type === 'dictMultipleSelect'"
      code=""
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      type="multipleSelect"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </DictData>
    <ImageUpload
      v-else-if="item.type === 'imageUpload'"
      v-bind="item.props || {}"
      ref="imageUploadRef"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </ImageUpload>
    <FileUpload
      v-else-if="item.type === 'fileUpload'"
      v-bind="item.props || {}"
      ref="fileUploadRef"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </FileUpload>
    <RegionsSelect
      v-else-if="item.type === 'regions'"
      :placeholder="'请选择' + item.label"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </RegionsSelect>
    <TinymceEditor
      v-else-if="item.type === 'editor'"
      v-bind="item.props || {}"
      :modelValue="model[item.prop]"
      @update:modelValue="updateValue"
    >
      <template
        v-for="name in Object.keys(item.slots || {}).filter(
          (k) => !!(item.slots && item.slots[k] && $slots[item.slots[k]])
        )"
        #[name]="slotProps"
      >
        <slot :name="item.slots?.[name]" v-bind="slotProps || {}"></slot>
      </template>
    </TinymceEditor>
    <template v-else-if="item.type && !['label', 'error'].includes(item.type)">
      <slot
        :name="item.type"
        :item="item"
        :model="model"
        :updateValue="updateValue"
      ></slot>
    </template>
  </ElFormItem>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import TinymceEditor from '@/components/TinymceEditor/index.vue';
  import RegionsSelect from '@/components/RegionsSelect/index.vue';
  import ImageUpload from '@/components/ImageUpload/index.vue';
  import FileUpload from '@/components/FileUpload/index.vue';
  import {
    uploadTypes,
    getRuleType,
    getRuleTrigger,
    getRuleMessage
  } from '../util';

  const props = defineProps({
    /** 表单项配置 */
    item: {
      type: Object,
      required: true
    },
    /** 表单数据 */
    model: {
      type: Object,
      required: true
    },
    /** 验证规则 */
    rules: Object
  });

  const emit = defineEmits(['updateValue']);

  /** 更新值 */
  const updateValue = (value) => {
    emit('updateValue', value);
  };

  /** 图片上传组件实例 */
  const imageUploadRef = ref(null);

  /** 文件上传组件实例 */
  const fileUploadRef = ref(null);

  /** 判断上传组件是否上传完毕 */
  const uploadIsDone = () => {
    if (props.item.type === 'imageUpload') {
      return imageUploadRef.value ? imageUploadRef.value.isDone() : true;
    }
    if (props.item.type === 'fileUpload') {
      return fileUploadRef.value ? fileUploadRef.value.isDone() : true;
    }
    return true;
  };

  /** 表单验证规则 */
  const itemRules = computed(() => {
    const itemProps = props.item.itemProps;
    const iRule = itemProps ? itemProps.rules : void 0;
    const iRules = iRule ? (Array.isArray(iRule) ? iRule : [iRule]) : void 0;
    const fRule = props.rules ? props.rules[props.item.prop] : void 0;
    const fRules = fRule ? (Array.isArray(fRule) ? fRule : [fRule]) : void 0;
    const rules = iRules || fRules || [];
    if (props.item.required) {
      const rRule = {
        required: true,
        message: getRuleMessage(props.item.type, props.item.label),
        type: getRuleType(props.item.type),
        trigger: getRuleTrigger(props.item.type)
      };
      rules.unshift(rRule);
    }
    if (props.item.type && uploadTypes.includes(props.item.type)) {
      const uRule = {
        type: getRuleType(props.item.type),
        trigger: getRuleTrigger(props.item.type),
        validator: (_rule, value, callback) => {
          if (value && !uploadIsDone()) {
            return callback(new Error(`${props.item.label ?? ''}还未上传完毕`));
          }
          callback();
        }
      };
      rules.push(uRule);
    }
    return rules;
  });
</script>

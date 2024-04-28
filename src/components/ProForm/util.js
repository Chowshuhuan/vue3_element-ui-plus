/**
 * 表单数据类型为字符串的组件类型
 */
export const stringTypes = [
  'input',
  'textarea',
  'date',
  'datetime',
  'time',
  'timeSelect',
  'autocomplete',
  'editor'
];

/**
 * 表单数据类型为数字的组件类型
 */
export const numberTypes = [
  'select',
  'radio',
  'radioButton',
  'checkbox',
  'checkboxButton',
  'switch',
  'inputNumber',
  'rate',
  'slider',
  'tableSelect'
];

/**
 * 表单数据类型为数组的组件类型
 */
export const arrayTypes = [
  'multipleSelect',
  'checkbox',
  'checkboxButton',
  'daterange',
  'datetimerange',
  'timerange',
  'cascader',
  'sliderRange',
  'treeMultipleSelect',
  'virtualTreeMultipleSelect',
  'tableMultipleSelect',
  'multipleCheckCard',
  'editTag',
  'dictCheckbox',
  'dictMultipleSelect',
  'regions'
];

/**
 * 表单验证规则使用blur触发的组件类型
 */
export const blurTypes = ['input', 'textarea'];

/**
 * 选择类型的组件类型
 */
export const selectTypes = [
  'select',
  'multipleSelect',
  'radio',
  'radioButton',
  'checkbox',
  'checkboxButton',
  'date',
  'datetime',
  'daterange',
  'datetimerange',
  'time',
  'timerange',
  'timeSelect',
  'switch',
  'cascader',
  'rate',
  'slider',
  'sliderRange',
  'treeSelect',
  'tableMultipleSelect',
  'virtualTreeSelect',
  'virtualTreeMultipleSelect',
  'tableSelect',
  'tableMultipleSelect',
  'checkCard',
  'multipleCheckCard',
  'dictRadio',
  'dictSelect',
  'dictCheckbox',
  'dictMultipleSelect',
  'regions'
];

/**
 * 上传类型的组件类型
 */
export const uploadTypes = ['imageUpload', 'fileUpload'];

/**
 * 获取验证规则值类型
 * @param type 组件类型
 */
export function getRuleType(type) {
  if (type) {
    if (arrayTypes.includes(type)) {
      return 'array';
    }
    if (numberTypes.includes(type)) {
      return 'number';
    }
  }
  return 'string';
}

/**
 * 获取验证规则触发类型
 * @param type 组件类型
 */
export function getRuleTrigger(type) {
  return type && blurTypes.includes(type) ? 'blur' : 'change';
}

/**
 * 获取验证规则提示文本
 * @param type 组件类型
 * @param label 表单项标题
 */
export function getRuleMessage(type, label) {
  const text = label ?? '';
  if (type) {
    if (selectTypes.includes(type)) {
      return `请选择${text}`;
    }
    if (uploadTypes.includes(type)) {
      return `请上传${text}`;
    }
  }
  return `请输入${text}`;
}

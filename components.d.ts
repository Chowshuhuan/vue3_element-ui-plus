import 'element-plus/global';
import 'ele-admin-plus/typings/global';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    DictData: (typeof import('@/components/DictData/index.vue'))['default'];
  }
}

export {};

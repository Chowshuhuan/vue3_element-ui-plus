<template>
  <div>
    <div class="option-wrapper">
      <option-item label="表头背景" :responsive="false">
        <el-switch v-model="toolbarBg" size="small" />
      </option-item>
      <option-item label="显示边框" :responsive="false">
        <el-switch v-model="border" size="small" @change="onConfigChange" />
      </option-item>
      <option-item label="显示斑马纹" :responsive="false">
        <el-switch v-model="stripe" size="small" @change="onConfigChange" />
      </option-item>
      <option-item label="显示表头" :responsive="false">
        <el-switch v-model="showHeader" size="small" />
      </option-item>
      <option-item label="显示表尾合计行" :responsive="false">
        <el-switch v-model="showSummary" size="small" />
      </option-item>
      <option-item label="行点击高亮" :responsive="false">
        <el-switch v-model="highlightCurrentRow" size="small" />
      </option-item>
      <option-item label="行点击勾选" :responsive="false">
        <el-switch v-model="rowClickChecked" size="small" />
      </option-item>
    </div>
    <ele-pro-table
      ref="tableRef"
      row-key="pieceId"
      :columns="columns"
      :datasource="datasource"
      :show-overflow-tooltip="true"
      :highlight-current-row="highlightCurrentRow"
      :row-click-checked="rowClickChecked"
      v-model:selections="selections"
      v-model:current="current"
      :pagination="{
        pageSize: 10,
        pageSizes: [10, 20, 40]
      }"
      :toolbar="{ theme: toolbarBg ? 'default' : 'plain' }"
      :border="border"
      :stripe="stripe"
      :show-header="showHeader"
      :show-summary="showSummary"
      :summary-method="getSummaries"
    >
      <template #toolbar>
        <el-button type="primary" class="ele-btn-icon" @click="getSelections">
          获取多选行数据
        </el-button>
        <el-button
          v-if="highlightCurrentRow"
          type="primary"
          class="ele-btn-icon"
          @click="getCurrent"
        >
          获取单选行数据
        </el-button>
      </template>
      <template #action="{ row }">
        <el-link type="primary" :underline="false" @click="openEdit(row)">
          修改
        </el-link>
        <el-divider direction="vertical" />
        <el-link type="danger" :underline="false" @click="remove(row)">
          删除
        </el-link>
      </template>
    </ele-pro-table>
  </div>
</template>

<script setup>
  import { ref, nextTick } from 'vue';
  import { EleMessage, random } from 'ele-admin-plus/es';
  import OptionItem from '@/views/extension/avatar/components/option-item.vue';

  /** 表格实例 */
  const tableRef = ref(null);

  /** 表格列配置 */
  const columns = ref([
    {
      type: 'selection',
      columnKey: 'selection',
      width: 50,
      align: 'center',
      fixed: 'left'
    },
    {
      type: 'index',
      columnKey: 'index',
      width: 50,
      align: 'center',
      fixed: 'left'
    },
    {
      prop: 'pieceNo',
      label: '案卷档号',
      minWidth: 260
    },
    {
      prop: 'title',
      label: '案卷题名',
      minWidth: 160
    },
    {
      prop: 'retention',
      label: '保管期限',
      minWidth: 110,
      align: 'center'
    },
    {
      prop: 'amount',
      label: '件数',
      minWidth: 110,
      align: 'center'
    },
    {
      prop: 'secret',
      label: '密级',
      minWidth: 110,
      align: 'center'
    },
    {
      prop: 'year',
      label: '归档年度',
      minWidth: 110,
      align: 'center'
    },
    {
      prop: 'type',
      label: '案卷类型',
      minWidth: 140,
      align: 'center'
    },
    {
      prop: 'location',
      label: '存放位置',
      minWidth: 140,
      align: 'center'
    },
    {
      prop: 'carrier',
      label: '载体类型',
      minWidth: 110,
      align: 'center'
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 160,
      align: 'center',
      slot: 'action',
      fixed: 'right'
    }
  ]);

  /** 表格数据源 */
  const datasource = async ({ page, limit }) => {
    const list = Array.from({ length: limit || 10 }).map((_, i) => {
      const pieceId = ((page || 1) - 1) * (limit || 10) + i + 1;
      const no = String(pieceId).padStart(3, '0');
      const secrets = ['机密', '秘密', '公开', '绝密', '内部'];
      const retentions = ['永久', '定期10年', '定期20年'];
      const retentionNos = ['Y', 'D10', 'D20'];
      const retentionRandom = random(0, retentions.length);
      const carriers = ['纸张', '光盘'];
      const year = '2020';
      const item = {
        pieceId,
        title: `教学档案${no}`,
        pieceNo: `ELE101-${retentionNos[retentionRandom]}-ZM•JX-${year}-${no}`,
        secret: secrets[random(0, secrets.length)],
        location: `001-001-${Math.random() < 0.5 ? 'A' : 'B'}0${random(1, 7)}`,
        type: '教学组织',
        retention: retentions[retentionRandom],
        carrier: carriers[random(0, carriers.length)],
        year,
        amount: random(2, 10)
      };
      return item;
    });
    return { count: 40, list };
  };

  /** 表格多选选中数据 */
  const selections = ref([]);

  /** 表格单选选中数据 */
  const current = ref(null);

  /** 更多配置 */
  const toolbarBg = ref(false);
  const border = ref(false);
  const stripe = ref(false);
  const showHeader = ref(true);
  const showSummary = ref(true);
  const highlightCurrentRow = ref(false);
  const rowClickChecked = ref(false);

  /** 打开编辑弹窗 */
  const openEdit = (row) => {
    EleMessage.success('编辑:' + row.pieceNo);
  };

  /** 删除单个 */
  const remove = (row) => {
    EleMessage.error('删除:' + row.pieceNo);
  };

  /** 表格合计行 */
  const getSummaries = ({ columns, data }) => {
    const sums = [];
    columns.forEach((column, index) => {
      if (column.property === 'amount') {
        sums[index] = data
          .map((item) => Number(item[column.property]))
          .reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
      } else if (index === 2) {
        sums[index] = '合计';
      }
    });
    return sums;
  };

  /** 获取多选行数据 */
  const getSelections = () => {
    console.log(JSON.stringify(selections.value));
    EleMessage.success(
      '共 ' + selections.value.length + ' 条数据已打印在控制台'
    );
  };

  /** 获取选中行数据 */
  const getCurrent = () => {
    console.log(JSON.stringify(current.value));
    if (!current.value) {
      EleMessage.success('未选中任何数据');
    } else {
      EleMessage.success(current.value.pieceNo + '的数据已打印在控制台');
    }
  };

  /** 表格属性改变 */
  const onConfigChange = () => {
    nextTick(() => {
      tableRef.value && tableRef.value.doLayout();
    });
  };
</script>

<style lang="scss" scoped>
  .option-wrapper {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    padding-top: 12px;

    :deep(.option-item) {
      margin: 0 20px 8px 0;

      .option-item-label + .option-item-body {
        padding-left: 4px;
      }
    }
  }
</style>

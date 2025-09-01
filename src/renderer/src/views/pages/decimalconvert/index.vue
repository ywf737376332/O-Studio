<template>
    <div class="main-container">
        <div class="radix-header">
            <el-input v-model="viewModel.numVal" placeholder="请输入需要转换的数据" class="input-with-select" size="small" clearable>
                <template #prepend>{{ viewModel.label }}</template>
                <template #append>
                    <el-select v-model="viewModel.radix" placeholder="请选择进制" style="width: 80px" size="small">
                        <el-option v-for="item in radixOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </template>
            </el-input>
            <el-select-v2 v-model="selectRadixVal" :options="radixOptions" multiple clearable collapse-tags
                placeholder="请选择要显示的进制" :max-collapse-tags="2" :filterable=true style="width: 280px" size="small">
                <template #header>
                    <el-checkbox v-model="selectModel.checkAll" :indeterminate="selectModel.indeterminate"
                        @change="handleCheckAll">
                        全选
                    </el-checkbox>
                </template>
            </el-select-v2>
        </div>
        <div class="times-container">
            <div class="time-convert-list">
                <div class="time-convert-item" v-for="item in computedRadixList" :key="item.id">
                    <BaseInput :label="item.label" v-model:val="item.value" :readonly="true"
                        @fnClick="copyText(item.value)"></BaseInput>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="DecimalConvert">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import BaseInput from '@/components/BaseInput/index.vue';
import { copyTextToClipboard } from '@/utils/download'
import { generateRadixOptions, convertRadixes } from '@/utils'

const radixOptions = ref([]);

onMounted(() => {
    radixOptions.value = generateRadixOptions();
})

const viewModel = reactive({
    label: '转换值',
    radix: '10',
    numVal: '111000'
})

const selectRadixVal = ref(["2", "8", "10", "16", "32"])
const selectModel = reactive({
    checkAll: false,
    indeterminate: false
})

watch(selectRadixVal, (val) => {
    if (val.length === 0) {
        selectModel.checkAll = false
        selectModel.indeterminate = false
    } else if (val.length === radixOptions.value.length) {
        selectModel.checkAll = true
        selectModel.indeterminate = false
    } else {
        selectModel.indeterminate = true
    }
})


const computedRadixList = computed(() => {
    if (!selectRadixVal.value) return [];
    const filteredList = radixOptions.value.filter(item => {
        return selectRadixVal.value.includes(item.value);
    })
    return convertRadixes(viewModel.numVal, viewModel.radix, filteredList);
})

const handleCheckAll = (val) => {
    selectModel.indeterminate = false
    if (val) {
        selectRadixVal.value = radixOptions.value.map((_) => _.value)
    } else {
        selectRadixVal.value = []
    }
}

const copyText = (text) => {
    copyTextToClipboard(text)
}

</script>

<style scoped lang="scss">
/* 在选择器外部定义变量 */
$size: 23px;

.main-container {
    width: 100%;
    // height: calc(100% - 83px);
    height: 100%;
    padding: 15px 20px;
    display: flex;
    flex-direction: column;
    align-content: center;

    .radix-header {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .input-with-select {
            flex: 1;
            margin-right: 10px;
        }

        :deep(.el-select .el-select__wrapper) {
            height: 28px;
        }

        :deep(.el-input-group__prepend) {
            background-color: rgb(96, 123, 243);
            color: #FFF;
        }
    }

    .times-container {
        width: 100%;
        height: calc(100% - 40px);
        margin-top: 10px;
        padding: 10px 10px 15px 10px;
        border-radius: 5px;
        border: 1px dashed #CCC;
        overflow-y: auto;

        .time-convert-list {
            display: flex;
            flex-direction: column;
            height: 100px;

            .time-convert-item {
                margin: 5px 0;
            }
        }
    }
}
</style>
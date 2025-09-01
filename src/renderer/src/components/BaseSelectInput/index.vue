<template>
    <div class="time-convert-fn">
        <el-input v-model="inputValue" :placeholder="inputTip" class="input-with-select" size="small">
            <template #prepend>{{ label }}</template>
            <template #append>
                <el-select v-model="selectValue" :placeholder="selectTip" :style="{ 'width': width + 'px' }" size="small">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </template>
        </el-input>
    </div>
</template>

<script setup>
/**
 * TODO 未完善
 */
defineProps({
    modelValue: {
        type: [String, Number],
        dafault: ''
    },
    label: {
        type: String,
        default: ''
    },
    options: {
        type: Array,
        required: true
    },
    inputTip: {
        type: String,
        default: ''
    },
    selectTip: {
        type: String,
        default: ''
    },
    width: {
        type: Number,
        default: 80
    }
})

const inputValue = ref(props.modelValue)
const selectValue = ref(props.modelValue)
</script>

<style scoped lang="scss">
.time-convert-fn {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .input-with-select {
        flex: 1;
        margin-right: 10px;
    }

    :deep(.el-button) {
        height: 26px;
    }

    :deep(.el-select .el-select__wrapper) {
        height: 28px;
    }

    :deep(.el-input-group__prepend) {
        background-color: rgb(96, 123, 243);
        color: #FFF;
    }
}
</style>
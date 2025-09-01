<template>
    <div class="select-pane">
        <span>{{ label }}</span>
        <el-select v-model="viewVal" filterable :placeholder="selectTip" :style="{ 'width': width + 'px' }" size="small"
            @change="handleChange">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    options: {
        type: Array,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Number],
        dafault: ''
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

const viewVal = ref(props.modelValue)

const emit = defineEmits(['change', 'update:modelValue'])
const handleChange = (val) => {
    emit('update:modelValue', val)
    emit('change', val)
}


</script>

<style scoped lang="scss">
.select-pane {
    display: flex;
    flex-direction: row;
    align-items: center;

    >span:first-of-type {
        display: block;
        font-size: 12px;
        background-color: var(--main-select-label-color);
        box-sizing: border-box;
        border: 1px solid var(--main-select-label-border-color);
        color: var(--main-btn-font-color);
        border-right: none;
        width: 60px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-bottom-left-radius: 3px;
        border-top-left-radius: 3px;
        border-bottom-right-radius: 0%;
        border-top-right-radius: 0%;

        &:hover {
            background-color: var(--main-btn-active-color);
        }
    }

    :deep(.el-select__wrapper) {
        border-bottom-left-radius: 0%;
        border-top-left-radius: 0%;
        height: 24px;
    }
}
</style>
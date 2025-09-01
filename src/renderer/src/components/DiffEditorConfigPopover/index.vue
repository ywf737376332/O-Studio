<template>
    <PopoverPane :menuName="`配置`" :menuIco="`icon-set-options`" :width="160" :visible="visible"
        @handelClick="handelClick">
        <template #container>
            <div class="popover-pane" ref="popoverPaneRef" v-click-outside="handleClickOutside">
                <div class="content">
                    <el-checkbox-group v-model="selectedOptions" size="small" @change="handleOptionsChange">
                        <el-checkbox v-for="option in checkboxOptions" :key="option.value" :value="option.value"
                            :label="option.label" />
                    </el-checkbox-group>
                </div>
            </div>
        </template>
    </PopoverPane>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import PopoverPane from '@/components/PopoverPane/index.vue'
import { ClickOutside as vClickOutside } from 'element-plus' // 点击其他区域指令

const popoverPaneRef = ref(null)
const visible = ref(false)
const handelClick = () => {
    visible.value = !visible.value
}

// 复选框选项配置
const checkboxOptions = [
    { value: 'ignoreTrimWhitespace', label: '忽略空白字符', defaultValue: true },
    // { value: 'wordWrap', label: '是否换行', defaultValue: 'off' },
    { value: 'renderSideBySide', label: '分割面板', defaultValue: true }
]

// 当前选中的选项
const selectedOptions = computed({
    get: () => Object.entries(editorOpts)
        .filter(([_, value]) => value === true || value === 'on')
        .map(([key]) => key),
    set: (newValues) => {
        // 重置所有选项
        Object.keys(editorOpts).forEach(key => {
            const option = checkboxOptions.find(opt => opt.value === key)
            if (option) {
                editorOpts[key] = newValues.includes(key)
                    ? (key === 'lineNumbers' || key === 'wordWrapView' ? 'on' : true)
                    : (key === 'lineNumbers' || key === 'wordWrapView' ? 'off' : false)
            }
        })
    }
})

//编辑器选项
const editorOpts = reactive(
    checkboxOptions.reduce((acc, { value, defaultValue }) => {
        acc[value] = defaultValue
        return acc
    }, {})
)

const emit = defineEmits(['handleOptionsChange'])
const handleOptionsChange = () => {
    const opts = selectedOptions.value.reduce((acc, key) => {
        if (key in acc) {
            if (key === 'wordWrapView') {
                acc[key] = 'on';
            } else if (key === 'lineNumbers') {
                acc[key] = 'on';
            } else {
                acc[key] = true;
            }
        }
        return acc
    }, editorOpts)
    emit('handleOptionsChange', opts);
    // visible.value = false;
}

// 点击外部关闭
const handleClickOutside = (event) => {
    if (popoverPaneRef.value && !popoverPaneRef.value.contains(event.target)) {
        visible.value = false
    }
}

</script>

<style scoped lang="scss">
.popover-pane {
    width: 100%;
    height: auto;
    border: 1px dashed var(--main-popover-border-color);
    border-radius: 3px;

    .content {
        width: 98%;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}
</style>
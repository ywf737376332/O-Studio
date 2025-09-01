<template>
    <div class="json-viewpane-container">
        <splitpanes class="default-theme" style="height: 100%">
            <pane min-size="20" size="50">
                <JsonPrettyViewer :data="jsonObject" @handleClick="handleClick" />
            </pane>
            <pane min-size="30" size="48">
                <el-table :data="tableData" height="100%" style="width: 100%" :border="true" size="small"
                    :highlight-current-row="false" row-key="id" :expand-row-keys="expandedKeys" :default-expand-all="false"
                    :cell-style="cellStyle">
                    <el-table-column prop="key" label="键" width="auto" :sortable="true" />
                    <el-table-column prop="value" label="值" width="auto" :sortable="true" />
                </el-table>
            </pane>
        </splitpanes>
    </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { isEmpty } from '@/utils'
import JsonPrettyViewer from '@/components/JsonPrettyViewer/index.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { Notification } from '@/utils/message'
import DataProcessor from '@/utils/DataProcessor.js';
const dataProcessor = new DataProcessor();
const expandedKeys = ref([]);

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
})

const jsonObject = ref({ 'code': 500, 'message': '数据解析失败' })
const tableData = ref([{ "id": 1, "key": "解析错误提示", "value": "JSON结构解析失败，请检查！" }])

const parseJsonText = async (data) => {
    if (isEmpty(data)) {
        return
    }
    try {
        // 构造json树对象
        jsonObject.value = data
        // 构造表格数据
        tableData.value = dataProcessor.process(data);
    } catch (e) {
        Notification({
            title: "解析错误提示",
            message: "JSON结构解析失败，请检查！"
        })
    }
}

// 获取指定层级的行ID
const getExpandedKeys = (data, maxLevel = 3, currentLevel = 1, keys = []) => {
    if (!Array.isArray(data) || currentLevel > maxLevel) return keys;
    data.forEach(item => {
        // 添加当前层级的ID
        keys.push(String(item.id));
        // 如果有子节点且未达到最大层级，继续递归
        if (item.children && currentLevel < maxLevel) {
            getExpandedKeys(item.children, maxLevel, currentLevel + 1, keys);
        }
    });

    return keys;
};

// 监听数据变化，更新展开的行
watch(tableData, (newData) => {
    // 获取1-3层级的所有行ID
    expandedKeys.value = getExpandedKeys(newData, 1);
}, { immediate: true });


watch(() => props.data, async (newData) => {
    await parseJsonText(newData)
}, { immediate: true })

const cellStyle = ({ row }) => {
    try {
        if (row.value.includes('{Object}') && !(row.key.includes('['))) {
            return { color: '#A24BBF', fontSize: '14px', fontWeight: 800 }
        } else if (row.value.includes('Array') && !(row.key.includes('['))) {
            return { color: '#028102', fontSize: '14px', fontWeight: 800 }
        } else if (row.key.includes('[') && row.key.includes(']')) {
            return { color: '#5073F5' }
        } else {
            return ''
        }
    } catch (error) {
        //console.log('单元格颜色设置失败！')
    }
}

const handleClick = (node) => {
    // console.log('当前节点key:', node.key)
    // console.log('当前节点层级:', node.level)
    // console.log('当前节点value:', node.content)
    // console.log('当前节点类型:', node.type)
    // console.log('当前节点:', node.path)
    // console.log('当前层级:', node.level)
}
</script>

<style scoped lang="scss">
.json-viewpane-container {
    width: 100%;
    height: 100%;

    :deep(.splitpanes__pane) {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :deep(.el-textarea__inner) {
        width: 99%;
        height: 100%;
        white-space: pre-wrap;
        /* 保持文本的换行 */
        word-wrap: break-word;
        /* 长单词或 URL 地址自动换行 */
        overflow-x: hidden;
        /* 禁用横向滚动条 */
    }

    :deep(.splitpanes.default-theme .splitpanes__pane) {
        background-color: #FFF;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        background-color: var(--main-background-color);
    }

    :deep(.splitpanes__splitter) {
        border-left: none;
        background-color: var(--main-background-color);
    }

    /* Vue 3 写法 */
    :deep(.el-table tbody tr:hover > td) {
        background-color: transparent !important;
    }
}
</style>
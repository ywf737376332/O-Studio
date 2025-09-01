<template>
    <div class="editor-container">
        <div class="top-menu drag">
            <ToolBar :funMenuList="funMenuList"></ToolBar>
        </div>
        <div class="editor-content">
            <CodingEditor ref="codingEditorRef" :options="options" :autoFocus=true @change="handleEditorChange" />
        </div>
        <HtmlViewDrawer :showDrawer="showCodeViewDrawer" :htmlCode="htmlCode" :textCode="viewText"
            @handleClose="handleCodeViewClose" />
    </div>
</template>

<script setup name="SqlTools">
import { ref, reactive } from 'vue';
import CodingEditor from '@/components/CodingEditor/index.vue';
import { ToolBar } from '@/layout/components'
import { formatSql, compressSql } from '@/utils/BeautifySql';
import HtmlViewDrawer from '@/components/HtmlViewDrawer/index.vue'

const options = reactive({
    value: '',
    language: 'sql',
    readOnly: false
})
const codingEditorRef = ref(null);

// 处理编辑器内容变化的方法
const handleEditorChange = (value) => {
};

// 代码预览窗口
const showCodeViewDrawer = ref(false);
const htmlCode = ref('');
const viewText = ref('');
const handleCodeViewClose = () => {
    showCodeViewDrawer.value = false;
}

const funMenuList = [
    {
        menuName: '清空',
        menuIco: 'icon-clean',
        position: 'right',
        menuFun: () => {
            codingEditorRef.value.setEditorValue("");
        }
    },
    {
        menuName: '预览',
        menuIco: 'icon-json-viewer',
        position: 'right',
        menuFun: async () => {
            await codePreview()
        }
    },
    {
        menuName: '压缩',
        menuIco: 'icon-compress',
        position: 'right',
        menuFun: () => {
            const value = codingEditorRef.value.getEditorValue();
            if (value) {
                codingEditorRef.value.setEditorValue(compressSql(value));
            }
        }
    },
    {
        menuName: '格式化',
        menuIco: 'icon-formatCode',
        position: 'right',
        menuFun: () => {
            const value = codingEditorRef.value.getEditorValue();
            if (value) {
                codingEditorRef.value.setEditorValue(formatSql(value));
            }
        }
    }
]
const codePreview = async () => {
    const codingEditorInstance = codingEditorRef.value;
    const value = codingEditorInstance.getEditorValue();
    if (value) {
        htmlCode.value = await codingEditorInstance.colorizeHtml()
        viewText.value = value;
        showCodeViewDrawer.value = true;
    }
}

</script>

<style scoped lang="scss">
.editor-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .editor-content {
        width: 100%;
        // height: 100%;
        flex: 1;
    }
}
</style>
<template>
    <el-dialog :model-value="visible" title="通过二维码分享内容" width="500" :append-to-body="true" align-center destroy-on-close
        @open="dialogOpen" @close="dialogCloseCall">
        <template #header>通过二维码分享内容</template>
        <el-card>
            <div class="qrcodeView" v-html="qrcodeText"></div>
        </el-card>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    visible: {
        type: Boolean,
        default: true
    },
    qrcodeText: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['dialogCloseCall'])
const dialogCloseCall = () => {
    emit('dialogCloseCall')
}

/**
 * 打开对话框的回调
 */
const dialogOpen = () => {
}
</script>

<style scoped lang="scss">
.qrcodeView {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 宽度自适应父容器 */
  height: auto; /* 高度根据宽度自动调整 */
}

.qrcodeView svg {
  width: 100%; /* SVG 宽度填满父容器 */
  height: auto; /* 高度根据宽度自动调整 */
  max-width: 500px; /* 限制最大宽度 */
  max-height: 500px; /* 限制最大高度 */
}

</style>
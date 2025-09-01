<template>
    <el-dialog :model-value="visible" title="通过二维码分享内容" width="430" :append-to-body="true" align-center destroy-on-close
        @open="dialogOpen" @close="dialogCloseCall">
        <template #header>通过二维码分享内容</template>
        <el-card>
            <div class="qrcodeView" ref="qrCodeImgRef"></div>
        </el-card>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { createQrcode } from '@/utils';

const qrCodeImgRef = ref(null)

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

const dialogOpen = () => {
    createQrcode(props.qrcodeText, 355, qrCodeImgRef.value)
}
</script>

<style scoped lang="scss">
.qrcodeView {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
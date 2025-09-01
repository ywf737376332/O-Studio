<template>
    <el-upload class="upload-container" action="#" :auto-upload="false" list-type="picture" :file-list="fileList"
        :show-file-list="false" drag :on-change="handleChange">
        <ImageViewer v-if="imgSrc" :src="imgSrc" :showTools="showTools" @clearImage="clearImage" />
        <div v-else class="drag-file-area">
            <i class="iconfont icon-upload-file"></i>
            <div class="el-upload__text">
                <em>{{ operationTips }}</em>
            </div>
        </div>
        <template #tip v-if="fileTips">
            <div class="el-upload__tip">
                {{ fileTips }}
            </div>
        </template>
    </el-upload>
</template>

<script setup>
import ImageViewer from '@/components/ImageViewer/index.vue'
const props = defineProps({
    imgSrc: {
        type: String,
        default: ''
    },
    fileList: {
        type: Array,
        default: []
    },
    operationTips: {
        type: String,
        default: ''
    },
    fileTips: {
        type: String,
        default: ''
    },
    showTools: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['handleChange', 'clearImage'])
const handleChange = (file, fileList) => {
    emit('handleChange', file, fileList)
}


const clearImage = () => {
    emit('clearImage')
}

</script>

<style scoped lang="scss">
.upload-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .drag-file-area {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .el-upload__text {
            em {
                color: #999;
            }
        }
    }

    .el-upload__tip {
        color: rgb(45, 128, 244);
    }

    :deep(.el-upload) {
        width: 100%;
        height: 100%;
    }

    :deep(.el-upload-dragger) {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .iconfont {
        font-size: 50px;
        color: #999;
    }
}
</style>
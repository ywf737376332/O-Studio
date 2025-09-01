<template>
    <div class="main-container">
        <div class="watermark-setting">
            <div class="setting-item" v-if="optsType === 'text'">
                <span>水印文字内容，多行水印文字用‘|’分割</span>
                <el-input v-model="defaultOps.content" style="width: 100%" size="small" type="textarea" :rows=4
                    show-word-limit maxlength="60" resize="none" />
            </div>
            <div class="setting-item-image" v-else>
                <DragUpload :imgSrc="defaultOps.watermarkImg.url" :fileList="watermarkImgList" :operationTips="`拖入水印图片`"
                    @handleChange="handleChange" @clearImage="clearWatemarkImage">
                </DragUpload>
            </div>
            <div class="setting-item" v-show="optsType === 'text'">
                <span>水印颜色</span>
                <el-color-picker v-model="defaultOps.font.color" show-alpha :predefine="predefineColors" size="small" />
            </div>
            <div class="setting-item" v-show="optsType === 'text'">
                <span>字体大小</span>
                <el-slider v-model="defaultOps.font.fontSize" :min="1" :max="100"/>
            </div>
            <div class="setting-item" v-show="optsType === 'image'">
                <span>水印图片宽</span>
                <el-input-number class="logo-item" v-model="defaultOps.watermarkImg.width" :min="1" size="small"
                    controls-position="right" @change="handleWidthChange" />
            </div>
            <div class="setting-item" v-show="optsType === 'image'">
                <span>水印图片高</span>
                <el-input-number class="logo-item" v-model="defaultOps.watermarkImg.height" :min="1" size="small"
                    controls-position="right" @change="handleHeightChange" />
            </div>
            <div class="setting-item">
                <span>旋转角度</span>
                <el-slider v-model="defaultOps.rotate" :min="-180" :max="180" />
            </div>
            <div class="setting-item">
                <span>水印间隔</span>
                <el-input-number class="logo-item" v-model="defaultOps.gap[0]" :min="1" :max="200" size="small"
                    controls-position="right" />
                <el-input-number class="logo-item" v-model="defaultOps.gap[1]" :min="1" :max="200" size="small"
                    controls-position="right" />
            </div>
            <div class="setting-item">
                <span>水印偏移量</span>
                <el-input-number class="logo-item" v-model="defaultOps.offset[0]" :min="0" :max="200" size="small"
                    controls-position="right" />
                <el-input-number class="logo-item" v-model="defaultOps.offset[1]" :min="0" :max="200" size="small"
                    controls-position="right" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import DragUpload from '@/components/DragUpload/index.vue'
import { convertImgToBase64, getImageFileSize } from '@/utils'
import { Message } from '@/utils/message'


const props = defineProps({
    optsType: {
        type: String,
        default: ''
    },
    options: {
        type: Object,
        required: true
    }
});

// 创建本地响应式对象
const defaultOps = reactive({
    content: props.options.content || '',
    font: {
        fontSize: props.options.font.fontSize || 16,
        color: props.options.font.color || 'rgba(0, 0, 0, 0.15)'
    },
    rotate: props.options.rotate || -22,
    gap: props.options.gap || [20, 20],
    offset: props.options.offset || [0, 0],
    watermarkImg: {
        url: '',
        width: 0,
        height: 0
    }
});


const emit = defineEmits(['update:options']);
// 监听本地变化
watch(defaultOps, (newVal) => {
    emit('update:options', { ...newVal });
}, { deep: true, immediate: true });


const watermarkImgList = ref([]);
const handleChange = (file, fileList) => {
    if (file) {
        convertImgToBase64(file.raw).then(base64 => {
            watermarkImgList.value = fileList;
            initImgInfo(file.raw, base64)
        })
    }
}

const aspectRatio = ref(130 / 30)
const initImgInfo = async (fileRaw, base64) => {
    const imgSize = await getWatermarkImgInfo(fileRaw)
    Object.assign(defaultOps.watermarkImg, { url: base64, width: imgSize.width, height: imgSize.height });
    // 计算宽高比
    aspectRatio.value = imgSize.width / imgSize.height
}


const getWatermarkImgInfo = async (fileRaw) => {
    try {
        return await getImageFileSize(fileRaw);
    } catch (error) {
        Message({
            message: `图片尺寸获取失败！`,
            type: 'error'
        })
    }
}

/**
 * 重新计算宽高，保持等比例缩放
 * @param newWidth 
 */
const handleWidthChange = (newWidth) => {
    const newHeight = Number((newWidth / aspectRatio.value).toFixed(0));
    defaultOps.watermarkImg.height = newHeight;
}
const handleHeightChange = (newHeight) => {
    const newWidth = Number((newHeight * aspectRatio.value).toFixed(0))
    defaultOps.watermarkImg.width = newWidth;
}

const clearWatemarkImage = () => {
    watermarkImgList.value = []
    Object.assign(defaultOps, { content: '', font: { fontSize: 16, color: 'rgba(0, 0, 0, 0.15)' }, rotate: -22, gap: [20, 20], offset: [0, 0], watermarkImg: {} });
}

const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585'
])

defineExpose({ clearWatemarkImage })
</script>

<style scoped lang="scss">
.main-container {
    width: 100%;
    height: 100%;

    .watermark-setting {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-content: space-between;

        .setting-item {
            width: 100%;

            >span:first-of-type {
                min-width: 100px;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                &::after {
                    content: '：';
                }
            }

            .logo-item {
                min-width: 80px;
                flex: 1;
            }

            .logo-item:not(:last-child) {
                margin-right: 15px;
            }

            /** 颜色选择器样式 */
            :deep(.el-color-picker__trigger) {
                height: 26px;
                width: 190px;
            }

            /**滑动条样式 */
            :deep(.el-slider__runway) {
                height: 3px;
            }

            :deep(.el-slider__bar) {
                height: 3px;
            }

            :deep(.el-slider__button) {
                width: 15px;
                height: 15px;
                transform: translateY(-10%);
            }
        }

        .setting-item:first-child {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-around;
            height: 120px;
            font-size: 14px;
        }

        .setting-item:not(:first-child) {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            font-size: 14px;
        }

        .setting-item-image {
            width: 100%;
            height: 200px;
        }
    }
}
</style>
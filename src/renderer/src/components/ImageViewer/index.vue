<template>
  <div class="image-container">
    <img :src="src" class="image-viewer" @error="defaultFailImage" />
    <div v-show="showTools" class="tools" @click.prevent.stop="">
      <template v-for="item in menuList">
        <i :class="['iconfont', item.icon]" @click.prevent.stop="item.fun"></i>
      </template>
    </div>
    <el-image-viewer v-if="dialogVisible" :url-list="[dialogImageUrl]" :initial-index="0" @close="closeImageViewer"
      :hide-on-click-modal="true" />
  </div>
</template>

<script setup>
import loadFailImg from '@/assets/images/failImage.png'
import { downloadBase64Img, copyBase64ImageToClipboard } from '@/utils/download'
import { ref, nextTick } from 'vue';
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  showTools: {
    type: Boolean,
    default: false
  }
})

const defaultFailImage = (e) => {
  e.target.src = loadFailImg;
}

const emit = defineEmits(['clearImage'])

const clearImage = () => {
  emit('clearImage')
}

const menuList = [
  {
    icon: 'icon-amplifier',
    fun: () => {
      handlePictureCardPreview(props.src)
    }
  },
  {
    icon: 'icon-download',
    fun: () => {
      downloadBase64Img(props.src)
    }
  },
  {
    icon: 'icon-copy',
    fun: () => {
      copyBase64ImageToClipboard(props.src)
    }
  },
  {
    icon: 'icon-delete',
    fun: () => {
      clearImage()
    }
  },
]

const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const handlePictureCardPreview = (url) => {
  dialogImageUrl.value = url;
  dialogVisible.value = true;
  nextTick(() => {
    document.getElementsByClassName('el-image-viewer__wrapper')[0].addEventListener('click', function (event) {
      event.stopPropagation(); // 阻止事件冒泡
    })
  })
}

const closeImageViewer = () => {
  dialogVisible.value = false
}

</script>

<style scoped lang="scss">
.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;

  .image-viewer {
    max-width: 100%;
    max-height: 100%;
    /* 保持图片纵横比 */
    object-fit: contain;
  }

  .tools {
    position: absolute;
    background-color: hsla(0, 0%, 0%, 0.5);
    /* 使用 hsla 设置透明度 */
    z-index: 999;
    bottom: 0px;
    left: 0;
    right: 0;
    min-width: 120px;
    height: 35px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    display: none;
    color: #FFF;
    text-align: center;
    line-height: 35px;
    padding: 0 10px;

    .iconfont {
      font-size: 20px;
    }

    .iconfont:not(:last-of-type) {
      margin-right: 30px;
    }
  }

  .dialog-image-view {
    width: 80%;
    /* 保持图片纵横比 */
    object-fit: contain;
  }
}

/* 当鼠标悬停在父元素上时，显示子元素 */
.image-container:hover .tools {
  display: block;
}

:deep(.el-dialog) {
  background-color: transparent;
  padding: 0;
}

/* 覆盖遮罩层的点击事件 */
:deep(.el-dialog__wrapper) {
  pointer-events: none;
}
</style>
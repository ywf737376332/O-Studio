<template>
  <el-dialog :model-value="visible" title="软件版本更新" width="530" :append-to-body="true" align-center destroy-on-close
    :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" @open="dialogOpen"
    @close="dialogCloseCall">
    <template #header>软件版本更新</template>
    <div class="version-pane">
      <div class="logo">
        <img :src="getImageUrl(avatarImage)" width="50px" height="50px" alt="" />
      </div>
      <div class="content">
        <div class="title">
          <h4>{{ versionData.title }}</h4>
        </div>
        <div class="descript">
          <p v-html="versionData.descript"></p>
        </div>
        <div class="item-label">最新版本：{{ versionData.versionTag }}</div>
        <div class="item-label">发布时间：{{ formatTime(versionData.createdTime) }}</div>
        <div class="bottom">
          <div class="btn-item">
            <el-button type="primary" size="small" :color="themeColor" :loading="loading" @click="downloadLastVersion()">
              下载更新
            </el-button>
          </div>
          <div class="btn-item" v-if="isForceUpdate">
            <el-button type="info" plain size="small" @click="exitAppCall()"> 退出应用 </el-button>
          </div>
          <div class="btn-item" v-else>
            <el-button type="info" plain size="small" @click="dialogCloseCall()">
              暂不更新
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import useSettingStore from '@/store/modules/settings'
import { getImageUrl, formatTime } from '@/utils'
import avatarImage from '@/assets/electron.svg'
import { isEmpty } from '@/utils'
import { Message } from '@/utils/message'

const settingStore = useSettingStore()
const themeColor = computed(() => settingStore.getThemeColor())
const loading = ref(false)
const isForceUpdate = ref(false)

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  versionData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['dialogCloseCall'])
const dialogCloseCall = () => {
  emit('dialogCloseCall')
}

const dialogOpen = () => {
  isForceUpdate.value = props.versionData.isForceUpdate
}

const downloadLastVersion = () => {
  loading.value = true
  const url = props.versionData.fileUrl
  if (isEmpty(url)) {
    Message({
      message: `当前软件暂未提供最新版本下载地址！`,
      type: 'error'
    })
    loading.value = false
    return
  }
  window.shell
    .openExternal(url)
    .then(() => {
      loading.value = false
    })
    .catch((err) => {
      loading.value = false
      console.error('打开浏览器失败:', err)
    })
}

const exitAppCall = () => {
  window.ipcRenderer.send('winExit')
}
</script>

<style scoped lang="scss">
.version-pane {
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  .logo {
    width: 80px;
    height: auto;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #666;
    margin-right: 15px;

    >p {
      margin-top: 20px;
    }
  }

  .content {
    width: 420px;
    min-height: 100px;

    .title {
      text-align: center;
      margin-bottom: 10px;
    }

    .descript {
      padding: 15px 0;
      width: 420px;
      min-height: 80px;
      flex-grow: 1;
      margin-bottom: 10px;
      font-size: 13px;

      >p {
        line-height: 22px;
      }
    }

    .item-label {
      font-size: 12px;
      margin-bottom: 10px;
    }

    .bottom {
      margin-top: 15px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      &:last-child .btn-item {
        margin-left: 30px;
      }
    }
  }
}
</style>

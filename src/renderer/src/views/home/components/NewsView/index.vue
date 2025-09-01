<template>
  <div class="news-container">
    <div class="news-content">
      <ul>
        <template v-for="(item, index) in newsList">
          <li @click="showNewsDetail(item.target)">
            <span>{{ index + 1 }}</span> <span class="hotNews">{{ item.target.title }}</span
            ><span>{{ item.detail_text }}</span>
          </li>
        </template>
      </ul>
    </div>
    <div class="tips-pane" v-if="!isEmpty(newsContext)">
      <div class="content">
        <p>{{ newsContext }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getZhihuNews } from '@/api'
import { defaultNews } from '@/config/defaultContent'
import { isEmpty } from '@/utils'
import useSettingStore from '@/store/modules/settings'
import useUserCacheStore from '@/store/modules/userCache'

const settingStore = useSettingStore()
const userCacheStore = useUserCacheStore()

const themeColor = computed(() => settingStore.getThemeColor())
const newsList = ref(defaultNews)
const newsContext = ref('')
const newsTitle = ref('')

const getNewsData = async () => {
  let newsRes = userCacheStore.getNewsList()
  if (newsRes && newsRes.length > 0) {
    return newsRes
  }
  newsRes = await getZhihuNews()
  if (newsRes) {
    newsList.value = newsRes
    await userCacheStore.setNewsList(newsList)
  }
}

const showNewsDetail = (newsTarget) => {
  newsContext.value = newsTarget.excerpt
  newsTitle.value = newsTarget.title
}

onMounted(async () => {
  await getNewsData()
})
</script>

<style scoped lang="scss">
.news-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .news-content {
    flex: 1;
    border: 1px dashed #666;
    border-radius: 5px;
    width: auto;
    height: calc(100% - 120px);
    display: flex;
    flex-direction: column;
    padding: 10px 5px;
    overflow-y: auto;

    > ul {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 10px;
      /* 可选：设置网格项之间的间距 */
      cursor: pointer;
      padding: 0 5px;
      overflow-y: auto;
      overflow: -moz-scrollbars-none; /* Firefox */
      -ms-overflow-style: none; /* IE 和 Edge */
      scrollbar-width: none; /* Firefox */

      > li {
        font-size: 13px;

        .hotNews {
          margin: 0 1ch;
        }

        > span:not(.hotNews) {
          color: #9195a3;
          font-weight: bold;
        }

        > span:last-child {
          font-size: 8px;
          text-decoration: none;
        }

        .hotNews:hover {
          color: #0078d4;
          text-decoration: underline;
          font-weight: bold;
        }
      }

      li:nth-child(1) span:first-child,
      li:nth-child(1) span:last-child {
        color: #fe2d46;
      }

      li:nth-child(2) span:first-child,
      li:nth-child(2) span:last-child {
        color: #ff6600;
      }

      li:nth-child(3) span:first-child,
      li:nth-child(3) span:last-child {
        color: #faa90e;
      }
    }
  }

  .tips-pane {
    border: 1px dashed v-bind(themeColor);
    border-radius: 5px;
    width: 100%;
    height: 120px;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 10px 5px;

    .content {
      overflow-y: auto;
      overflow: -moz-scrollbars-none; /* Firefox */
      -ms-overflow-style: none; /* IE 和 Edge */
      scrollbar-width: none; /* Firefox */
      padding: 0 5px;

      > p {
        font-size: 13px;
        line-height: 1.6;
        text-indent: 3.5ch;
      }
    }
  }
}
</style>

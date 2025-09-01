<template>
  <div class="great-quotes-content">
    <template v-if="greatQuotes.type === 'other'">
      <p class="great-quotes" v-html="greatQuotes.hitokoto"></p>
      <p class="creator">——【{{ greatQuotes.creator }}】</p>
    </template>
    <template v-else>
      <p class="one-quotes" v-html="greatQuotes.hitokoto"></p>
      <p class="creator" v-if="countWords(greatQuotes.hitokoto)<50" style="font-size: 12px; position: absolute; bottom: 3px; right: 3px;">——【{{ greatQuotes.creator }}】</p>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { countWords } from '@/utils'
import { getGreatQuotes } from '@/api'

const greatQuotes = ref("")

onMounted(async () => {
  greatQuotes.value = await getGreatQuotes();
})

window.ipcRenderer.on('refresh-system-runtime', async (event) => {
  greatQuotes.value = await getGreatQuotes();
  Logger.info('刷新一句话名言内容')
})

</script>

<style scoped lang="scss">
.great-quotes-content {
  height: 100%;
  padding: 0 5px;
  overflow-x: hidden;
  overflow-y: auto;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  scrollbar-width: none;
  display: grid;
  place-items: center;
  position: relative;

  .great-quotes {
    line-height: 2;
    text-indent: 4ch;
    font-size: 13px;
    text-align: left;

    &::first-letter {
      font-size: 2em;
      line-height: normal;
    }
  }

  .one-quotes {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 2;
    text-indent: 4ch;
    font-size: 14px;
    vertical-align: middle;
  }

  .creator {
    width: 100%;
    text-align: right;
  }
}
</style>

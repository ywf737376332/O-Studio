<template>
  <div class="timer-container">
    <div class="timer-panel">
      <div class="left-panel">
        <p>{{ year }}年{{ month + 1 }}月</p>
        <p>
          <span>{{ day }}</span>日
        </p>
      </div>
      <div class="right-panel">{{ week }}</div>
    </div>
    <div class="bottom-pane">农历 {{ lunarStr }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Lunar } from 'lunar-javascript'
import useSettingStore from '@/store/modules/settings'

const props = defineProps({
  todayDay: {
    type: Date,
    default: () => new Date()
  }
})

const settingStore = useSettingStore()
const themeColor = computed(() => settingStore.getThemeColor())

const currentDate = computed(() => props.todayDay)
const daysOfWeek = ['一', '二', '三', '四', '五', '六', '日']
const year = ref(currentDate.value.getFullYear())
const month = ref(currentDate.value.getMonth())
const day = ref(currentDate.value.getDate())
const week = ref(`星期${daysOfWeek[currentDate.value.getDay() == 0 ? 6 : currentDate.value.getDay() - 1]}`)
const lunar = ref('')
const lunarStr = ref('')
const InitNongliDate = () => {
  let nongli = Lunar.fromDate(currentDate.value)
  lunar.value = nongli.getDayInChinese()
  lunarStr.value = nongli.getMonthInChinese() + '月' + nongli.getDayInChinese()
}

onMounted(() => {
  InitNongliDate()
})
</script>

<style scoped lang="scss">
.timer-container {
  width: 160px;
  height: 140px;
  box-sizing: border-box;
  border: 1px dashed #666;
  border-radius: 5px;
  padding: 23px 5px 15px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .timer-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 3px solid #666;

    .left-panel {
      width: 100px;
      height: 84px;
      margin-right: 5px;

      >p:first-child {
        width: 100px;
        height: 20px;
        line-height: 19px;
        font-size: 18px;
        text-align: right;
      }

      >p:last-child {
        width: 100px;
        height: 60px;
        line-height: 70px;
        font-size: 18px;
        text-align: right;
        letter-spacing: 2.6px;

        >span:first-child {
          font-size: 46px;
          color: v-bind(themeColor);
        }
      }
    }

    .right-panel {
      height: 84px;
      font-size: 20px;
      writing-mode: vertical-rl;
      text-orientation: upright;
      /* 强制字符直立（避免英文/数字横转） */
      letter-spacing: 8px;
    }
  }

  .bottom-pane {
    text-align: center;
    line-height: 35px;
    width: 120px;
    height: 35px;
    font-size: 18px;
  }
}
</style>

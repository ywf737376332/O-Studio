<template>
  <div class="today-festival-pane">
    <div class="title" v-if="todayHolidaysList.length === 0">节假日预告🔊</div>
    <div class="title" v-else>今日节日/节气</div>
    <div class="festival-centent" v-if="todayHolidaysList.length > 0">
      <template v-for="item in todayHolidaysList" :key="item.name">
        <p :style="{ color: themeColor }" style="cursor: pointer">{{ item.name }}</p>
      </template>
    </div>
    <div class="festival-centent" v-if="todayHolidaysList.length === 0">
      <p style="font-weight: normal; font-size: 13px" v-if="previewHolidays.restDayType === 'week'">
        ⏰距离{{ previewHolidays.holidayName }}还有<span>{{ previewHolidays.diffDays }}</span
        >天 <br />🎈周末可休息<span>{{ previewHolidays.restDays }}</span
        >天
        <template v-if="!isEmpty(previewHolidays.isHolidayWork)">
          <br />🍀本周进行{{ previewHolidays.isHolidayWork }}。
        </template>
        <template v-if="futureFestivalList.length > 0">
          <br />🔔距离<strong>{{ futureFestivalList[0].name }}</strong
          >还有<span>{{ futureFestivalList[0].diffDays }}</span
          >天
        </template>
      </p>
      <p style="font-weight: normal; font-size: 13px" v-else>
        距离<span>{{ previewHolidays.holidayName }}</span
        >还有<span>{{ previewHolidays.diffDays }}</span
        >天，可连续休息<span>{{ previewHolidays.restDays }}</span
        >天
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { formatDate, isEmpty } from '@/utils'
import {
  getAllFestivals,
  getNearestRestDayInfo,
  getFutureFestival,
  FESTIVALS_TYPE,
  groupHolidays
} from '@/utils/FestivalsTools'
import useSettingStore from '@/store/modules/settings'

const settingStore = useSettingStore()
const props = defineProps({
  todayDay: {
    type: Date,
    default: () => new Date()
  }
})
const currentDay = computed(() => formatDate(props.todayDay, 'yyyy-MM-dd'))
const year = computed(() => props.todayDay.getFullYear())
const themeColor = computed(() => settingStore.getThemeColor())
const futureFestivalList = ref([])
const todayHolidaysList = ref([])
const previewHolidays = reactive({
  holidayDate: '',
  diffDays: 0, // 距离放假天数
  restDays: 0, // 休息天数
  restDayType: '', // 类型
  holidayName: '', // 类型名称
  isHolidayWork: '' // 类型
})

onMounted(async () => {
  const festivalsList = await getAllFestivals(year.value)

  // 获取最近的节日/节气预告信息
  futureFestivalList.value = getFutureFestival(festivalsList, currentDay.value)

  // 获取今天的节日/节气
  todayHolidaysList.value = festivalsList.filter(
    (f) => f.type !== FESTIVALS_TYPE.MAKE_WORK && f.date === currentDay.value
  )

  // 获取最近休息日信息
  await nearestRestDayInit(props.todayDay)
})

/**
 * 获取临近假日预告
 * @param todayDay
 */
const nearestRestDayInit = async (todayDay) => {
  const nearestRestDayInfo = await getNearestRestDayInfo(todayDay)
  previewHolidays.holidayDate = nearestRestDayInfo.holidayDate
  previewHolidays.diffDays = nearestRestDayInfo.diffDays
  previewHolidays.restDays = nearestRestDayInfo.restDays
  previewHolidays.restDayType = nearestRestDayInfo.restDayType
  previewHolidays.holidayName = nearestRestDayInfo.holidayName
  previewHolidays.isHolidayWork = nearestRestDayInfo.isHolidayWork
}
</script>

<style scoped lang="scss">
.today-festival-pane {
  height: 140px;
  width: 190px;
  border: 1px dashed #666;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .title {
    width: 100%;
    height: 25px;
    line-height: 25px;
    text-align: center;
    letter-spacing: 1.5px;
    background-color: var(--main-theme-title-background-color);
    border-bottom: 1px dashed #666;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .festival-centent {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    overflow: hidden;

    > p {
      letter-spacing: 3px;
      height: auto;
      line-height: 20px;
      font-size: 14px;
      font-weight: bold;
      text-overflow: ellipsis;

      /* 使用省略号表示溢出的文本 */
      > span {
        color: v-bind(themeColor);
        display: inline-block;
        min-width: 15px;
        font-weight: bold;
      }
    }
  }
}
</style>

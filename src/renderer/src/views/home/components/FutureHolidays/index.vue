<template>
  <div class="future-festival-container">
    <div class="future-festival-content">
      <div class="festival-item" v-for="item in viewAllHolidaysList" :key="item.name">
        <div class="festival-date">
          <p>{{ item.firstDate.slice(5) }}</p>
        </div>
        <div class="festival-diff-days">
          剩
          <p>{{ item.diffDays }}</p>
          天
        </div>
        <div class="festival-step">
          <div class="step-line"></div>
          <div class="step-icon"></div>
        </div>
        <div class="festival-festival-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  getAllFestivals,
  groupHolidays,
  FESTIVALS_LIST
} from '@/utils/FestivalsTools'
import { formatDate } from '@/utils'

const viewAllHolidaysList = ref([])

const props = defineProps({
  todayDay: {
    type: Date,
    default: () => new Date()
  }
})
const year = computed(() => props.todayDay.getFullYear())
const currentDay = computed(() => formatDate(props.todayDay, 'yyyy-MM-dd'))

onMounted(async () => {
  const festivalsList = await getAllFestivals(year.value)
  let nextYearHolidaysList = []
  // 获取节假日预告
  const futureHolidaysList = await getHolidaysList(festivalsList, currentDay.value)

  // 获取下一年节假日预告
  if (futureHolidaysList.length < 3) {
    nextYearHolidaysList = await getNextYearHolidays(year.value, currentDay.value)
  }
  // 合并数据
  viewAllHolidaysList.value = [...futureHolidaysList, ...nextYearHolidaysList]
    .reduce((acc, obj) => {
      if (!acc.find((item) => item.name === obj.name) && obj.diffDays >0) {
        acc.push(obj)
      }
      return acc
    }, [])
    .slice(0, 3)
})

/**
 * 获取本年度的节假日预告
 * @param festivalsList
 * @param currentDate
 */
const getHolidaysList = async (festivalsList, currentDate) => {
  const holidays = await groupHolidays(
    //festivalsList.filter((f) => f.type === FESTIVALS_TYPE.LEGAL_HOLIDAY && f.date >= currentDate),
    festivalsList.filter((f) =>f.date >= currentDate),
    currentDate
  )
  return holidays
}

/**
 * 获取第二年节假日预告
 */
const getNextYearHolidays = async (year, currentDate) => {
  let nextYearHolidays = []
  const nextYear = year + 1
  const nextYearFestivalsList = await getAllFestivals(nextYear)
  nextYearHolidays = await groupHolidays(
    nextYearFestivalsList.filter((f) => FESTIVALS_LIST.includes(f.name)),
    currentDate
  )
  return nextYearHolidays.map((f) => ({ ...f, name: f.name, count: 0 }))
}
</script>

<style scoped lang="scss">
.future-festival-container {
  //   padding: 0 10px;
  width: 365px;
  height: 120px;
  border: 1px dashed #666;
  border-radius: 5px;

  .future-festival-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 0 10px;
    overflow-y: hidden;
    overflow-x: auto;
    /* 隐藏滚动条 */
    scrollbar-width: none;
    &:hover {
      /* 显示滚动条 */
      scrollbar-width: auto;
    }

    .festival-item {
      width: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .festival-date {
        margin-top: 5px;
        width: 100%;
        height: 25px;
        text-align: center;
        background-color: var(--main-theme-festival-date-label-background-color);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;

        > p {
          width: 60px;
          height: 20px;
          line-height: 21px;
          border-radius: 3px;
        }
      }

      &:first-child .festival-date {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;

        &:first-child p {
          color: #fff;
          background-color: #409efc;
        }
      }

      &:last-child .festival-date {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
      }

      .festival-diff-days {
        margin-top: 8px;
        width: 95px;
        height: 30px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        color: #c0c0c0;

        > p {
          width: 25px;
          height: 20px;
          line-height: 20px;
          border-radius: 3px;
          margin: 0 5px;
        }
      }

      &:first-child .festival-diff-days {
        color: #666;

        & > p {
          color: #fff;
          background-color: #f24b50;
        }
      }

      .festival-step {
        width: 100%;
        height: 20px;
        position: relative;

        .step-line {
          position: absolute;
          background-color: #c0c0c0;
          width: 100%;
          height: 1px;
          margin: auto;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .step-icon {
          width: 5px;
          height: 5px;
          background-color: #c0c0c0;
          border-radius: 50%;
          position: absolute;
          margin: auto;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          filter: blur(1px);
          box-shadow:
            0 0 5px 1px rgba(160, 160, 162, 0.5),
            /* 内层光晕 */ 0 0 8px 3px rgba(160, 160, 162, 0.3),
            /* 中层光晕 */ 0 0 12px 6px rgba(160, 160, 162, 0.1);
        }
      }

      &:first-child .step-icon {
        background-color: rgba(68, 147, 251, 0.8);
        box-shadow:
          0 0 5px 1px rgba(68, 147, 251, 0.5),
          /* 内层光晕 */ 0 0 8px 3px rgba(68, 147, 251, 0.3),
          /* 中层光晕 */ 0 0 12px 6px rgba(68, 147, 251, 0.1);
        /* 外层光影 */
      }

      .festival-festival-name {
        width: 100%;
        height: 20px;
        line-height: 25px;
        text-align: center;
        font-size: 12px;
      }

      &:first-child .festival-festival-name {
        font-weight: bold;
      }
    }
  }
}
</style>

<template>
  <div class="statistics-container">
    <div class="statistics-item" v-for="item in holidaysStaticList" :key="item.title">
      <p>{{ item.title }}</p>
      <p :style="{ color: getRandomLightColor() }">{{ item.showValue }}</p>
    </div>
    <div class="statistics-item" v-for="item in specialHolidayList" :key="item.title">
      <p style="font-weight: bold">{{ item.title }}</p>
      <p :style="{ color: getRandomLightColor() }">{{ item.showValue }}</p>
    </div>
    <div class="statistics-item" v-for="item in appRunStaticList" :key="item.title">
      <p>{{ item.title }}</p>
      <p :style="{ color: getRandomLightColor() }">{{ item.showValue }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getRandomLightColor, formatMilliseconds, formatDate } from '@/utils'
import { getAllFestivals, groupHolidays, FESTIVALS_TYPE } from '@/utils/FestivalsTools'

import useUserCacheStore from '@/store/modules/userCache'
const userCacheStore = useUserCacheStore()

const props = defineProps({
  todayDay: {
    type: Date,
    default: () => new Date()
  }
})
const currentDay = computed(() => formatDate(props.todayDay, 'yyyy-MM-dd'))
const year = computed(() => props.todayDay.getFullYear())

const systemTotalRuntime = ref('')
const launchCounts = computed(() => userCacheStore.getLaunchCounts())

const yearOverHolidays = reactive({
  totalDays: 0,
  overDays: 0
})
const yearOverDays = reactive({
  totalDays: 0,
  overDays: 0
})

const holidaysStaticList = computed(() => [
  {
    title: `${year.value}年余额`,
    showValue: `${yearOverDays.overDays}/${yearOverDays.totalDays}天`
  },
  {
    title: '节假日余额',
    showValue: `${yearOverHolidays.overDays}/${yearOverHolidays.totalDays}天`
  }
])
const appRunStaticList = computed(() => [
  {
    title: '启动次数',
    showValue: `${launchCounts.value}次`
  },
  {
    title: '累计使用时间',
    showValue: systemTotalRuntime.value
  }
])
const specialHolidayList = computed(() => [
  // {
  //   title: '小橙子生日',
  //   showValue: '160天'
  // }
])

const getDaysInYear = async (year) => {
  // 获取一年有多少天
  yearOverDays.totalDays =
    Math.floor((new Date(year, 11, 31) - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24)) + 1 // 转为天数
  // 返回这一天是一年中的第几天
  yearOverDays.overDays =
    Math.floor((props.todayDay - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24)) + 1 // 转为天数
}

const getHolidays = async () => {
  const festivalsList = await getAllFestivals(year.value)
  const holidaysList = groupHolidays(
    festivalsList.filter((f) => f.type === FESTIVALS_TYPE.LEGAL_HOLIDAY),
    currentDay.value
  )
  yearOverHolidays.totalDays = holidaysList.reduce((sum, item) => {
    return sum + (typeof item.count === 'number' ? item.count : 0)
  }, 0)
  yearOverHolidays.overDays = holidaysList.reduce((sum, item) => {
    return sum + (typeof item.count === 'number' && item.diffDays < 0 ? item.count : 0)
  }, 0)
}

onMounted(async () => {
  await getHolidays()
  await getDaysInYear(year.value)
  await getSystemTotalRuntime()
})

const getSystemTotalRuntime = async () => {
  const totalRuntime = await userCacheStore.getTotalRuntime()
  systemTotalRuntime.value = formatMilliseconds(totalRuntime)
}


window.ipcRenderer.on('refresh-system-runtime', async (event) => {
  await getSystemTotalRuntime()
  Logger.info('刷新系统运行时间')
})
</script>

<style scoped lang="scss">
.statistics-container {
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .statistics-item {
    display: flex;
    height: 80px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px dashed #666;
    border-radius: 5px;
    flex: 1;

    >p:first-child {
      font-size: 12px;
    }

    >p:last-child {
      font-size: 16px;
      font-weight: 800;
    }

    >p {
      letter-spacing: 1.6px;
      line-height: 1.5;
    }
  }

  >*:not(:first-child):not(:last-child) {
    margin: 0 10px;
  }

  >*:first-child {
    margin-right: 10px;
  }

  >*:last-child {
    margin-left: 10px;
  }
}
</style>

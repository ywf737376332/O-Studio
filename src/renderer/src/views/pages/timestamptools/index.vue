<template>
    <div class="main-container">
        <div class="tools">
            <p class="iconfont icon-current-time"> 当前时间</p><span @click="handleClick">{{ currentTimeView.localTimeStr
            }}</span>
            <p class="iconfont icon-current-time"> 当前时间戳</p><span @click="handleClick">{{ currentTimeView.timestamp
            }}</span>
            <div class="pausedFn" @click="pausedTime()" :class="['iconfont', isPaused ? 'icon-start' : 'icon-paused']">
            </div>
        </div>
        <div class="times-container">
            <div class="time-convert-fn">
                <el-input v-model="timeModel.timeViewValue" placeholder="请输入当前时间或时间戳" class="input-with-select"
                    size="small">
                    <template #prepend>{{ timeModel.timeLabel }}</template>
                    <template #append>
                        <el-select v-model="timeModel.timeZone" placeholder="请选择时区" style="width: 110px" size="small">
                            <el-option v-for="item in timeZoneOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </template>
                </el-input>
                <el-button size="small" color="#3D9F1B" @click="updateCurrentTimestamp">当前时间戳</el-button>
                <el-button size="small" color="#9C15CC" @click="updateCurrentTime">当前时间</el-button>
            </div>
            <div class="time-convert-list">
                <div class="time-convert-item" v-for="[key, item] in Object.entries(timeConvertList)" :key="key">
                    <BaseInput :label="item.label" v-model:val="item.value" :readonly="true"
                        @fnClick="copyText(item.value)"></BaseInput>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="TimestampTools">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import BaseInput from '@/components/BaseInput/index.vue';
import { timeZoneOptions } from '@/config';
import { copyTextToClipboard } from '@/utils/download'
import { getTimestampWithOffset, formatDateTimeView, formatDateTime, formatDate, getDayOfYear, getWeekNum } from '@/utils/dateTools'

const isPaused = ref(false)
let initTime = Date.now()
const timeModel = reactive({
    timeLabel: '时间戳',
    timeZone: '8',
    timeValue: initTime,
    timeViewValue: initTime
})

const currentTimeView = reactive({
    timestamp: initTime,
    localTimeStr: formatDateTimeView(initTime)
})

const viewCurrentTime = () => {
    let time = Date.now();
    currentTimeView.timestamp = time;
    currentTimeView.localTimeStr = formatDateTimeView(time)
}

const copyText = (text) => {
    copyTextToClipboard(text)
}

const handleClick = (event) => {
    copyTextToClipboard(event.target.textContent)
}

const pausedTime = () => {
    if (isPaused.value) {
        // 如果当前是暂停状态，则重新开始
        isPaused.value = false;
        startInterval();
    } else {
        // 如果当前是运行状态，则暂停
        pauseInterval();
    }
}

const updateCurrentTimestamp = () => {
    let time = getTimestampWithOffset(Date.now(), timeModel.timeZone);
    timeModel.timeLabel = '时间戳'
    timeModel.timeValue = time;
    timeModel.timeViewValue = time;
}

const updateCurrentTime = () => {
    let time = getTimestampWithOffset(Date.now(), timeModel.timeZone);
    timeModel.timeLabel = '时间字符串'
    timeModel.timeValue = time;
    timeModel.timeViewValue = formatDateTime(time)
}

const timeUpdateComputed = (currentTime) => {
    let newTime = getTimestampWithOffset(currentTime, timeModel.timeZone);
    timeConvertList.millisecond.value = newTime;
    timeConvertList.second.value = Math.floor(newTime / 1000);
    timeConvertList.timeStr.value = formatDateTimeView(newTime, timeModel.timeZone)
    timeConvertList.time.value = formatDateTime(newTime)
    timeConvertList.date.value = formatDate(newTime)
    timeConvertList.dateNum.value = getDayOfYear(newTime)
    timeConvertList.weekNum.value = getWeekNum(newTime)
}

watch(timeModel, async (val) => {
    await timeUpdateComputed(val.timeValue)
}, { deep: true })

let timer = null;
function startInterval() {
    if (!isPaused.value) {
        timer = setInterval(viewCurrentTime, 1000)
    }
}

function pauseInterval() {
    if (timer && !isPaused.value) {
        clearInterval(timer);
        isPaused.value = true;
    }
}


onMounted(async () => {
    startInterval()
    await timeUpdateComputed(initTime)
})

onUnmounted(() => {
    clearInterval(timer)
})

const timeConvertList = reactive({
    millisecond: {
        label: '毫秒',
        value: ''
    },
    second: {
        label: '秒',
        value: ''
    },
    timeStr: {
        label: '时间字符串',
        value: ''
    },
    time: {
        label: '时间',
        value: ''
    },
    date: {
        label: '日期',
        value: ''
    },
    dateNum: {
        label: '天数',
        value: ''
    },
    weekNum: {
        label: '周数',
        value: ''
    }
})

</script>

<style scoped lang="scss">
/* 在选择器外部定义变量 */
$size: 23px;

.main-container {
    width: 100%;
    height: 100%;
    padding: 15px 20px;
    display: flex;
    flex-direction: column;
    align-content: center;

    .tools {
        width: 100%;
        height: 35px;
        display: flex;
        align-items: center;
        //border: 1px dashed #CCC;
        padding: 0 10px;
        border-radius: 5px;

        >p {
            margin-right: 8px;
            background-color: rgb(96, 123, 243);
            color: #FFF;
            width: auto;
            height: 20px;
            padding: 0 6px;
            text-align: center;
            border-radius: 3px;
            line-height: 20px;
            font-size: 12px;
        }

        >span {
            height: 25px;
            line-height: 26px;
            border-bottom: 2px solid #24cb53;
            margin-right: 35px;
            display: block;
            white-space: nowrap;
            /* 防止文本换行 */
            overflow: hidden;
            /* 隐藏超出容器的内容 */
            text-overflow: ellipsis;
            /* 使用省略号表示溢出的文本 */
            cursor: pointer;
        }

        >span:first-of-type {
            flex: 1;
        }

        >span:last-of-type {
            min-width: 110px
        }

        >.pausedFn {
            width: $size;
            height: $size;
            line-height: $size;
            text-align: center;
            color: #2dc157;
            border: 1px dashed #CCC;
            border-radius: 50%;
            cursor: pointer;

            &:hover {
                border-color: #149d3b;
                color: #08b138;
            }
        }
    }

    .times-container {
        width: 100%;
        margin-top: 15px;
        padding: 10px 10px 15px 10px;
        border-radius: 5px;
        border: 1px dashed #CCC;

        .time-convert-fn {
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .input-with-select {
                flex: 1;
                margin-right: 10px;
            }

            :deep(.el-button) {
                height: 26px;
            }

            :deep(.el-select .el-select__wrapper) {
                height: 28px;
            }

            :deep(.el-input-group__prepend) {
                background-color: rgb(96, 123, 243);
                color: #FFF;
            }
        }

        .time-convert-list {
            display: flex;
            flex-direction: column;

            .time-convert-item {
                margin: 5px 0;
            }
        }
    }
}
</style>
import { Lunar, HolidayUtil } from 'lunar-javascript'
import { calculateDiffDays, isEmpty } from '@/utils'
import useUserCacheStore from '@/store/modules/userCache'
/**=====================================获取全年的所有节假日=============================================================================**/

const userCacheStore = useUserCacheStore()

const FESTIVALS_LIST = ['元旦', '元旦节', '春节', '清明', '清明节', '劳动节', '端午', '端午节', '国庆', '国庆节', '国庆中秋', '中秋', '中秋节']
/**
 * 补班日
 * 法定假日
 * 国际节日
 * 节气
 * 传统农历节日
 */
const FESTIVALS_TYPE = {
    MAKE_WORK: 'make_work',                     //补班日
    LEGAL_HOLIDAY: 'legal_holiday',             //法定假日
    INT_FESTIVAL: 'international_festival',     //国际节日
    SOLAR_TERMS: 'solar_terms',                 //节气
    LUNAR_FESTIVAL: 'lunar_festival',           //传统农历节日
};

const INTERNATION_FESTIVALS = [
    // 国际性别类
    // 原 "国际性别类"
    { name: '妇女节', month: 3, day: 8 },

    // ----------------------------
    // 原 "国内法定&纪念日"
    { name: '植树节', month: 3, day: 12 },
    { name: '愚人节', month: 4, day: 1 },
    { name: '劳动节', month: 5, day: 1 },
    { name: '五四青年节', month: 5, day: 4 },
    { name: '儿童节', month: 6, day: 1 },
    { name: '建党节', month: 7, day: 1 },
    { name: '建军节', month: 8, day: 1 },
    { name: '教师节', month: 9, day: 10 },
    { name: '国庆节', month: 10, day: 1 },

    // ----------------------------
    // 原 "国际公益性节日（不放假）"
    { name: '国际海关日', month: 1, day: 26 },
    { name: '世界湿地日', month: 2, day: 2 },
    { name: '情人节', month: 2, day: 14 },
    { name: '白色情人节', month: 3, day: 14 },
    { name: '消费者权益日', month: 3, day: 15 },
    { name: '国际航海日', month: 3, day: 17 },
    { name: '黑色情人节', month: 4, day: 14 },
    { name: '地球日', month: 4, day: 22 },
    { name: '护士节', month: 5, day: 12 },
    { name: '网络情人节', month: 5, day: 20 },
    { name: '世界无烟日', month: 5, day: 31 },
    { name: '世界环境日', month: 6, day: 5 },
    { name: '国际禁毒日', month: 6, day: 26 },
    { name: '国际接吻日', month: 7, day: 6 },
    { name: '银色情人节', month: 7, day: 14 },
    { name: '抗战胜利纪念日', month: 9, day: 3 },
    { name: '世界艾滋病日', month: 12, day: 1 },
    { name: '平安夜', month: 12, day: 24 },
    { name: '圣诞节', month: 12, day: 25 },

    // ----------------------------
    // 原 "职业性节日（示例）"
    { name: '元旦节', month: 1, day: 1 },
    { name: '中国人民警察节', month: 1, day: 10 },
    { name: '女生节', month: 3, day: 7 },
    { name: '女生节', month: 3, day: 7 },
    { name: '中国旅游日', month: 5, day: 19 },
    { name: '国际茶日', month: 5, day: 21 },
    { name: '中国购物节', month: 6, day: 18 },
    { name: '日本投降纪念日', month: 8, day: 15 },
    { name: '毛泽东逝世纪念日', month: 9, day: 9 },
    { name: '孔子诞辰', month: 9, day: 28 },
    { name: '九一八纪念日', month: 9, day: 18 },
    { name: '程序员节', month: 10, day: 24 },
    { name: '联合国日', month: 10, day: 24 },
    { name: '万圣节', month: 10, day: 31 },
    { name: '中国记者节', month: 11, day: 8 },
    { name: '消防宣传日', month: 11, day: 9 },
    { name: '光棍节', month: 11, day: 11 },
    { name: '双十一购物节', month: 11, day: 11 },
    { name: '双十二购物节', month: 12, day: 12 },
    { name: '国家公祭日', month: 12, day: 13 },
    { name: '毛泽东诞辰', month: 12, day: 26 },
];

const WEEK_FESTIVALS = [
    { name: '母亲节', month: 5, nth: 2, weekday: 0 }, // 5月第2个星期日
    { name: '父亲节', month: 6, nth: 3, weekday: 0 }, // 6月第3个星期日
    { name: '感恩节', month: 11, nth: 4, weekday: 4 }, // 11月第4个星期四
]

const TRADITIONAL_FESTIVALS = {
    '上巳节': (lunar) => lunar.getMonth() === 3 && lunar.getDay() === 3,
    '火把节': (lunar) => lunar.getMonth() === 6 && lunar.getDay() === 24,
    '中元节': (lunar) => lunar.getMonth() === 7 && lunar.getDay() === 15,
    '腊八节': (lunar) => lunar.getMonth() === 12 && lunar.getDay() === 8,
    '寒衣节': (lunar) => lunar.getMonth() === 10 && lunar.getDay() === 1,
    '下元节': (lunar) => lunar.getMonth() === 10 && lunar.getDay() === 15,
    '北方小年': (lunar) => lunar.getMonth() === 12 && lunar.getDay() === 23,
    '南方小年': (lunar) => lunar.getMonth() === 12 && lunar.getDay() === 24,
};

/**
* 获取中国全年节日（公历+农历）
* @param year 年份如 2025
*/
const getAllFestivals = async (year) => {

    const fullYearFestivals = userCacheStore.getFullYearFestivals(`${year}`);
    if (fullYearFestivals && fullYearFestivals.length > 0) {
        return fullYearFestivals;
    }
    console.warn(`缓存里面没有${year}年数据，去计算全年的节日信息！`)
    const allFestivals = [];
    // 遍历公历全年日期（按中国时区计算）
    const start = new Date(Date.UTC(year, 0, 1)); // UTC时间起点
    const end = new Date(Date.UTC(year, 11, 31));
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        // 时区矫正：转为中国时区（解决跨时区天数偏移问题）
        const beijingDate = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
        const gy = beijingDate.getFullYear();
        const gm = beijingDate.getMonth() + 1;
        const gd = beijingDate.getDate();

        /**
         * 1. 获取公历节假日（准确版本）
         */
        const holiday = HolidayUtil.getHoliday(gy, gm, gd);
        if (holiday) {
            allFestivals.push({
                date: `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`,
                name: holiday.getName(),
                type: holiday.isWork() ? FESTIVALS_TYPE.MAKE_WORK : FESTIVALS_TYPE.LEGAL_HOLIDAY,
                desc: holiday.isWork() ? '补班日' : '法定假日'
            });
        }

        /**
         * 2. 手动补充国际节日
         */
        INTERNATION_FESTIVALS.forEach(f => {
            if (gm === f.month && gd === f.day) {
                allFestivals.push({
                    date: `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`,
                    name: f.name,
                    type: FESTIVALS_TYPE.INT_FESTIVAL,
                    desc: '国际节日'
                });
            }
        });

        /**
         * 农历节气/节日处理
         */
        // 1. 农历转换（必须基于中国时区）
        const lunar = Lunar.fromDate(beijingDate);
        // 2. 获取节气
        const jieQi = lunar.getJieQi();
        if (jieQi) {
            allFestivals.push({
                date: `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`,
                name: jieQi,
                type: FESTIVALS_TYPE.SOLAR_TERMS,
                desc: '节气'
            });
        }

        // 3. 库内预置的中国传统节日
        const festivals = lunar.getFestivals();
        festivals.forEach(fname => {
            allFestivals.push({
                date: `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`,
                name: fname,
                type: FESTIVALS_TYPE.LUNAR_FESTIVAL,
                desc: '传统农历节日'
            });
        });

        // 4. 手动补充传统节日
        Object.entries(TRADITIONAL_FESTIVALS).forEach(([name, check]) => {
            if (check(lunar)) {
                allFestivals.push({
                    date: `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`,
                    name: name,
                    type: FESTIVALS_TYPE.LUNAR_FESTIVAL,
                    desc: '传统农历节日'
                });
            }
        });
    }

    // 5. 手动补充特殊按星期计算的节日
    WEEK_FESTIVALS.forEach(f => {
        const date = findNthWeekday(year, f.month, f.nth, f.weekday)
        if (date) {
            allFestivals.push({
                date: date,
                name: f.name,
                type: FESTIVALS_TYPE.INT_FESTIVAL,
                desc: '国际节日'
            });
        }
    });

    // ========== 数据合并整理 ==========
    // 去重：同一日期的同名事件保留一次
    const unique = allFestivals.reduce((acc, curr) => {
        const key = curr.date + curr.name;
        if (!acc.has(key)) {
            acc.set(key, curr);
        }
        return acc;
    }, new Map());

    // 按日期排序
    const allYearFestivals = Array.from(unique.values()).sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    // 保存到缓存中
    userCacheStore.setFullYearFestivals(`${year}`,allYearFestivals)
    return allYearFestivals;
}

/**
 * 查找某年某月的第N个星期X
 * @param {number} year - 年份
 * @param {number} month - 月份 (1-12)
 * @param {number} nth - 第几个 (1-5)
 * @param {number} weekday - 星期数 (0=周日, 1=周一, ..., 6=周六)
 * @returns {string|null} 日期字符串 (YYYY-MM-DD)，若找不到返回null
 */
function findNthWeekday(year, month, nth, weekday) {
    let current = new Date(year, month - 1, 1); // 月份从0开始
    let count = 0;

    // 跳过无效的nth参数（如负数）
    if (nth < 1) return null;

    // 扫描整个月，直到月份改变
    while (current.getMonth() === month - 1) {
        if (current.getDay() === weekday) {
            count++;
            if (count === nth) { // 找到目标，返回日期
                // 格式化YYYY-MM-DD，用"0"补位
                const pad = num => String(num).padStart(2, '0');
                return `${year}-${pad(month)}-${pad(current.getDate())}`;
            }
        }
        current.setDate(current.getDate() + 1); // 检查下一天
    }
    // 如果该月不足n个目标周数，返回null
    return null;
}

/**=========================================统计所有假期及放假天数=========================================================================**/

/**
 * 统计所有假期
 * @param {*} holidays
 */
const groupHolidays = (holidays, currentDate) => {
    const result = {}
    const today =
        currentDate !== null && currentDate !== undefined ? new Date(currentDate) : new Date() // 获取今天的日期
    holidays.forEach((holiday) => {
        const { name, date } = holiday
        const holidayDate = new Date(date)
        if (!result[name]) {
            // 如果 name 第一次出现，初始化统计信息
            result[name] = {
                firstDate: date,
                lastDate: date,
                count: 1,
                diffDays: calculateDiffDays(today, holidayDate) // 计算日期差
            }
        } else {
            // 更新最后一次出现的日期和计数
            result[name].lastDate = date
            result[name].count++
        }
    })

    // 将结果转换为数组
    return Object.entries(result).map(([name, stats]) => ({
        name,
        ...stats
    }))
}


/**=========================================统计所有节日/节气预告=========================================================================**/

/**
 * 统计所有节日/节气预告
 * @param {*} holidays
 */
const getFutureFestival = (holidays, currentDate, limitNum = 1) => {
    let counts = 0
    const result = []
    const festivalList = holidays.filter((f) => f.date >= currentDate)
    for (const festival of festivalList) {
        if (!festival || isEmpty(festival.name) || (festival.type === FESTIVALS_TYPE.LEGAL_HOLIDAY) || (festival.type === FESTIVALS_TYPE.MAKE_WORK)) {
            continue;
        }
        counts++
        result.push({
            name: festival.name,
            date: festival.date,
            diffDays: calculateDiffDays(new Date(currentDate), new Date(festival.date))
        })
        if (limitNum <= counts) {
            return result;

        }
    }
    return result;
}

/**===============================================计算最近的休息日(包含周末和节假日)=================================================================== */

/**
 * 最近休息日计算
 * @param dateStr
 */
const getNearestRestDayInfo = async (todayDay) => {
    if (!(todayDay instanceof Date) || isNaN(todayDay)) {
        throw new Error('Invalid date provided');
    }
    // 2. 创建一个新的 Date 对象，避免修改传入的 todayDay
    const today = new Date(todayDay);
    let diffDays = 0 // 距离放假天数
    let restDays = 0 // 休息天数
    let restDayType
    let holidayName
    let holidayDate
    let isHolidayWork

    /**#######前置计算方法封装############################ */
    /**
     * 获取补班信息
     * @param holiday
     * @param isWork
     */
    const getHolidayWorkNotes = (holiday, isWork) =>
        !isEmpty(holiday) && isWork ? holiday.getName() + '补班' : ''
    /**
     * 获取休息日信息
     * @param holiday
     */
    const getRestDayInfo = (holiday) => {
        return {
            type: !isEmpty(holiday) && holiday.getName() ? 'holiday' : 'week',
            name: !isEmpty(holiday) ? holiday.getName() : '周末'
        }
    }

    /**#######开始循环计算############################ */
    // 最多循环365次，避免死循环
    let loopCounts = 0
    while (loopCounts < 365) {
        // debugger
        // 获取节假日信息
        const holiday = HolidayUtil.getHoliday(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate()
        )
        const isWork = holiday?.isWork()
        const week = today.getDay()
        // 有节日,不是工作日 或者 周六天也不能是工作日，
        if ((!isEmpty(isWork) && !isWork) || ((week === 6 || week === 0) && isEmpty(isWork))) {
            restDays++
            // 只计算一次
            if (restDays === 1) {
                const { type, name } = getRestDayInfo(holiday)
                restDayType = type
                holidayName = name
                holidayDate = today.toISOString().split('T')[0]
            }
        } else {
            // 不存在值，一定是工作日，或者为true，一定是工作日
            if (isEmpty(isHolidayWork)) {
                isHolidayWork = getHolidayWorkNotes(holiday, isWork)
            }
            if (restDays > 0) {
                // 如果累计距离天数时，休息天数>0了，证明假期已经统计结束了
                return {
                    holidayDate: holidayDate,
                    diffDays: diffDays, // 距离放假天数
                    restDays: restDays, // 休息天数
                    restDayType: restDayType, // 类型
                    holidayName: holidayName, // 类型名称
                    isHolidayWork: isHolidayWork // 类型
                }
            } else {
                diffDays++
            }
        }
        today.setDate(today.getDate() + 1)
        loopCounts++
    }
}

/**===============================================将农历日期转换为公历日期=================================================================== */

/**
 * 将农历日期转换为公历日期
 * @param {number} lunarYear - 农历年份
 * @param {number} lunarMonth - 农历月份
 * @param {number} lunarDay - 农历日
 * @returns {Object} - 公历日期对象，包含年、月、日
 */
const getLunarToSolar = (lunarYear, lunarMonth, lunarDay) => {
    // 创建农历日期对象
    const lunar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay);
    // 转换为公历日期
    const solar = lunar.getSolar();
    // 返回公历日期的年、月、日
    return {
        year: solar.getYear(),
        month: solar.getMonth(),
        day: solar.getDay(),
    };
};

export { getAllFestivals, groupHolidays, getNearestRestDayInfo, getFutureFestival, getLunarToSolar, FESTIVALS_TYPE, FESTIVALS_LIST }

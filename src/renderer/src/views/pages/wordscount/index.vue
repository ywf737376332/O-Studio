<template>
    <div class="main-container">
        <div class="statistics">
            <div class="statistics-item" v-for="[key, item] in Object.entries(statisticsRes)" :key="key">
                <p>{{ item.label }}</p>
                <p>{{ item.value }}</p>
            </div>
        </div>
        <div class="content">
            <TextArea v-model="textTarget" :maxlength="100000" :placeholder="`转换后的文本`" :readonly="false"></TextArea>
        </div>
        <div class="tip">
            <p>提示：统计支持中文、英文、数字、标点符号，其中其他字符包括特殊表情符号的统计，字符数，不包含换行符号。</p>
        </div>
    </div>
</template>

<script setup name="WordsCount">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import TextArea from '@/components/TextArea/index.vue'
const textTarget = ref('')

const statisticsRes = reactive({
    totalChars: {
        label: '字符数',
        value: 0
    },
    lines: {
        label: '行数',
        value: 0
    },
    numbers: {
        label: '数字',
        value: 0
    },
    chineseChars: {
        label: '汉字',
        value: 0
    },
    chinesePunct: {
        label: '中文标点',
        value: 0
    },
    letters: {
        label: '字母',
        value: 0
    },
    englishPunct: {
        label: '英文标点',
        value: 0
    },
    spaces: {
        label: '空格',
        value: 0
    },
    others: {
        label: '其他字符',
        value: 0
    }
})

watch(textTarget,()=>{
    statisticsText(textTarget.value)
})

/**
 * 统计文本内容
 * @param {string} text - 要统计的文本
 * @returns {TextStats} 统计结果
 */
const statisticsText = (text) => {
    // 正则表达式
    const patterns = {
        totalChars: /[\r\n]/g,
        number: /[0-9]/,
        chineseChar: /[\u4e00-\u9fa5]/,
        /* 中文标点 。？！，、；：“”‘’（）《》〈〉【】『』「」﹃﹄〔〕…—～﹏￥｜┃│ */
        chinesePunct: /[\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5\uff5c\u2503\u2502]/,
        letter: /[a-zA-Z]/,
        englishPunct: /[~`!@#$%^&*()_\-+={}\[\]|\\:;"'<>,.?\/]/,
        space: /[ ]/,
        other: /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u
    }
    resetStatistics();
    // 如果文本为空，直接返回
    if (!text) {
        return
    }
    // 计算总字符数
    statisticsRes.totalChars.value = text.replace(patterns.totalChars, '').length
    // 计算行数（包括空行）
    statisticsRes.lines.value = text.split('\n').length
    // 遍历每个字符进行统计
    for (const char of text) {
        if (patterns.number.test(char)) {
            statisticsRes.numbers.value++
        } else if (patterns.chineseChar.test(char)) {
            statisticsRes.chineseChars.value++
        } else if (patterns.chinesePunct.test(char)) {
            statisticsRes.chinesePunct.value++
        } else if (patterns.letter.test(char)) {
            statisticsRes.letters.value++
        } else if (patterns.englishPunct.test(char)) {
            statisticsRes.englishPunct.value++
        } else if (patterns.space.test(char)) {
            statisticsRes.spaces.value++
        } else if(patterns.other.test(char)){
            statisticsRes.others.value++
        }
    }
    return statisticsRes
}

const resetStatistics = ()=>{
    Object.keys(statisticsRes).forEach(key=>{
        statisticsRes[key].value = 0
    })
}

</script>

<style scoped lang="scss">
.main-container {
    width: 100%;
    height: 100%;
    padding: 15px 20px;
    display: flex;
    flex-direction: column;
    align-content: center;

    .statistics {
        width: 100%;
        height: 80px;
        border: 1px dashed var(--main-dashed-border-color);
        border-radius: 10px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .statistics-item {
            text-align: center;
            color: var(--main-btn-font-color);

            >p:first-child {
                margin-bottom: 10px;
            }

            >p:last-child {
                letter-spacing: 2px;
                font-size: 14px;
                font-weight: 600;
            }
            &:hover {
                color: var(--main-menu-active-color);
                font-weight: 600;
            }
        }

    }

    .content {
        width: 100%;
        height: auto;
        flex: 1;
    }
    .tip {
        width: 100%;
        height: 25px;
        line-height: 25px;
        padding: 0 10px;
        border-radius: 3px;
        border: 1px dashed var(--main-tip-border-color);
        background-color: var(--main-tip-background-color);
        margin-top: 5px;
        p{
            font-size: 12px;
            color: #999;
        }
    }
}
</style>
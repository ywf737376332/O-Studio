<template>
    <div class="toggle-group">
        <template v-for="item in funList" :key="item.value">
            <FunButton class="radio-button" :class="[item.value == val ? 'active' : '']"
                @fnClick="toggleFun(item)" :text="item.text"></FunButton>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import FunButton from '@/components/FunButton/index.vue'
import useSettingStore from '@/store/modules/settings'
const settingStore = useSettingStore()
const props = defineProps({
    val: {
        type: String,
        dafault: ''
    },
    funList: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:val'])
const toggleFun = (item) => {
    emit('update:val',item.value)
}
const themeColor = computed(() => settingStore.getThemeColor())

</script>

<style scoped lang="scss">
.toggle-group {
    display: flex;
    flex-direction: row;

    .radio-button {
        border-radius: 0;
    }

    .active {
        background-color: v-bind(themeColor);
        color: #fff;
    }
}

.toggle-group div:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
}

.toggle-group div:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
}
</style>
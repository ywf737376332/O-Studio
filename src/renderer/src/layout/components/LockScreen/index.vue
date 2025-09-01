<template>
    <DrawerViewer :showDrawer="showDrawer" :direction="direction" :size="100" :pressEscOnClose="false"
        @handleClose="handleClose">
        <template #main>
            <div class="lock-screen-container">
                <div class="lock-screen-header">
                    <p>23:28</p>
                    <p>2026年2月28日 星期六</p>
                </div>
                <div class="lock-screen-pane">
                    <!-- <el-input v-model="lockScreenPassword" placeholder="请输入锁屏密码"></el-input> -->
                    <el-button type="primary" size="small" @click="handleClose">解锁</el-button>
                </div>
            </div>
        </template>
    </DrawerViewer>
</template>

<script setup>
import DrawerViewer from '@/components/DrawerViewer/index.vue'
import { ref } from 'vue';

const props = defineProps({
    showDrawer: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(['handleClose', 'routePage'])
const handleClose = () => {
    emit('handleClose')
}
const direction = ref('ttb')
const lockScreenPassword = ref('')
</script>

<style scoped lang="scss">
.lock-screen-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    .lock-screen-header {
        width: 100%;
        height: 160px;
        position: fixed;
        top: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        >p:first-child{
            font-size: 50px;
        }
        >p:last-child {
            font-size: 18px;
        }
    }
    .lock-screen-pane {
        width: 200px;
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        >p {
            font-size: 28px;
        }
    }
}
</style>
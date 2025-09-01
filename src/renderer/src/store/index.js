import { createPinia } from "pinia";
const pinia = createPinia();

// pinia数据初始化方法调用
pinia.use(({ store }) => {
    if (store.$id === 'system-settings') {
        store.initLoadSettings(); // 在创建 Store 时自动初始化
        Logger.info("成功加载持久化【system-settings】数据到pinia")
    }
    if (store.$id === 'user-cache') {
        store.initAppData(); // 在创建 Store 时自动初始化
        Logger.info("成功加载持久化【user-cache】数据到pinia")
    }
    if (store.$id === 'user-menus') {
        store.initMenusData(); // 在创建 Store 时自动初始化
        Logger.info("成功加载持久化【user-menus】数据到pinia")
    }
});

export default pinia;
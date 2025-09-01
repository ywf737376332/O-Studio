<template>
  <div class="input-pane">
    <p>{{ label }}</p>
    <input class="base-input" :value="val" @input="input" :readonly="readonly"/>
    <span class="iconfont icon-copy" @click="fnClick"></span>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  val: {
    type: [String, Number],
    default: ''
  },
  readonly:{
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:val', 'fnClick'])
const input = (event) => {
  emit('update:val', event.target.value)
}
const fnClick = ()=>{
    emit('fnClick')
}
</script>

<style scoped lang="scss">
.input-pane {
  width: 100%;
  height: 30px;
  background-color: var(--main-input-background-color);
  display: flex;
  align-items: center;
  border-radius: 3px;

  >p {
    width: 80px;
    padding: 0 5px;
    font-size: 12px;
    margin-left: 5px;
    color: var(--main-btn-font-color);
  }

  >span {
    width: 45px;
    text-align: center;
    font-size: 12px;
    padding: 0 5px;
    cursor: pointer;
  }

  .iconfont {
    font-size: 14px;
    color: var(--main-btn-font-color);
  }

  .base-input {
    flex: 1;
    font-size: 12px;
  }

  input {
    border: 0;
    height: 30px;
    background-color: var( --main-input-background-color);
    padding: 0 5px;
    color: var(--main-input-label-font-color);

    &:hover {
      background-color: var(--main-input-active-color);
    }

    &:focus {
      box-sizing: border-box;
      border: 1px solid var(--main-input-focus-border-color);
      background-color: var(--main-input-focus-color);
    }
  }

}
</style>
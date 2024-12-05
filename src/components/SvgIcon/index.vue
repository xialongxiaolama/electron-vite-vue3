<template>
  <svg aria-hidden="true" class="svg-icon-spin" :class="iconSize">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup name="SvgIcon">
import useThemeStore from '@/store/app/theme'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  color: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#333',
  },
  size: {
    type: String,
    default: 'default',
  },
})
const themeStore = useThemeStore()

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const iconSize = computed(() => `svg-icon-${props.size}`)
</script>

<style lang="scss" scoped>
.svg-icon-spin {
  width: v-bind('themeStore.iconSize');
  height: v-bind('themeStore.iconSize');
  fill: v-bind('themeStore.iconColor');
  color: v-bind('themeStore.iconColor');
  vertical-align: middle;
}
</style>

<template>
  <div class="sticky-wrap">
    <sticky v-if="menus.length">
      <sticky-menu :menus="menus" parent=".sticky-wrap" :top="top" :z-index="zIndex"></sticky-menu>
    </sticky>
    <slot />
  </div>
</template>
<script>
import Sticky from './sticky.vue'
import StickyMenu from './sticky-menu.vue'
export default {
  components: {
    Sticky,
    StickyMenu
  },
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    top: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 101
    }
  }
}
</script>
<style lang="scss" scoped>
.sticky-wrap{
  overflow-y: auto;
  scroll-behavior:smooth;
  max-height: 100%;
}
</style>

<template>
  <div class="klk-anchor">
    <div class="klk-anchor_scroll">
      <ul ref="anchor_nav" class="klk-anchor_nav">
        <li
          v-for="item in menus"
          :key="item.value"
          class="klk-anchor_nav-item"
          :class="{ 'klk-anchor_nav-item_active': menu === item.value }"
        >
          <span @click="handleMenuChange(item.value)">{{
            item.label
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getFirstScrollElement, debounce } from '../utils/index.js'
export default {
  props: {
    top: {
      type: Number,
      default: 0
    },
    menus: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      selector: '',
      menu: '',
      isScroll: true,
      isMounted: false,
      scrollTop: 0,
      anchorChange: false,
      rootScrollElement: '',
      timer: null
    }
  },
  watch: {
    parent: {
      immediate: true,
      handler: 'getScrollElement'
    },
    menus: {
      immediate: true,
      handler(list) {
        this.menu = (list.length > 0 && list[0].value) ? list[0].value : ''
      }
    },
    scrollTop() {
      if (this.anchorChange) {
        // 切换按钮会滚动视图，$nextTick 之后按钮值改变了，但滚动可能还没有结束，所以需要打个标记。
        this.isScroll = true
      }
    }
  },
  mounted() {
    this.isMounted = true
    this.getScrollElement()
  },

  methods: {
    handleMenuChange(selector) {
      this.isScroll = false
      this.anchorChange = false
      this.menu = selector
      const scrollElement = document.querySelector(selector)
      const rootScrollElement = getFirstScrollElement(scrollElement)
      const bodyTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollElement && rootScrollElement) {
        const offsetTop = scrollElement.offsetTop + scrollElement.clientTop
        let offsetHeight = 0
        if (this.$el && this.$el.parentElement && this.$el.parentElement.offsetHeight) {
          offsetHeight = this.$el.parentElement.offsetHeight
        }
        const top = offsetTop - this.top - offsetHeight - bodyTop
        rootScrollElement.scrollTop = top
        // 当滚动容器无法滚动时，点击的菜单高亮
        if (this.scrollTop >= this.rootScrollElement.scrollHeight - this.rootScrollElement.offsetHeight) {
          this.menu = selector
        }
        this.$nextTick(() => {
          this.anchorChange = true
        })
      }
    },
    getScrollElement() {
      if (!this.isMounted) { return }
      // 如果没有传入 parent 默认取第一个父级滚动元素
      const parent = this.parent
      let element = null
      if (parent) {
        element = document.querySelector(parent)
        // mount 之后 rootScrollElement 可能已经存在了，如果和上次一样就不做任何操作。
        if (element === this.rootScrollElement) { return }
      } else if (this.$el) {
        element = getFirstScrollElement(this.$el.parentElement)
      }
      if (element) {
        this.removeScrollEvent()
        this.rootScrollElement = element
        this.rootScrollElement.addEventListener('scroll', debounce(this.handleScroll, 20))
      }
    },
    removeScrollEvent() {
      if (this.rootScrollElement) {
        this.rootScrollElement.removeEventListener('scroll', this.handleScroll)
      }
    },
    handleScroll() {
      const bodyTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollTop = this.rootScrollElement.scrollTop - bodyTop
      this.scrollTop = scrollTop
      if (!this.isScroll) { return }
      const menus = this.menus
      let offsetHeight = 0
      if (this.$el && this.$el.parentElement && this.$el.parentElement.offsetHeight) {
        offsetHeight = this.$el.parentElement.offsetHeight
      }
      const scrollList = []
      menus.length && menus.forEach((item) => {
        const element = document.querySelector(item.value)
        if (element) {
          const top = element.offsetTop - bodyTop
          const rect = {
            top: top + element.clientTop - this.top - offsetHeight,
            bottom: top + element.offsetHeight - this.top - offsetHeight
          }
          scrollList.push(rect)
        }
      })
      if (scrollTop < scrollList[0].top) {
        this.menu = this.menus[0].value || ''
        return
      }
      // 遍历按钮元素的 top 和 bottom，查看当前滚动在那个元素的区间内。
      scrollList.some((it, index) => {
        if (index && scrollTop >= it.top && scrollTop < it.bottom) {
          const menu = this.menus[index].value || ''
          if (menu) { this.menu = menu }
          return true
        }
      })
    }
  }
}
</script>
<style lang="scss">
.klk-anchor{
  &_scroll {
    width: 100%;
    height: 48px;
    background-color: #fff;
    overflow-y: hidden;
  }

  &_nav {
    padding-bottom: 18px; // Hide scroll bar
    white-space: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  &_nav-item {
    display: inline-block;
    span {
      display: inline-block;
      padding: 16px;
      margin-bottom: -1px;
      border-bottom: 3px solid transparent;
      font-size: 14px;
      font-weight: 600;
      line-height: 1;
    }
    &_active{
      span{
        border-bottom-color: #ff5722;
        color: #ff5722;
        transition: all 0.2
      }
    }
  }
}
</style>

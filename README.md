# sticky-anchor
``` bash
# install
$ npm install sticky-anchor
```
# 使用说明

``` javasscript
props: {
    // tab列表 格式[{label: 'tab1', value: '.container1'}]
    menus: {
      type: Array,
      default: () => []
    },
    // 距顶部距离
    top: {
      type: Number,
      default: 0
    },
    // tab层级
    zIndex: {
      type: Number,
      default: 101
    }
}

示例
## js
import StickyAnchor from 'sticky-anchor'
data(){
    return: {
        menus: [
            {label: 'tab1', value: '.container1', content: '21212'}
            {label: 'tab2', value: '.container2', content: '21212'}
            {label: 'tab3', value: '.container3', content: '21212'}
            {label: 'tab4', value: '.container4', content: '21212'}
        ]
    }
}

## html
<sticky-anchor :menus="menus">
    <div v-for="menu in menus" :key="menu.value" :class="menu.value">{{ item.label }}</div>
</sticky-anchor>

```
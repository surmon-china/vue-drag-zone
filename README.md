[![GitHub issues](https://img.shields.io/github/issues/surmon-china/vue-drag-zone.svg?style=flat-square)](https://github.com/surmon-china/vue-drag-zone/issues)
[![GitHub forks](https://img.shields.io/github/forks/surmon-china/vue-drag-zone.svg?style=flat-square)](https://github.com/surmon-china/vue-drag-zone/network)
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/vue-drag-zone.svg?style=flat-square)](https://github.com/surmon-china/vue-drag-zone/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/surmon-china/vue-drag-zone/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/surmon-china/vue-drag-zone.svg?style=social?style=flat-square)](https://twitter.com/intent/tweet?url=https://github.com/surmon-china/vue-drag-zone)

[![NPM](https://nodei.co/npm/vue-drag-zone.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/vue-drag-zone/)

# Vue-Drag-Zone
Drag Zone component for Vue2.

适用于Vue2的dom拖动组件。


> ### v1.2.0
> 增加：支持竖向拖动、min-height、max-height属性（还有bug，求修复）

> ### v1.0.0
> 依赖jquery，支持横向拖动、disabled、min-width、max-width属性


# Example
[Demo Page](https://surmon-china.github.io/vue-drag-zone/)


# Use Setup


### Install vue-drag-zone

``` bash
npm install vue-drag-zone --save
```

``` javascript
// import with ES6
import Vue from 'vue'
import VueDragZone from 'vue-drag-zone'


// require with Webpack
const Vue = require('vue')
const VueDragZone = require('vue-drag-zone')


// use
Vue.use(VueDragZone)


// or use with component(ES6)
import { dragZone, dragHandle } from 'vue-drag-zone'

// use
export default {
  components: {
    dragZone,
    dragHandle
  }
}
```

``` html
<!-- base use -->
<drag-zone class="zone">
  <div class="item i1">item1</div>
  <drag-handle class="handle">H</drag-handle>
  <div class="item i2">item2</div>
  <drag-handle class="handle">H</drag-handle>
  <div class="item i3">item3</div>
  <drag-handle class="handle">H</drag-handle>
  <div class="item i4">item4</div>
  <drag-handle class="handle">H</drag-handle>
  <div class="item i5">item5</div>
</drag-zone>

<!-- disabled handle -->
<drag-zone class="zone">
  <div class="item i1">item1</div>
  <drag-handle class="handle">H</drag-handle>
  <div class="item i2">item2</div>
  <drag-handle class="handle">H</drag-handle>
  <div class="item i3">item3</div>
  <div class="item i4">item4</div>
  <drag-handle class="handle" :disabled="true">H</drag-handle>
  <div class="item i5">item5</div>
</drag-zone>

<!-- min width and max width -->
<drag-zone class="zone">
  <div class="item i1">min 100px && max 30rem</div>
  <drag-handle class="handle"></drag-handle>
  <div class="item i2">item2</div>
  <drag-handle class="handle"></drag-handle>
  <div class="item i3">item3</div>
  <div class="item i4">min 50px</div>
  <drag-handle class="handle"></drag-handle>
  <div class="item i5">min 10em</div>
</drag-zone>

<drag-zone class="zone" :options="{ direction: 'vertical' }">
  <div class="item i1">item1</div>
  <drag-handle class="handle"></drag-handle>
  <div class="item i2">item2</div>
  <drag-handle class="handle"></drag-handle>
  <div class="item i3">item3</div>
  <div class="item i4">item4</div>
  <drag-handle class="handle"></drag-handle>
  <div class="item i5">item5</div>
</drag-zone>
```

# Author Blog
[Surmon](https://surmon.me)

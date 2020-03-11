
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/vue-drag-zone.svg?style=flat-square)](https://github.com/surmon-china/vue-drag-zone/stargazers)
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square)](https://github.com/surmon-china/vue-drag-zone)
[![GitHub issues](https://img.shields.io/github/issues/surmon-china/vue-drag-zone.svg?style=flat-square)](https://github.com/surmon-china/vue-drag-zone/issues)
[![GitHub forks](https://img.shields.io/github/forks/surmon-china/vue-drag-zone.svg?style=flat-square)](https://github.com/surmon-china/vue-drag-zone/network)
[![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg?style=flat-square)](https://github.com/surmon-china/vue-drag-zone)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/surmon-china/vue-drag-zone)

[![NPM](https://nodei.co/npm/vue-drag-zone.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/vue-drag-zone/)
[![NPM](https://nodei.co/npm-dl/vue-drag-zone.png?months=9&height=3)](https://nodei.co/npm/vue-drag-zone/)


# Vue-Drag-Zone
Drag Zone component for Vue.
适用于 Vue 的 DOM 拖动组件。


### Example
[Example Page](https://github.surmon.me/vue-drag-zone)

### Install

#### CDN

``` html
<script type="text/javascript" src="path/to/vue.min.js"></script>
<script type="text/javascript" src="path/to/dist/vue-drag-zone.js"></script>
<script type="text/javascript">
  Vue.use(window.VueDragZone)
</script>
```

#### NPM

``` bash
npm install vue-drag-zone --save
```

### Mount

#### mount with global

``` javascript
import Vue from 'vue'
import VueDragZone from 'vue-drag-zone'

Vue.use(VueDragZone)
```

#### mount with component

```javascript
import { dragZone, dragHandle, dragContent } from 'vue-drag-zone'

export default {
  components: {
    dragZone,
    dragHandle,
    dragContent
  }
}
```

### component

```html
<template>
  <!-- base use -->
  <drag-zone class="zone">
    <drag-content class="content c1">
      <div class="item i1">item 1</div>
    </drag-content>
    <drag-handle class="handle"></drag-handle>
    <drag-content class="content c2">
      <div class="item i2">item 2</div>
    </drag-content>
    <drag-handle class="handle"></drag-handle>
    <drag-content class="content c3">
      <div class="item i3">item 3</div>
    </drag-content>
    <drag-content class="content c4">
      <div class="item i4">item 4</div>
    </drag-content>
    <drag-handle class="handle"></drag-handle>
    <drag-content class="content c5">
      <div class="item i5">item 5</div>
    </drag-content>

  <!-- disabled handle -->
  <drag-zone class="zone">
    <drag-content class="content c1">
      <div class="item i1">item 1</div>
    </drag-content>
    <drag-handle class="handle"></drag-handle>
    <drag-content class="content c2">
      <div class="item i2">item 2</div>
    </drag-content>
    <drag-content class="content c3">
      <div class="item i3">item 3</div>
    </drag-content>
    <drag-handle class="handle"></drag-handle>
    <drag-content class="content c4">
      <div class="item i4">item 4</div>
    </drag-content>
    <drag-handle class="handle" :disabled="disabledHandle"></drag-handle>
    <drag-content class="content c5">
      <div class="item i5">item 5</div>
    </drag-content>
  </drag-zone>
</template>
```

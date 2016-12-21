 /**
 *
 * Vue-touch-ripple
 * Adapted from rippleJS (https://github.com/samthor/rippleJS)
 * removed jQuery
 *
 */

var dragZone = require('./zone.vue')
var dragHandle = require('./handle.vue')

var VueDragZone = {
  dragZone,
  dragHandle,
  install(Vue) {
    Vue.component('drag-zone', dragZone)
    Vue.component('drag-handle', dragHandle)
  }
}

module.exports = VueDragZone

 /**
 *
 * Vue-Drag-Zone
 * Author @Surmon.me
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

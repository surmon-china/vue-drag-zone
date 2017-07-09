 /**
 *
 * Vue-Drag-Zone
 * Author @Surmon.me
 *
 */

var dragZone = require('./zone.vue')
var dragHandle = require('./handle.vue')
dragHandle = dragHandle.default || dragHandle

var VueDragZone = {
  dragZone: dragZone,
  dragHandle: dragHandle,
  install(Vue) {
    Vue.component(dragZone.name, dragZone)
    Vue.component(dragHandle.name, dragHandle)
  }
}

module.exports = VueDragZone

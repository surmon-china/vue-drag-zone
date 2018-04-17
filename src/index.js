
/*
* Vue-Drag-Zone
* Author: surmon@foxmail.com
* Github: https://github.com/surmon-china/vue-drag-zone
*/

import dragZone from './zone.vue'
import dragHandle from './handle.vue'
import dragContent from './content.vue'

const install = function (Vue) {
  Vue.component(dragZone.name, dragZone)
  Vue.component(dragHandle.name, dragHandle)
  Vue.component(dragContent.name, dragContent)
}
const VueDragZone = { dragZone, dragHandle, dragContent, install }

export default VueDragZone

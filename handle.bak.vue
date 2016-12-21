<template>
  <div class="drag-handle" :class="{ 'disabled': disabled }">
    <slot></slot>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: 'drag-handle',
    props: ['disabled'],
    mounted() {
      this.dragHandleBuild()
    },
    methods: {
      dragHandleBuild() {

        // self
        let self = this

        // 父容器宽高信息
        let $wrap = $(this.$parent.$el)

        // 父容器宽度
        let warpClientWidth = $wrap[0].clientWidth

        // 载体本身
        let $currentLabel = $(this.$el)

        // 载体宽高
        let currentLabelWidth = $currentLabel[0].clientWidth
        let currentLabelHeight = $currentLabel[0].clientHeight

        // 计算元素组的指定属性之和
        let elementsWidths = (elements = [], attr = 'minWidth', notReduce = false) => {
          if (!elements.length) return 0
          let elementsArr =  Array.from(elements).map(label => {
            let labelWidth = $(label).css(attr)
            if (!labelWidth || labelWidth === 'auto') {
              labelWidth = 0
            } else {
              labelWidth = parseInt(labelWidth)
            }
            return labelWidth
          })
          return notReduce ? elementsArr : elementsArr.reduce((preValue, curValue) => { return preValue + curValue })
        }

        // 给当前label绑定事件
        $currentLabel.bind('mousedown', function(e) {

          // 判断是否禁用
          if (self.disabled) return false

          console.log(this.$parent)

          // 父容器左边绝对位置
          let wrapOffsetLeft = $wrap.offset().left

          // 要设置的属性
          let buildStyle = 'width'

          // 获取前后的所有兄弟元素
          let $prevAll = $currentLabel.prevAll()
          let $nextAll = $currentLabel.nextAll()
          let $prevLabels = $prevAll.filter('.drag-handle')
          let $nextLabels = $nextAll.filter('.drag-handle')
          let $prevLabel = $prevLabels[0] ? $($prevLabels[0]) : null
          let $nextLabel = $nextLabels[0] ? $($nextLabels[0]) : null
          let prevLabelOffsetLeft = null
          let nextLabelOffsetLeft = null
          let prevLabelOffsetTop = null
          let nextLabelOffsetTop = null

          // 获取到前后紧邻的Label的距左距离
          if ($prevLabels.length) prevLabelOffsetLeft = $($prevLabels[0]).offset().left
          if ($nextLabels.length) nextLabelOffsetLeft = $($nextLabels[0]).offset().left

          // 前面需要设置样式的元素集合
          let prevElementsToDo = $prevLabel ? $currentLabel.prevUntil('.drag-handle') : $prevAll

          // 后面需要设置样式的元素集合
          let nextElementsToDo = $nextLabel ? $currentLabel.nextUntil('.drag-handle') : $nextAll

          // 前面的元素的最小宽度之和
          let prevElementsMinWidths = elementsWidths(prevElementsToDo)

          // 前面的元素的最大宽度之和
          let prevElementsMaxWidths = elementsWidths(prevElementsToDo, 'maxWidth')

          // 后面的元素的最小宽度之和
          let nextElementsMinWidths = elementsWidths(nextElementsToDo)

          // 监听移动
          $(document).bind('mousemove', function(event) {

            if (self.disabled) return false

            // 鼠标X轴
            let mouseX = event.pageX

            // 可移动的最小范围

            // 如果左边有label，则应该是label的左边距加左边label的宽度
            // 如果左边没有label，则应该是父容器的距左距离
            // 无论什么情况，如果左边元素有min属性，则应该要加上min属性值的总和
            let minScope = ($prevLabel ? (prevLabelOffsetLeft + $prevLabel[0].clientWidth) : wrapOffsetLeft) + prevElementsMinWidths

            // 可移动的最大范围

            // 如果左边有max，则计算出左边max的总和， + label的左边距加左边label的宽度 = max
            // 如果左边没有max
            //  - 如果右边有label，则应该是右边label的距左距离
            //  - 否则是父容器宽度 + 父容器距左边距
            //  - 无论上面任意情况，如果右边元素有min属性，则应该要减去这个属性值的总和
            let maxScope
            if (!!prevElementsMaxWidths) {
              maxScope = prevElementsMaxWidths + ($prevLabel ? (prevLabelOffsetLeft + $prevLabel[0].clientWidth) : wrapOffsetLeft)
            } else {
              if (nextLabelOffsetLeft) maxScope = nextLabelOffsetLeft
              if (!nextLabelOffsetLeft) maxScope = warpClientWidth + wrapOffsetLeft
              maxScope -= (currentLabelWidth + nextElementsMinWidths)
            }

            // 限制最大最小范围
            if (mouseX < minScope) mouseX = minScope
            if (mouseX > maxScope) mouseX = maxScope

            // 设置左边元素的宽度
            if (prevElementsToDo.length) {
              let toDoWidth
              if (prevLabelOffsetLeft) {
                toDoWidth = mouseX - prevLabelOffsetLeft - currentLabelWidth
              } else {
                toDoWidth = mouseX - wrapOffsetLeft
              }

              // 如果toDoWidth还大于minwidth之和，则分配
              if (toDoWidth > prevElementsMinWidths) {

                // 平均值
                let average = toDoWidth / prevElementsToDo.length

                // 最大minwidth
                let prevElementsMinMaxWidth = Math.max.apply(null, elementsWidths(prevElementsToDo, 'minWidth', true))

                // console.log(average, prevElementsMinMaxWidth)

                // 如果平均分配的值大于最大的minwidth，则平均分配
                if (average >= prevElementsMinMaxWidth) {
                  prevElementsToDo.css(buildStyle, toDoWidth / prevElementsToDo.length)
                } else {
                  // 否则，开始特殊分配
                  // 给有minwidth的全部width设置为自己的minwidth
                  let notHasMinWidthElements = []
                  Array.from(prevElementsToDo).forEach(element => {
                    let minWidth = $(element).css('minWidth')
                    if (minWidth !== 'auto') {
                      $(element).css('width', minWidth)
                    } else {
                      notHasMinWidthElements.push(element)
                    }
                  })
                  // 给没有minwidth的设置(toDoWidth - minwidth之和) / 自己数量
                  $(notHasMinWidthElements).css(buildStyle, (toDoWidth - prevElementsMinMaxWidth) / notHasMinWidthElements.length)
                  // console.log($(notHasMinWidthElements))
                }
              }
            }

            // 设置右边元素的宽度
            if (nextElementsToDo.length) {

              let toDoWidth
              if (nextLabelOffsetLeft) {
                toDoWidth = nextLabelOffsetLeft - mouseX
              } else {
                toDoWidth = warpClientWidth - (mouseX - wrapOffsetLeft)
              }
              toDoWidth -= currentLabelWidth

              // 如果toDoWidth还大于minwidth之和，则分配
              if (toDoWidth > nextElementsMinWidths) {

                // 平均值
                let average = toDoWidth / nextElementsToDo.length

                // 最大minwidth
                let nextElementsMinMaxWidth = Math.max.apply(null, elementsWidths(nextElementsToDo, 'minWidth', true))

                // console.log(average, nextElementsMinMaxWidth)

                // 如果平均分配的值大于最大的minwidth，则平均分配
                if (average >= nextElementsMinMaxWidth) {
                  nextElementsToDo.css(buildStyle, toDoWidth / nextElementsToDo.length)
                } else {
                  // 否则，开始特殊分配
                  // 给有minwidth的全部width设置为自己的minwidth
                  let notHasMinWidthElements = []
                  Array.from(nextElementsToDo).forEach(element => {
                    let minWidth = $(element).css('minWidth')
                    if (minWidth !== 'auto') {
                      $(element).css('width', minWidth)
                    } else {
                      notHasMinWidthElements.push(element)
                    }
                  })
                  // 给没有minwidth的设置(toDoWidth - minwidth之和) / 自己数量
                  $(notHasMinWidthElements).css(buildStyle, (toDoWidth - nextElementsMinMaxWidth) / notHasMinWidthElements.length)
                  // console.log($(notHasMinWidthElements))
                }
              }
            }
          })
        })

        // 移除监听事件
        $(document).bind('mouseup', function(event) {
          $(document).unbind('mousemove')
          event.cancelBubble = true
        })
      }
    }
  }
</script>

<style scoped>
  .drag-handle {
    cursor: e-resize;
  }
  .drag-handle.disabled {
    opacity: .5;
    cursor: no-drop;
  }
</style>

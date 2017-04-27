<template>
  <div class="drag-handle" :class="{ 'disabled': disabled, 'horizontal': horizontal, 'vertical': !horizontal }">
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
    computed: {
      horizontal() {
        return Object.is(this.$parent.options.direction, 'horizontal')
      }
    },
    methods: {
      dragHandleBuild() {

        let self = this

        // 模式
        let horizontal = self.horizontal

        // 父容器宽高信息
        let $wrap = $(this.$parent.$el)

        // 父容器宽度
        let warpClientAttr = $wrap[0][horizontal ? 'clientWidth' : 'clientHeight']

        // 载体本身
        let $currentHandle = $(this.$el)

        // 载体宽高
        let currentHandleAttr = $currentHandle[0][horizontal ? 'clientWidth' : 'clientHeight']

        // 计算元素组的指定属性之和
        let elementsAttrs = (elements = [], attr = 'minWidth', notReduce = false) => {
          if (!elements.length) return 0
          let elementsArr =  Array.from(elements).map(element => {
            let elementAttr = $(element).css(attr)
            if (!elementAttr || elementAttr === 'auto') {
              elementAttr = 0
            } else {
              elementAttr = parseInt(elementAttr)
            }
            return elementAttr
          })
          return notReduce ? elementsArr : elementsArr.reduce((preValue, curValue) => { return preValue + curValue })
        }

        // 给当前label绑定事件
        $currentHandle.bind('mousedown', function(e) {

          // 判断是否禁用
          if (self.disabled) return false

          // 父容器绝对位置
          let wrapOffsetAttr = $wrap.offset()[horizontal ? 'left' : 'top']

          // 要设置的属性
          let buildStyle = horizontal ? 'width' : 'height'

          // 前后的所有兄弟元素
          let $prevAll = $currentHandle.prevAll()
          let $nextAll = $currentHandle.nextAll()
          // 到前后所有的Handle
          let $prevHandles = $prevAll.filter('.drag-handle')
          let $nextHandles = $nextAll.filter('.drag-handle')
          // 到前后紧邻的Handle
          let $prevHandle = $prevHandles[0] ? $($prevHandles[0]) : null
          let $nextHandle = $nextHandles[0] ? $($nextHandles[0]) : null
          // 获取到前后紧邻的Handle的距前/上距离
          let prevHandleOffsetAttr = $prevHandle ? $($prevHandle).offset()[horizontal ? 'left' : 'top'] : null
          let nextHandleOffsetAttr = $nextHandle ? $($nextHandle).offset()[horizontal ? 'left' : 'top'] : null


          // 前面需要设置样式的元素集合
          let prevElementsToDo = $prevHandle ? $currentHandle.prevUntil('.drag-handle') : $prevAll

          // 后面需要设置样式的元素集合
          let nextElementsToDo = $nextHandle ? $currentHandle.nextUntil('.drag-handle') : $nextAll

          // 前面的元素的最小宽度/高度之和
          let prevElementsMinAttrs = elementsAttrs(prevElementsToDo, horizontal ? 'minWidth' : 'minHeight')
          let prevElementsMaxAttrs = elementsAttrs(prevElementsToDo, horizontal ? 'maxWidth' : 'maxHeight')

          // 后面的元素的最小宽度/高度之和
          let nextElementsMinAttrs = elementsAttrs(nextElementsToDo, horizontal ? 'minWidth' : 'minHeight')
          let nextElementsMaxAttrs = elementsAttrs(nextElementsToDo, horizontal ? 'maxWidth' : 'maxHeight')

          // 监听移动
          $(document).bind('mousemove', function(event) {

            if (self.disabled) return false

            // 鼠标定位
            let mousePosition = event[horizontal ? 'pageX' : 'pageY']

            // 可移动的最小范围
            // 如果后面元素有max限制，则minScope应该是
            //    如果后面没有handle了，则是 父元素宽度 + 父元素左边距离 - 右边元素的最大宽度之和
            //    如果后面还有handle，则应该是 父元素宽度 + 父元素左边距离 - 右边所有元素的宽度之和
            // 如果前边有label，则应该是label的前边距加前边label的宽度
            // 如果前边没有label，则应该是父容器的距前距离
            // 无论什么情况，如果前边元素有min属性，则应该要加上min属性值的总和
            let minScope

            if (nextElementsMaxAttrs)
              minScope = warpClientAttr + wrapOffsetAttr - nextElementsMaxAttrs

            else
              if ($prevHandle) minScope = prevHandleOffsetAttr + $prevHandle[0][horizontal ? 'clientWidth' : 'clientHeight']
              if (!$prevHandle) minScope = wrapOffsetAttr
              minScope += prevElementsMinAttrs

            // 可移动的最大范围

            // 如果前边有max，则计算出前边max的总和， + label的前边距加前边label的宽度 = max
            // 如果前边没有max
            //  - 如果后边有label，则应该是后边label的距前距离
            //  - 否则是父容器宽度 + 父容器距前边距
            //  - 无论上面任意情况，如果后边元素有min属性，则应该要减去这个属性值的总和
            let maxScope
            if (!!prevElementsMaxAttrs) {
              if ($prevHandle) maxScope = prevHandleOffsetAttr + $prevHandle[0][horizontal ? 'clientWidth' : 'clientHeight']
              if (!$prevHandle) maxScope = wrapOffsetAttr
              maxScope += prevElementsMaxAttrs
            } else {
              if (nextHandleOffsetAttr) maxScope = nextHandleOffsetAttr
              if (!nextHandleOffsetAttr) maxScope = warpClientAttr + wrapOffsetAttr
              maxScope -= (currentHandleAttr + nextElementsMinAttrs)
            }

            // 限制最大最小范围
            if (mousePosition < minScope) mousePosition = minScope
            if (mousePosition > maxScope) mousePosition = maxScope

            // 设置前面元素的属性
            if (prevElementsToDo.length) {

              let toDoAttr

              if (prevHandleOffsetAttr)
                toDoAttr = mousePosition - prevHandleOffsetAttr - currentHandleAttr

              else
                toDoAttr = mousePosition - wrapOffsetAttr

              // 如果待分配的属性还大于最小属性之和，则分配
              if (toDoAttr > prevElementsMinAttrs) {

                // 平均值
                let average = toDoAttr / prevElementsToDo.length

                // 最大minwidth
                let prevElementsMinMaxAttr = Math.max.apply(null, elementsAttrs(prevElementsToDo, horizontal ? 'minWidth' : 'minHeight', true))

                // console.log(average, prevElementsMinMaxAttr)

                // 如果平均分配的值，大于其中任何一个拥有max-attr的元素，
                // 则给这个元素设置width为自己的maxattr，然后把剩下的给剩下的元素在均分

                // 如果平均分配的值大于最大的minwidth，则平均分配
                if (average >= prevElementsMinMaxAttr) {
                  prevElementsToDo.css(buildStyle, toDoAttr / prevElementsToDo.length)
                } else {
                  // 否则，开始特殊分配
                  // 给有minwidth的全部width设置为自己的minwidth
                  let notHasMinAttrElements = []
                  Array.from(prevElementsToDo).forEach(element => {
                    let minAttr = $(element).css(horizontal ? 'minWidth' : 'minHeight')
                    if (minAttr !== 'auto') {
                      $(element).css(horizontal ? 'width' : 'height', minAttr)
                    } else {
                      notHasMinAttrElements.push(element)
                    }
                  })
                  // 给没有minwidth的设置(toDoAttr - minwidth之和) / 自己数量
                  $(notHasMinAttrElements).css(buildStyle, (toDoAttr - prevElementsMinMaxAttr) / notHasMinAttrElements.length)
                  // console.log($(notHasMinAttrElements))
                }
              }
            }

            // 设置后面元素的宽度
            if (nextElementsToDo.length) {

              let toDoAttr

              if (nextHandleOffsetAttr)
                toDoAttr = nextHandleOffsetAttr - mousePosition
              else
                toDoAttr = warpClientAttr - (mousePosition - wrapOffsetAttr)

              toDoAttr -= currentHandleAttr

              // 如果toDoAttr还大于minwidth之和，则分配
              if (toDoAttr > nextElementsMinAttrs) {

                // 平均值
                let average = toDoAttr / nextElementsToDo.length

                // 最大minwidth
                let nextElementsMinMaxAttr = Math.max.apply(null, elementsAttrs(nextElementsToDo, horizontal ? 'minWidth' : 'minHeight', true))

                // console.log(average, nextElementsMinMaxAttr)

                // 如果平均分配的值大于最大的minwidth，则平均分配
                if (average >= nextElementsMinMaxAttr) {
                  nextElementsToDo.css(buildStyle, toDoAttr / nextElementsToDo.length)
                } else {
                  // 否则，开始特殊分配
                  // 给有minwidth的全部width设置为自己的minwidth
                  let notHasMinAttrElements = []
                  Array.from(nextElementsToDo).forEach(element => {
                    let minAttr = $(element).css(horizontal ? 'minWidth' : 'minHeight')
                    if (minAttr !== 'auto') {
                      $(element).css(horizontal ? 'width' : 'height', minAttr)
                    } else {
                      notHasMinAttrElements.push(element)
                    }
                  })
                  // 给没有minwidth的设置(toDoAttr - minwidth之和) / 自己数量
                  $(notHasMinAttrElements).css(buildStyle, (toDoAttr - nextElementsMinMaxAttr) / notHasMinAttrElements.length)
                  // console.log($(notHasMinAttrElements))
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
  .drag-handle.horizontal {
    cursor: e-resize;
  }
  .drag-handle.vertical {
    cursor: n-resize;
  }
  .drag-handle.disabled {
    opacity: .5;
    cursor: no-drop;
  }
</style>

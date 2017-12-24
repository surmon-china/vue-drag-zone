<template>
  <div class="drag-handle"
       @mousedown="handleMouseDown"
       :class="{ 
        'disabled': disabled,
        'horizontal': direction === 'horizontal',
        'vertical': direction === 'vertical'
      }">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'drag-handle',
    props: {
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        canDrag: false,
        todoContentsMaxSize: 0,
        mouseHandleOffsetPrev: 0,
        mouseHandleOffsetNext: 0,
        nextHandleOffsetPosition: 0,
      }
    },
    computed: {
      // 方向 direction, 1: 水平 horizontal  2: 垂直 vertical
      direction() {
        return this.$parent.options.direction
      },
      // 水平
      horizontal() {
        return this.direction === 'horizontal'
      },
      // 垂直
      vertical() {
        return this.direction === 'vertical'
      }
    },
    methods: {
      // 获取所有同级手柄组件
      getAllHandles() {
        return this.$parent.$children.filter(com => {
          return com.$vnode && 
                 com.$vnode.componentOptions && 
                 com.$vnode.componentOptions.tag === 'drag-handle'
        })
      },
      // 分割前面和后面的所有兄弟手柄组件
      getHandles() {
        const allHandles = this.getAllHandles()
        const prev = []
        const next = []
        let isSegmented = false
        allHandles.forEach(handle => {
          const isCurrent = handle === this
          isSegmented = isSegmented || isCurrent
          if (!isCurrent) {
            (isSegmented ? next : prev).push(handle)
          }
        })
        return { all: allHandles, prev, next }
      },
      // 分割前后相邻的兄弟手柄组件
      getHandle() {
        const allHandles = this.getAllHandles()
        let prev = null
        let next = null
        allHandles.forEach((handle, index) => {
          if (handle === this) {
            prev = allHandles[index - 1]
            next = allHandles[index + 1]
          }
        })
        return { prev, next }
      },
      // 获取所有的兄弟内容组件
      getAllContents() {
        return this.$parent.$children.filter(com => {
          return com.$vnode &&
                 com.$vnode.componentOptions &&
                 com.$vnode.componentOptions.tag === 'drag-content'
        })
      },
      // 分割前后相邻的兄弟内容组件
      getTodoContents() {
        const allComponents = this.$parent.$children
        const all = []
        const next = []
        let prev = []
        let isSegmented = false
        let isSegmentEnd = false
        allComponents.forEach(component => {
          const isCurrent = component === this
          isSegmented = isSegmented || isCurrent
          if (component.$vnode && component.$vnode.componentOptions) {
            if (component.$vnode.componentOptions.tag === 'drag-content') {
              all.push(component)
              if (!isSegmented) {
                prev.push(component)
              } else if (!isSegmentEnd) {
                next.push(component)
              }
            } else {
              if (!isCurrent) {
                (isSegmented) ? (isSegmentEnd = true) : prev = []
              }
            }
          }
        })
        return { all, prev, next }
      },
      // 获取尺寸属性
      getSize(element) {
        return element.getBoundingClientRect()[this.horizontal ? 'width' : 'height']
      },
      // 获取偏移位置属性
      getOffsetPosition(element) {
        return this[this.horizontal ? 'offsetLeft' : 'offsetTop'](element)
      },
      // 获取尺寸之和
      getSizePlus(components) {
        return components.reduce((size, component) => {
          return size + this.getSize(component.$el)
        }, 0)
      },
      // 获取前后尺寸的实时尺寸
      getLiveContentsSize() {
        const { 
          all: allContents,
          prev: prevContents,
          next: nextContents
        } = this.getTodoContents()
        const prevContentsSize = this.getSizePlus(prevContents)
        const nextContentsSize = this.getSizePlus(nextContents)
        const allContentsSize = prevContentsSize + nextContentsSize
        return { 
          all: allContentsSize,
          prev: prevContentsSize,
          next: nextContentsSize
        }
      },
      // 获取元素的纵坐标 
      offsetTop(element) { 
        let offset = element.offsetTop
        if(element.offsetParent != null) {
          offset += this.offsetTop(element.offsetParent)
        }
        return offset
      },
      // 获取元素的横坐标 
      offsetLeft(element) { 
        let offset = element.offsetLeft
        if(element.offsetParent != null) {
          offset += this.offsetLeft(element.offsetParent)
        }
        return offset
      },
      // 获取鼠标位置
      mousePosition(event) {
        return event[this.horizontal ? 'pageX' : 'pageY']
      },
      // 当前手柄尺寸
      handleSize() {
        return this.getSize(this.$el)
      },
      // 当前手柄位置
      handleOffsetPosition() {
        return this.getOffsetPosition(this.$el)
      },
      // 鼠标抬起事件
      handleMouseUp() {
        this.canDrag = false
        this.mouseHandleOffsetPrev = 0
        this.mouseHandleOffsetNext = 0
        this.nextHandleOffsetPosition = 0
        this.removeMouseEvents()
      },
      handleMouseDown(event) {
        
        // 更改状态
        this.canDrag = true

        // 基本属性
        const handleSize = this.handleSize()
        const mousePosition = this.mousePosition(event)
        const handleOffsetPosition = this.handleOffsetPosition()

        // 按下时确定最大宽度
        this.todoContentsMaxSize = this.getLiveContentsSize().all

        // 鼠标相对于当前手柄的偏移位置
        this.mouseHandleOffsetPrev = mousePosition - handleOffsetPosition
        this.mouseHandleOffsetNext = handleSize - this.mouseHandleOffsetPrev

        // 下一个手柄元素的绝对位置
        const { next: nextHandle } = this.getHandle()
        this.nextHandleOffsetPosition = nextHandle
                                        ? this.getOffsetPosition(nextHandle.$el)
                                        : this.getOffsetPosition(this.$parent.$el) + this.getSize(this.$parent.$el)

        // 绑定事件
        this.bindMouseEvents()
      },
      handleMouseMove(event) {

        // 若手柄为禁用或非点击状态则不做任何改变
        if (this.disabled || !this.canDrag) return false

        // 鼠标定位
        const mousePosition = this.mousePosition(event)

        // 活动手柄的位置
        const handleOffsetPosition = this.handleOffsetPosition()

        // 宿主容器的位置
        const parentOffsetPosition = this.getOffsetPosition(this.$parent.$el)

        // 相邻手柄
        const { prev: prevHandle, next: nextHandle } = this.getHandle()

        // 待处理的内容元素
        const { 
          all: allContents,
          prev: prevContents,
          next: nextContents
        } = this.getTodoContents()

        // 待处理的前面相邻内容区总尺寸 = 鼠标定位的位置 - 鼠标前偏移 - （前面相邻手柄的位置 + 尺寸）
        let todoPrevContentsSize = mousePosition - this.mouseHandleOffsetPrev - 
                                    (!prevHandle ? parentOffsetPosition : (
                                      this.getOffsetPosition(prevHandle.$el) + this.getSize(prevHandle.$el)
                                    ))
                                 
        
        // 待处理的后面相邻元素总尺寸 = 后面相邻手柄的位置 - 当前鼠标的位置 - 当前手柄相对鼠标的偏移值
        let todoNextContentsSize = this.nextHandleOffsetPosition - mousePosition - this.mouseHandleOffsetNext

        // 一些防溢出的处理
        if (todoPrevContentsSize < 0) {
          todoPrevContentsSize = 0
        }
        if (todoNextContentsSize < 0) {
          todoNextContentsSize = 0
        }
        if (todoPrevContentsSize > this.todoContentsMaxSize) {
          todoPrevContentsSize = this.todoContentsMaxSize
        }
        if (todoNextContentsSize > this.todoContentsMaxSize) {
          todoNextContentsSize = this.todoContentsMaxSize
        }

        /*
         * 处理前拦截
         * 前面元素的最大尺寸 ===（一个具体的值 || 移动区间 - 后面元素的最小尺寸）
         * 前面元素的最小尺寸 ===（一个具体的值 || 0）
         * 后面元素的最大尺寸 ===（一个具体的值 || 移动区间 - 前面元素的最小尺寸）
         * 后面元素的最小尺寸 ===（一个具体的值 || 0）
        */

        const prevContentsMinSizePlus = prevContents.reduce((plus, content) => plus + content.getMinSize(), 0)
        const nextContentsMinSizePlus = nextContents.reduce((plus, content) => plus + content.getMinSize(), 0)
        let prevContentsMaxSizePlus = prevContents.reduce((plus, content) => plus + content.getMaxSize(), 0)
        let nextContentsMaxSizePlus = nextContents.reduce((plus, content) => plus + content.getMaxSize(), 0)

        if (typeof prevContentsMaxSizePlus === 'string') {
          prevContentsMaxSizePlus = this.todoContentsMaxSize - nextContentsMinSizePlus
        }

        if (typeof nextContentsMaxSizePlus === 'string') {
          nextContentsMaxSizePlus = this.todoContentsMaxSize - prevContentsMinSizePlus
        }

        /*
         * 如果待操作的前面总尺寸 > 前面元素的最大尺寸
         * 如果待操作的前面总尺寸 < 前面元素的最小尺寸
         * 如果待操作的后面总尺寸 > 后面元素的最大尺寸
         * 如果待操作的后面总尺寸 < 后面元素的最小尺寸
        */

        if (todoPrevContentsSize > prevContentsMaxSizePlus ||
            todoPrevContentsSize < prevContentsMinSizePlus ||
            todoNextContentsSize > nextContentsMaxSizePlus ||
            todoNextContentsSize < nextContentsMinSizePlus) {
          // console.log('超出预期进行拦截')
          return false
        }

        // 更新所有元素
        const updateContentsSize = (contents, todoContentsSize) => {
          const average = todoContentsSize / contents.length          
          const todoContents = []
          const fixedContents = []
          let fixedContentsSize = 0
          contents.forEach(content => {
            const contentSize = this.getSize(content.$el)
            if (content.fixed) {
              fixedContentsSize += contentSize
              fixedContents.push(content)
            } else {
              const contentMinSize = content.getMinSize()
              const contentMaxSize = content.getMaxSize()
              const isMinSize = contentSize <= contentMinSize
              const isMaxSize = contentSize >= contentMaxSize
              content.isMinSize = isMinSize
              content.isMaxSize = isMaxSize
              if ((isMinSize && average < contentMinSize) || (isMaxSize && average > contentMaxSize)) {
                content.size = isMinSize ? contentMinSize : contentMaxSize
                fixedContentsSize += isMinSize ? contentMinSize : contentMaxSize
                fixedContents.push(content)
              } else {
                todoContents.push(content)
              }
            }
          })
          todoContents.forEach(component => {
            component.size = (todoContentsSize - fixedContentsSize) / todoContents.length
          })          
        }

        updateContentsSize(prevContents, todoPrevContentsSize)
        updateContentsSize(nextContents, todoNextContentsSize)
        // this.$nextTick(() => {
          // updateContentsSize(nextContents, this.todoContentsMaxSize - this.getLiveContentsSize().prev)
        // })
      },
      // 绑定事件
      bindMouseEvents() {
        document.addEventListener('mouseup', this.handleMouseUp)
        document.addEventListener('mousemove', this.handleMouseMove)
      },
      // 释放所有事件
      removeMouseEvents() {
        document.removeEventListener('mouseup', this.handleMouseUp)
        document.removeEventListener('mousemove', this.handleMouseMove)
      }
    }
  }
</script>

<style scoped>
  .drag-handle.horizontal {
    cursor: col-resize;
  }
  .drag-handle.vertical {
    cursor: row-resize;
  }
  .drag-handle.disabled {
    opacity: .5;
    cursor: no-drop;
  }
</style>

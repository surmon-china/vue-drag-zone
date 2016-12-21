<template>
  <div class="drag-zone">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'drag-zone',
    props: {
      options: {
        type: Object,
        default() {
          return {
            direction: 'horizontal'
          }
        }
      }
    }
  }
</script>

<style scoped>
  .drag-zone {}
</style>

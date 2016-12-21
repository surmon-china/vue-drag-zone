<template>
  <md-card>
    <md-card-actions v-md-ink-ripple>
      <div class="md-subhead">
        <span>Disabled Example</span>
      </div>
      <md-button class="md-icon-button"
                 target="_blank"
                 href="https://github.com/surmon-china/vue-drag-zone/tree/master/examples/02-example.vue">
        <md-icon>code</md-icon>
      </md-button>
    </md-card-actions>
    <md-card-media>
      <!-- drag-zone -->
      <drag-zone class="zone">
        <div class="item i1">item1</div>
        <drag-handle class="handle">H</drag-handle>
        <div class="item i2">item2</div>
        <div class="item i3">item3</div>
        <drag-handle class="handle">H</drag-handle>
        <div class="item i4">item4</div>
        <drag-handle class="handle" :disabled="disabledHandle">H</drag-handle>
        <div class="item i5">item5</div>
      </drag-zone>
    </md-card-media>
  </md-card>
</template>

<script>
  export default {
    data() {
      return {
        disabledHandle: true
      }
    },
    mounted() {
      setInterval(() => {
        this.disabledHandle = !this.disabledHandle
      }, 5000)
    }
  }
</script>

<style scoped>
  .zone {
    width: 100%;
    height: 500px;
    line-height: 180px;
    margin: 0 auto;
    position: relative;
    clear: both;
    text-align: center;
    color: white;
    background: #eee;
    display: flex;
    justify-content: space-between;
  }
  .zone .handle {
    width: 10px;
    height: 180px;
    background: #2196f3;
  }
  .zone .item {
    width: calc((100% - 30px) / 4);
    height: 180px;
    overflow: hidden;
  }
  .zone .item.i1 {
    background: #999;
  }
  .zone .item.i2 {
    background: #777;
  }
  .zone .item.i3 {
    background: #555;
  }
  .zone .item.i4 {
    background: #333;
  }
  .zone .item.i5 {
    background: #000;
  }
</style>

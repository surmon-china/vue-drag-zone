<template>
  <md-card>
    <md-card-actions>
      <div class="md-subhead">
        <span>Horizontal MinWidth and MaxWidth Example</span>
      </div>
      <md-button class="md-icon-button"
                 target="_blank"
                 href="https://github.com/surmon-china/vue-drag-zone/tree/master/examples/03-example.vue">
        <md-icon>code</md-icon>
      </md-button>
    </md-card-actions>
    <md-card-media>
      <!-- drag-zone -->
      <drag-zone class="zone">
        <div class="item i1">min 100px && max 30rem</div>
        <drag-handle class="handle"></drag-handle>
        <div class="item i2">item2</div>
        <drag-handle class="handle"></drag-handle>
        <div class="item i3">item3</div>
        <div class="item i4">min 50px</div>
        <drag-handle class="handle"></drag-handle>
        <div class="item i5">min 10em</div>
      </drag-zone>
    </md-card-media>
  </md-card>
</template>

<script>
  export default {
    data() {
      return {
      }
    }
  }
</script>

<style scoped>
  .zone {
    width: 100%;
    height: 180px;
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
    min-width: 100px;
    max-width: 30rem;
    background: #999;
  }
  .zone .item.i2 {
    background: #777;
  }
  .zone .item.i3 {
    background: #555;
  }
  .zone .item.i4 {
    min-width: 50px;
    background: #333;
  }
  .zone .item.i5 {
    min-width: 10em;
    background: #000;
  }
</style>

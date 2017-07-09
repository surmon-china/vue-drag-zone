<template>
  <md-card>
    <md-card-actions>
      <div class="md-subhead">
        <span>Vertical Nested Example</span>
      </div>
      <md-button class="md-icon-button"
                 target="_blank"
                 href="https://github.com/surmon-china/vue-drag-zone/tree/master/examples/05-example.vue">
        <md-icon>code</md-icon>
      </md-button>
    </md-card-actions>
    <md-card-media>
      <!-- drag-zone -->
      <drag-zone class="vertical-zone" :options="{ direction: 'vertical' }">
        <div class="item i1">item1</div>
        <drag-handle class="handle"></drag-handle>
        <div class="item i2">item2</div>
        <div class="item i3">item3</div>
        <drag-handle class="handle"></drag-handle>
        <div class="item i4">
        <drag-zone class="horizontal-zone">
          <div class="item i1">min 100px && max 30rem</div>
          <drag-handle class="handle"></drag-handle>
          <div class="item i2">item2</div>
          <drag-handle class="handle"></drag-handle>
          <div class="item i3">item3</div>
          <div class="item i4">min 50px</div>
          <drag-handle class="handle"></drag-handle>
          <div class="item i5">min 10em</div>
        </drag-zone>
        </div>
        <drag-handle class="handle"></drag-handle>
        <div class="item i5">item5</div>
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
  .vertical-zone {
    width: 100%;
    height: 500px;
    margin: 0 auto;
    position: relative;
    clear: both;
    text-align: center;
    color: white;
    background: #eee;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .vertical-zone >.handle {
    width: 100%;
    height: 10px;
    background: #2196f3;
  }
  .vertical-zone >.item {
    width: 100%;
    height: calc((100% - 30px) / 4);
    overflow: hidden;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vertical-zone >.item.i1 {
    background: #999;
  }
  .vertical-zone >.item.i2 {
    background: #777;
  }
  .vertical-zone >.item.i3 {
    background: #555;
  }
  .vertical-zone >.item.i4 {
    background: #333;
  }
  .vertical-zone >.item.i5 {
    background: #000;
  }
  .horizontal-zone {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    clear: both;
    text-align: center;
    color: white;
    background: #eee;
    display: flex;
    justify-content: space-between;
  }
  .horizontal-zone >.handle {
    width: 10px;
    height: 100%;
    background: #2196f3;
  }
  .horizontal-zone >.item {
    width: calc((100% - 30px) / 4);
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .horizontal-zone >.item.i1 {
    min-width: 100px;
    max-width: 30rem;
    background: #999;
  }
  .horizontal-zone >.item.i2 {
    background: #777;
  }
  .horizontal-zone >.item.i3 {
    background: #555;
  }
  .horizontal-zone >.item.i4 {
    min-width: 50px;
    background: #333;
  }
  .horizontal-zone >.item.i5 {
    min-width: 10em;
    background: #000;
  }
</style>

<template>
  <div class="m-container" id="m-container">
    <div :class="{start_div:centerFlag}" id="start_div">
      <slot name="start"></slot>
    </div>
    <div class="end_div" id="end_div">
      <slot name="end"></slot>
    </div>
  </div>
</template>

<script>
  import {Common} from 'js/base'
  export default {
    props:["initHeight","intervalTime","centerFlag"],
    computed: {
        container () {
            return document.getElementById("m-container");
        },
        start_div () {
            return document.getElementById("start_div");
        }
    },
    data(){
      return{
        "runTimer":-1,
        "topVal":0,
      }
    },
    methods:{
      start:function(){
        clearInterval(this.runTimer);
        let self = this;
        this.runTimer = setInterval(function(){
          self.topVal -= self.initHeight;
          self.container.style.marginTop = self.topVal+"px";
          if(self.topVal==-self.start_div.offsetHeight){
            self.topVal=0;
          }
        },self.intervalTime)
      },
      end:function(){
        clearInterval(this.runTimer);
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "~@/assets/scss/base/function";
  @import "~@/assets/scss/base/mixin.scss";
  .m-container{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .start_div{
    top: 0;
    height: 100%;
    @include center;

  }
</style>

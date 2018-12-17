<template>
  <div class="m-alert" id="m-alert" v-show='spinFlag'>
    <Spin fix v-show='spinFlag'>
        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
    </Spin>
  </div>
</template>

<script>
  import Spin from 'iview/src/components/spin/spin';
  import Icon from 'iview/src/components/icon/icon';

  import {Hub} from 'js/base'
  export default {
    data () {
        return {
            spinFlag:0,
        }
    },
    mounted: function () {
        let self = this;
        Hub.$on('spinShow',function(){
            self.spinFlag = 1;
        });
        Hub.$on('spinHide',function(){
            self.spinFlag = 0;
        });
    },
    methods:{
        spinShow:function(){
            this.spinFlag = 1;
        },
        spinHide:function(){
            this.spinFlag = 0;
        }
    },
    components: {
        Spin,
        Icon
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../assets/css/iview/iview.css";
  .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
      height: 100px;
      position: relative;
      border: 1px solid #eee;
  }
</style>

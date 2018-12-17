<template>
  <div name="fade">
    <!-- alert 弹窗 -->
    <div class="m-alert" id="m-alert" v-show="msgType">
        <div id="msgType" :style="msgType?animation:''"  class="msg-tips" :class="msgType" ><p>{{alertMsg}}</p></div>
    </div> 
    <!-- confirm 弹窗 -->
    <div class="g-confirm-alert" id="comfirm-alert" v-show="confirm.content">
        <!-- 背景遮罩层 -->
        <div class="g-confirm-cover" v-show='!confirm.noBgCover'></div>
        <!-- 内容框 -->
        <div class="g-confirm-warp">
            <!-- 关闭按钮 -->
            <div class="g-confirm-close" v-show="confirm.closeBtn" @click="cancel(confirm.close || confirm.cancelCallBack)"></div>
            <!-- 标题 -->
            <div class="g-confirm-tit" 
                :style="confirm.content?confirm.titStyle:''"  
                v-html="confirm.title" 
                v-if="confirm.title">
            </div>
            <!-- 消息框 -->
            <div class="g-confirm-content">
                <div v-html="confirm.content"></div>
            </div>
            <!-- 双按钮 -->
            <div class="g-confirm-btn" v-if="!confirm.onlyOneBtn">
                <div class="g-cbtn g-cancel" 
                    :style="confirm.content?confirm.cancelStyle:''" 
                    @click="cancel(confirm.cancelCallBack)"
                    v-html='confirm.cancelBtn || "取消"'>
                    </div>
                <div class="g-cbtn g-okey" 
                    :style="confirm.content?confirm.okeyStyle:''" 
                    @click="ok(confirm.okeyCallBack)"
                    v-html='confirm.okeyBtn || "确认"'>
                </div>
            </div>
            <!-- 单按钮 -->
            <div class="g-confirm-btn" v-else>
                <div class="g-cbtn g-okey" 
                    :style="confirm.content?confirm.okeyStyle:''" 
                    @click="ok(confirm.okeyCallBack)"
                    v-html='confirm.okeyBtn || "确认"'>
                </div>
            </div>            
        </div>
    </div>
  </div> 
</template>

<script>
import { Hub } from "js/base";
export default {
  data() {
    return {
        msgType: "",
        alertMsg: "",
        timer: -1,
        animation:'',
        confirm:'',
    };
  },
  methods: {
    show: function(type = "default", msg, _time = 3) {
        if(this.msgType) return;
        this.msgType = type ;
        this.alertMsg = msg;
        let self = this;
        let time = parseInt(_time) * 1000;
        clearTimeout(this.timer);
        this.animation={
            animation:"fadeOut " + time / 1000 + "s linear 0s 1",
        }
        this.timer = setTimeout(function() {
            self.msgType = "";
        }, time);
    },
    showConfirm:function(data,okey_fn,cancel_fn){
        this.reset();
        if(this.getDataType(data) == 'Object'){ //复杂弹窗
            this.setConfirmData(data);
        }else{ //简单消息框
            this.confirm = new Object();
            this.confirm['content'] = data;
            this.confirm['okeyCallBack'] = okey_fn;
            this.confirm['cancelCallBack'] = cancel_fn;           
        }
    },    
    ok: function(e) {
        if(this.confirm.okeyDisable) return;
        this.reset();
        if(typeof e == 'function'){
           e();
        }
    },
    cancel: function(e) {
        if(this.confirm.cancelDisable) return;
        this.reset();
        if(typeof e == 'function'){
           e();
        } 
    },
    reset:function(){
        this.setConfirmData();
    },
    setConfirmData(data = new Object()){ // 
        this.confirm = data;
        if(data.success &&　typeof (data.success) == 'function'){
            data.success(this);
        }
    },    
    getDataType(data){
        return Object.prototype.toString.call(data).match(/^\[object\s(.*)\]$/)[1];
    },
  },
  mounted: function() {
    let self = this;
    if(!Hub._events['alert']){
        Hub.$on("alert", function(type, msg, time) {
            self.show(type, msg, time);
        });
    }
    if(!Hub._events['confirm']){
        Hub.$on('confirm',function(data,okey_fn,cancel_fn){
            self.showConfirm(data,okey_fn,cancel_fn);
        });        
    }
  },
  components: {}
};
</script>

<style lang='scss'>
@import "~assets/scss/base/base";
.g-confirm-alert{
  position:fixed;
  width:100%;
  height:100%;
  top:0;
  left:0;
  z-index:999999991;
  @include center;
  .g-confirm-cover{
    position:absolute;
    width:100%;
    height:100%;
    top:0;
    left:0;
    z-index:1;
    background:rgba(0,0,0,0.3);
  }
  .g-confirm-warp{
    position:relative;
    width:px2rem(504);
    min-height:px2rem(300);
    z-index:2;
    background:#fff;
    border-radius:px2rem(30);
    .g-confirm-close{
        position:absolute;
        width:px2rem(43);
        height:px2rem(94);
        top:px2rem(-94);
        right:px2rem(43);
        background:url(./img/confirm-close.png) center top no-repeat;
        background-size:100% auto;
    }
    .g-confirm-tit{
        width:100%;
        height:px2rem(80);
        line-height:px2rem(80);
        text-align:center;
        font-size:px2rem(30);
        color:#333;
        border-bottom:1px solid #d9d9d9;
    }
    .g-confirm-content{
      padding:px2rem(40) px2rem(30);
      @include center;
      font-size:px2rem(28);
      color:#333;
      min-height:px2rem(220);
      position:relative;
      word-break:break-all;
      word-wrap: break-word;
      line-height:px2rem(40);
      text-align: justify;
    }
    .g-confirm-btn{
        width:100%;
        height:px2rem(80);
        position:relative;
        border-top:1px solid #d9d9d9;
        display:flex;
        align-items:center;
        font-size:px2rem(28);
        .g-cbtn{
          height:100%;
          display:flex;
          flex:1;
          align-items:center;
          justify-content: center;
          &.g-cancel{
            color:#999;
            border-right:1px solid #d9d9d9;
          }
          &.g-okey{
            color:#f52f3e;
          }

        }

    }

  }
}
.m-alert {
  position: fixed;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  z-index: 999999999;
  @include center;
  .msg-tips {
    max-width: px2rem(500);
    @include center;
    padding: px2rem(10) px2rem(20);
    border: 1px solid #d6ebff;
    background-color: #ebf5ff;
    font-size: px2rem(20);
    color: #333;
    border-radius: px2rem(7);
    opacity: 0;
    p {
      line-height: px2rem(30);
      word-break: break-all;
      position: relative;
      padding-left: px2rem(30);
    }
    p:before {
      position: absolute;
      content: "";
      top: px2rem(3);
      left: 0;
      width: px2rem(24);
      height: px2rem(24);
      background: url(./img/info-fill.svg) left center no-repeat;
      background-size: auto 100%;
    }
    &.default {
    }
    &.simpleSuccess {
      border: 1px solid #ccf5e0;
      background-color: #e6faf0;
      p:before {
        background: url(./img/success-fill.svg) left center no-repeat;
        background-size: auto 100%;
      }
    }
    &.simpleWarning {
      border: 1px solid #ffebcc;
      background-color: #fff5e6;
      p:before {
        background: url(./img/warn-fill.svg) left center no-repeat;
        background-size: auto 100%;
      }
    }
    &.simpleError {
      border: 1px solid #ffd6cc;
      background-color: #ffebe6;
      p:before {
        background: url(./img/error-fill.svg) left center no-repeat;
        background-size: auto 100%;
      }
    }
  }
}
@keyframes fadeOut {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

</style>

<template>
	<div class="scratch" id='canvasBox'>
		<canvas id="scratchCanvas" ></canvas>
	</div>
</template>

<script>
	import MaskImage from 'src/views/activity/semscratchregister/img/gua-mchen.png'
	export default {
		data(){
			return{

			}
		},
		props: ['options'],
		computed:{
			device:function(){
				return /android|iphone|ipad|ipod|webos|iemobile|opear mini|linux/i.test(navigator.userAgent.toLowerCase());
			},
			startEvtName:function(){
				return this.device?"touchstart":"mousedown";
			},
			moveEvtName:function(){
				return this.device?"touchmove":"mousemove";
			},
			endEvtName:function(){
				return this.device?"touchend":"mouseup";
			},		
		},
		mounted:function(){
			let self=this;
			this.scratchCard(self.options);
		},
		methods:{
	        scratchCard:function(opt){
	        	let self=this;
	        	let canvas=document.createElement('canvas');
	        	let canvasBox=document.getElementById('canvasBox');
	        	canvas.id='scratchCanvas';				
				if(document.getElementById("scratchCanvas")){
					document.getElementById("scratchCanvas").remove();					
				}				
				document.getElementById('canvasBox').appendChild(canvas);				
				let can = canvas.getContext("2d");
				let X = canvas.width;
				let Y = canvas.height;
				let area=X*Y;
				let scrapeNum = 0;
				let oImg = new Image();
				oImg.src =opt.MaskImage || MaskImage;
				oImg.onload = function(){
					can.beginPath();
					can.drawImage(oImg,0,0,X,Y);
					can.closePath();
				}				
				function touchMove(e){					
					e.preventDefault();
					let touchX=self.offSet(canvasBox).left;
					let touchY=self.offSet(canvasBox).top;
					let R=opt.radius || 20;
					let x = self.device?e.touches[0].pageX-touchX:e.pageX-touchX;
					let y = self.device?e.touches[0].pageY-touchY:e.pageY-touchY;
					can.beginPath();
					can.globalCompositeOperation = "destination-out";
					can.arc(x,y,R,0,Math.PI*2,false);
					can.fill();
					can.closePath();
					if(typeof(opt.touchMove)=='function'){
						opt.touchMove();
					}					
				}
				function touchStart(e){
					if(typeof(opt.touchStart)=='function'){
						opt.touchStart();
					}
					e.preventDefault();				
					canvas.addEventListener(self.moveEvtName,touchMove,false);								
				}
				function touchEnd(e){
					let drawData=can.getImageData(0,0,X,Y).data;//===获取像素值===						
					for(let i=3;i<drawData.length;i+=4){
						if(drawData[i]===0){							
							scrapeNum++;
						}
					}
					if(scrapeNum > area * 0.2){
				        can.clearRect(0, 0, X, Y);
				        canvas.removeEventListener(self.moveEvtName,touchMove,false);
				        if(typeof(opt.touchEnd)=='function'){
				        	opt.touchEnd();
				        }				        				        			        				        
				    }
				    					
				}
				// true  捕获 false  冒泡				
				canvas.addEventListener(self.startEvtName,touchStart,false);
				canvas.addEventListener(self.endEvtName,touchEnd,false);						

        	
	        },
	        offSet:function(target){
	        	let s={
	        		top:0,
	        		left:0
	        	}
	        	let parents=target.parentNode;
	        	let  t=target.offsetTop;
	        	let l=target.offsetLeft;
	        	function getOffsetTop(){
	        		if(parents!=document){
	        			t=t+parents.offsetTop;
	        			l=l+parents.offsetLeft;
	        			parents=parents.parentNode;
	        			getOffsetTop();
	        		}else{
	        			s.top=t;
	        			s.left=l;
	        			return s;
	        		}
	        	}
	        	getOffsetTop();
	        	return s;
	        },			
		},
	}
</script>

<style lang='scss' scoped>
	@import "~@/assets/scss/base/function";
	.scratch{
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 10;
		overflow: hidden;
		#scratchCanvas{
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
		}

	}
</style>
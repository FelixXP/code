;(function($) {
  $.fn.SSwiper = function(opts) {
  	var self = this;
	  var opts = opts || {};
	  var options = {
	    speed: 300,//滑动速度,slider自动滑动开始到结束的时间(ms)
	    autoPlay: 0,//自动切换的时间间隔(ms),不设定该参数slide不会自动切换
	    touchEvent:true,//是否允许触控滑动
	    startIndex: 0//起始索引(第一张为0)
	  }
	  $.extend(options,opts);

	  var	timer = null,
		  	swiper_wrap =  self.find(".swiper-wrap"),
		    slides =  self.find('.swiper-item'),
		  	len =  slides.length,
		  	winWidth =  this.width(),
      	index =  options.startIndex,
      	flag =  0, 
      	left =  0,
      	swipeRt =  false;


	  self.initSwiper = function(){
	  	swiper_wrap.css({
		    'width': winWidth*len,
		    'left': '-' + index*winWidth
		  });
		  if(options.autoPlay){ self.startSwiper(); }
		  if(options.touchEvent) { self.touchSwiper(); }
		  return this;
	  };

	  self.startSwiper = function(){
	    timer = setInterval(function(){
	      index++;
	      left = index*winWidth;
	      if (index == len) {
	        left = 0;
	        index = 0;
	      }
	      swiper_wrap.animate({
	        left: '-'+ left+'px'
	      },options.speed);
	    },options.autoPlay);
		  return this;
	  };

	  self.stopSwiper = function(){
	  	clearInterval(timer);
	  	return this;
	  };

	  self.touchSwiper = function(){
		  var startPosition = {},
		  		endPosition = {},
		  		originPosition = {};
		  swiper_wrap.on('touchstart',function(e){
		  	e.preventDefault();
		  	e.stopPropagation();
		    clearInterval(timer);
		    var touch = e.originalEvent.touches[0];
		    startPosition = {
		      x: touch.pageX
		    };
		    originPosition = {
		      x: touch.pageX
		    };
		  });
		  swiper_wrap.on('touchmove',function(e){
		  	e.preventDefault();
		  	e.stopPropagation();
		    var touch = e.originalEvent.touches[0];
		    if(flag){
		      startPosition.x = endPosition.x;
		    }
		    flag = 1;

		    endPosition = {
		      x: touch.pageX
		    }
		    swiper_wrap.css({
		      left: parseInt(swiper_wrap.css('left')) + (endPosition.x - startPosition.x) +'px'
		    });
		  });
		  swiper_wrap.on('touchend',function(e){
		  	e.preventDefault();
		  	e.stopPropagation();
		  	var distance = endPosition.x - originPosition.x;
		    //判断是否向右滑动
		    swipeRt = endPosition.x - originPosition.x > 0 ? true:false;
		    flag = 0;
		    var toleft;
		    if(Math.abs(distance) > winWidth*0.2 ){
		    	index += distance > 0 ? -1 : 1; //左滑加一，右滑减一
		    	toleft = '-'+index*winWidth + 'px';
		    }
		    else{
		    	toleft = 0;
		    }
		    
		    if( !swipeRt && index == len){//左滑动到最后一张
		      toleft = '-' + (len - 1) * winWidth + 'px';
		      index = len - 1
		    }else if(swipeRt && index == -1){//右滑动到最后一张
		      toleft = '0';
		      index = 0;
		    }

		    swiper_wrap.animate({left: toleft},options.speed);

		    if(options.autoPlay){  self.startSwiper(); }
			});
			return this;
	  }

	  self.swiperTo = function(i){//第一张为0
	  	if (i !== index && i >= 0 && i < len) {
	      swiper_wrap.animate({
	        left: '-'+ i*winWidth+'px'
	      },options.speed);
	  	}
	  	return this;
	  }

	  self.swiperNext = function(){
	  	if (index < len) {
		  	self.swiperTo(index+1);
		  	index += 1;
	  	}
	  	return this;
	  }

	  self.swiperPre = function(){
	  	if (index > 0) {
		  	self.swiperTo(index-1);
		  	index -= 1;
	  	}
	  	return this;
	  }

	  return self;
	}
})(jQuery);
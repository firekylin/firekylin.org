$(function(){
	$('#backTop').click(function(e) {
		e.preventDefault();
		$('html,body').animate({
			scrollTop: 0
		}, 700);
		return false;
	});
	$(document).click(function(event) {
		$('.wrapper-dropdown-3').removeClass('active');
		if(event.target.getAttribute('class') !== 'themestore active')	$('li.dropmenu').removeClass('active');
	});
	$('.dropmenu').click(function(e){
		$(this).toggleClass('active');
	});
	$('.search-bounce').click(function(){
		let $input = $(this).parent().find('input');
		let $btn = $(this).parent().find('button');
		$input[0].className = 'inlineBlock show';
		$btn[0].style.zIndex = '10';
		$input.focus();
	});
	$(document).click(function(event){
		//console.log(event.target);
		if(event.target != $('.search-bounce i')[1] && event.target != $('.search-input input')[1] && event.target != $('.search-input form')[1]){
			let $input2 = $('.search-input input'),
			    $btn2 = $('.search-input button');
			$input2[1].className = 'inlineBlock';
	                $btn2[1].style.zIndex = '-1';
		}
	});
	$('#order').click(function(event) {
		$('.dropdown')[0].focus();
	});
	window.onscroll=function(event) {
		$header = $('header');
		$nav = $('nav');
		if(document.body.scrollTop>$header.height()) $nav.fadeIn(300);
		else $nav.fadeOut(300);
	};
});
//DropDown组件
class DropDown{
	constructor(el){
			this.dd = el;
			this.placeholder = this.dd.children('span');
			this.opts = this.dd.find('ul.dropdown > li');
			this.val = '';
			this.index = -1;
			this.initEvents();
	}
	initEvents() {
		var obj = this;

		obj.dd.on('click', function(event){
			$(this).toggleClass('active');
			return false;
		});

		obj.opts.on('click',function(){
			var opt = $(this);
			obj.val = opt.text();
			obj.index = opt.index();
			obj.placeholder.text(obj.val);
		});
	}
	getValue() {
		return this.val;
	}
	getIndex() {
		return this.index;
	}
}
//Star Rank组件
class StarRank{
	constructor(options){
		if(options.container){
			this.container = document.querySelector(options.container);
			this.rankCustom = options.rankCustom || '';
			this.rank = Math.round(parseFloat(options.rank))-1 || 0;
			this.init();
		}
	}
	init(){
		let container = this.container;
		let stars = [];
		stars[0]=document.createElement('i');
		stars[0].setAttribute('class','fa fa-star-o');
		container.appendChild(stars[0]);
		for(let i=1;i<5;i++){
			stars[i] = stars[0].cloneNode(true);
			container.appendChild(stars[i]);
		}
		this.stars = stars;
		this.lightStar(this.rank);
		let self = this;
		let mouseoverHandler = evt=>{let idx = self.stars.indexOf(evt.target);self.lightStar(idx);},
			mouseleaveHandler = evt=>{self.lightStar(self.rank,self.stars);},
			clickHandler = evt=>{
				let idx = self.stars.indexOf(evt.target);
				self.rankFun(idx);
				self.stars.forEach((item,index,arr)=>{
					item.removeEventListener('mouseover',mouseoverHandler);
					item.removeEventListener('click',clickHandler);
				});
				container.removeEventListener('mouseleave',mouseleaveHandler)
			};
		stars.forEach((item,index,arr)=>{
			item.addEventListener('mouseover',mouseoverHandler);
			item.addEventListener('click',clickHandler);
		});
		container.addEventListener('mouseleave',mouseleaveHandler);
	}
	lightStar(index){
		for(let i=0;i<index+1;i++){
			this.stars[i].setAttribute('class','fa fa-star');
		}
		for(let j=index+1;j<this.stars.length;j++){
			this.stars[j].setAttribute('class','fa fa-star-o');
		}
	}
	rankFun(index){
		this.lightStar(index,this.stars)
		let self = this,
			res,
			orRank = this.rank;
		index++;
		if(this.rankCustom) {res = this.rankCustom(index);}
		if(res !== 'orRank')	{
			self.rank = res-1;
			setTimeout(self.lightStar(self.rank), 700);
		}
		else this.lightStar(orRank);
	}
}

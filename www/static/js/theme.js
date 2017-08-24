$(function(){
	//判断页面高度设置page
	let bodyH =document.body.offsetHeight,
		windowH = window.innerHeight,
		$page = $('.pages');
	if(bodyH < windowH)	$page[0].className = 'pages fixed-bottom';
	else $page[0].className = 'pages';
	//dropmenu初始化
	function ddActive($el,t){
		switch (t){
			case 'theme_downloadtimes': $el.text('popular');break;
			case 'theme_marking':$el.text('Liked');break;
			case 'theme_lastupdated':$el.text('Latest');break;
		}
	}
	//分页
	let url = window.location.pathname;
	let pattern = /\/page\/[a-zA-z0-9_]*/g,
		patternType = /\/type\/[a-zA-z0-9_]*/g,
		matches = url.match(pattern)?url.match(pattern)[0]:'/page/1',
		matchesType = url.match(patternType)?url.match(patternType)[0]:'/type/theme_downloadtimes',
		p = parseInt(matches.replace(/\/page\//,'')),
		t = matchesType.replace(/\/type\//,'');
	let $ddPage = $('#filter .order'),
		$dd = $('#dd'),
		dd = new DropDown($('#dd'));
		dd2 = new DropDown($('#dd2'));
	ddActive($('#dd2').find('span'),t);
	ddActive($dd.find('span'),t)
	$('.page').click(function(){
		let page = '/page/' + $(this).data('href');
		url = url.replace(pattern,'') + page;
		window.location.pathname = url;
	});
	$('.type').click(function(){
		let type = '/type/' + $(this).data('href');
		url = url.replace(patternType,'').replace(pattern,'')+type;//排序方式改变时，要跳回第一页
		window.location.pathname = url;
	});
	$('#previous').click(function(){
		if(p>1) --p;	else return;
		let page = '/page/'+p;
		url = url.replace(pattern,'') + page;
		window.location.pathname = url;
	});
	$('#next').click(function(){
		let totalPages = $(this).data('total');
		if(p<totalPages) ++p;	else return;
		page = '/page/'+p;
		url = url.replace(pattern,'') + page;
		window.location.pathname = url;
	});
	//分页active
	let liArr = Array.from(document.querySelectorAll('#page li'));
	let hrefArr = liArr.map((item,index)=>{
		return item.getAttribute('data-href');
	});
	setActive(hrefArr,liArr,liArr[1],p.toString());

	function setActive(dataArr,objArr,defaultObj,str){
		let flag = 0;
		dataArr.forEach((item,index)=>{
			objArr[index].setAttribute('class','');
			if(item === str) {objArr[index].setAttribute('class','active');flag++;}
		});
		if(flag === 0){
			defaultObj.setAttribute('class','active');
		}
	}
});

$(function(){
  //判断此主题是否为当前排序下的最前或最后
  let step = firstOrLast.value;
 /* if(step != 'first'){
 $('#stepBefore').removeAttr("disabled");
    let str = $.param({id:themeid.value,themename:encodeURIComponent($(themename).val()),step:'before'});
    beforeHandler = ()=>{$.post('/themes/index/step',str);}
    stepBefore.addEventListener('click',beforeHandler);
  }
  if(step != 'last'){
    $('#stepNext').removeAttr("disabled");
    let str2 = $.param({id:themeid.value,themename:encodeURIComponent($(themename).val()),step:'next'});
    nextHandler = ()=>{$.post('/themes/index/step',str2);}
    stepNext.addEventListener('click',nextHandler);
  }*/
if(step != 'first'){
    $('#stepBefore').removeAttr("disabled");
    stepBefore.setAttribute('href',`/themes/index/step/id/${themeid.value}/themename/${themename.value}/step/before`);
  }
  if(step != 'last'){
    $('#stepNext').removeAttr("disabled");
    stepNext.setAttribute('href',`/themes/index/step/id/${themeid.value}/themename/${themename.value}/step/next`);
  }
  let sr = new StarRank({
    container:'#star',
    rank:marking.innerText,
    rankCustom(index){
      let str = $.param({rank:index,themename:$('#themename').val()});
      let rank;
      $.ajax({
          url:'/themes/mytheme/rank',
          type:'POST',
          dataType:'JSON',
          data:str,
          async:false,
          success:function(res){
            if(!res.errno) {
              rank = Math.round(res.data.rank);
              marking.innerText = res.data.avg;
              num.innerText = res.data.num;
            }
            else{
              alert(res.errmsg);
              rank = 'orRank';
            }
          }
        });
      return rank;
    }
  });
  $('#download').click(function(){
      let filename = $(this).data('filename'),
          times = $(this).data('times');
      let str = $.param({filename:filename,times:times});
      $.ajax({
        url:'/themes/index/download',
        type:'POST',
        dataType:'JSON',
        data:str
      });
  });
  $('#deleteTheme').click(function(){
    if(confirm('Are you sure to delete this theme?')){
      let filesrc = encodeURIComponent($(this).data('filesrc'));
      let str = $.param({filesrc:filesrc,mmuid:thememmuid.value});
      $.ajax({
        url:'/themes/mytheme/delete',
        type:'POST',
        dataType:'JSON',
        data:str,
        success:function(e){
          if(!e.errno) {
            alert('Delete successfully!');
            window.location.pathname='/themes/index/index';
          }
          else alert('Delete failed, please try again！');
        }
      });
    }
  });
});

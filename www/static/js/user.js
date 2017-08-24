$(function(){
	$('#logout').click(function(){
		$.ajax({
			url:'/user/login/logout',
			type:'POST',
			dataType:'JSON',
			success:function(e){
				if(!e.errno) window.location.reload();
				else alert('注销失败，请重试！');
			}
		});
	});
});
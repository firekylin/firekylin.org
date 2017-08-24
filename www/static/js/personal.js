$(function(){
	$('form').submit(evt=>{
		evt.preventDefault();
		$.ajax({
			url: '/user/personal/update',
			type: 'POST',
			dataType: 'json',
			data: $('form').serialize(),
			success:res=>{
        		if(!res.errno) {
        			alert('Update Successfully！');
        			window.location.reload();
        		}
        		else alert(res.errmsg);
			}
		});
	});
	$('#inputNickname').bind('input propertychange',function(){
		let pattern = /^[0-9a-zA-Z_]{0,}$/;
		let res = !!$(this).val().match(pattern);
		if(!res) {
			$('form').attr('class','error');$('form').attr('disabled',true);
		}
		else {$('form').attr('class','');$('form').removeAttr('disabled');}
		//if(!res) {$('form').attr('class','error');$('form button').attr('disabled',true);}
		//else {$('form').attr('class','');$('form button').removeAttr('disabled');}
	});
});

$(function(){
    //文件上传
    $('#fileUpload').submit(function (e) {
        e.preventDefault();
        let data = new FormData($(this)[0]);
    	$.ajax({
            url: '/themestore/upload/theme',
            type: 'POST',
            data: data,
            async: false,  
            cache: false,  
            contentType: false,  
            processData: false,
            success:function (res) {
        		if(!res.errno){
                    if(res.data === "update") alert('This theme you have uploaded has been updated successfully!');
                    else if(res.data === "upload") alert('Upload successfully!');
                } 
        		else alert(res.errmsg);
        	}
    	});
    });
}); 
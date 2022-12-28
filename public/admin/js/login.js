// 登录页面入口函数
$(document).ready(function(){

var returnUrl = getQueryString('returnUrl');

var postPattern = /^[0-9a-zA-Z_]{4,10}$/;
// 点击按钮 登录
var tipObj = {
    trigger:"manual",
    title:"必须是4~10位数字、字母、_ ",
}
// $('[data-toggle="tooltip1"]').tooltip({
//     trigger:'manual',
// });
// $('[data-toggle="tooltip2"]').tooltip({
//     trigger:'manual'
// });
$('#loginBtn').on('click',function(){
    var usernameValue = $('#inputUsername').val().trim();
    var passwordValue = $('#inputPassword').val().trim();
    var isOk = true;
 
    $('form input').each(function(index,item){
        
        if(!$(item).val().trim()){
            $('[data-toggle="tooltip'+(index+1)+'"]').tooltip({
                trigger:'manual',
                title:$(item).parent().prev().text()+"不能为空!"
            });
            $('[data-toggle="tooltip'+(index+1)+'"]').tooltip('show');
            setTimeout(function(){ 
              $('[data-toggle="tooltip'+(index+1)+'"]').tooltip('destroy');  
            },2000) 
            isOk = false;        
    }
    if(!postPattern.test($(item).val().trim())){
            $('[data-toggle="tooltip'+(index+1)+'"]').tooltip({
                trigger:'manual',
                title:$(item).parent().prev().text()+"不符合条件!"
            });
            $('[data-toggle="tooltip'+(index+1)+'"]').tooltip('show');
            setTimeout(function(){ 
              $('[data-toggle="tooltip'+(index+1)+'"]').tooltip('destroy');  
            },2000)        
            isOk = false; 
    }
        
    })
    if(isOk){
        $.ajax({
            url:"/employee/employeeLogin",
            type:"post",
            data:{
                username:usernameValue,
                password:passwordValue
            },
            success:function(res){
                if(res.success){
                    $('.alert').addClass('alert-success').removeClass('alert-danger').text("登录成功!!").fadeIn();
                    setTimeout(function(){
                        location = returnUrl || "index.html";
                    },1000)
                } else {
                    $('.alert').addClass('alert-danger').removeClass('alert-success').text("登录失败!!"+res.message).fadeIn(2000);
                    setTimeout(function(){
                      $('.alert').fadeOut();
                    },2000)
                }
            }
        })       

    }
    return false;
})

  // 2.正则匹配获取----如果有多个参数 并且是无序的,用正则会更严谨...
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURI(r[2]);
    }
    return null;
  }

})
// 登录页面入口函数
$(document).ready(function(){

var returnUrl = getQueryString('returnUrl');

var postPattern = /^[0-9a-zA-Z_]{4,10}$/;
// 点击按钮 登录
$('#loginBtn').on('click',function(){
    $('[data-toggle="tooltip"]').tooltip();
    var usernameValue = $('#inputUsername').val().trim();
    var passwordValue = $('#inputPassword').val().trim();
    var isOk = true;
    $('form input').each(function(index,item){
        if(!$(item).val().trim()){
            alert($(item).parent().prev().text()+'是空值!');
            isOk = false;
            return;
        }
        if(!postPattern.test($(item).val().trim())){
            alert($(item).parent().prev().text()+'不符合条件!');
            isOk = false;
            return;            
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
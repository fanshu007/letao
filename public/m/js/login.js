$(document).ready(function(){

    
     // 请求之前show显示加载中效果 
     $('.loading-box').show();
    
    // 请求完成后hide隐藏加载中效果
    setTimeout(function(){
        $('.loading-box').hide();
    },1000);
    // 点击登录
    $('.btn-login').on('tap',function(){
        var userName = $('input[name=userName]').val().trim();
        var userPass = $('input[name=password]').val().trim();
        var userNamePattern = /^[a-zA-Z0-9_]{6,16}$/;
        var userPassPattern = /^[a-zA-Z0-9_]{6,10}$/;
        if (userName.length==0){
            mui.alert('请输入用户名','温馨提示');
            return;
        }
        if (userPass.length==0){
            mui.alert('请输入密码','温馨提示');
            return;
        }
        if(!userNamePattern.test(userName) || !userPassPattern.test(userPass)){
            mui.toast('请输入正确的用户名或者密码',{ duration:'3000ms', type:'div' });
        } else {
            $.ajax({
                url:"/user/login",
                type:"post",
                data:{
                    username: userName,
                    password: userPass
                },
                beforeSend: function() {
                    // 请求之前show显示加载中效果 
                    $('.loading-box').show();
                },
                // ajax请求完成后的回调函数
                complete: function() {
                    // 请求完成后hide隐藏加载中效果
                    setTimeout(function(){
                        $('.loading-box').hide();
                    },1000)
                },
                success: function(res){
                    if(res.success){
                        var returnUrl = getQueryString('returnUrl') || "user.html";
                        location = returnUrl;
                    } else {
                        mui.toast(res.message,{ duration:'3000ms', type:'div' })
                    }
                }
            })
        }
    })

    // 点击进入注册页面
    $('.btn-register').on('tap',function(){
        location.assign("register.html");
    })



})
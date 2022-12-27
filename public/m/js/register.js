$(document).ready(function () {

    
    // 请求之前show显示加载中效果 
    $('.loading-box').show();

    // 请求完成后hide隐藏加载中效果
    setTimeout(function(){
        $('.loading-box').hide();
    },1000);
    // 手机号码,用户名,密码的简单正则对象
    var phonePattern = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
    var userNamePattern = /^[a-zA-Z0-9_]{6,16}$/;
    var passwordPattern = /^[a-zA-Z0-9_]{6,16}$/;

    // 初始化滑动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 ,
        bounce: true 
    });
    
    // 点击--注册
    $(".btn-register").on("tap", function () {
      // 表单内的数据
        var phoneNumber = $("[name=mobile]").val().trim();
        var userName = $("[name=username]").val().trim();
        var password = $("[name=password]").val().trim();
        var comfirmPassword = $("[name=comfirmPassword]").val().trim();
        // var codeVerify = $("[name=vCode]").val().trim(); 
    // 判断是否有空值
    // switch (true) {
    //     case phoneNumber.length == 0 :
    //      mui.alert('手机号码不允许为空','提示');  
    //      return; 
    //     case userName.length == 0 :
    //      mui.alert('用户名不允许为空','提示');  
    //      return; 
    //     case password.length == 0 :
    //      mui.alert('密码不允许为空','提示'); 
    //      return;  
    //     case comfirmPassword.length == 0 :
    //      mui.alert('确认密码不允许为空','提示');   
    //      return;
    //     case verify.length == 0 :
    //      mui.alert('验证码不允许为空','提示');  
    //      return; 
    
    //     default:
    //         break;
    // }
    
    var fullCheck = true;
    mui(".mui-input-group input").each(function() {
        //若当前input为空，则alert提醒 
        if(!this.value || this.value.trim() == "") {
            var label = this.previousElementSibling;
            mui.alert(label.innerText + "不允许为空");
            fullCheck = false;
            return false;
        }
        }); //校验通过，继续执行业务逻辑 
        if(fullCheck){
            if(!phonePattern.test(phoneNumber)){
                mui.alert('您输入的手机号码不合法!','提示'); 
                return;
            }
            if(!userNamePattern.test(userName)){
                mui.alert('您输入的用户名不合法!','提示'); 
                return;
            }
            if(!passwordPattern.test(password)){
                mui.alert('您输入的密码不合法!','提示'); 
                return;
            }
            if(password!==comfirmPassword){
            mui.alert('您输入的密码不一致!','提示');
            return;  
            }
            // if(vCode!==codeVerify){
            // mui.alert('您输入的验证码错误!','提示');
            // return;  
            // }
            // 注册请求
            $.ajax({
                url:"/user/register",
                type:"POST",
                data:$('.mui-input-group').serialize(),
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
                success:function(res){
                    if(res.success){
                        mui.alert("账号注册成功!!");
                        location="login.html";
                    } else {
                        mui.alert(res.message,'注册失败'); 
                    }
                }
            })
        }
    // 判断各个值是否符合条件

  });

    // 点击--获取验证码
    $('.btn-get-verify').on('tap',function(){
        if(phonePattern.test($("[name=mobile]").val().trim()) ){
            var that = this;
            // 手机填写正确
            var seconds = 10;
            $(that).text("重新获取("+seconds+"s)");
            $(that).addClass('disabled');
            $('.mask').show();
            var timerID = setInterval(function(){
                seconds--;
                $(that).text("重新获取("+seconds+"s)");
                if(seconds==-1){
                    clearInterval(timerID);
                    $(that).text("获取验证码");
                    $(that).removeClass('disabled');
                    $('.mask').hide();
                }
            },1000);
            $.ajax({
                url:"/user/vCode",
                success:function(res){
                    mui.alert('【乐淘】移动商城 验证码:'+ res.vCode);
                    //  mui.toast('【乐淘】移动商城 验证码:'+res.vCode,{ duration:'5000ms', type:'div' });
                }
            })
        } else {
            mui.alert('您输入的手机号码不合法','提示'); 
        }
    })




  // 页面回退
  $("#back").on("tap", function () {
    history.back();
  });
});

$(document).ready(function(){

    initRender();

    // 初始化滑动功能
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        bounce: true
    });
    
    // 渲染页面
    function initRender(){
        $.ajax({
            url:"/user/queryUserMessage",
            beforeSend: function() {
                // 请求之前show显示加载中效果 
                $('.loading-box').show();
            },
            // ajax请求完成后的回调函数
            complete: function() {
                // 请求完成后hide隐藏加载中效果
                setTimeout(function(){
                    $('.loading-box').hide();
                },500)
            },
            success:function(res){
                if(res.error){
                    location = "login.html";
                } else {
                    $('#setting ul li:first-child').find('.user-name').text(res.username);
                    $('#setting ul li:first-child').find('.user-phone').text(res.mobile);
                }
            }
        })
    }

    // 点击 退出登录
    $('.btn-logout').on('tap',function(){
        $.ajax({
            url:"/user/logout",
            success:function(res){
                console.log(res);
                if(res.success){
                    location="login.html";
                } else {
                    mui.toast('退出失败',{ duration:'long', type:'div' }) 
                }
            }
        })        
    })


    // 页面回退
    $('#back').on('tap',function(){
        history.back();
    })

    
})
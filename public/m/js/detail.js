
// ----入口函数-----
$(function(){

// 获取查找产品的id
var productId = getQueryString('id');
// 渲染加载数据
renderPage(productId);

// 初始化页面滑动
mui('.mui-scroll-wrapper').scroll({
    indicators: true, //是否显示滚动条
    deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
    bounce: true //是否启用回弹
});

// 初始化轮播图
function initSlider(params) {
    mui('#banner .mui-slider').slider({
        interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
    });    
}

// 初始化 商品尺寸按钮点击切换
function initButtonTap(){
    $('.product-size').on('tap','.mui-btn',function(){
        if(!$(this).hasClass('mui-btn-warning')){
            $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
        }
    })  
}

// 渲染页面
function renderPage(id) {
    // 请求相应商品数据
    $.ajax({
        url:"/product/queryProductDetail",
        data:{
            id:id
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
        success:function(res){
            var result = res;
            var startSize = res.size.split('-')[0];
            var endSize = res.size.split('-')[1];
            var midSize = parseInt((endSize-startSize)/2)+parseInt(startSize);
            result['startSize'] = startSize;
            result['endSize'] = endSize;
            result['midSize'] = midSize;
            var html =template('tpl-main',result);
            $('#main .mui-scroll').html(html);
            initButtonTap();
            initSlider();
            mui('.mui-numbox').numbox();
        }
    })
    // 点击添加到购物车
    $('#addToCart').on('tap',function(){
        var productNum = $('.product-num').find('input').val();
        if(productNum==0){
            mui.toast('请选择数量',{ duration:'long', type:'div' }) 
            return;
        }
        var productSize = $('.product-size').children('.mui-btn-warning').text();
        $.ajax({
            url:"/cart/addCart",
            type:"POST",
            data:{
                productId:productId,
                num:productNum,
                size:productSize
            },
            success:function(res){
                if(res.success){
                    mui.toast('已添加至购物车!!',{ duration:'long', type:'div' });
                    $('#footer .fa-shopping-cart').addClass('add-to-cart');
                    // $('#footer .fa-shopping-cart').css({
                    //     color:'red',
                    //     transform:'rotate(-45deg) scale(2)',
                    //     transition:'all 1s'
                    // })
                } else {
                    mui.confirm("现在前往登录???","您还没登录!!",['确认','取消'],function(e){
                        
                        if(e.index==0){
                            location = "login.html?returnUrl="+location.href;
                        } else {
                          mui.toast('请登录后添加该商品~',{ duration:'long', type:'div' })   
                        }
                    });
                }
            },
            complete:function(){
                setTimeout(function(){
                    $('#footer .fa-shopping-cart').css({
                        color:'#333',
                        transform:'rotate(0deg) scale(1)',
                        transition:'all 1s'
                    })
                },2000)
            }
        })
    })
}

// 点击 页面回退
// $('#back').on('tap',function(){
//     history.back();
// })


})



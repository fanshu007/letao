
$(document).ready(function () {

    leftScroll();
    rightScroll();
    getLeftItem();
    getRightItem(1);
   



    // ----函数集合-----
    function leftScroll() {
        mui('.category-left .mui-scroll-wrapper').scroll({
            deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            indicators:false,
        });
    }
    function rightScroll() {
        mui('.category-right .mui-scroll-wrapper').scroll({
            deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            indicators:true,
        });
    }

    function getLeftItem() {
        $.ajax({
            url:"/category/queryTopCategory",
            success:function (res) { 
                var html = template('tpl-left',res);
                $('.category-left ul').html(html);
             }
        })
    }
    function getRightItem(id) {
        $.ajax({
            url:"/category/querySecondCategory",
            data: {id:id},
            beforeSend: function() {
                // 请求之前show显示加载中效果 
                $('.mui-backdrop').show();
            },
            // ajax请求完成后的回调函数
            complete: function() {
                // 请求完成后hide隐藏加载中效果
                $('.mui-backdrop').hide();
            },
            success:function (res) { 
                var html = template('tpl-right',res);
                $('.category-right .mui-row').html(html);
             }
        })
    }
     // mask遮罩层
    //  var mask = mui.createMask();//callback为用户点击蒙版时自动执行的回调；
    // function callback() { /////////加载怎么动态效果????????????????????????????????????????
    //     $('.mui-backdrop img').css({
    //         transform:'rotate(0deg)',
    //     })
    // }
    // 输入框聚焦时跳到search页面
    $('#search-text').on('focus',function(){
        location.assign('http://localhost:3000/m/search.html');
    })
    // 左侧点击获得内容
    
    $('.category-left ul').on('tap','li',function(){
        // mask.show();//显示遮罩      
        var id = $(this).data('id');
        $(this).addClass('active').siblings().removeClass('active');
        
        getRightItem(id);
    })        


    // 页面回退
    $('#back').on('tap',function(){
        history.back();
    })

  
});


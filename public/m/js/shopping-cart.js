$(document).ready(function(){

    renderPage(1,4);
    
     // 请求之前show显示加载中效果 
     $('.loading-box').show();
   
     // 请求完成后hide隐藏加载中效果
     setTimeout(function(){
         $('.loading-box').hide();
     },1000);
     // 初始化页面上下滑动
     mui('#main>.mui-scroll-wrapper').scroll({
            deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            indicators: false,
        });

    var remWidth =0.26667 * document.body.clientWidth;
    // 初始化 下拉刷新,上拉加载更多
    mui.init({
        pullRefresh : {
          container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            auto: false,//可选,默认false.首次加载自动下拉刷新一次
            color:'pink', //可选，默认“#2BD009” 下拉刷新控件颜色
            height:0.5*remWidth,//可选,默认50px.下拉刷新控件的高度,
            range:remWidth,
            contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback :pullDownFresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          },
          up : {
            height:0.5*remWidth,//可选.默认50.触发上拉加载拖动距离
            auto:false,//可选,默认false.自动上拉加载一次
            contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback :pullUpFresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          }
        }
      });
    
    //   点击生成订单
    $('#myOrder').on('tap',function(){
        var orderNum = $('.total-amount').children('span').text();
        if(orderNum=='0.00')return;
    })


    // 下拉刷新函数
    function pullDownFresh() {
        setTimeout(function(){
            renderPage(1,4);
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
        },1500)
    }
    var index = 1;
    var totalNum = 0;
    // 上拉加载更多函数
    var noMoreProduct = false;
    function pullUpFresh() {
        index++;
        setTimeout(function(){
            $.ajax({
                url:"/cart/queryCartPaging",
                data:{
                    page:index,
                    pageSize:4
                },
                success:function(res){
                    if(res.data){
                        totalNum += res.data.length;
                        console.log('totalNum:'+totalNum);
                        var html = template('tpl-li',res);
                        $('.mui-table-view').append(html);
                    } else {
                        noMoreProduct = true;
                    }
                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMoreProduct);
                }
            })
        },1500)
    }

    // 渲染某一页的信息
    function renderPage(page,pageSize) {
        $.ajax({
            url:"/cart/queryCartPaging",
            data:{
                page:page,
                pageSize:pageSize
            },
            success:function(res){
                if(res.error){
                    location = "login.html?returnUrl="+location.href;
                }
                if(res.data){
                    var html = template('tpl-li',res);
                    $('.mui-table-view').html(html);
                } else {
                    $('.mui-table-view').html("<h3>您的购物车空空如也~</h3>");
                    $('.empty-content').show();
                    $('#order').hide();
                    mui.toast('购物车还没有东西呢',{ duration:'long', type:'div' }); 
                }
            },

        })

    }
    
    // 点击--编辑某一个商品
    $('#refreshContainer .mui-table-view').on('tap','.edit-product',function(){
        // 获取数据
        var li = $(this).parents('li')[0];
        var productObj = $(this).data('product');
        var miniSize = productObj.productSize.split('-')[0];
        var maxSize = productObj.productSize.split('-')[1];
        var selectSize = productObj.size;
        var totalNum = productObj.productNum;
        var selectNum = productObj.num;
        var id = productObj.id;
        productObj['miniSize'] = miniSize ;
        productObj['maxSize'] = maxSize ;
        productObj['selectSize'] = selectSize ;
        productObj['totalNum'] = totalNum ;
        productObj['selectNum'] = selectNum ;
        var html = template('tpl-popover',productObj);
        
        mui.confirm(html.replace(/[\r\n\t]/g,''),"重选商品配置",["确定","取消"],function(e){
            if(e.index==0){
                // 要修改....
                selectSize = $('.product-size .mui-btn-warning').text();
                selectNum = mui('.product-num .mui-numbox').numbox().getValue();
                $.ajax({
                    url:"/cart/updateCart",
                    type:"POST",
                    data:{
                        id:id,
                        size:selectSize,
                        num:selectNum
                    },
                    success:function(res){
                        if(res.success){
                            var currentPrice = $(li).find('.current-price').text().substr(1);
                            var totalAccount = parseFloat(currentPrice*selectNum).toFixed(2);
                            $(li).find('.selected-size').text(selectSize);
                            $(li).find('.selected-num').text('x'+selectNum+'双');
                            $(li).find('input[name=checkbox]').data('total-account',totalAccount);
                            mui.toast('修改成功',{ duration:'long', type:'div' }) 
                        } else {
                            mui.toast('修改失败',{ duration:'long', type:'div' }) 
                        }
                    }
                })
            } 
            setTimeout(function(){
                mui.swipeoutClose(li);
            },0)
        });
        // 初始化两个组件
        mui('.mui-numbox').numbox();
        $('.product-size').on('tap','button',function(){
            $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
        })
        
        // 确定编辑
        // $('.btn-confirm').on('tap',function(){
        //     selectSize = $('.product-size .mui-btn-warning').text();
        //     selectNum = mui('.mui-numbox').numbox().getValue();
        //     $.ajax({
        //         url:"/cart/updateCart",
        //         type:"POST",
        //         data:{
        //             id:id,
        //             size:selectSize,
        //             num:selectNum
        //         },
        //         success:function(res){
        //             if(res.success){
        //                 var currentPrice = $(li).find('.current-price').text().substr(1);
        //                 var totalAccount = parseFloat(currentPrice*selectNum).toFixed(2);
        //                 $(li).find('.selected-size').text(selectSize);
        //                 $(li).find('.selected-num').text('x'+selectNum+'双');
        //                 $(li).find('input[name=checkbox]').val(totalAccount);
        //                 mui.toast('修改成功',{ duration:'long', type:'div' }) 
        //             } else {
        //                 mui.toast('修改失败',{ duration:'long', type:'div' }) 
        //             }
        //             mui('#popover').popover('hide',$('.btn-confirm')[0]);
        //             setTimeout(function(){
        //                 mui.swipeoutClose(li);
        //             },0)   
        //         }
        //     })
        // })
        // 取消编辑
        // $('.btn-cancel').on('tap',function(){
        //     mui('#popover').popover('hide',$('.btn-cancel')[0]);
        //     setTimeout(function(){
        //         mui.swipeoutClose(li);
        //     },0)

        // })
    })

    // 点击--删除 购物车某个商品
    $('#refreshContainer .mui-table-view').on('tap','.delete-product',function(){
        var id = $(this).data('id');
        var li = $(this).parents('li')[0];
        console.log(id);
            mui.confirm("您确定要删除这个商品吗?","温馨提示",["确定","取消"],function(e){
            if(e.index==0){
                // 要删除....
                $.ajax({
                    url:"/cart/deleteCart",
                    data:{
                        id:id
                    },
                    success:function (res) {
                        if(res.success){
                            renderPage(1,4);
                            mui.toast('删除成功',{ duration:'long', type:'div' }) 
                        } else {
                            mui.toast('删除失败',{ duration:'long', type:'div' }) 
                        }                        
                    }
                })
            } 
            setTimeout(function(){
                mui.swipeoutClose(li);
            },0)
        });
    })

    // 点击--生成订单总额
    $('#refreshContainer ul').on('change','input',function(){
        var totalAccount = 0;
        $('input:checked').each(function(index,item){
            totalAccount += parseFloat($(item).data('total-account')) ;
        })
        $('.total-amount i').text(parseFloat(totalAccount).toFixed(2));
    })
    
    // 页面回退
    $('#back').on('tap',function(){
        history.back();
    })

    
})
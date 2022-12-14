$(function(){

    // 获取 搜索关键词
    var keyword = decodeURI(location.search.split('=')[1]) ;
    $('#search-word').val(keyword);
    var searchArr = localStorage.getItem('searchArr')===null ? [] : JSON.parse(localStorage.getItem('searchArr') )  ; 
    // renderProducts(1,4,1,1,keyword);
    // 初始化 下拉和上拉控件
    mui.init({
        pullRefresh : {
          container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        //   down : {
        //     height:50,//可选,默认50.触发下拉刷新拖动距离,
        //     auto: true,//可选,默认false.首次加载自动下拉刷新一次
        //     contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        //     contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        //     contentrefresh : "正在拼命加载中...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        //     callback :pullfreshDown //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        //   },
          up : {
            height:50,//可选.默认50.触发上拉加载拖动距离
            auto:false,//可选,默认false.自动上拉加载一次
            contentrefresh : "数据正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback :pullfreshUp //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          }
        }
      });

    // 初始化 滑动控件
    mui('#main .mui-scroll-wrapper').scroll({
        indicators: true, //是否显示滚动条
        deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true //是否启用回弹
    });
    // 点击'<-'页面回退
    $('#back').on('tap',function(){
        history.back();
    })

    // --点击title 标题部分 更新数据
    $('.search-content-title .mui-col-xs-3').on('tap',function(){

        $(this).addClass('active').siblings().removeClass('active');
        // 是否 是升序
        var isAsc = true;
        if($(this).find('span').hasClass('mui-icon-arrowup')){
            $(this).find('span').removeClass('mui-icon-arrowup').addClass('mui-icon-arrowdown');
        } else {
            $(this).find('span').removeClass('mui-icon-arrowdown').addClass('mui-icon-arrowup');
            isAsc=false;
        }        
        if($(this).hasClass('launch-time') || $(this).hasClass('discount'))return;
        // 查询的种类
        if($(this).hasClass('price')){
            renderProducts(1,2,isAsc==true?1:2,'',''); 
        } else {
            // 库存量和销量是反比
            renderProducts(1,2,'',isAsc==true?2:1,''); 
        }
        
    })

    // 点击'搜索'按钮
    $('#iSearch').on('tap',function(){
        var searchWord = $('#search-word').val().trim();
        if(searchArr.indexOf(searchWord)!=-1){
            var index = searchArr.indexOf(searchWord);
            searchArr.splice(index,1);
        }
        searchArr.unshift(searchWord);
        localStorage.setItem('searchArr',JSON.stringify(searchArr));
        location.search='keyword='+searchWord;
    })
    // $('#search-word').on('keyup',function(e){
    //     if(e.keyCode==13 ){
    //         $('#iSearch').trigger('tap');
    //         return false;
    //     }  
    // })
    
    // 渲染产品列表
    
    function renderProducts(page,pageSize,price,num,proName,brandId) {
        $.ajax({
            url:"/product/queryProduct",
            data:{
                page:page,//第几页
                pageSize:pageSize, //每页的条数
                price:price, //价格,1是升序,2是降序
                num:num, // 库存,1是升序 2是降序
                proName:proName, //产品名称
                brandId:brandId, //品牌id
            },
            success:function(res){
                var html = template('tpl-xs-6',{list:res.data});
                $('.search-content-list .mui-row').html(html);
            }
        })        
    }
    

    // 下拉刷新 函数
    function pullfreshDown() {
        console.log('下拉刷新');
        // renderProducts(1,2,1,1,keyword);
        // location.reload();
    }

    var index = 0;
    // 上拉加载更多数据 函数
    function pullfreshUp() {
        console.log('上拉加载更多');
        // index+2;
        // renderProducts(1,index,1,1,keyword);
        // pullfreshUp=null;
    }




    

})
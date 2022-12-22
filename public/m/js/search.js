
$(document).ready(function(){

    
    // 请求之前show显示加载中效果 
    $('.loading-box').show();

    // 请求完成后hide隐藏加载中效果
    setTimeout(function(){
        $('.loading-box').hide();
    },1000)

    var searchArr = localStorage.getItem('searchArr')===null ? [] : JSON.parse(localStorage.getItem('searchArr') )  ; 
    showSearchList(searchArr);
    $('.mui-input-clear').trigger('focus');
    // --初始化搜索历史滑动
    mui('#main .mui-scroll-wrapper').scroll({
        deceleration: 0.0015 , //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        bounce: true ,
    });

    // [Event]: 点击 输入框的"X"
    $('.mui-icon-clear').on('click',function(){
        $(this).trigger('click');
    });    
    // [Event]: 点击'搜索'按钮
    $('#iSearch').on('tap',function(){
        // 如果是submit 无法阻止空值请求跳转,无法将关键词存入本地存储
        var searchText = $.trim($('.search-head input').val());
        if(!searchText)return;
        searchForward(searchText);
    })
    // 搜索框内回车
    $('.search-head input').on('keyup',function(e){
        if(e.keyCode==13){
            $('#iSearch').trigger('tap');
        }
    })

    // 【Event】: 点击'X'删除--本条记录
    $('.search-content ul').on('tap','.clear-history',function(){
        // 绑定index,会更容易找到索引
        var thisHistory = this.previousElementSibling.innerText ;
        var index = searchArr.indexOf(thisHistory);
        searchArr.splice(index,1);
        localStorage.setItem('searchArr',JSON.stringify(searchArr));
        showSearchList(searchArr);
        return false;
    })
    // [Event]: 点击--删除所有记录
    $('.search-content').on('tap','#clear-all-history',function(){
        searchArr=[];
        // localStorage.setItem('searchArr','[]');
        localStorage.removeItem('searchArr'); //clear会清空所有的键值对
        showSearchList(searchArr);
    })
    // 点击li 监听 触发搜索功能
    $('.search-content ul').on('tap','li:not(#search-head,#no-more-search)',function(e){
        // 阻止子元素 冒泡
        if($(e.target).hasClass('clear-history'))return;
        var thisHistory = $(this).children('.search-text').text();
        searchForward(thisHistory);
    })

    // [Event]:页面回退
    $('#back').on('tap',function(){
        history.back();
    })

    // [Function]: 渲染搜索记录
    function showSearchList(data) {
        // 倒序---前面用unshift 这里不用翻转了
        // var newArr1 = JSON.parse(JSON.stringify(data));
        var html = template('tpl-li',{list:data});
        $('.search-content ul').html(html);         
    }

    // [Function]: 搜索跳转到产品页面
    function searchForward(text) {
        var tempArr = searchArr.filter(function(value){
            return value !== text;
        })
        searchArr = tempArr ;
        searchArr.unshift(text);
        localStorage.setItem('searchArr',JSON.stringify(searchArr));
        showSearchList(searchArr);
        // 清空输入框
        $('.search-head input').val('');
        // 服务器修改了根目录就可能受到影响
        // location.assign('/m/productList.html?keywords='+text);
        // js放在search.html里面,所以和其他html是同级....加一个不一样的参数 避免浏览器读取缓存信息
        location = 'productList.html?keyword='+text+'&timestamp='+new Date().getTime();
    }
    // [Function]: 数组翻转
    // function reverseArr(arr){
    //     for(var i=0;i<arr.length/2;i++){
    //         var temp = arr[i];
    //         arr[i]=arr[arr.length-1-i];
    //         arr[arr.length-1-i] = temp;
    //     }
    //     return arr;
    // }
    
    

})


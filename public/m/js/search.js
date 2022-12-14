
$(document).ready(function(){

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
        var thisHistory = this.previousElementSibling.innerText ;
        var index = searchArr.indexOf(thisHistory);
        searchArr.splice(index,1);
        localStorage.setItem('searchArr',JSON.stringify(searchArr));
        showSearchList(searchArr);
        return false;
    })
    // [Event]: 点击删除--所有记录
    $('.search-content').on('tap','#clear-all-history',function(){
        searchArr=[];
        // localStorage.setItem('searchArr','[]');
        localStorage.removeItem('searchArr');
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

    // [Function]: 搜索跳转
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
        location.assign('http://localhost:3000/m/productList.html?keywords='+text);
    }
    // [Function]: 数组翻转
    function reverseArr(arr){
        for(var i=0;i<arr.length/2;i++){
            var temp = arr[i];
            arr[i]=arr[arr.length-1-i];
            arr[arr.length-1-i] = temp;
        }
        return arr;
    }

    

})


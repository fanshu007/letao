$(function () {
  // 获取 搜索关键词--
  // var keyword = decodeURI(location.search.split('=')[1].split('&')[0]) ;
  var keyword = getQueryString("keyword");
  renderProducts({});

  var searchArr =
    localStorage.getItem("searchArr") === null ? [] : JSON.parse(localStorage.getItem("searchArr"));
  
  // 初始化下拉,上拉功能
  mui.init({
    pullRefresh: {
      container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        height: '50', //可选,默认50.触发下拉刷新拖动距离,
        auto: false, //可选,默认false.首次加载自动下拉刷新一次
        contentdown: "你可以下拉", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh: "技师离您还有230米...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        callback: pullFreshDown, //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      },
      up: {
        height: 50, //可选.默认50.触发上拉加载拖动距离
        auto: false, //可选,默认false.自动上拉加载一次
        contentrefresh: "老夫正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
        contentnomore: "老夫是有底线的...", //可选，请求完毕若没有更多数据时显示的提醒内容；
        callback: pullfreshUp, //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      },
    },
  });
  //   下拉回调函数
  function pullFreshDown() {
    // 模拟定时器
    setTimeout(function () {
      $.ajax({
        url: "/product/queryProduct",
        data: {
            page: 1,
            pageSize: 2, 
            proName: keyword 
        },
        success: function (res) {
          var html = template("tpl-xs-6", res);
          $(".search-content-list .mui-row").html(html);
          mui("#refreshContainer").pullRefresh().endPulldownToRefresh();
        //   mui("#refreshContainer").pullRefresh().refresh(true);
          console.log("下拉完成");
        },
      });
    }, 1500);
  }
  var pageSize = 2;
  var totalSize = 0;
  //   上拉回调函数
  function pullfreshUp() {
    pageSize += 2;
    setTimeout(function () {
      $.ajax({
        url: "/product/queryProduct",
        data: { 
            page: 1,
            pageSize: pageSize, 
            proName: keyword 
            },
        success: function (res) {
          var html = template("tpl-xs-6", res);
          $(".search-content-list .mui-row").html(html);
          mui("#refreshContainer")
            .pullRefresh()
            .endPullupToRefresh(totalSize == res.data.length ? true : false);
          totalSize = res.data.length;
        },
      });
    }, 1500);
  }

  //    --初始化滑动功能--
  mui("#main .mui-scroll-wrapper").scroll({
    indicators: false, //是否显示滚动条
    deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
    bounce: true, //是否启用回弹
  });

  // 点击'<-'页面回退
  $("#back").on("tap", function () {
    history.back();
  });

  // --点击title 标题部分 更新数据
  $(".search-content-title .mui-col-xs-3").on("tap", function () {
    $(this).addClass("active").siblings().removeClass("active");
    // 是否 升序
    var isAsc = true;
    if ($(this).find("span").hasClass("mui-icon-arrowup")) {
      $(this)
        .find("span")
        .removeClass("mui-icon-arrowup")
        .addClass("mui-icon-arrowdown");
    } else {
      $(this)
        .find("span")
        .removeClass("mui-icon-arrowdown")
        .addClass("mui-icon-arrowup");
      isAsc = false;
    }
    if ($(this).hasClass("launch-time") || $(this).hasClass("discount")) return;
    // 查询的种类
    if ($(this).hasClass("price")) {
      // renderProducts(1,2,isAsc==true?1:2,'','');
      renderProducts({ pageSize: 2, price: isAsc == true ? 1 : 2 });
    } else {
      // 库存量和销量是反比
      // renderProducts(1,2,'',isAsc==true?2:1,'');
      renderProducts({ num: isAsc == true ? 2 : 1 });
    }
  });

  // 点击'搜索'按钮
  $("#iSearch").on("tap", function () {
    var searchWord = $("#search-word").val().trim();
    if (!searchWord) return;
    if (searchArr.indexOf(searchWord) != -1) {
      var index = searchArr.indexOf(searchWord);
      searchArr.splice(index, 1);
    }
    searchArr.unshift(searchWord);
    localStorage.setItem("searchArr", JSON.stringify(searchArr));
    location.search =
      "keyword=" + searchWord + "&timestamp=" + new Date().getTime();
    renderProducts({ proName: searchWord });
    return false;
  });

  // 渲染产品列表
  function renderProducts(params) {
    $.ajax({
      url: "/product/queryProduct",
      data: {
        page: params.page || 1, //第几页
        pageSize: params.pageSize || 2, //每页的条数
        price: params.price, //价格,1是升序,2是降序
        num: params.num, // 库存,1是升序 2是降序
        proName: params.proName || keyword, //产品名称
        brandId: params.brandId, //品牌id
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
      success: function (res) {
        var html = template("tpl-xs-6", res);
        $(".search-content-list .mui-row").html(html);
        totalSize = res.data.length;
      },
    });
  }

    // 点击立即购买
    $(".search-content-list .mui-row").on('tap','.btn-submit',function(){
        var id = $(this).data('id');
        location.assign('detail.html?id='+id);
    })
});

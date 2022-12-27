// $(function(){

userLogout();

// 用户退出
    function userLogout(){
        $('.logout').on('click',function(){
            $.ajax({
                url:"/employee/employeeLogout",
                success:function(res){
                    if(res.success){
                        location = "login.html?returnUrl="+location.href;
                    } else {
                        alert('退出失败--');
                    }
                }
            })
        })
    }

// 初始化分页插件
function initPagination(callback){
    $("#page").bootstrapPaginator({
        bootstrapMajorVersion:3, //对应的bootstrap版本
        currentPage: currentPage, //当前页数
        numberOfPages: 10, //每次显示页数
        totalPages:totalPages, //总页数
        shouldShowPage:true,//是否显示该按钮
        useBootstrapTooltip:true,
        //点击事件
        onPageClicked: function (event, originalEvent, type, page) {
            callback(page,initPageSize);
        }
    });  
}
// window.initPagination = initPagination ;

// })
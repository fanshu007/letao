    var initPageSize = 0;
    var currentPage = 1;
    var totalPages = 0;
    
$(function(){

    initRender(1,5);
    updateDisable();
    

 

// 初始化渲染
function initRender(page,pageSize){
    $.ajax({
        url:"/user/queryUser",
        data:{
            page:page,
            pageSize:pageSize
        },
        success:function(res){
            totalPages = Math.ceil(res.total/res.size);
            initPage = page;
            initPageSize = pageSize;
            var html = template('tpl-tr',res);
            $('table tbody').html(html);
            currentPage = res.page;
            initPagination(initRender);
        }
    })
}


// 修改禁用
function updateDisable() {
    $('tbody').on('click','.btn-disable',function(){
        var id = $(this).data('id');
        var isDelete = $(this).data('disable')==1? 0 : 1;
        $.ajax({
            url:"/user/updateUser",
            type:"post",
            data:{
                id:id,
                isDelete:isDelete
            },
            success:function(res){
                if(res.success){
                    initRender(initPage,initPageSize);
                } else {
                    alert('修改失败');
                }
            }
        })        
    }); 

}



})

var currentPage = 1;
var initPageSize = 0;
var totalPages = 0;

$(function(){
    initRender(1,5);
    updateTopCategory();


// 点击--保存添加 新分类
$('.btn-save1').on('click',function(){
    var cateName = $('#inputCate').val().trim();
    if(!cateName){
        alert('空值,可以作为分类吗?');
        return;
    }
    if(!/[\u4e00-\u9fa5]/.test(cateName) || cateName.length<3 || cateName.length>6){
        alert('请输入中文分类名 或者长度错误!!');
        return;
    }
    var isExist = false;
    $.ajax({
        url:"/category/queryTopCategory",
        success:function(res){
            var totalCateArr = res.rows;
            totalCateArr.forEach(function(item,index){
                if(cateName==item.categoryName){
                    isExist = true;
                }
            })
        if(isExist){
            $('#addCategory .alert').addClass('alert-danger').removeClass('alert-success').text('此分类已存在!!').fadeIn();
            setTimeout(function(){
            $('#addCategory .alert').fadeOut();
            },2000)
            return;
        }    
        $.ajax({
            url:"/category/addTopCategory",
            type:"post",
            data:{
                categoryName:cateName
            },
            success:function(res){
                if(res.success){
                    $('#addCategory .alert').addClass('alert-success').removeClass('alert-danger').text('分类添加成功!!').fadeIn();
                    setTimeout(function(){
                        $('#addCategory').modal('hide');
                        initRender(1,initPageSize);
                    },1000)
                } else {
                    $('#addCategory .alert').addClass('alert-danger').removeClass('alert-success').text('分类添加失败!!').fadeIn();
                    setTimeout(function(){
                    $('#addCategory .alert').fadeOut();
                    },2000)
                }

            }
        })                
        }
    })


})

// 初始化渲染
function initRender(page,pageSize){
    $.ajax({
        url:"/category/queryTopCategoryPaging",
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

// 修改分类
function updateTopCategory() {
    $('tbody').on('click','.btn-update',function(){
        var id = $(this).data('id');
        var isOldDelete = $(this).data('isdelete');
        var cateOldName = $(this).data('catename');
        $('#updateCategory').find('#cateId').val(id);
        $('#updateCategory').find('#inputCate').val(cateOldName);
        $('#updateCategory').find('#inputDelete').val(isOldDelete==1 ? 1 : 0 );
        $('#updateCategory').modal('show');
        saveTopCategory(id);
    }); 
}
// 点击--修改分类
function saveTopCategory(id){
    $('#updateCategory .btn-save2').on('click',function(){
        var cateNewName = $('#updateCategory').find('#inputCate').val().trim();
        var isNewDelete = $('#updateCategory').find('#inputDelete').val().trim();
        $.ajax({
            url:"/category/updateTopCategory",
            type:"post",
            data:{
                id:id,
                categoryName:cateNewName,
                isDelete:isNewDelete
            },
            success:function(res){
                if(res.success){
                    $('#updateCategory .alert').addClass('alert-success').removeClass('alert-danger').text('分类修改成功!!').fadeIn();
                    setTimeout(function(){
                        $('#updateCategory').modal('hide');
                        $('#updateCategory .alert').fadeOut();
                        initRender(1,initPageSize);
                    },1000)
                } else {
                    $('#updateCategory .alert').addClass('alert-danger').removeClass('alert-success').text('分类修改失败!!').fadeIn();
                    setTimeout(function(){
                      $('#updateCategory .alert').fadeOut();
                    },2000)
                }
                $('#updateCategory .btn-save2').off('click');
            }
        }) 
    })
}

})
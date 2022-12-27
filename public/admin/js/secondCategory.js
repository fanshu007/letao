var currentPage = 1;
var initPageSize = 0;
var totalPages = 0;

$(function(){

    initRender(1,5);
    addNewBrand();
    clearmyModal();

// 初始化渲染
function initRender(page,pageSize){
    $.ajax({
        url:"/category/querySecondCategoryPaging",
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


// 动态生成某些元素
function generateElement(arr,ele,parent){
    parent.empty();
    for(var i=0;i<arr.length;i++){
        var ele1 = document.createElement(ele);
        ele1.innerText = arr[i]['categoryName'];
        ele1.value = arr[i]['id'];
        parent.append($(ele1));
    }
}

// 添加/修改 品牌
function addNewBrand() {
    var id = 0;
    var picUpload = false;
    var isUpdate = false;
    // 点击 获取所有一级分类
    $('.main-content').on('click','.updateBrand,.addBrand',function(){
        var that = this ;
        // 添加/修改判断
        if($(this).hasClass('updateBrand')){
            isUpdate = true;
            id = $(this).data('id');
            // 填充二级分类的信息
            $('.btn-save').text('修改');
            $('#myModalLabel').text('编辑品牌');
            $('#inputIsdelete').val($(this).data('isdelete'));
            $('#inputBrand').val($(this).data('brandname'));
            $('.logo-display').find('span').text('分类图片还没修改!');
            $('.logo-display').find('img').attr('src',$(this).data('brandlogo'));
           
        } else {
            $('.btn-save').text('添加');
        }
        $.ajax({
            url:"/category/queryTopCategory",
            success:function(res){
                generateElement(res.rows,'option',$('#inputCate'));
                setTimeout(function(){
                    $('#inputCate').val($(that).data('categoryid') || 1);
                    $('#addBrand').modal('show');
                },0)
            }
        })
    })    
    
    // 图片预览(该接口是请求成功后 返回一个src!!!),change后要触发 上传图片请求
    $('#inputLogo').on('change',function(){
        // 用console.dir()才能查找到file所有元素信息
        var file1= $(this).prop('files')[0]; //获取input上传的图片数据
        if(!file1){
            alert("请选择一张图片");
            return;
        }
        // var url = window.URL.createObjectURL(file1); //得到blob对象路径, 可当成普通文件路径一样使用,赋值给src
        var formData = new FormData();
        formData.append('pic1',file1);
        $.ajax({
            url:"/category/addSecondCategoryPic",
            type:"post",
            processData: false, //防止序列化,转化成字符串
            contentType: false, //防止urlencode 编码
            data:formData,
            success:function(res){
                console.log(res);
                if(!res.picAddr){
                    alert('分类图片上传失败!!!');
                    return;
                } else {
                    $('.logo-display').children('img').attr('src',res.picAddr);
                    $('.upload-tips').text('分类图片上传成功!!').css({'color':'red'});
                    picUpload = true;
                }
            }
        })           
    }) 
    //  点击添加/修改分类
    $('.btn-save').on('click',function(){
        // 上传图片成功后 再上传其他信息
        var brandName = $('#inputBrand').val().trim();
        var categoryId = $('#inputCate').val();
        var isDelete = $('#inputIsdelete').val();
        var brandLogo = $('.logo-display').find('img').attr('src');
        if(!brandName || !categoryId || !$('#inputLogo').val() || !picUpload){
            alert('信息不全!无法提交!!');
            return;
        }
        var dataObj = {
                brandName:brandName,
                categoryId:categoryId,
                brandLogo:brandLogo,
                hot:1            
        }
        if(isUpdate){
           dataObj['isDelete'] = isDelete;
           dataObj['id'] = id;
        }
        // console.log(dataObj);
        $.ajax({
            url: isUpdate ? "/category/updateSecondCategory": "/category/addSecondCategory",
            type:"post",
            data:dataObj,
            success:function(res){
                if(res.success){
                    $('#addBrand .alert').addClass('alert-success').removeClass('alert-danger').text('操作成功!!').fadeIn();
                    setTimeout(function(){
                        $('#addBrand').modal('hide');
                        $('#addBrand .alert').fadeOut();
                        $('.logo-display').children().attr('src','images/default.png'); 
                        $('.upload-tips').text('分类图片还没上传!').css({'color':'#000'});
                        initRender(1,initPageSize);
                    },1000)
                } else {
                    $('#addBrand .alert').addClass('alert-danger').removeClass('alert-success').text('操作失败!!').fadeIn();
                    setTimeout(function(){
                      $('#addBrand .alert').fadeOut();
                    },2000)
                }
            }
        })
    })     
 
}

// 关闭弹窗 自动清空内容
function clearmyModal(){
    $('#addBrand').on('hidden.bs.modal', function (e) {
        $('#inputCate').val(1);
        $('#inputIsdelete').val(1);
        $('#inputBrand').val('');
        $('#inputLogo').val('');
        $('.logo-display').find('span').text('分类图片还没上传!');
        $('.logo-display').find('img').attr('src','images/default.png');    
        $('#myModalLabel').text('添加品牌');    
      })
}

})
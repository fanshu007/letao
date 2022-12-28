var currentPage = 1;
var initPageSize = 0;
var totalPages = 0;

$(function(){

    initRender(1,5);
    updateProduct();
    clearmyModal();

// 初始化渲染
function initRender(page,pageSize){
    $.ajax({
        url:"/product/queryProductDetailList",
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
        ele1.innerText = arr[i]['brandName'];
        ele1.value = arr[i]['id'];
        parent.append($(ele1));
    }
}


// 添加新品牌
function updateProduct() {
    var id = 0;
    var picUpload = false;
    var isUpdate = false;
    // 点击 获取所有一级分类
    $('.main-content').on('click','.updateProduct,.addProduct',function(){
        var that = this ;
        // 添加/修改判断
        if($(this).hasClass('updateProduct')){
            isUpdate = true;
            id = $(this).data('id');
            // 填充二级分类的信息  
            $('.btn-save').text('修改');
            $('#myModalLabel').text('编辑商品');
            $('#inputId').val(id);
            $('#inputOldprice').val($(this).data('oldprice'));
            $('#inputPrice').val($(this).data('price'));
            $('#inputNum').val($(this).data('num'));
            $('#inputStatus').val($(this).data('status'));
            $('#inputSize1').val($(this).data('size').split('-')[0]);
            $('#inputSize2').val($(this).data('size').split('-')[1]);
            $('#inputProductname').val($(this).data('proname'));
            $('#inputProductdesc').val($(this).data('prodesc'));
            $('.logo-display').find('span').text('分类图片还没修改!');
            
        } else {
            $('.btn-save').text('添加');
        }
        $.ajax({
            url:"/category/querySecondCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            success:function(res){
                generateElement(res.rows,'option',$('#inputBrandId'));
                setTimeout(function(){
                    $('#inputBrandId').val($(that).data('brandid'));
                    $('#updateProduct').modal('show');
                },0)
            }
        })
    })    
    
    // 图片预览(该接口是请求成功后 返回一个src!!!),change后要触发 上传图片请求
    $('#inputPicture').on('change',function(){
        // 用console.dir()才能查找到file所有元素信息
        var file1= $(this).prop('files')[0]; //获取input上传的图片数据,重选点'取消'会没有值
        if(!file1){
            alert("请选择一张图片");
            return;
        }
        var formData = new FormData();
        formData.append('pic1',file1);
        formData.append('pic2',file1);
        formData.append('pic3',file1);
        $.ajax({
            url:"/product/addProductPic",
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
                    $('.upload-tips').text('商品图片上传成功!!').css({'color':'red'});
                    picUpload = true;
                }
            }
        })           
    }) 
    //  点击添加/修改分类
    $('.btn-save').on('click',function(){
        // 上传图片成功后 再上传其他信息
        var proName = $('#inputProductname').val().trim();
        var oldPrice = $('#inputOldprice').val().trim();
        var price = $('#inputPrice').val().trim();
        var proDesc = $('#inputProductdesc').val().trim();
        var size = $('#inputSize1').val().trim()+'-'+$('#inputSize2').val().trim();

        var statu = $('#inputStatus').val().trim();
        var num = $('#inputNum').val().trim();
        var brandId = $('#inputBrandId').val().trim();
        // 这个数据上传会成功,但是数据库找不到数据
        var tempImgname = "041cb210-85f3-11ed-89fb-89e30bdf3f5c.jpeg";
        var pic = [
            {"picName":tempImgname,"picAddr":"/upload/brand/"+tempImgname},
            {"picName":tempImgname,"picAddr":"/upload/brand/"+tempImgname},
        ]
        
        // var brandLogo = $('.logo-display').find('img').attr('src');
        if(!proName || !oldPrice || !price || !proDesc || !size || !num || !brandId || !pic){
            alert('信息不全!无法提交!!');
            return;
        }
        // pic图片数组[{"picName":"24-1.png","picAddr":"product/24-1.png"},{"picName":"24-1.png","picAddr":"product/24-1.png"}]
        var dataObj = {
                proName:proName,
                oldPrice:oldPrice,
                price:price,
                proDesc:proDesc,
                size:size,
                statu:statu,
                num:num,
                brandId:brandId,
                pic:pic
        }
        // console.log(dataObj);
        // return;
        if(isUpdate){
           dataObj['id'] = id;
        }
        $.ajax({
            url: isUpdate ? "/product/updateProduct": "/product/addProduct",
            type:"post",
            data:dataObj,
            success:function(res){
                if(res.success){
                    $('#updateProduct .alert').addClass('alert-success').removeClass('alert-danger').text('操作成功!!').fadeIn();
                    setTimeout(function(){
                        $('#updateProduct').modal('hide');
                        $('#updateProduct .alert').fadeOut();
                        $('.logo-display').children().attr('src','images/default.png'); 
                        $('.upload-tips').text('分类图片还没上传!').css({'color':'#000'});
                        initRender(1,initPageSize);
                    },1000)
                } else {
                    $('#updateProduct .alert').addClass('alert-danger').removeClass('alert-success').text('操作失败!!').fadeIn();
                    setTimeout(function(){
                      $('#updateProduct .alert').fadeOut();
                    },2000)
                }
            }
        })
    })     
 
}
        
// 关闭弹窗 自动清空内容
function clearmyModal(){
    $('#updateProduct').on('hidden.bs.modal', function (e) {
        $('#inputId').val('');
        $('#inputProductname').val('');
        $('#inputOldprice').val('');
        $('#inputPrice').val('');
        $('#inputProductdesc').val('');
        $('#inputStatus').val(1);
        $('#inputSize1').val('');
        $('#inputSize2').val('');
        $('#inputNum').val('');
        $('.logo-display').find('span').text('分类图片还没上传!');
        $('.logo-display').find('img').attr('src','images/default.png');    
        $('#myModalLabel').text('添加商品');  
        $('#inputBrandId').val(1);
        
      })
}

})
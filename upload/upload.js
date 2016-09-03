$(function(){
  /**
   * 检查图片类型
   * @param  {string} picPath  [图片路径]
   * @param  {array } typeList [允许图片类型]
   * @return {boolean}
   */
  function checkType(picPath,typeList){
    var type = picPath.substring(picPath.lastIndexOf('.')+1,picPath.length).toLowerCase();
    if(typeList){
      if(typeList.indexOf(type)>=0){
        return true;
      }
      return false;
    }
    if( type != 'jpg' && type != 'bmp' && type != 'gif' && type != 'png'){
     return false;
    }
    return true;
  }
  /**
   * 新增图片预览
   * @param  {string} picURL [图片路径]
   * @param  {string} target [目标图片标签选择器]
   * @param  {object} $this  [input控件]
   */
  function previewPic(picURL,target,$this){
    var type = checkType(picURL);
    var target = $(target);
    
    if(type){
      if( $this.context.files && ($this.context.files)[0] ){
        var reader = new FileReader();
        reader.onload = function(evt){
          target.attr('src',evt.target.result);
        }
        reader.readAsDataURL($this.context.files[0]);
      }else{
        var file = $this[0];
        file.select();
        file.blur();
        var ieURL = document.selection.createRange().text;
        target.css({
          filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\''+ieURL+'\''
        })
      }
      $('.j-upload-cover').addClass('hide');
      $('.j-preview').removeClass('hide');
    }
  }

  // 绑定图片上传事件
  $(document).on('change','input[type="file"]',function(){
    var $this = $(this);
    var target = ".j-img-box img";
    previewPic($this.val(),target,$this);
    picType = "input";
    // checkSubmit()
  });
  //删除图片
  $('.j-preview .j-delete').on('click',function(){
    $(this).parents('.j-preview').addClass('hide');
    $('.tab-cover').find('input[type="file"]').val('');
    $('.tab-cover').find(".img-box img").attr('src','');
    $('.upload-cover').removeClass("hide");
    picType = "";
    // checkSubmit();
  });

  //拖拽上传
  $(".j-newpic").on({
    dragleave:function(e){//拖离
      e.preventDefault();
    },
    drop:function(e){//拖后放
      e.preventDefault();
      e.dataTransfer = e.originalEvent.dataTransfer;
      var fileList = e.dataTransfer.files; //获取文件对象
      if(fileList.length == 0){
          return false;
      }
      if(fileList[0].type.indexOf('image') === -1){ //检测文件是不是图片
          return false;
      }

      picType = "drop";
      picFile = fileList[0];
      var imgURL = window.URL.createObjectURL(fileList[0]);
      $(".j-img-box img").attr("src",imgURL);
      $(".j-preview").removeClass("hide");
      $(".upload-cover").addClass("hide");
      // checkSubmit();
    },
    dragenter:function(e){//拖进
      e.preventDefault();
    },
    dragover:function(e){//拖来拖去
      e.preventDefault();
    }
  });

  //表单验证
  // $.validate('.j-form');

  //提交表单
  $('.j-advert-confirm').on('click', function(e){
    e.preventDefault();
    if (!picType) {return false;}
    if (picType === "drop") {//拖拽上传
      var formData = new FormData($(".j-form")[0]);
      formData.append('advertisement[content]', picFile);
      $.ajax({
          url: '<%= management_advertisements_path %>',
          type: 'POST',
          cache: false,
          data: formData,
          processData: false,
          contentType: false
      }).done(function(res) {
        window.location.reload();
      }).fail(function(res) {});
    }
    else if (picType === "input") {//点击上传
      $('.j-form').submit();
    }
  })

  $('.search-icon').on('click', function(){
    $('.search-form').submit();
  })
});
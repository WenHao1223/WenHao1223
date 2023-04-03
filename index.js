$(window).scroll(() => {
    $("#news").css("height", $(document).width()*0.078 + parseFloat($(".section.content_news").css("top").slice(0,-2))+parseFloat($(".section.content_news").css("height").slice(0,-2)));
    if($("#news").css("height") < $(".col.img_news_settings").css("height")){
        $(".col.img_news_settings").css("height", $(".col.img_news_settings").css("height") - 20);
    }

    
    if($(".col_382.content_work").width()/$(window).width() > 0.6 ){
        $("img.content_work").addClass("show");
    } else {
        $("img.content_work").removeClass("show");
    }
});
// Create a reference under which you want to list
const storageRef = firebase.storage().ref().child('gallery');

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

function gallery(){
    if($("div.galleryCollection").attr("class").split(" ").includes("d-none")){
        $("div.galleryCollection").removeClass("d-none");
        $("#b_gallery").text("-");
        $("span.gallery").text("See Less");
        
        if($("ul.gallery.galleryCollection").html() == ""){
            // Find all the prefixes and items.
            storageRef.listAll().then((res) => {
                res.items.forEach((galleryRef) => {
                    galleryRef.getDownloadURL().then((url) => {
                        $("ul.gallery.galleryCollection").html($("ul.gallery.galleryCollection").html() + `<li class="gallery galleryCollection"><img class="gallery galleryCollection" src="${url}" alt="gallery" loading="lazy"></li>`);
                    })
                    .catch((error) => {
                        console.error("Error while getting download url - Gallery", error);
                    });
                });
            }).catch((error) => {
                console.error("Error while fetching list of images - Gallery", error);
            });
        }
    } else {
        $("div.galleryCollection").addClass("d-none");
        $("#b_gallery").text("+");
        $("span.gallery").text("See More");
    }
}
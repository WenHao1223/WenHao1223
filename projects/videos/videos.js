const db = firebase.firestore();
const storageRef = firebase.storage().ref().child('projects/videos');

$("#b_back").addClass("d-none");

// Load data from firebase
db.collection("public/projects/videos").orderBy("createdYear").get().then(async (videosRef) => {
    let indexNo = 1;
    videosRef.forEach((videoDoc) => {
        videoData = videoDoc.data();

        if (videoData["divStyle"] == "horizontal"){
            $(".navbar_section").html($(".navbar_section").html() + `<div class="card vertical"><div class="row"><div class="col-sm-12 col-md-12 col-lg-6"><iframe width="560" height="315" src="${videoData["link"]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" class="card-img-top" class="img-fluid" allowfullscreen></iframe></div><div class="col-sm-12 col-md-12 col-lg-5"><div class="card-body"><h3 class="card-title">${videoData['name']}<span class="card-subheader">(${videoData['createdYear']})</span></h3><p class="card-text">${videoData["positions"].join(", ")}</p><p class="card-text">${videoData['des']}</p><a href="https://www.youtube.com/watch?v=${videoData["link"].split("embed/")[1]}" target="_blank" class="card-link ${videoDoc.id}"><i>Watch in YouTube</i></a></div></div></div></div>`);
        }
        else if (videoData["divStyle"] == "fullScreen"){
            $(".navbar_section").html($(".navbar_section").html() + `<div class="card"><iframe width="560" height="315" src="${videoData["link"]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" class="card-img-top" allowfullscreen></iframe><div class="card-body"><h3 class="card-title">${videoData['name']}<span class="card-subheader">(${videoData['createdYear']})</span></h3><p class="card-text">${videoData["positions"].join(", ")}</p><p class="card-text">${videoData['des']}</p><a href="https://www.youtube.com/watch?v=${videoData["link"].split("embed/")[1]}" target="_blank" class="card-link ${videoDoc.id}"><i>Watch in YouTube</i></a></div></div>`);
        } else if (videoData["divStyle"] == "vertical") {
            if (indexNo % 2){
                $(".navbar_section").html($(".navbar_section").html() + `<div class="row"><div class="col-xl-6 xl_index_${indexNo}"><div class="card"><iframe width="560" height="315" src="${videoData["link"]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" class="card-img-top" allowfullscreen></iframe><div class="card-body"> <h3 class="card-title">${videoData['name']}<span class="card-subheader">(${videoData['createdYear']})</span></h3><p class="card-text">${videoData["positions"].join(", ")}</p><p class="card-text">${videoData['des']}</p><a href="https://www.youtube.com/watch?v=${videoData["link"].split("embed/")[1]}" target="_blank" class="card-link ${videoDoc.id}"><i>Watch in YouTube</i></a></div></div></div><div class="col-xl-6 xl_index_${++indexNo}"></div>`);
            } else {
                $(`.xl_index_${indexNo}`).html(`<div class="card"><iframe width="560" height="315" src="${videoData["link"]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" class="card-img-top" allowfullscreen></iframe><div class="card-body"> <h3 class="card-title">${videoData['name']}<span class="card-subheader">(${videoData['createdYear']})</span></h3><p class="card-text">${videoData["positions"].join(", ")}</p><p class="card-text">${videoData['des']}</p><a href="https://www.youtube.com/watch?v=${videoData["link"].split("embed/")[-1]}" target="_blank" class="card-link ${videoDoc.id}"><i>Watch in YouTube</i></a></div></div></div>`);
                indexNo++;
            }
        }

        $(".navbar_section").html($(".navbar_section").html() + `<p><a class="card-link text-white-50" data-bs-toggle="collapse" href="#readMore" role="button" aria-expanded="false" aria-controls="collapseExample">READ MORE</a><div class="collapse mt-3" id="readMore"><div class="card card-body text-bg-dark">${videoData["longEssay"]}</div></div></p>`);
    });

    $("#readMore").on('show.bs.collapse', function(){
        $("#readMore").prev().children().text("Show Less");
    });
    $("#readMore").on('hide.bs.collapse', function(){
        $("#readMore").prev().children().text("Read More");
    });
}).catch((error) => {
    console.error("Error getting list of documents inside videos:", error);
});
const db = firebase.firestore();
const storageRef = firebase.storage().ref().child('projects/innovations');

param = new URLSearchParams(window.location.search);
paramID = param.get("id");

// paramID is null
if(!paramID){
    $("#b_back").addClass("d-none");

    // Load data from firebase
    db.collection("public/projects/innovations").orderBy("createdYear").get().then(async (innovationsRef) => {
        let indexNo = 1;
        innovationsRef.forEach((innovationDoc) => {
            innovationData = innovationDoc.data();
    
            if (innovationData["divStyle"] == "horizontal"){
                $(".navbar_section").html($(".navbar_section").html() + `<div class="card vertical"><div class="row"><div class="col-sm-12 col-md-12 col-lg-4"><img src="" id="${innovationDoc.id}" alt="${innovationData['name']}" class="img-fluid"></div><div class="col-sm-12 col-md-12 col-lg-7"><div class="card-body"><h3 class="card-title">${innovationData['name']}<span class="card-subheader">(${innovationData['createdYear']})</span></h3><p class="card-text">${innovationData['des']}</p><a href="?id=${innovationDoc.id}" class="card-link"><i>Read More</i></a></div></div></div></div>`);
            }
            else if (innovationData["divStyle"] == "fullScreen"){
                $(".navbar_section").html($(".navbar_section").html() + `<div class="card"><img src="" id="${innovationDoc.id}" alt="${innovationData['name']}" class="card-img-top"><div class="card-body"><h3 class="card-title">${innovationData['name']}<span class="card-subheader">(${innovationData['createdYear']})</span></h3><p class="card-text">${innovationData['des']}</p><a href="?id=${innovationDoc.id}" class="card-link"><i>Read More</i></a></div></div>`);
            } else if (innovationData["divStyle"] == "vertical") {
                if (indexNo % 2){
                    $(".navbar_section").html($(".navbar_section").html() + `<div class="row"><div class="col-xl-6 xl_index_${indexNo}"><div class="card"><img src="" id="${innovationDoc.id}" alt="${innovationData['name']}" class="card-img-top"><div class="card-body"> <h3 class="card-title">${innovationData['name']}<span class="card-subheader">(${innovationData['createdYear']})</span></h3><p class="card-text">${innovationData['des']}</p><a href="?id=${innovationDoc.id}" class="card-link"><i>Read More</i></a></div></div></div><div class="col-xl-6 xl_index_${++indexNo}"></div>`);
                } else {
                    $(`.xl_index_${indexNo}`).html(`<div class="card"><img src="" id="${innovationDoc.id}" alt="${innovationData['name']}" class="card-img-top"><div class="card-body"> <h3 class="card-title">${innovationData['name']}<span class="card-subheader">(${innovationData['createdYear']})</span></h3><p class="card-text">${innovationData['des']}</p><a href="?id=${innovationDoc.id}" class="card-link"><i>Read More</i></a></div></div></div>`);
                    indexNo++;
                }
            }
    
            storageRef.child(innovationDoc.id+"/photo.png").getDownloadURL().then((photoURL) => {
                $(`img#${innovationDoc.id}`).attr("src", photoURL);
            }).catch((error) => {
                console.error("No such file - projects/innovations: ", error);
            });
        });
    }).catch((error) => {
        console.error("Error getting list of documents inside innovations:", error);
    });    
} else {
    $("#b_back").removeClass("d-none");

    db.collection("public/projects/innovations").doc(paramID).get().then((docSpecific) => {
        if (docSpecific.exists) {
            docSpecificData = docSpecific.data();

            $(".navbar_section").html($(".navbar_section").html() + `<div class="card"><img src="" id="${paramID}" alt="${paramID}" class="card-img-top"><div class="card-body"><h3 class="card-title">${docSpecificData["name"]}<span class="card-subheader">(${docSpecificData["createdYear"]})</span></h3><p class="card-text">${docSpecificData["des"]}</p><a class="card-link" data-bs-toggle="collapse" href="#readMore" role="button" aria-expanded="false" aria-controls="collapseExample"><i>Read More</i></a><div class="collapse mt-3" id="readMore"><div class="card card-body text-bg-dark">${docSpecificData["longEssay"]}</div></div><div class="row mt-3" style="width: calc(100vw - var(--padding) * 2);"><div class="col col-md-12"><ul class="list-group list-group-horizontal mb-3 horizontal_scrollbar"></ul><ul class="list-group list-group-horizontal mb-3 horizontal_scrollbar"></ul></div><div class="col col-md-12"></div></div></div></div>`);

            storageRef.child(paramID+"/photo.png").getDownloadURL().then((photoURL) => {
                $(`img#${paramID}`).attr("src", photoURL);
            }).catch((error) => {
                console.error("No such file - projects/innovations with ID of", paramID, ": ", error);
            });
            
            const gallery = {"first":"images", "last": "attachments"};
            for(let i = 0; i < Object.keys(gallery).length; i++){
                for(let j = 0; j < (docSpecificData[gallery[Object.keys(gallery)[i]]] != undefined? docSpecificData[gallery[Object.keys(gallery)[i]]].length : 0); j++){
                    eval(`$(".list-group").${Object.keys(gallery)[i]}()`).html(eval(`$(".list-group").${Object.keys(gallery)[i]}()`).html() + `<li class="list-group-item"><iframe src="https://drive.google.com/file/d/${docSpecificData[gallery[Object.keys(gallery)[i]]][j]}/preview" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe></li>`);
                }
            }

        } else {
            console.error("No such file - projects/innovations with ID of", paramID);
            $(".navbar_section").html("File not found.");
        }
    }).catch((error) => {
        console.error("Error getting collection - innovations:", error);
    });
    
    $("#readMore").on('show.bs.collapse', function(){
        $("#readMore").prev().children().text("Show Less");
    });
    $("#readMore").on('hide.bs.collapse', function(){
        $("#readMore").prev().children().text("Read More");
    });
}
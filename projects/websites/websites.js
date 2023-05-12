const db = firebase.firestore();
const storageRef = firebase.storage().ref().child('projects/websites');

$("#b_back").addClass("d-none");

// Load data from firebase
db.collection("public/projects/websites").orderBy("createdYear").get().then(async (websitesRef) => {
    let indexNo = 1;
    websitesRef.forEach((websiteDoc) => {
        websiteData = websiteDoc.data();

        if (websiteData["divStyle"] == "horizontal"){
            $(".navbar_section").html($(".navbar_section").html() + `<div class="card vertical"><div class="row"><div class="col-sm-12 col-md-12 col-lg-4"><img src="" id="${websiteDoc.id}" alt="${websiteData['name']}" class="img-fluid"></div><div class="col-sm-12 col-md-12 col-lg-7"><div class="card-body"><h3 class="card-title">${websiteData['name']}<span class="card-subheader">(${websiteData['createdYear']})</span><span class="btn pe-none ms-2 ${websiteDoc.id}">${websiteData["status"]}</span></h3><p class="card-text">${websiteData['des']}</p><a href="${websiteData["link"]}" target="_blank" class="card-link ${websiteDoc.id}"><i>Visit Website</i></a></div></div></div></div>`);
        }
        else if (websiteData["divStyle"] == "fullScreen"){
            $(".navbar_section").html($(".navbar_section").html() + `<div class="card"><img src="" id="${websiteDoc.id}" alt="${websiteData['name']}" class="card-img-top"><div class="card-body"><h3 class="card-title">${websiteData['name']}<span class="card-subheader">(${websiteData['createdYear']})</span><span class="btn pe-none ms-2 ${websiteDoc.id}">${websiteData["status"]}</span></h3><p class="card-text">${websiteData['des']}</p><a href="${websiteData["link"]}" target="_blank" class="card-link ${websiteDoc.id}"><i>Visit Website</i></a></div></div>`);
        } else if (websiteData["divStyle"] == "vertical") {
            if (indexNo % 2){
                $(".navbar_section").html($(".navbar_section").html() + `<div class="row"><div class="col-xl-6 xl_index_${indexNo}"><div class="card"><img src="" id="${websiteDoc.id}" alt="${websiteData['name']}" class="card-img-top"><div class="card-body"> <h3 class="card-title">${websiteData['name']}<span class="card-subheader">(${websiteData['createdYear']})</span><span class="btn pe-none ms-2 ${websiteDoc.id}">${websiteData["status"]}</span></h3><p class="card-text">${websiteData['des']}</p><a href="${websiteData["link"]}" target="_blank" class="card-link ${websiteDoc.id}"><i>Visit Website</i></a></div></div></div><div class="col-xl-6 xl_index_${++indexNo}"></div>`);
            } else {
                $(`.xl_index_${indexNo}`).html(`<div class="card"><img src="" id="${websiteDoc.id}" alt="${websiteData['name']}" class="card-img-top"><div class="card-body"> <h3 class="card-title">${websiteData['name']}<span class="card-subheader">(${websiteData['createdYear']})</span><span class="btn pe-none ms-2 ${websiteDoc.id}">${websiteData["status"]}</span></h3><p class="card-text">${websiteData['des']}</p><a href="${websiteData["link"]}" target="_blank" class="card-link ${websiteDoc.id}"><i>Visit Website</i></a></div></div></div>`);
                indexNo++;
            }
        }
        
        if(websiteData["link"] == "" | websiteData["link"] == undefined){
            $(`a.${websiteDoc.id}`).addClass("text-muted");
            $(`a.${websiteDoc.id}`).addClass("pe-none");
        }

        const status = {"Published": "success", "Developing": "warning", "Planning": "danger"};
        $(`.btn.pe-none.${websiteDoc.id}`).addClass(`btn-${status[websiteData["status"]]}`);

        storageRef.child(websiteDoc.id+".png").getDownloadURL().then((photoURL) => {
            $(`img#${websiteDoc.id}`).attr("src", photoURL);
        }).catch((error) => {
            console.error("No such file - projects/websites: ", error);
            storageRef.child("stayTuned.png").getDownloadURL().then((photoURL) => {
                $(`img#${websiteDoc.id}`).attr("src", photoURL);
            }).catch((error) => {
                console.error("No such file - projects/websites - stayTuned.png: ", error);
                
            });
        });
    });
}).catch((error) => {
    console.error("Error getting list of documents inside websites:", error);
});
const db = firebase.firestore();
const storageRef = firebase.storage().ref().child('projects/websites');

$("#b_back").addClass("d-none");

// Load data from firebase
db.collection("public/projects/websites").orderBy("createdYear").get().then(async (websitesRef) => {
    let indexNo = 1;
    websitesRef.forEach((websitesDoc) => {
        // console.log(websitesDoc.id, "=>", websitesDoc.data());
        websitesData = websitesDoc.data();

        if (websitesData["divStyle"] == "horizontal"){
            $(".navbar_section").html($(".navbar_section").html() + `<div class="card vertical"><div class="row"><div class="col-sm-12 col-md-12 col-lg-4"><img src="" id="${websitesDoc.id}" alt="${websitesData['name']}" class="img-fluid"></div><div class="col-sm-12 col-md-12 col-lg-7"><div class="card-body"><h3 class="card-title">${websitesData['name']}<span class="card-subheader">(${websitesData['createdYear']})</span><span class="btn pe-none ms-2 ${websitesDoc.id}">${websitesData["status"]}</span></h3><p class="card-text">${websitesData['des']}</p><a href="${websitesData["link"]}" target="_blank" class="card-link ${websitesDoc.id}"><i>Visit Website</i></a></div></div></div></div>`);
        }
        else if (websitesData["divStyle"] == "fullScreen"){
            $(".navbar_section").html($(".navbar_section").html() + `<div class="card"><img src="" id="${websitesDoc.id}" alt="${websitesData['name']}" class="card-img-top"><div class="card-body"><h3 class="card-title">${websitesData['name']}<span class="card-subheader">(${websitesData['createdYear']})</span><span class="btn pe-none ms-2 ${websitesDoc.id}">${websitesData["status"]}</span></h3><p class="card-text">${websitesData['des']}</p><a href="${websitesData["link"]}" target="_blank" class="card-link ${websitesDoc.id}"><i>Visit Website</i></a></div></div>`);
        } else if (websitesData["divStyle"] == "vertical") {
            if (indexNo % 2){
                $(".navbar_section").html($(".navbar_section").html() + `<div class="row"><div class="col-xl-6 xl_index_${indexNo}"><div class="card"><img src="" id="${websitesDoc.id}" alt="${websitesData['name']}" class="card-img-top"><div class="card-body"> <h3 class="card-title">${websitesData['name']}<span class="card-subheader">(${websitesData['createdYear']})</span><span class="btn pe-none ms-2 ${websitesDoc.id}">${websitesData["status"]}</span></h3><p class="card-text">${websitesData['des']}</p><a href="${websitesData["link"]}" target="_blank" class="card-link ${websitesDoc.id}"><i>Visit Website</i></a></div></div></div><div class="col-xl-6 xl_index_${++indexNo}"></div>`);
            } else {
                $(`.xl_index_${indexNo}`).html(`<div class="card"><img src="" id="${websitesDoc.id}" alt="${websitesData['name']}" class="card-img-top"><div class="card-body"> <h3 class="card-title">${websitesData['name']}<span class="card-subheader">(${websitesData['createdYear']})</span><span class="btn pe-none ms-2 ${websitesDoc.id}">${websitesData["status"]}</span></h3><p class="card-text">${websitesData['des']}</p><a href="${websitesData["link"]}" target="_blank" class="card-link ${websitesDoc.id}"><i>Visit Website</i></a></div></div></div>`);
                indexNo++;
            }
        }

        
        if(websitesData["link"] == "" | websitesData["link"] == undefined){
            console.log(websitesDoc.id);
            $(`a.${websitesDoc.id}`).addClass("text-muted");
            $(`a.${websitesDoc.id}`).addClass("pe-none");
        }

        const status = {"Published": "success", "Developing": "warning", "Planning": "danger"};
        $(`.btn.pe-none.${websitesDoc.id}`).addClass(`btn-${status[websitesData["status"]]}`);

        storageRef.child(websitesDoc.id+".png").getDownloadURL().then((photoURL) => {
            $(`img#${websitesDoc.id}`).attr("src", photoURL);
        }).catch((error) => {
            console.error("No such file - projects/websites: ", error);
            storageRef.child("stayTuned.png").getDownloadURL().then((photoURL) => {
                $(`img#${websitesDoc.id}`).attr("src", photoURL);
            }).catch((error) => {
                console.error("No such file - projects/websites - stayTuned.png: ", error);
                
            });
        });
    });
}).catch((error) => {
    console.error("Error getting list of documents inside websites:", error);
});    
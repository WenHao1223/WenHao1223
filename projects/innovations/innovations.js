const db = firebase.firestore();
const storageRef = firebase.storage().ref().child('projects/innovations');

// Load data from firebase
db.collection("public/projects/innovations").orderBy("createdYear").get().then(async (innovationsRef) => {
    let indexNo = 1;
    innovationsRef.forEach((innovationDoc) => {
        // console.log(innovationDoc.id, "=>", innovationDoc.data());
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
    console.error("Error getting list of documents inside innovations: ", error);
});
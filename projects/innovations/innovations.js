const db = firebase.firestore();
const storageRef = firebase.storage().ref().child('projects/innovations');

db.collection("public/projects/innovations").get().then(async (innovationsRef) => {
    innovationsRef.forEach((innovationDoc) => {
        // console.log(innovationDoc.id, "=>", innovationDoc.data());
        innovationData = innovationDoc.data();

        if (innovationData["divStyle"] == "horizontal"){
            $(".navbar_section").html($(".navbar_section").html() + `<div class="card"><div class="row"><div class="col-sm-12 col-md-12 col-lg-4"><img src="" id="${innovationDoc.id}" alt="${innovationData['name']}" class="img-fluid"></div><div class="col-sm-12 col-md-12 col-lg-7"><div class="card-body"><h3 class="card-title">${innovationData['name']}<span class="card-subheader">(${innovationData['createdYear']})</span></h3><p class="card-text">${innovationData['des']}</p><a href="?id=${innovationDoc.id}" class="card-link"><i>Read More</i></a></div></div></div></div>`);
        }
        else if (innovationData["divStyle"] == "fullScreen"){
            $(".navbar_section").html($(".navbar_section").html() + `<div class="card"><img src="" id="${innovationDoc.id}" alt="${innovationData['name']}" class="card-img-top"><div class="card-body"><h3 class="card-title">${innovationData['name']}<span class="card-subheader">(${innovationData['createdYear']})</span></h3><p class="card-text">${innovationData['des']}</p><a href="?id=${innovationDoc.id}" class="card-link"><i>Read More</i></a></div></div>`);
        }

        storageRef.child(innovationDoc.id+".png").getDownloadURL().then((photoURL) => {
            console.log("loaded");
            $(`img#${innovationDoc.id}`).attr("src", photoURL);
        }).catch((error) => {
            console.error("No such file - projects/innovations: ", error);
        });
    });
}).catch((error) => {
    console.error("Error getting list of documents inside innovations: ", error);
});

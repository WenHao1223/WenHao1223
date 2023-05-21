const db = firebase.firestore();
const firestoreRef = db.collection("public/achievements/academic");
const storageRef = firebase.storage().ref().child('achievements/academic');

ls_school = [], ls_year = [];
firestoreRef.orderBy("year").get().then(async (querySnapshot) => {
    await querySnapshot.forEach((doc) => {
        ls_school.push(doc.data()["school"]);
        ls_year.push(doc.data()["year"]);
    });
    ls_school = Array.from(new Set(ls_school)).sort();
    ls_year = Array.from(new Set(ls_year)).reverse();

    load_ls();
}).catch((error) => {
    console.error("Error getting list of documents inside query snapshot of academic:", error);
});

$(".btn-group").change(function(){
    load_ls();
});

function load_ls(){
    card_html = "";
    for(let i = 0; i < eval("ls_"+$("input[name='btnradio']:checked")[0].id).length; i++){
        firestoreRef.where($("input[name='btnradio']:checked")[0].id, "==", eval("ls_"+$("input[name='btnradio']:checked")[0].id)[i]).get().then(async (querySnapshot) => {
            card_html += `<h3 class="header mt-4 mb-4">${eval("ls_"+$("input[name='btnradio']:checked")[0].id)[i]}</h3><div class="row g-0">`;
            await querySnapshot.forEach(async (academicDoc) => {
                academicData = academicDoc.data();
        
                card_html += `<div class="col col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12"><div class="card"><img id="${academicDoc.id}" src="" class="card-img-top" alt="${academicData["name"]}"><div class="card-body"><h5 class="card-title">${academicData["name"]}</h5><p class="card-text">📃 ${academicData["result"]}<br></p></div></div></div>`;

                storageRef.child(academicDoc.id+".png").getDownloadURL().then((photoURL) => {
                    $(`img#${academicDoc.id}`).attr("src", photoURL);
                }).catch((error) => {
                    firebase.storage().ref('achievements/null.png').getDownloadURL().then((photoURL) => {
                        $(`img#${academicDoc.id}`).attr("src", photoURL);
                        $(`img#${academicDoc.id}`).addClass("d-sm-none");
                        $(`img#${academicDoc.id}`).addClass("d-md-block");
                    }).catch((error) => {
                        console.error("null.png not found: ", error);
                    });
                });
            });
            card_html += `</div>`;
            
            // Bootstrap tooltip
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
            $(".content").html(card_html);
        })
        .catch((error) => {
            console.error("Error getting documents of school / year of query snapshot of academic: ", error);
        });
    }
}
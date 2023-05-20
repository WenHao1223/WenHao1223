const db = firebase.firestore();
const firestoreRef = db.collection("public/achievements/society");
const storageRef = firebase.storage().ref().child('achievements/society');

ls_club = [], ls_year = [];
firestoreRef.orderBy("year").get().then(async (querySnapshot) => {
    await querySnapshot.forEach((doc) => {
        ls_club.push(doc.data()["club"]);
        ls_year.push(doc.data()["year"]);
    });
    ls_club = Array.from(new Set(ls_club)).sort();
    ls_year = Array.from(new Set(ls_year)).reverse();

    load_ls();
}).catch((error) => {
    console.error("Error getting list of documents inside query snapshot of society:", error);
});

$(".btn-group").change(function(){
    load_ls();
});

function load_ls(){
    card_html = "";
    for(let i = 0; i < eval("ls_"+$("input[name='btnradio']:checked")[0].id).length; i++){
        firestoreRef.where($("input[name='btnradio']:checked")[0].id, "==", eval("ls_"+$("input[name='btnradio']:checked")[0].id)[i]).get().then(async (querySnapshot) => {
            card_html += `<h3 class="header mt-4 mb-4">${eval("ls_"+$("input[name='btnradio']:checked")[0].id)[i]}</h3><div class="row g-0">`;
            await querySnapshot.forEach(async (societyDoc) => {
                societyData = societyDoc.data();
        
                card_html += `<div class="col col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12"><div class="card"><img id="${societyDoc.id}" src="" class="card-img-top" alt="${societyData["name"]}"><div class="card-body"><h5 class="card-title">${societyData["name"]}</h5><p class="card-text">`;

                award_dict = {"Gold": "🥇", "Silver": "🥈", "Bronze": "🥉", "Participation": "📃"};
                for(let i = 0; i < societyData["award"].length; i++){
                    if(societyData["award"][i] in award_dict){
                        card_html += award_dict[societyData["award"][i]];
                    } else {
                        card_html += `🏆`;
                    }
                    card_html += ` ${societyData["award"][i]}<br>`;
                }

                card_html += `</p></div></div></div>`;

                storageRef.child(societyDoc.id+".png").getDownloadURL().then((photoURL) => {
                    $(`img#${societyDoc.id}`).attr("src", photoURL);
                }).catch((error) => {
                    firebase.storage().ref('achievements/null.png').getDownloadURL().then((photoURL) => {
                        $(`img#${societyDoc.id}`).attr("src", photoURL);
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
            console.error("Error getting documents of club / year of query snapshot of society: ", error);
        });
    }
}
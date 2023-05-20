const db = firebase.firestore();
const firestoreRef = db.collection("public/achievements/competitions");
const storageRef = firebase.storage().ref().child('achievements/competitions');

// Load data from firebase
// firestoreRef.orderBy("year").get().then(async (competitionsRef) => {
//     card_html = $(".content").html() + `<div class="row g-0">`;
//     competitionsRef.forEach((competitionDoc) => {
//         competitionData = competitionDoc.data();
        
//         card_html += `<div class="col col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12"><div class="card"><img id="${competitionDoc.id}" src="" class="card-img-top" alt="${competitionData["name"]}"><div class="card-body"><h5 class="card-title">${competitionData["name"]}</h5><p class="card-text">`;

//         award_dict = {"Gold": "🥇", "Silver": "🥈", "Bronze": "🥉"};
//         if(competitionData["award"] in award_dict){
//             card_html += award_dict[competitionData["award"]];
//         } else {
//             card_html += `🏆`;
//         }

//        card_html += ` ${competitionData["award"]}</p><p class="card-text card_t_comp"><i>${competitionData["teammates"].join(", ")}</i><br><i>Project won: ${competitionData["proj"]}</i></p></div></div></div>`;

//         storageRef.child(competitionDoc.id+".png").getDownloadURL().then((photoURL) => {
//             $(`img#${competitionDoc.id}`).attr("src", photoURL);
//         }).catch((error) => {
//             console.error("No such file - achievements/competitions: ", error);
//         });
//     });
//     card_html += `</div>`;
//     $(".content").html(card_html);

//     // Bootstrap tooltip
//     const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
//     const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
// }).catch((error) => {
//     console.error("Error getting list of documents inside competitions:", error);
// });

ls_level = [], ls_year = [];
firestoreRef.orderBy("year").get().then(async (querySnapshot) => {
    await querySnapshot.forEach((doc) => {
        ls_level.push(doc.data()["level"]);
        ls_year.push(doc.data()["year"]);
    });
    ls_level = Array.from(new Set(ls_level)).sort();
    ls_year = Array.from(new Set(ls_year)).reverse();

    load_ls();
}).catch((error) => {
    console.error("Error getting list of documents inside query snapshot of competitions:", error);
});

$(".btn-group").change(function(){
    load_ls();
});

function load_ls(){
    card_html = "";
    for(let i = 0; i < eval("ls_"+$("input[name='btnradio']:checked")[0].id).length; i++){
        firestoreRef.where($("input[name='btnradio']:checked")[0].id, "==", eval("ls_"+$("input[name='btnradio']:checked")[0].id)[i]).get().then(async (querySnapshot) => {
            card_html += `<h3 class="header mt-4 mb-4">${eval("ls_"+$("input[name='btnradio']:checked")[0].id)[i]}</h3><div class="row g-0">`;
            await querySnapshot.forEach(async (competitionDoc) => {
                competitionData = competitionDoc.data();
        
                card_html += `<div class="col col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12"><div class="card"><img id="${competitionDoc.id}" src="" class="card-img-top" alt="${competitionData["name"]}"><div class="card-body"><h5 class="card-title">${competitionData["name"]}</h5><p class="card-text">`;

                award_dict = {"Gold": "🥇", "Silver": "🥈", "Bronze": "🥉", "Participation": "📃"};
                for(let i = 0; i < competitionData["award"].length; i++){
                    if(competitionData["award"][i] in award_dict){
                        card_html += award_dict[competitionData["award"][i]];
                    } else {
                        card_html += `🏆`;
                    }
                    card_html += ` ${competitionData["award"]}<br>`;
                }

                card_html += `</p><p class="card-text card_t_comp"><i>${competitionData["teammates"].join(", ")}</i>`;
                if(!!competitionData["proj"]){
                    card_html += `<br><i>Project won: ${competitionData["proj"]}</i>`
                }
                card_html += `</p></div></div></div>`;

                storageRef.child(competitionDoc.id+".png").getDownloadURL().then((photoURL) => {
                    $(`img#${competitionDoc.id}`).attr("src", photoURL);
                }).catch((error) => {
                    storageRef.child("null.png").getDownloadURL().then((photoURL) => {
                        $(`img#${competitionDoc.id}`).attr("src", photoURL);
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
            console.error("Error getting documents of level / year of query snapshot of competitions: ", error);
        });
    }
}
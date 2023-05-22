const db = firebase.firestore();

// Load data from firebase
db.collection("public/news/main").orderBy("year").get().then(async (newsRef) => {
    await newsRef.forEach((newsDoc) => {
        newsData = newsDoc.data();
        $(".navbar_section").html($(".navbar_section").html() + `<h4 class="header mt-2">${newsData["name"]} (${newsData["year"]})</h4><div class="content" id=${newsDoc.id}></div>`);
        for(let i = 0; i < newsData["link"].length; i++){
            $.ajax("https://opengraph.io/api/1.0/site/" + encodeURIComponent(newsData["link"][i]) + "?app_id=e234bff1-96f3-42cb-8dcb-1ea1c6130924").done(function(data){
                description = !!data.openGraph.description ? data.openGraph.description : "";

                $(`.content#${newsDoc.id}`).html($(`.content#${newsDoc.id}`).html() + `<div class="card mb-3"><div class="row g-0"><div class="col-md-5"><img src="${data.openGraph.image.url}" class="img-fluid rounded-start" alt="${newsData["name"]}"></div><div class="col-md-7"><div class="card-body"><h5 class="card-title">${data.openGraph.title}</h5>
                <p class="card-text">${description}</p><a class="card-link" href="${data.openGraph.url}" target="_blank"><i>Browse News</i></a></div></div></div></div>`);

                // $("#htmlCssJs").html($("#htmlCssJs").html() + "<div class='card col-lg-3 col-md-6 col-sm-12' style='width: 18rem;'><img src='" + data.openGraph.image.url +
                // "' class='card-img-top' alt='Website Icon'><div class='card-body'><h5 class='card-title'>" + data.hybridGraph.title +
                // "</h5><p class='card-text'>" + description +
                // "</p><a href='" + data.hybridGraph.url +
                // "' class='btn btn-primary' target='_parent'><i class='fas fa-chevron-right'></i>  Visit</a></div></div>");
            });
        }
    });
}).catch((error) => {
    console.error("Error getting list of documents inside news:", error);
});
let card = document.querySelectorAll(".card");
card.forEach(c => {
    c.style.display = "none";
});

alert("Select a department from the menu on the left to begin viewing a gallery.");
let response_arr = [];
let dept = 1;
let side_btn = document.querySelectorAll(".side-btn");
let modal = document.querySelector("#modal");
let modal_img = document.querySelector("#img-modal");
let modal_close = document.querySelector("#close-modal");
let card_img = document.querySelectorAll(".card-img");
let check = document.querySelector(".highlight");
let load = document.querySelector("#loading");


// retrieving images

function get_data(x, obj_ids) {
    console.log("fetching image data...");
    let ret = fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects/" + obj_ids[x]).then(
        response => {
            if(!response.ok){
                throw Error(response.statusText);
            }
            //response;
            return response;
        }
    ).then(json => {
        return json.json();
    }).then(j_response => {
        if(j_response.isPublicDomain!=false && j_response.isHighlight==check.checked) {
            console.log(j_response.objectID);
            return j_response;
        } else {
            return get_data(x+1, obj_ids);
        }
        
    }).catch(error => {
        console.log(error);
    })
    
    return ret;
};

function get_info(count, obj_ids){
    console.log("choosing images...");
    let info_arr = [];
    //info_arr = get_data(0, obj_ids, info_arr);
    for(let i = 0; i < obj_ids.length; i++) {
        if(info_arr.length == 30){
            break;
        } else {
            var x = Promise.resolve(get_data(count+i, obj_ids));
            info_arr.push(x);
            // info_arr.push(get_data(i, obj_ids));
        }
    }
    return info_arr;
};

function array_eq (arr_1, arr_2) {
    return Array.isArray(arr_1) && Array.isArray(arr_2) &&
    arr_1.length === arr_2.length &&
    arr_1.every((val, index) => val === b[index]);
};

function display_images(count, obj_ids){
    console.log("generating images...");
    Promise.all(get_info(count, obj_ids)).then(responses => {
        for(let i = 0; i < 30; i++) {
            if (response_arr.length==10) {
                break;
            }
            if (response_arr.length==0){
                response_arr.push(responses[i]);
            } else if(response_arr[response_arr.length-1].objectID !== responses[i].objectID) {
                console.log(responses[i]);
                response_arr.push(responses[i]);
            }
        }
        if(response_arr.length<10){
            display_images(count+30, obj_ids);
        }
        console.log("done!");
        return response_arr;
    }).then(response_arr => {
        for(i = 0; i < 10; i++) {
            card[i].childNodes[1].childNodes[1].src = response_arr[i].primaryImage;
            card[i].childNodes[1].childNodes[1].alt = "Image unavailable! Sorry for the inconvenience.";
            card[i].childNodes[1].childNodes[3].childNodes[1].textContent = response_arr[i].title;
            card[i].childNodes[1].childNodes[3].childNodes[3].textContent = response_arr[i].medium;
            card[i].childNodes[1].childNodes[3].childNodes[5].textContent = response_arr[i].artistDisplayName;
            card[i].childNodes[1].childNodes[3].childNodes[7].textContent = response_arr[i].artistDisplayBio;
        }
        card.forEach(c => {
            c.style.display = "";
        });
        load.textContent = "";
    }).catch(error => {
        console.log(error);
    })
};

function get_images(dept_id){
    console.log("searching in department...");
    let ret = fetch("https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId="+dept_id+"&q=art").then(
        response => {
            if(!response.ok){
                throw Error(response.statusText);
            }
            return response.json();
        }
    ).then(j_response => {
        display_images(0, j_response.objectIDs);
        //return j_response.objectIDs;
    }).catch(error => {
        console.log(error);
    });
    return ret;
};

function get_department(){
    card.forEach(c => {
        c.style.display = "none";
    })
    console.log("retrieving data...")
    response_arr = [];
    dept = this.id;
    check.id = dept;
    load.textContent = "loading...";
    get_images(dept);
};

side_btn.forEach(function(btn) {
    btn.addEventListener("click", get_department);
});

// modal

card_img.forEach(function(img) {
    img.addEventListener("click", function(){
        modal.style.display = "block";
        modal_img.src = this.src;
    });
});

modal_close.onclick = function() {
    modal.style.display = "none";
};


//checkbox
check.addEventListener("click", get_department);


// childnodes: https://www.w3schools.com/jsref/prop_node_childnodes.asp
// hide scrollbars: https://www.w3schools.com/howto/howto_css_hide_scrollbars.asp
// modal: https://www.w3schools.com/howto/howto_css_modal_images.asp
// array comparison: https://masteringjs.io/tutorials/fundamentals/compare-arrays
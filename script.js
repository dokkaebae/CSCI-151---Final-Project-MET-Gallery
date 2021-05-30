alert("Select a department from the menu on the left to begin viewing a gallery.");
let side_btn = document.querySelectorAll(".side-btn");

//https://collectionapi.metmuseum.org/public/collection/v1/objects/[objectID]

// async function get_data(x, obj_ids) {
//     return fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects/" + obj_ids[x]).then(
//         response => {
//             if(!response.ok){
//                 throw Error(response.statusText);
//             }
//             return response.json();
//         }
//     ).then(j_response => {
//         if(j_response.isPublicDomain!=false){
//             console.log(j_response);
//             return j_response;
//         }
//     }).catch(error => {
//         console.log(error);
//     })
// };

function get_data(x, obj_ids) {
    let ret = fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects/" + obj_ids[x]).then(
        response => {
            if(!response.ok){
                throw Error(response.statusText);
            }
            return response;
        }
    ).then(json => {
        return json.json();
    }).then(j_response => {
        if(j_response.isPublicDomain!=false){
            return j_response;
        }
    }).catch(error => {
        console.log(error);
    })
    return ret;
};

function display_images(obj_ids){
    let card = document.querySelectorAll(".card");
    let info_arr = [];
    let response_arr = [];
    //info_arr = get_data(0, obj_ids, info_arr);
    for(let i = 0; i < obj_ids.length; i++) {
        if(info_arr.length == 10){
            break;
        } else {
            Promise.resolve(info_arr.push(get_data(i, obj_ids)));
            // info_arr.push(get_data(i, obj_ids));
        }
    }
    Promise.all(info_arr).then(responses => {
        console.log(responses);
        for(let i = 0; i < 10; i++) {
            response_arr.push(responses[i]);
        }
        return response_arr;
    }).then(response_arr => {
        for(i = 0; i < 10; i++) {
            console.log(card[0].childNodes[1].childNodes[3]);
            card[i].childNodes[1].childNodes[1].src = response_arr[i].primaryImage;
            card[i].childNodes[1].childNodes[1].alt = "Image unavailable! Sorry for the inconvenience.";
            card[i].childNodes[1].childNodes[3].childNodes[1].textContent = response_arr[i].title;
            card[i].childNodes[1].childNodes[3].childNodes[3].textContent = response_arr[i].medium;
            card[i].childNodes[1].childNodes[3].childNodes[5].textContent = response_arr[i].artistDisplayName;
            card[i].childNodes[1].childNodes[3].childNodes[7].textContent = response_arr[i].artistDisplayBio;
        }
    }).catch(error => {
        console.log("error");
    })
    console.log(card[0]);
};

function get_images(dept_id){
    fetch("https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId="+dept_id+"&q=art").then(
        response => {
            if(!response.ok){
                throw Error(response.statusText);
            }
            return response.json();
        }
    ).then(j_response => {
        display_images(j_response.objectIDs);
        //return j_response.objectIDs;
    }).catch(error => {
        console.log(error);
    })
}

function get_department(){
    let dept_id = this.id;
    get_images(dept_id);
};

side_btn.forEach(function(btn) {
    btn.addEventListener("click", get_department);
});

// childnodes: https://www.w3schools.com/jsref/prop_node_childnodes.asp
// hide scrollbars: https://www.w3schools.com/howto/howto_css_hide_scrollbars.asp

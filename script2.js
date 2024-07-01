// async function fetchDataJson() {
//     let response = await fetch('https://www.fruityvice.com/api/fruit/all');
//     let responseAsJson = await response.json();

//     generateTable(responseAsJson);
// }


function onloadFunc() {
    console.log("test");
    putData("/examplePath", { type : "test" } );
    const data = { type : "test" };  
}

const BASE_URL = "https://remotestorage-7d44c-default-rtdb.europe-west1.firebasedatabase.app/"
async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseAsJson = await response.json();
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
    return responseAsJson = await response.json();
}

async function putData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}


    async function deleteData(path =""){
        let response = await fetch(BASE_URL + path + ".json",{
            method: "DELETE",
            },
        );
    return responseAsJson = await response.json();
    }


    // ----------- 2 nd code ---------
    async function fetchDataJson() {
        let response = await fetch('https://www.fruityvice.com/api/fruit/all');
        let responseAsJson = await response.json();
   
        generateTable(responseAsJson);
    }
   
   
    async function onloadFunc() {
        let userResponse = await getAllUsers("namen");
   
        let UserKeyssArray = Object.keys(userResponse);
   
        for (let i = 0; i < UserKeyssArray.length; i++) {
           users.push (
               {
                    id: UserKeyssArray[i],
                    user: userResponse[UserKeyssArray[i]],
               }
           )
        }
   
        await addEditSingleUser(users[2].id, {name:'Schmandy'})
        console.log(users);
    }
   
    
    function onloadFunc() {
        console.log("test");
        postData("/name", {"22":"ISMAIL"});
    }
   
   async function putData(path = "", data = {}) {
       let response = await fetch(BASE_URL + path + ".json", {
           method: "PUT",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify(data)
       });
       return await response.json();
   }
   
   
   async function addEditSingleUser(id=44 , user={name:'Kevin'}){
       putData(`namen/${id}`,user) ;
       
   }
   
   async function getAllUsers(path) {
       let response = await fetch(BASE_URL + path + ".json");
       return responseAsJson = await response.json();
   }
   
   
    async function postData(path = "", data = {}) {
        let response = await fetch(BASE_URL + path + ".json",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
        return responseAsJson = await response.json();
    }
   
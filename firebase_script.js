var firebaseConfig = {
    "Get config from your account."
};

var room_id = 1;
//var username = "pardhu";
var user_name = "Hello";
var players_names = [];
var scrs=[];

// var scrs = new Array()




// -----------------Initialize Firebase---------------------
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var ref = database.ref(room_id);
var players_raw = database.ref(room_id + '/players');
//var my_ref = database.ref(room_id+"/"+username);
//my_ref.set(0);


var names = [];
var scores = [];





let table = document.getElementById('table');
let thead = document.getElementById('thead');
let tbody = document.getElementById('tbody');



let flag_for_table = 0;

ref.on('value',function(snap){
    var count = 0;
    names = [];
    scores = [];

    
    snap.forEach(function(childsnap){
        count += 1;
        var key = childsnap.key;
        var val = childsnap.val();
//        console.log(key);
        if(val != 0){
            names.push(key);
            scores.push(val);
        }
    });

    
    
    
    for(var irand = 0; irand < scores.length; irand++){
        for(var jrand = 0; jrand < (scores.length - irand -1); jrand++){
             if(scores[jrand] < scores[jrand+1]){
                var temp = scores[jrand];
                scores[jrand] = scores[jrand + 1];
                scores[jrand+1] = temp;
                 
                var temp = names[jrand];
                names[jrand] = names[jrand + 1];
                names[jrand+1] = temp;
                 
            }
        }
    }

    
    
    while(table.rows.length > 0) {
        table.deleteRow(0);
    }
    for(let i=0; i<names.length; i++){
        let row_2 = document.createElement('tr');
        let row_2_data_1 = document.createElement('td');
        row_2_data_1.innerHTML = i+1;
        let row_2_data_2 = document.createElement('td');
        row_2_data_2.innerHTML = names[i];
        let row_2_data_3 = document.createElement('td');
        row_2_data_3.innerHTML = scores[i];

        row_2.appendChild(row_2_data_1);
        row_2.appendChild(row_2_data_2);
        row_2.appendChild(row_2_data_3);
        tbody.appendChild(row_2);
    }
});



function stateHandle1(){
    room_id = document.getElementById("id").value;
    user_name = document.getElementById("name").value;
    user_pswd = document.getElementById("pass").value;
    
    console.log(room_id);
    console.log(user_name);
    console.log(user_pswd);
    
//    console.log(database.ref("1"));
//    dum_ref = database.ref("dum");
    
    pswd_ref = database.ref("passwords/" + room_id);
//    console.log("Button");
    
    
    
    
    pswd_ref.once("value", (snap)=>{
        pswd_fb = snap.val();
        console.log(pswd_fb);

        if(room_id == null){
            console.log("Enter room id.....");
        }

        else if(user_name!=""){
            if(user_pswd === pswd_fb){
                console.log("login");
                sessionStorage.setItem("first", user_name);
                var my_ref = database.ref(room_id+"/"+user_name);
                my_ref.set(0);
                var locc = "final_game.html";
                location.href=(locc);
            }
            else{
                console.log("Incorrect Password!!");
            }
        }

        else{
            console.log("Enter Username.....");
        }
    });
}




function stateHandle2(){
    new_pass = document.getElementById("id").value;
    new_name = document.getElementById("name").value;
    name_ref = database.ref(id_num + "/players");
    id_ref = database.ref("curr_room_id");
    id_ref.once("value", (snap)=>{
        new_id = snap.val();
        new_id = new_id + 1;
        firebase.database().ref(new_id).set({"pass":new_pass});
    })
    name_ref.once("value", (snap)=>{
        name = snap.val();
        name = name + "_" + new_name;
        firebase.database().ref(name_ref).set({"name":name});
    })

}






// console.log(players_names);





// console.log(scrs);
// const propertyNames=Object.values(scrs);  
// console.log(propertyNames);  

var firebaseConfig = {
    "Get config from your account."
};

firebase.initializeApp(firebaseConfig);
console.log(firebase);
var database = firebase.database();


function stateHandle1(){
    room_id = document.getElementById("id").value;
    user_name = document.getElementById("name").value;
    user_pswd = document.getElementById("pass").value;
    
    console.log(room_id);
    console.log(user_name);
    console.log(user_pswd);
    
    pswd_ref = database.ref("passwords/" + room_id);
//    console.log("Button");
    console.log("passwords/" + room_id);
    
    
    
    pswd_ref.once("value", (snap)=>{
        pswd_fb = snap.val();
//        console.log(pswd_fb);

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
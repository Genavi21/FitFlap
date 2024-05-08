const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
    
//videoElement.msHorizontalMirror = true;
    
let image_height = canvasElement.height;
let image_width = canvasElement.width;
    
//canvasCtx.translate(image_width/2, image_height/2);
//canvasCtx.scale(-1, 1);
//canvasCtx.translate(-image_width/2, -image_height/2);
//console.log(canvasCtx);
//canvasCtx.save();

var username = (sessionStorage.getItem("first"));


let wallBuf = [];
let heightBuf = [];
    
let count_flag = 40;
let score = 0;



function onResults(results) {
    count_flag+=1;
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
    //        console.log((landmarks[0].x) * 1280);
            let nose_x = ((landmarks[2].x) * image_width);
            let nose_y = ((landmarks[2].y) * image_height);
            canvasCtx.beginPath();
            canvasCtx.arc(nose_x, nose_y, 10, 0, 2 * Math.PI, false);
            canvasCtx.fillStyle = 'green';
            canvasCtx.fill();
            canvasCtx.lineWidth = 5;
            canvasCtx.strokeStyle = '#003300';
            canvasCtx.stroke();
            for(let i=0; i<wallBuf.length;i++){
                if((nose_x - wallBuf[i] < 20 && nose_x - wallBuf[i] >0) && (nose_y<=heightBuf[i] || nose_y>=heightBuf[i]+100)){
                    score-=300
                }

                else{
                    score+=1
                }
            }

            var user_ref = database.ref(room_id + "/" + username);
            user_ref.set(score);



            for(let i=0; i<wallBuf.length; i++){
                canvasCtx.fillRect(wallBuf[i],0,30,heightBuf[i]);
                canvasCtx.fillRect(wallBuf[i],heightBuf[i]+100,30,image_height-100-heightBuf[i]);
                wallBuf[i] += 5;
            }

            if(count_flag > 50){
                wallBuf.push(0);
                let random_generated_wall = genWall(canvasElement.height);
                heightBuf.push(random_generated_wall);
                count_flag = 0;
            }
        }
    }
  canvasCtx.restore();
}


function genWall(h){
    return Math.round(Math.random() * (h-250));
}

function drawWallBuffer(wallBuf, canvasCtx){
//    console.log(image_height);
//    console.log(image_width);
    
    for(let i=0; i<wallBuf.length; i++){
    
        canvasCtx.beginPath();
        canvasCtx.arc(((i), (100)), 10, 0, 2 * Math.PI, false);
        canvasCtx.fillStyle = 'green';
        canvasCtx.fill();
        canvasCtx.lineWidth = 5;
        canvasCtx.strokeStyle = '#003300';
        canvasCtx.stroke();
    }
}





const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});


faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();
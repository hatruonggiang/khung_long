const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")
// Khai báo biến
let Score;
let scoreText
let highScore;
let highScoreText;
let player;
let gravity;
let obstacles=[];
let gameSpeed;
let key = {};
let backgroundImage = new Image();
backgroundImage.src = 'background.jpg'; // Đường dẫn đến hình ảnh nền



document.addEventListener('keydown', function (evt){
    key[evt.code] = true

});
document.addEventListener('keyup',function (evt){
    key[evt.code] = false
})


 class Player {
     constructor(x,y,w,h,color) {
         this.x = x;
         this.y = y;
         this.w = w;
         this.h = h;
         this.color = color;
         this.image = new Image(); // Tạo đối tượng Image
         this.image.src = 'player2.png'; // Đường dẫn đến hình ảnh của nhân vật
         this.image.onload = () => {
            this.imageLoaded = true;
            this.removeBackground();
        };
         this.dy = 0;
         // đặt dy: hay lực hướng là vận tốc nhảy
         this.dy = 0
         this.jumpForce = 15
         this.originalHeight=h;
         this.ground = false
         this.jumptimer = 0;
         this.floorOffset = 125; // Khoảng cách từ đáy màn hình
     }
     Animate(){
      //jump
         if(key['Space'] ){
             this.Jump()
         }
         else {
             this.jumptimer=0;
         }

         if (key['KeyS']){
             this.h = this.originalHeight/2;
         }
         else {
             this.h = this.originalHeight;
         }

         this.y += this.dy
        // Gravity
        if (this.y + this.h < canvas.height - this.floorOffset) {
            this.dy += gravity;
            this.ground = false;
        } else {
            this.dy = 0;
            this.ground = true;
            this.y = canvas.height - this.h - this.floorOffset; // Đảm bảo nhân vật không chạm đáy
        }



         this.Draw()
     }

         Jump () {
             if (this.ground && this.jumptimer === 0) {
                 this.jumptimer = 1
                 this.dy = this.jumpForce
             } else if (this.jumptimer > 0 && this.jumptimer < 15) {

                 this.jumptimer++;
                 this.dy = -this.jumpForce - (this.jumptimer/50);
             }
         }

         removeBackground() {
            const canvasTemp = document.createElement('canvas');
            const ctxTemp = canvasTemp.getContext('2d');
            canvasTemp.width = this.w;
            canvasTemp.height = this.h;
            ctxTemp.drawImage(this.image, 0, 0, this.w, this.h);
            const imageData = ctxTemp.getImageData(0, 0, this.w, this.h);
            const data = imageData.data;
    
            // Thay đổi màu nền (ví dụ: màu trắng) thành trong suốt
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) { // Nếu màu trắng
                    data[i + 3] = 0; // Thay đổi alpha thành 0 (trong suốt)
                }
            }
            ctxTemp.putImageData(imageData, 0, 0);
    
            this.image = new Image();
            this.image.src = canvasTemp.toDataURL(); // Cập nhật hình ảnh với nền đã được xóa
        }

    Draw() {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    
 }


 class Obstacle {
    constructor(x,y,w,h,color) {
        this.x=x
        this.y=y
        this.w=w
        this.h=h
        this.color=color
        this.image = new Image(); // Tạo đối tượng Image
        this.image.src = 'boom2.png'; // Đường dẫn đến hình ảnh của nhân vật
        this.image.onload = () => {
            this.imageLoaded = true;
            this.removeBackground();
        };
        //dx là vận tốc theo chiều trục X
        this.dx = -gameSpeed;
        this.floorOffset = 125; // Khoảng cách từ đáy màn hình
    }

    update () {
        this.x += this.dx
        this.Draw();
        this.dx=-gameSpeed
    }

    removeBackground() {
        const canvasTemp = document.createElement('canvas');
        const ctxTemp = canvasTemp.getContext('2d');
        canvasTemp.width = this.w;
        canvasTemp.height = this.h;
        ctxTemp.drawImage(this.image, 0, 0, this.w, this.h);
        const imageData = ctxTemp.getImageData(0, 0, this.w, this.h);
        const data = imageData.data;

        // Thay đổi màu nền (ví dụ: màu trắng) thành trong suốt
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) { // Nếu màu trắng
                data[i + 3] = 0; // Thay đổi alpha thành 0 (trong suốt)
            }
        }
        ctxTemp.putImageData(imageData, 0, 0);

        this.image = new Image();
        this.image.src = canvasTemp.toDataURL(); // Cập nhật hình ảnh với nền đã được xóa
    }
    Draw() {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
 }


 class Text {
     constructor(t,x,y,a,c,s) {
         this.t = t
         this.x=x
         this.y=y
         this.a=a
         this.c=c
         this.s=s
     }
     Draw () {
         ctx.beginPath();
         ctx.fillStyle = this.c;
         ctx.font = this.s + "sans-serif";
         ctx.textAlign = this.a
         ctx.fillText(this.t, this.x, this.y);
         ctx.closePath();
     }
 }

 function SpawnObstacle (){
    let size = RandomIntInRange (20,70);
     let type = RandomIntInRange (0,1);
     let obstacle = new Obstacle(canvas.width+size,canvas.height - size -125 ,size,size,'#2484E4');


     if (type == 1){
         obstacle.y -= player.originalHeight-10;
     }
     obstacles.push(obstacle);
 }

 function RandomIntInRange (min,max){
    return Math.round(Math.random()*(max-min)+min);
 }




 function Start(){
     canvas.width =window.innerWidth;
     canvas.height=window.innerHeight;

     ctx.font = "20px sans-serif";

     gameSpeed = 3;
     gravity = 1;

     Score = 0;
     highScore = 0;

     if(localStorage.getItem('highScore')){
         highScore = localStorage.getItem('highScore');
     }


     player = new Player(25,0, 50, 50, '#FF5858');

     scoreText = new Text("Score: " + Score, 25, 25, "left","#212121","20");
     highScoreText  = new Text("HighScore" +highScore, canvas.width - 25, 25, "right", "#212121","20")

     requestAnimationFrame(Update);
 }

 // bộ đếm thời gian ban đầu
 let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer
 function Update(){
     requestAnimationFrame(Update);
     ctx.clearRect(0,0,canvas.width,canvas.height);

     ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
     spawnTimer --;
     if (spawnTimer <= 0){
         SpawnObstacle();
         console.log(obstacles)
         spawnTimer = initialSpawnTimer - gameSpeed *8;
          if (spawnTimer<60){
              spawnTimer = 60
          }
     }

     for (let i = 0; i < obstacles.length; i++) {
         let o = obstacles[i];
       if(o.x + o.width<0){
           obstacles.splice(i,1)
       }

       if(
           player.x < o.x + o.w &&
           player.x + player.w>o.x &&
           player.y< o.y + o.h &&
           player.y + player.h >o.y
       ){
           obstacles=[]
           Score = 0
           spawnTimer=initialSpawnTimer
           alert("game over")
           gameSpeed = 3
           window.localStorage.setItem('highScore', highScore)
       }


         o.update();
     }


     player.Animate();
     Score ++;
     scoreText.t = "Score: " + Score;
     scoreText.Draw()

     if (Score>highScore){
         highScore=Score;
         highScoreText.t = "HighScore: " + highScore;

     }

     highScoreText.Draw()

     gameSpeed += 0.003
 }
 Start();

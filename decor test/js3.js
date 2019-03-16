var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var count = 0;
var clockcount = 0;
var bombkill = "off";
var chktime = "off"; //กำหนดตัวแปรเช็คการเริ่มกดปุ่มตัวแรก
var casebomb = "on";//ตั้งค่าจุดระเบิด
var boomset = "off";//ตั้งระเบิดจะระเบิด
var timebomb = 0;//เซตเวลาระเบิด
var chkclock = "on"; // เช็คว่างูกินที่เพิ่มเวลาไปหรือยัง
var key = { //กำหนดตค่าปุ่มเริ่มต้น
    move:undefined
}
var size = 20; //ขนาดบล็อคตัวงู
var key_p = undefined;
var snake = [{x:canvas.width/2-10, y:canvas.height/2-10}]; //สร้างarray snake เก็บค่าพิกัดงู ซึ่งตัวแรกให้อยู่กลางแมพ
var long = 0; //ความยาวของตัวงู
var high = 0; //score สุดท้าย
var time = 20; //กำหนดเวลาของเกม
var bomb= {
    x:undefined,
    y:undefined
}
var clock = {
    x:undefined,
    y:undefined
}
var boom = {
    x:undefined,
    y:undefined
}
var food = {
    x:undefined,
    y:undefined}
    window.onkeyup = function(event) {
        let key = event.key.toUpperCase();
        if ( key == 'W' ) {
            document.getElementById("startGame").style.display="none";
            chktime = "on";
        }
        else if( key == 'P' ) {
            died();
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 1; i <= 3; i++){ //สร้างพิกัดจุดงูเริ่มต้นซึ่งมี4จุด เพราะมี4บล็อค
        snake.push({
            x:canvas.width/2-10,
            y:(canvas.height/2-10)+(i*size)
        })
    }
    function spaceNoSnake(){  //พื้นที่ที่ไม่มีงู
        this.space = [] //array เก็บ พื้นที่
        for (var i = 0; i <= canvas.width-20; i += 20){ // แกน x
            for(var j = 0; j <= canvas.height-20; j += 20){ // แกน y
                for(let y = 0; y < snake.length; y++){
                    if ((snake[y].x == i && snake[y].y == j) || (snake[y].x == food.x && snake[y].y == food.y) || (snake[y].x == bomb.x && snake[y].x == bomb.y)){ //พื้นที่ไม่มีอะไรทับงู
                        break}
                    else if (y == snake.length-1) space.push({x:i, y:j})
                }
            }
        }
    }
    spaceNoSnake();
    food = this.space[Math.floor(Math.random() * this.space.length)]; // array อาหารที่เกิด
    window.addEventListener('keydown', function(event){ // รับค่าkeyborad
        key.move= String.fromCharCode(event.keyCode); //ให้ค่าที่รับกลายเป็นstr
    })

    function draw(){ //ฟังชั่นในการสร้างภาพทั้งหมด
        if ((snake[0].x == bomb.x || snake[0].y == bomb.y) && bombkill == "on"){ //โดนระเบิดตาย
            died();
        }
        if (key.move == "W" && key_p != "S") key_p = "W"; //เช็คปุ่มและป้องกันการเดินถอยหลัง
        else if (key.move == "S" && key_p != "W" && key_p != undefined) key_p = "S"; //เช็คปุ่มและป้องกันการเดินถอยหลัง
        else if (key.move == "A" && key_p != "D") key_p = "A"; //เช็คปุ่มและป้องกันการเดินถอยหลัง
        else if (key.move == "D" && key_p != "A") key_p = "D"; //เช็คปุ่มและป้องกันการเดินถอยหลัง
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++ ){ //สร้างงูที่อยู่ในarray
            ctx.shadowColor = "#F20505"; //สีshadow
            ctx.shadowBlur = 10; //ขนาดshadow
            ctx.fillStyle = "#BF0404"; //สี
            ctx.fillRect(snake[i].x, snake[i].y, size, size);
            ctx.strokeStyle = "#ef648f";
            ctx.strokeRect(snake[i].x, snake[i].y, size, size);
        }

        function drawFood(){
            ctx.shadowColor = "red";
            ctx.shadowBlur = 10;
            ctx.fillStyle = "white"; //สร้างอาหาร
            ctx.fillRect(food.x, food.y, size, size);
            ctx.strokeRect(food.x, food.y, size, size);
        }
        let newx = snake[0].x; // ให้พิกัดใหม่มีค่าเท่ากับหัวงู
        let newy = snake[0].y;

        if (this.key_p == "A") newx -= this.size; // บวกพิกัดใหม่เพิ่มตามค่า w a s d
        if (this.key_p == "S") newy += this.size; // บวกพิกัดใหม่เพิ่มตามค่า w a s d
        if (this.key_p == "D") newx += this.size; // บวกพิกัดใหม่เพิ่มตามค่า w a s d
        if (this.key_p == "W") newy -= this.size; // บวกพิกัดใหม่เพิ่มตามค่า w a s d

        newx = (newx >= canvas.width?0:newx < 0?canvas.width:newx); //ถ้างูชนกำแพงงูจะวาปมากำแพงตรงข้ามในแนวแกน x
        newy = (newy >= canvas.height?0:newy < 0?canvas.height:newy); //ถ้างูชนกำแพงงูจะวาปมากำแพงตรงข้ามในแนวแกน y
        if (newx != snake[0].x || newy != snake[0].y){
            for (let i = 0; i < snake.length; i++){ //เช็คว่างูชนรึยัง
            if((newx == snake[i].x && newy == snake[i].y)|| (newx == bomb.x && newy == bomb.y)){
                ctx.fillStyle = "green";
                ctx.fillRect(snake[i].x, snake[i].y, size, size);
                ctx.strokeRect(snake[i].x, snake[i].y, size, size);
                died();
                }
            }

        }

        if(newx == food.x && newy == food.y){ //ถ้างูกินอาหารแล้วอาหารจะถูกสุ่มเกิดใหม่
            spaceNoSnake();
            sound("bite")   //เสียงกิน
            food = this.space[Math.floor(Math.random() * this.space.length)];
            }
        else{
            if ((newx != snake[0].x || newy != snake[0].y) && snake.length != 1){
            snake.pop();} //แล้วงูไม่กินอาหารหางจะหาย
        }
        if (newx != snake[0].x || newy != snake[0].y){
            snake.unshift({ //เพิ่มส่วนหัว (ถ้างูกินอาหารส่วนหางจะไม่ถูกตัดทำให้งูยาวขึ้น)
            x:newx,
            y:newy
        })
        }
        function drawBomb(){ //ฟังชั้นวาดระเบิด
            ctx.shadowColor = "purple"; //สีshawdow
            ctx.shadowBlur = 10; //ขนาดshadow
            ctx.fillStyle = "purple"; //สี
            ctx.fillRect(bomb.x, bomb.y, size, size); //สร้างรูป
            ctx.strokeRect(bomb.x, bomb.y, size, size); //สร้างขอบ
        }
        function drawClock(){ //ฟังชั้นวาดระเบิด
            ctx.shadowColor = "orange"; //สีshawdow
            ctx.shadowBlur = 10; //ขนาดshadow
            ctx.fillStyle = "orange"; //สี
            ctx.fillRect(clock.x, clock.y, size, size); //สร้างรูป
            ctx.strokeRect(clock.x, clock.y, size, size); //สร้างขอบ
        }

        function drawBoom(){//วาดรัศมีระเบิด
            ctx.shadowColor = "yellow";
            ctx.shadowBlur = 10;
            ctx.fillStyle = "yellow";
            ctx.fillRect(0, boom.y, canvas.width, size);
            ctx.fillRect(boom.x, 0, size, canvas.height);
            ctx.strokeRect(0, boom.y, canvas.width, size);
            ctx.strokeRect(boom.x, 0, size, canvas.height);
        }
        count = (count*10 + 0.1*10) /10; // นับที่ละ 1 เพราะฟังชั่นdrawทำงานครั้งละ 1 วิ(ที่ต้องคูณ100เพราะ js บวก float มันกาก)
        if (count%6 == 0){ // ไปที่ฟังชั้นspawn_b เพื่อรีเวลาใหม่
            if (casebomb == "on" && chktime == "on"){
                spaceNoSnake();
                bomb = this.space[Math.floor(Math.random() * this.space.length)];
                boomset = "on"
                casebomb = "off";
                timebomb = 0;
                sound("clock")  //เสียงนาฬิกา
            }
            else{
                bomb.x = undefined;
                bomb.y = undefined;
                casebomb = "on";
                boomset = "on";
            }
        }
        if (boomset == "on"){
            if(timebomb == 5 || bomb.x == undefined){//นับเวลาระเบิดหรือระเบิดหาย
                boom.x = bomb.x;
                boom.y = bomb.y;
                boomset = "off";
                if (bomb.x != undefined){
                    bombkill = "on";
                    sound("fire")   //เสียงระเบิด
                }
                else bombkill = "off";
            }
            timebomb = (timebomb*10 + 0.1*10) /10;  //เวลาระเบิด
        }
        if (bombkill == "on"){
            for (let i = 1; i < snake.length; i++){ //เช็คว่างูชนรึยัง
            if(bomb.x == snake[i].x || bomb.y == snake[i].y){
                snake = snake.slice(0, i);
                }
            }
        }
        
        if (chktime == "on"){
            clockcount += 1;}/* ยังไม่เสร็จ
        if (clockcount == 20){ // นาฬิกาหายไปเมื่อเวลากำหนด 
            clock.x = undefined;
            clock.y = undefined;
            chkclock = "on";
            clockcount = 0;
        }*/
        if (snake[0].x == clock.x && snake[0].y == clock.y){ //กินนาฬิกาแล้วหายไปเวลาเพิ่มขึ้น
            time += 3;
            updateTime();
            clock.x = undefined;
            clock.y = undefined;
            chkclock = "on";
            clockcount = 0;
        }
        if (clockcount % 4 == 0){ // ทำให้เกิดนาฬิกา
            if (chkclock == "on" && chktime == "on" && clockcount > 19){
                spaceNoSnake();
                clock = this.space[Math.floor(Math.random() * this.space.length)];
                chkclock = "off";;
            }
        }
    drawClock();    
    drawFood();//เรียกฟังชั้นวาดอาหาร
    drawBomb();//เรียกฟังชั้นวาดระเบิด
    drawBoom();//เรียกฟังชั้นวาดแรงระเบิด
    long = snake.length; //หาขนาด Array งู
    updateScore();
    }

    let game = setInterval(draw,75);
    countdown();//เรียกฟังก์ชันนับถอยหลัง

    function updateScore(){
        // แสดงคะแนนให้คนดู
        theScore.innerText = long-1; //optional: เอาความยาวมา -1 เพราะไม่อยากให้นับรวมส่วนหัวด้วย
        highScore();
    }
    function countdown(){
            //  ฟังก์ชันนับเวลา
            cd = setInterval(
            function(){
                // ถ้ายังไม่หมดเวลา
                if (time > 0) {
                    // ลดเวลา
                    if (chktime == "on"){ // BUG บางทีมันหน่วงตรงนับ 20
                    time--;
                    // อัพเดทเวลา
                    updateTime();}
                }
                // ถ้าหมดเวลา
                else{
                    died();
                    console.log("END");
                }
            },1000)
    }
    function updateTime(){
            // แสดงเวลา
            theTime.innerText = time;

            // ถ้าหมดเวลา ให้บอก
            if (time == 0) {
                status.innerHTML = "Game Over!! <a href='#!' onclick='ready()'>play again</a>"; // !!ยังไม่สำเร็จ คาดว่าต้องแก้ฟังก์ชันใหม่
        }}
    
    function highScore(){   //ฟังก์ชั่นเก็บ HighScore
        if((long-1) > high){
            high = long-1;
        }
    }
    function died(){    //ฟังก์ชันตาย
        sound("gameover");  //เสียง Gameovers
        time = 0;
        document.getElementById('endGame').style.display = 'block'; //แสดงหน้า endGame ที่ซ่อนไว้
        total.innerText = high;     //คะแนน HighScore
        final.innerText = long-1;   //คะแนน FinalScore
        document.getElementById('bgm').pause(); //Pause เสียง BGM
        document.getElementById("clock").pause(); //Pause เสียง clock (บางทีมันชอบเกินมา)
        clearInterval(game); //หยุดการทำงาน

    }
    function start(){
        window.location.reload();   //รีเฟรซหน้า
        document.getElementById('endGame').style.display = 'none';  //ซ่อนหน้า endGame
    }
    function sound(id){ //ฟังก์ชันใส่เสียง
        document.getElementById(id).play();
    }
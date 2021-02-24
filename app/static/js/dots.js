var canvas = document.getElementById('dots_window'),
   can_w = parseInt(canvas.getAttribute('width')),
   can_h = parseInt(canvas.getAttribute('height')),
   ctx = canvas.getContext('2d');


   //Objects
var ball = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
}


var box = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    x0: 0,
    y0: 0
}

var ball_color = {
    r: 255,
    g: 0,
    b: 0,
    a: 1
}

var logo_color = {
    r: 255,
    g: 255,
    b: 255,
    a: 1
}

var line = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    a: 1
}

var mouse = {
    x: 0,
    y: 0
}

var squareMouse = {
    x: 0,
    y: 0
}

//Util Functions
function randomSidePos(length){
    return Math.ceil(Math.random() * length);
}

function randomSpeed(){
    var x = Math.ceil(Math.random() * maxSpeed * 2) - maxSpeed
    var y = Math.ceil(Math.random() * maxSpeed * 2) - maxSpeed
    if (Math.abs(x) < 0.1 & Math.abs(y) < 0.1){
        return randomSpeed();
    }
    return [x, y]
}

function ballDistance(b1, b2){
    return Math.sqrt(ballDistanceSqr(b1, b2))
}

function ballDistanceSqr(b1, b2){
    dx = b1.x - b2.x
    dy = b1.y - b2.y
    c = dx * dx + dy * dy
    return c
}


//Global Vars
balls = []
squares = []

R = 5
square_size = 10
maxSpeed = 2
nBalls = 200
lineRange = 200

ballColor = "#AAAAAA"
logoColor = "#4DA8DA"

lastFrame = 0
now = 0
fps = 60
msPerFrame =  (1/fps)*1000

infection_chance = 9995;

logo_tl = {
    x: 0,
    y: 0
}

logo_dem = {
    x: 0,
    y: 0
}

logo_char_size = {
    width: 0,
    height: 0
}

logo_pad = {
    side: 20,
    top: 40
}

logo_text_dem = {
    x: 113,
    y: 15
}

logo = `
BBBBBBBBBBBBBBBBB     DDDDDDDDDDDDD                 444444444    HHHHHHHHH     HHHHHHHHH  EEEEEEEEEEEEEEEEEEEEEE
B::::::::::::::::B    D::::::::::::DDD             4::::::::4    H:::::::H     H:::::::H  E::::::::::::::::::::E
B::::::BBBBBB:::::B   D:::::::::::::::DD          4:::::::::4    H:::::::H     H:::::::H  E::::::::::::::::::::E
BB:::::B     B:::::B  DDD:::::DDDDD:::::D        4::::44::::4    HH::::::H     H::::::HH  EE::::::EEEEEEEEE::::E
  B::::B     B:::::B    D:::::D    D:::::D      4::::4 4::::4      H:::::H     H:::::H      E:::::E       EEEEEE
  B::::B     B:::::B    D:::::D     D:::::D    4::::4  4::::4      H:::::H     H:::::H      E:::::E             
  B::::BBBBBB:::::B     D:::::D     D:::::D   4::::4   4::::4      H::::::HHHHH::::::H      E::::::EEEEEEEEEE   
  B:::::::::::::BB      D:::::D     D:::::D  4::::444444::::444    H:::::::::::::::::H      E:::::::::::::::E   
  B::::BBBBBB:::::B     D:::::D     D:::::D  4::::::::::::::::4    H:::::::::::::::::H      E:::::::::::::::E   
  B::::B     B:::::B    D:::::D     D:::::D  4444444444:::::444    H::::::HHHHH::::::H      E::::::EEEEEEEEEE   
  B::::B     B:::::B    D:::::D     D:::::D            4::::4      H:::::H     H:::::H      E:::::E             
  B::::B     B:::::B    D:::::D    D:::::D             4::::4      H:::::H     H:::::H      E:::::E       EEEEEE
BB:::::BBBBBB::::::B  DDD:::::DDDDD:::::D              4::::4    HH::::::H     H::::::HH  EE::::::EEEEEEEE:::::E
B:::::::::::::::::B   D:::::::::::::::DD             44::::::44  H:::::::H     H:::::::H  E::::::::::::::::::::E
B::::::::::::::::B    D::::::::::::DDD               4::::::::4  H:::::::H     H:::::::H  E::::::::::::::::::::E
BBBBBBBBBBBBBBBBB     DDDDDDDDDDDDD                  4444444444  HHHHHHHHH     HHHHHHHHH  EEEEEEEEEEEEEEEEEEEEEE`

// Init Balls
function initBalls(num){
    for(var i = 1; i <= num; i++){
        speed = randomSpeed()
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: speed[0],
            vy: speed[1],
            infected: false
        });
    }
}

function initLogo(str){
    var lines = str.split('\n');
    var line;
    for(var i = 0; i < lines.length; i++){
        line = lines[i]
        for(var j = 0; j < line.length; j++){
            char = line[j]
            if (char != " " & char != ".") {
                squares.push({
                    x: j,
                    y: i,
                    vx: 0,
                    vy: 0,
                    x0: j,
                    y0: i
                });
            }
            
        }
    }
}


//Render functions

function renderBalls() {
    Array.prototype.forEach.call(balls, function(b){
        if (b.infected) {
            ctx.fillStyle = yellow
        } else {
            ctx.fillStyle = ballColor;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
     });
}

function renderSquares() {
    Array.prototype.forEach.call(squares, function(b){
        ctx.fillStyle = logoColor;
        ctx.beginPath();
        ctx.rect(logo_tl.x + b.x * logo_char_size.width, logo_tl.y + b.y * logo_char_size.height, logo_char_size.width + 2, logo_char_size.height + 2);
        ctx.closePath();
        ctx.fill();
     });
}

function renderLines() {
    Array.prototype.forEach.call(balls, function(ball){
        Array.prototype.forEach.call(balls, function(sub_ball){
            if (ball != sub_ball)
            {
                dist = ballDistanceSqr(ball, sub_ball)
                lineRangeSq = lineRange * lineRange
                if (dist < lineRangeSq)
                {
                    if (ball.infected) {
                        ctx.strokeStyle = 'rgba(0,155,0,' + (1 - (dist / lineRangeSq)) + ')';
                    } else {
                        ctx.strokeStyle = 'rgba(155,155,155,' + (1 - (dist / lineRangeSq)) + ')';
                    }
                    ctx.beginPath();
                    ctx.moveTo(ball.x, ball.y);
                    ctx.lineTo(sub_ball.x, sub_ball.y);
                    ctx.stroke();
                    if (ball.infected & !sub_ball.infected)
                    {
                        chance = Math.ceil(Math.random() * 10000)
                        if (chance >= infection_chance) {
                            sub_ball.infected = true
                        }
                    }
                }
            }
         });
     });
}

function updateBalls() {
    Array.prototype.forEach.call(balls, function(b){
        mouseDx = mouse.x - b.x;
        mouseDy = mouse.y - b.y;

        mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy)
        
        mouseDx /= mouseDist;
        mouseDy /= mouseDist;

        range = 200;

        if (mouseDist <= range)
        {
            b.vx -= mouseDx * (range / mouseDist);
            b.vy -= mouseDy * (range / mouseDist);
        }

        if ((b.vx * b.vx) + (b.vy * b.vy) > maxSpeed * maxSpeed){
            b.vx *= 0.9;
            b.vy *= 0.9;
        }

        b.x += b.vx
        b.y += b.vy

        if (b.x <= 0) {
            b.x += can_w
        }
        if (b.y <= 0) {
            b.y += can_h
        }
        if (b.x >= can_w) {
            b.x = 0
        }
        if (b.y >= can_h) {
            b.y = 0
        }
    });
}

function updateLogo() {
    Array.prototype.forEach.call(squares, function(b){
        mouseDx = mouse.x - (logo_tl.x + b.x * logo_char_size.width);
        mouseDy = mouse.y - (logo_tl.y + b.y * logo_char_size.height);

        homeDx = b.x0 - b.x
        homeDy = b.y0 - b.y;

        b.vx = homeDx / 10
        b.vy = homeDy / 10

        mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy)
        
        range = 100

        if (mouseDist <= range)
        {
            b.vx -= mouseDx * 0.001 / (mouseDist / range)
            b.vy -= mouseDy * 0.001 / (mouseDist / range)
        }
        b.x += b.vx
        b.y += b.vy
    });
}

function addBallIfy() {

}




function render(){
    now = Date.now()
    if (now - then >= msPerFrame) {
        then = now
        ctx.clearRect(0, 0, can_w, can_h);

        renderLines();

        renderBalls();

        renderSquares();
        
        updateBalls();

        updateLogo();
        
        addBallIfy();
    }
    window.requestAnimationFrame(render);
}

// Init Canvas
function initCanvas(){
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    
    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));

    logo_tl.x = can_w * logo_pad.side / 100
    logo_tl.y = can_h * logo_pad.top / 100


    logo_dem.x = can_w - (logo_tl.x * 2)
    logo_dem.y = can_h - (logo_tl.y * 2)


    logo_char_size.width = logo_dem.x / logo_text_dem.x
    logo_char_size.height = logo_dem.y / logo_text_dem.y
}



function startAnimation(){
    initCanvas();
    initBalls(nBalls);
    // initLogo(logo);
    then = Date.now()
    window.requestAnimationFrame(render);
}
startAnimation();


// listeners
window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
});

canvas.addEventListener('mousemove', function(e){
    var e = e || window.event;
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});

canvas.addEventListener('mousedown', function(e){
    var e = e || window.event;
    mouse.x = e.pageX;
    mouse.y = e.pageY;

    for (var i = 0; i < balls.length; i++)
    {
        if (!balls[i].infected){
            balls[i].infected = true;
            break;
        }
    }
});

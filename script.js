// Получаем canvas
const canvas = document.getElementById("canvas")
const context = canvas.getContext('2d');

// Получим модальные окна
const modalFail = document.getElementById('modalFail')
const restartBtn = modalFail.querySelector('button')
const scoreShow = document.querySelector('.score')

const stopPlay = document.getElementById('stopPlay')
const continueBtn = stopPlay.querySelector('button')
// Создаем объекты
const final = new Audio();
const succes = new Audio();

const bird = new Image()
const ground = new Image()
const pipeUp = new Image()
const pipeDown = new Image()   

// Подключаем объекты
final.src = '/audio/gameover.mp3'
succes.src = '/audio/succes.mp3'
bird.src = '/img/birdDown.png'
ground.src = '/img/ground.png'
pipeUp.src = '/img/pipeUp.png'
pipeDown.src = '/img/pipeDown.png'

// Переменные
let playing = true
let posX = 150
let posY = 20
let gravity = 1
let gap = 140
let  pipes = [
    {
        x:canvas.width,
        y:0,
    }
]
let score = 0
let jumpHeight = 40
// События

//Прыжок
document.addEventListener("keydown", (e)=>{
    if(e.code == 'Space'){
        const startJump = posY
        bird.src = '/img/birdUp.png'
        let timer = setInterval(function(){
            posY-=1
            if(posY<startJump-jumpHeight){
                clearInterval(timer)
                bird.src = '/img/birdDown.png'
            }
        }, 0.5)
        gravity = 1
    }
})

//Рестарт игры при падении
restartBtn.addEventListener('click', ()=>{
    playing = true
    posX = 150
    posY = 20
    gravity = 1
    gap = 140
    pipes = [
        {
            x:canvas.width,
            y:0,
        }
    ]
    score = 0
    jumpHeight = 40
    draw()
    modalFail.classList.remove('active')
})

//Пауза
document.addEventListener("keydown", (e)=>{
    if(e.key == 'Escape'){
        playing = false
        stopPlay.classList.add('active')
    }         
})

// Кнопка продолжения игры
continueBtn.addEventListener('click', ()=>{
    stopPlay.classList.remove('active')
    playing = true
    draw()
})
// Основнаяя функция отрисовки
function draw(){
    //
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bird, posX, posY);
    posY += gravity;
    gravity += 0.03;
    
    //Рисуем трубы
    for (let i=0; i<pipes.length; i++){
        context.drawImage(pipeUp, pipes[i].x, pipes[i].y);
        context.drawImage(pipeDown, pipes[i].x, pipes[i].y + pipeUp.height + gap);
        pipes[i].x -= 1

        if(pipes[i].x == 700){
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random()* pipeUp.height - pipeUp.height),
            })
        }

        // Обработка столкновений
        if(
            posX <= pipes[i].x + pipeUp.width-10//проверяет столкновение хвоста и трубы при взлете из трубы
            &&
            posX + bird.width >= pipes[i].x+10 //клювом въехали в трубу
            &&
            (
                posY <= pipes[i].y + pipeUp.height-10 //столкновение спинки с верхней трубой
                ||
                posY + bird.height >= pipes[i].y + pipeUp.height + gap+10 //столкновение лапок с нижней трубой
            )
            ||
            posY + bird.height >= canvas.height - ground.height+50+10 //столкновение птички с землей
            ||
            posY <= -20 //столкновение птички с небом
        ){
            final.play()
            playing = false
            modalFail.classList.add('active')
            scoreShow.innerHTML = score
        }

        // Проверка прохождения препятствия 
        if (pipes[i].x    == posX - 10){
            score++
            succes.play()
        }

    }

    // Рисуем землю
    context.drawImage(ground, 0, canvas.height - ground.height+50, canvas.width, ground.height);

    //Рисуем счетчик 
    context.fillStyle='green';
    context.font='24px sans-serif';
    context.fillText(`Score:${score}`, canvas.width/2 - 40, canvas.height - 20);
    
    
    
    if(playing){requestAnimationFrame(draw)}
}
// Первый запуск игры
ground.onload = draw
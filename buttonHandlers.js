

const newGameBtn = document.querySelector('#new-game');
const highscoreBtn = document.querySelector('#highscore');
const helpBtn = document.querySelector('#help');
const menuContent = document.querySelector('.inner-menu-container');
const template = document.querySelector('#template');


newGameBtn.addEventListener('click',start);
helpBtn.addEventListener('click',displayHelp);
highscoreBtn.addEventListener('click',displayHighscore);

function displayHelp(){
 menuContent.setAttribute('style','display:none');
 template.setAttribute('style','display:visible');
 template.innerHTML = `<img src='img/logo.png' style='padding-bottom:30px' alt='obrazek bąbelka'>
 <div class="description">
 Deflate bubble by clicking it, until it pops. Gain points by popping the bubbles. The smaller bubble gets, the faster it moves!
  </div>
 <button id='next'>Next >></button>`;
const nextBtn = document.querySelector('#next');
next.addEventListener('click',handleFirstNext);
};

function handleFirstNext(){
     template.innerHTML=`<img src='img/idle_bubbles.png' style="padding-bottom:10px">
     <div class='description'>Avoid touching blue bubbles, which appear as you increase the score! Each can devour bubble when it becomes smaller than their size.</div>
     <button id="second-next">Return</button>`;
     const secondNextBtn = document.querySelector('#second-next');
     secondNextBtn.addEventListener('click',handleLastNext);
};

function handleLastNext(){
     template.innerHTML=`<div class='description' style='min-height:300px; display:flex; align-items:center'>You can quit the game anytime by clicking the escape button.</div>
     <button id="return">Return</button>`;
     const returnBtn = document.querySelector('#return');
     returnBtn.addEventListener('click',handleReturn);
};

function handleReturn(){
template.setAttribute('style','display:none');
menuContent.setAttribute('style','display:visible');
}

function displayHighscore(){
     menuContent.setAttribute('style','display:none');
 template.setAttribute('style','display:visible');
 template.innerHTML = `<h2>Scoreboard</h2>
 <ul id="score-table"></ul> 
 <button id="return">Return</button>`;
  const returnBtn = document.querySelector('#return');
     returnBtn.addEventListener('click',handleReturn);
 const scoreTable = document.querySelector('#score-table');
 let actualStoredScore = JSON.parse(localStorage.highscore);
 for( let i = 0; i < actualStoredScore.length; i++){
     let listItem = document.createElement('li');
     const itemIndex = `img/trophy_${i+1}.png`;
     if(actualStoredScore[i] === 1){
         listItem.innerHTML = `<img class ="item-index" src ="${itemIndex}">${actualStoredScore[i]} point`;
     }
     else{
        listItem.innerHTML = `<img class ="item-index" src ="${itemIndex}">${actualStoredScore[i]} points`;
     }
     scoreTable.appendChild(listItem);
 }
    
};

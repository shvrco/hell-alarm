
//--------------//
//definisanje variabli i dohvatanje sa html-om
//--------------//

var clock = document.querySelector(".clock");
var clockDisplay = document.querySelector(".clockDisplay");
var gameDisplay = document.querySelector(".gameDisplay");
var submitButton = document.querySelector(".submitButton");
var setAgain = document.querySelector(".againButton");
var statusMessage = document.querySelector(".statusMessage");
var gameStatusMessage = document.querySelector(".gameStatusMessage");
var gameNumInput = document.querySelector("#guessNumberInput");
var minuteInput = document.querySelector("#minuteInput");
var hourInput = document.querySelector("#hourInput");
var numberLimitSpan = document.querySelector(".numberLimit");
var audio = new Audio("alarm.mp3");
var counter = 0;

var minuteInputVal, hourInputVal, alarmTime, currentTime, play,
correctNum, guessNum;

//--------------//
//funkcije startTime za prikaz trenutnog vremena
//--------------//

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  h = checkTime(h);
  m = checkTime(m);
  s = checkTime(s);
  var t = setTimeout(startTime, 500);
  clock.innerHTML = '<p>' +h+ '</p>' + ' : ' + '<p>' +m+ '</p>' + ' : ' + '<p>' +s+ '</p>';
  currentTime = h + " : "  + m;     
}

//--------------//
//funkcija checkTime za proveravanje
// da li je broj jednocifren i ima manje od 2 slova
//i dodaje nulu na te brojeve
//--------------//

function checkTime(i) {
  if (i < 10  && i.toString().length < 2) {
    i = "0" + i;
  }
  return i;
}

//--------------//
//funkcija getInputValue za dohvatanje vrednosti inputa
//provera vrednosti
// i upisivanje u alarm time
//--------------//

function getInputValue() {
  minuteInputVal = document.querySelector("#minuteInput").value;
  hourInputVal = document.querySelector("#hourInput").value;
  alarmTime = checkTime(hourInputVal) + " : " + checkTime(minuteInputVal);
  if (
    minuteInputVal > 59 ||
    hourInputVal > 23 ||
    minuteInputVal === "" ||
    hourInputVal === ""
  ) {
    alarmTime = null;
    inputError();
  } else {
    inputSuccess();
    compare(alarmTime);
  }
}

//--------------//
//dve funkcije success i error
//koje pozivaju dve funkcije za popunjavanje UI-a
//--------------//

function inputSuccess() {
  updateUiSuccess();
  resetInput();
}

function inputError() {
  updateUiError();
  resetInput();
  return;
}

//--------------//
//resetInput funkcija skida vrednosti sa inputa
//--------------//

function resetInput() {
  minuteInput.value = null;
  hourInput.value = null;
}

//--------------//
//dve funkcije za apdejtovanje UI,
//dve mogucnosti success i error
//--------------//

function updateUiSuccess() {
  statusMessage.style.display = "block";
  statusMessage.textContent = 'Your alarm is set at: ' + alarmTime;
  statusMessage.classList.remove("error");
  statusMessage.classList.add("success");
}

function updateUiError() {
  statusMessage.style.display = "block";
  statusMessage.textContent = "Sorry you have entered invalid value, please try again!";
  statusMessage.classList.remove("success");
  statusMessage.classList.add("error");
}

//--------------//
//funkcija compare uporedjuje na svakih sekund
//da li se vremena poklapaju i pokrece zvono kad dodje do toga
//--------------//

function compare() {
  var b = setTimeout(compare, 500);
  play = true;
  if (play) {
    if (currentTime === alarmTime) {
      clockDisplay.style.display = "none";
      audio.play();
      clearTimeout(b);
      numberGuesser();
    }
  }
}

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
  play = false;
}

//--------------//
//Igrica pomocu koje zaustavljam alarm
//--------------//

function numberGuesser() {
  setAgain.style.display = "none";
  gameDisplay.style.display = "block";
  numberLimit = 10;
  correctNum = Math.round(Math.random() * numberLimit);
  numberLimitSpan.textContent = numberLimit;
  gameNumInput.addEventListener("keypress", function(e) {
    if (e.keyCode === 13) {
      if (this.value >= 0 && this.value <= numberLimit && this.value !== " ") {
        guessNum = parseInt(this.value);
        if (guessNum === correctNum) {
          stopAudio();
          correctGuess();
        } else {
          gameStatusMessage.classList.add("error");
          gameStatusMessage.textContent = "You are wrong, try again!";
        }
      } else {
        gameStatusMessage.style.display = "block";
        gameStatusMessage.classList.add("error");
        gameStatusMessage.textContent = "Invalid input!";
        this.value = null;
      }
    }
  });
  console.log(correctNum);
}

//--------------//
//funkcija correctGuess za pogodjen broj
//--------------//

function correctGuess() {
  counter++;
  gameStatusMessage.classList.remove("error");
  gameStatusMessage.classList.add("success");
  gameStatusMessage.textContent = "You have stopped alarm!";
  setAgain.style.display = "block";
  setAgain.addEventListener("click", function() {
    if (counter <= 3) {
      init();
      clearSetAgain();
    } else {
      document.querySelector(".gameTitle").textContent =
        "Stop playing game and get up!";
      gameStatusMessage.style.display = "none";
      setAgain.style.display = "none";
      gameNumInput.style.display = "none";
    }
  });

}

function clearSetAgain() {
  guessNum.textContent =null;  
  correctNum = null; 
  clockDisplay.style.display = "block";
  gameStatusMessage.textContent = " ";
  statusMessage.textContent = " ";
  statusMessage.classList.remove("success");
  gameStatusMessage.classList.remove("success");
  statusMessage.style.display = "none";
}

//--------------//
//init funkcija za pokretanje
//--------------//

function init() {
  statusMessage.style.display = "none";
  gameDisplay.style.display = "none";
  startTime();
  submitButton.addEventListener("click", getInputValue);
}

init();

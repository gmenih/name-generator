var length = 0;
var lengthDOM = null;
var holder = null;
var placeholders = [];
var firstLetter = [];
var middleLetter = [];
var lastLetter = [];
window.addEventListener('load', function(){
  holder = document.getElementById('letter-holder');
  lengthDOM = document.getElementById('length');
  holder.innerHTML = "And it has!";
  length = new Number(lengthDOM.value);
  initPlaceholders();
  //load JSON
  sendRequest('./first-letter.json', function(data){
    firstLetter = JSON.parse(data.responseText);
  });
  sendRequest('./middle-letter.json', function(data){
    middleLetter = JSON.parse(data.responseText);
  });
  sendRequest('./last-letter.json', function(data){
    lastLetter = JSON.parse(data.responseText);
  });
});
document.getElementById('length').addEventListener('change', function() {
  var tempLength = new Number(lengthDOM.value);
  if(tempLength >= 3 && tempLength <= 11) {
    length = tempLength;
    initPlaceholders();
  } else {
    lengthDOM.value = length;
    error("The length must be between 3 and 15 letters.");
  }
});
document.getElementById('increase').addEventListener('click', function() {
  length++;
  if(length >= 3 && length <= 11) {
    lengthDOM.value = length;
    addPlaceholder();
  } else {
    length--;
    error("The length must be between 3 and 15 letters.");
  }
});
document.getElementById('decrease').addEventListener('click', function() {
  length--;
  if(length >= 3 && length <= 11) {
    lengthDOM.value = length;
    removePlaceholder();
  } else {
    length++;
    error("The length must be between 3 and 15 letters.");
  }
});
document.getElementById('generate').addEventListener('click', function() {
  var firstIndex = Math.round(Math.random() * 25);
  var prev = firstLetter[firstIndex];
  document.getElementById(placeholders[0]).innerHTML = String.fromCharCode(65 + firstIndex);
  var i = 1;
  var interval = setInterval(function(){
    var chance = getChance();
    if(i < length - 1){
      var sum = 0;
      for(var j = prev.table.length - 1; j >= 0; j--) {
        var frequency = prev.table[j].frequency;
        if((chance > sum) && (chance < sum + frequency)) {
          prev = middleLetter[prev.table[j].letter.charCodeAt(0) - 65];
          break;
        }
        sum += prev.table[j].frequency;
      }
      document.getElementById(placeholders[i]).innerHTML = prev.letter;
    } else if(i < length){
      prev = lastLetter[(prev.letter.charCodeAt(0) - 65)];
      var sum = 0;
      for(var j = prev.table.length - 1; j >= 0; j--) {
        var frequency = prev.table[j].frequency;
        if((chance > sum) && (chance < sum + frequency)) {
          prev = lastLetter[prev.table[j].letter.charCodeAt(0) - 65];
          break;
        }
        sum += prev.table[j].frequency;
      }
      document.getElementById(placeholders[i]).innerHTML = prev.letter;
    } else {
      clearInterval(interval);
    }
    i++;
  },200);
});

function getChance() {
  return (Math.random() * 100).toFixed(4);
}
function initPlaceholders() {
  holder.innerHTML = "";
  var i = 0;
  var interval = setInterval(function() {
    if(i < length){
      holder.innerHTML += '<div class="placeholder" id="ph-' + (1 + i) + '"><span>'+(String.fromCharCode(65 + i))+'<span></div>';
      placeholders.push('ph-' + (i + 1));
    } else {
      clearInterval(interval);
    }
    i++;
  }, 1);
}
function addPlaceholder() {
  holder.innerHTML += '<div class="placeholder" id="ph-' + (length) + '"><span>'+(String.fromCharCode(64 + length))+'<span></div>';
  placeholders.push('ph-' + length);
}
function removePlaceholder() {
  holder.removeChild(holder.childNodes[holder.childNodes.length - 1]);
  placeholders.pop();
}

function error(msg) {
  console.error(msg);
}

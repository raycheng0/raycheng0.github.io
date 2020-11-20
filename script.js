var timerEl, timer, interval, timeout, player1, player2, clickTime, switchTime;
var delayTime = 0;
var defaultPlayer = 0;

var x1 = document.getElementById("player-container1");
var x2 = document.getElementById("player-container2");

var conf1 = {
  key: '265f564f-53c8-4acf-8b6f-2a74c8df681e',
  analytics: {
    key: 'ae793699-51a4-495a-92b5-26785f06f761',
  },
  playback: {
    autoplay: true,
    muted: false
  },
  //events: {
  //  timechanged: onTimeChanged1
  //},
};

var conf2 = {
  key: '265f564f-53c8-4acf-8b6f-2a74c8df681e',
  analytics: {
    key: 'ae793699-51a4-495a-92b5-26785f06f761',
    videoId: 'channel-switching'
  },
  playback: {
    autoplay: true,
    muted: false
  },
  //events: {
  //  timechanged: onTimeChanged2
  //},
};

function resetButtons() {
  var container = document.querySelector('.button-container');
  var buttons = container.getElementsByTagName('button');

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].removeAttribute('disabled');
    var info = buttons[i].querySelector('.timer');
    if (info) {
      info.innerText = '';
    }
  }
}

function updateTimer(time) {
  if (!timerEl) {
    return;
  }

  timer = time;
  timerEl.innerText = ' (' + time + ')';
}

function resetTimer() {
  if (!timerEl) {
    return;
  }

  timer = null;
  timerEl.innerText = '';
  timerEl = null;
}

function disableButton() {
  if (!timerEl) {
    return;
  }

  timerEl.parentElement.setAttribute('disabled', 'disabled');
  resetTimer();
}

    
function onTimeChanged1() {
  if (!clickTime || switchTime) {
    return;
  }
  x2.style.display = "none";
  x1.style.display = "block";
  player2.unload();
  
  switchTime = Date.now();
  var diffTime = switchTime - clickTime - delayTime;
  var diffEl = document.getElementById('switch-time');
  diffEl.innerText = 'First frame after ' + diffTime + 'ms';
}

function onTimeChanged2() {
  if (!clickTime || switchTime) {
    return;
  }
  x1.style.display = "none";
  x2.style.display = "block";
  player1.unload();
  
  switchTime = Date.now();
  var diffTime = switchTime - clickTime - delayTime;
  var diffEl = document.getElementById('switch-time');
  diffEl.innerText = 'First frame after ' + diffTime + 'ms';
}

function resetDiff() {
  document.getElementById('switch-time').innerHTML = 'Waiting for first frame...';
  clickTime = null;
  switchTime = null;
}

function switchChannel(channelID, event) {
  var delay = 0;

  resetButtons();

  if (event) {
    
    resetDiff();
    clickTime = Date.now();
  }

  if (event && event.target) {
    timerEl = event.target.querySelector('.timer');
  }

  if (delayTime > 0 && timerEl) {
    updateTimer(delayTime / 1000);
    delay = delayTime;
    
    clearInterval(interval);
    interval = setInterval(function () {
      updateTimer(--timer);
    }, 1000);
  }

  clearTimeout(timeout);
    
  timeout = setTimeout(function () {
    disableButton();

    var source;
    if (channelID === '1') {
      source = {
        title: 'Source 1',
        description: '',
        dash: 'http://35.241.110.86/llc/jc1/manifest.mpd'
      }
    } else if (channelID === '2') {
      source = {
        title: 'Source 2',
        description: '',
        dash: 'https://bitmovin-a.akamaihd.net/content/sintel/sintel.mpd'
      };
    } else {
      source = {
        title: 'Source 3',
        description: '',
        dash: 'http://35.241.110.86/llc/jc2/manifest.mpd'        
      }
    }

    if (defaultPlayer === 1) {
         player2.load(source);
         defaultPlayer = 2;
    } else if (defaultPlayer === 2) {
        player1.load(source);
        defaultPlayer = 1;
    } else {
        player1.load(source);
        defaultPlayer = 1;
    }
  }, delay);
}

(function () {
  var playerContainer1 = document.getElementById('player-container1');
  player1 = new bitmovin.player.Player(playerContainer1, conf1);

  var playerContainer2 = document.getElementById('player-container2');
  player2 = new bitmovin.player.Player(playerContainer2, conf2);

  x1.style.display = "block";
  x2.style.display = "none";

  switchChannel('1');
    
  player1.on(bitmovin.player.PlayerEvent.Playing, function (data) {
    onTimeChanged1();
  });
  
  player2.on(bitmovin.player.PlayerEvent.Playing, function (data) {
    onTimeChanged2();
  });  
})();

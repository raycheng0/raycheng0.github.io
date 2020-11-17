var timerEl, timer, interval, timeout, player1, player2, clickTime, switchTime;
var delayTime = 0;
var defaultPlayer = 0;

var x1 = document.getElementById("player-container1");
var x2 = document.getElementById("player-container2");

var conf1 = {
  //key: '29ba4a30-8b5e-4336-a7dd-c94ff3b25f30',
  key: '265f564f-53c8-4acf-8b6f-2a74c8df681e',
  analytics: {
    //key: '45adcf9b-8f7c-4e28-91c5-50ba3d442cd4',
    key: 'ae793699-51a4-495a-92b5-26785f06f761',
    //videoId: 'channel-switching'
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
  //key: '29ba4a30-8b5e-4336-a7dd-c94ff3b25f30',
  key: '265f564f-53c8-4acf-8b6f-2a74c8df681e',
  analytics: {
    //key: '45adcf9b-8f7c-4e28-91c5-50ba3d442cd4',
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
  console.log("test3");
    x2.style.display = "none";
    x1.style.display = "block";
  //player2.pause();
  player2.unload();
    player1.setVideoQuality('720_1096000');
  
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
    //player1.pause();
    player1.unload();
    console.log("test4");
    player2.setVideoQuality('720_1096000');
    
    
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
  //console.log('event.target');
  //console.log(JSON.stringify(event.target));

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
        //title: '\u5947\u5999\u96FB\u8996',
        //title: 'CGTN1',
        title: 'Cantonese',
        description: '',
        hls: 'http://media.fantv.hk/m3u8/archive/channel2.m3u8'
        //hls: 'http://live.cgtn.com/cctv-r.m3u8'
        //hls: 'http://streaming.macaudsat.com/test/can.m3u8'
        //hls: 'https://cmaflive-test.akamaized.net/cmaf/live/2013021/Cantonese/Cantonese_CMAF_Primary/playlist.m3u8'
        //hls: 'http://34.92.250.197/llc/mk/manifest.mpd'
      }
    } else if (channelID === '2') {
      source = {
        //title: '\u9999\u6E2F\u96FB\u53F031\u53F0',
        //title: 'CGTN2',
        title: 'English',
        description: '',
        //hls: 'http://rthklive1-lh.akamaihd.net/i/rthk31_1@167495/index_810_av-b.m3u8?sd=10&rebase=on'
        //hls: 'http://live.cgtn.com/manifest.m3u8'
        //hls: 'http://streaming.macaudsat.com/test/eng.m3u8'
        //hls: 'https://cmaflive-test.akamaized.net/cmaf/live/2013021/English/English_CMAF_Primary/playlist.m3u8'
        dash: 'http://34.92.250.197/llc/mk/manifest.mpd'
      };
    } else {
      source = {
        //title: '\u6FB3\u8996\u885B\u661F',
        title: 'Putonghua',
        description: '',
        hls: 'http://live4.tdm.com.mo/ch3/_definst_/ch3.live/playlist.m3u8'
        //hls: 'https://cmaflive-test.akamaized.net/cmaf/live/2013021/Putonghua/Putonghua_CMAF_Primary/playlist.m3u8'
        //hls: 'http://34.92.250.197/llc/mk/manifest.mpd'
        
      }
    }

    if (defaultPlayer === 1) {
         player2.load(source);
         player2.setVideoQuality('360_564000');
         defaultPlayer = 2;
         console.log("test1");
    } else if (defaultPlayer === 2) {
        player1.load(source);
        player1.setVideoQuality('360_564000');
        defaultPlayer = 1;
        console.log("test2");
    } else {
        player1.load(source);
        player1.setVideoQuality('720_1096000');
        defaultPlayer = 1;
        console.log("test5");
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
    console.log("On Ready1: " + JSON.stringify(data));
  });
  
  player2.on(bitmovin.player.PlayerEvent.Playing, function (data) {
    onTimeChanged2();
    console.log("On Ready2: " + JSON.stringify(data));
  });
  
})();

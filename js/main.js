// dom & audio
const gui = {
  blink01: document.getElementById('blink-01'),
  bpmSlider: document.getElementById('bpm-slider'),
  bpmPlayPause: document.getElementById('bpm-play-pause'),
  // aClick01: new Audio('./audio/clack-hi.mp3'),
  // aClick02: new Audio('./audio/clack-lo.mp3'),
  aClick01: document.getElementById('a-click-01'),
  aClick02: document.getElementById('a-click-02'),
  meterBlock: document.getElementsByClassName('meter-block')[0],
  beatMeter: document.getElementById('container-beat-meter'),
  meterBtns: document.getElementsByClassName('meter-btn'),
  rangeNos: document.getElementById('range-nos').getElementsByTagName('li'),
  tapBtn: document.getElementById('btn-tap'),
  icons: {
    play: document.getElementById('icon-play'),
    pause: document.getElementById('icon-pause')
  }
}

// numbers & flags pertaining to rhythm & timeout
var beat = {
  running: false,
  bpmTimeout: undefined,
  meterTimeout: undefined,
  bpmCalc: 60,
  offset: 120,
  meter: [4,4],
  meterInc: 0,
  meterFrag: document.createDocumentFragment(),
  firstTapFlag: false,
  tapTimeoutArray: [],
  tapTimeoutInc: 0,
  tapTimeout: null,
  adjStart: undefined,
  adjDiff: undefined
}

const touchEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown'

// const tock = new Tock()

// set at 60 for refreshes
gui.bpmSlider.value = 60

// play/pause - bpm btn toggle
gui.blink01.addEventListener(touchEvent, function() {
  playPause()
})

// play/pause - space key
document.addEventListener('keydown', function(e) {
  if (e.keyCode === 32) {
    playPause()
  }
})

// toggle for playing & pausing
function playPause() {
  // stop
  if (beat.running) {
    clearInterval(beat.bpmTimeout)
    clearInterval(beat.meterTimeout)
    beat.running = false
    gui.icons.play.style.display = 'block'
    gui.icons.pause.style.display = 'none'
  // start
  } else {
    beat.running = true
    startAnimating()  
    gui.icons.play.style.display = 'none'
    gui.icons.pause.style.display = 'block'
  }  
}

// bpm slider
// update display value on move
gui.bpmSlider.addEventListener('input', function() {
  // display value
  gui.bpmPlayPause.innerHTML = this.value
  beat.bpmCalc = this.value
})

// bpm slider
// update value, but don't affect playing
// this only occurs on release (can use for play/pause)
// gui.bpmSlider.addEventListener('change', function() {
//   // display value
//   gui.bpmPlayPause.innerHTML = this.value
// })

// bpm start
function startAnimating() {

  beat.adjStart = Date.now()
  
  beat.meterInc = 0
  let beatHolder = beat.meterInc

  // beat first meter block
  gui.meterBlocks[beatHolder].classList.add('flash')
  setTimeout(function() {
    gui.meterBlocks[beatHolder].classList.remove('flash')
  },100)

  // beat once immediately
  gui.blink01.classList.add('flash-01')
  gui.aClick01.play()
  setTimeout(function() {
    gui.blink01.classList.remove('flash-01')
  },100)

  // get bpm & setInterval
  let bpm = 1000 / (beat.bpmCalc / 60)

  // start meter & beat Timeouts
  beat.meterTimeout = setTimeout(runMeter, bpm-beat.offset)
  beat.bpmTimeout = setTimeout(runBeat, bpm)

  beat.meterInc++

}

//
// meter timeout loop. plays offset before beat timeout
//

function runMeter() {

  if (beat.meterInc > beat.meter[0]-1) {
    beat.meterInc = 0
  }

  let beatHolder = beat.meterInc
  let bpm = 1000 / (beat.bpmCalc / 60)
  
  // beat meter blocks
  gui.meterBlocks[beatHolder].classList.add('flash')
  setTimeout(function() {
    gui.meterBlocks[beatHolder].classList.remove('flash')
  },150)

}

//
// bpm timeout
//

function runBeat() {

  // adjust compensate for inconsistent setTimeout timing
  let bpm = 1000 / (beat.bpmCalc / 60)
  beat.adjDiff = Date.now()
  let adjFix = beat.adjDiff - beat.adjStart - bpm
  // zero start value for loop
  beat.adjStart = beat.adjDiff

  let blinkFlashName = ''
  let beatAudioName = ''
  
  // greater than max, stop to 0
  // if (beat.meterInc > beat.meter[0]-1) {
  // (note) runMeter() has already scaled this to 0 above
  if (beat.meterInc === 0) {
    beat.meterInc = 0
    // use first colour & sound
    blinkFlashName = 'flash-01'
    beatAudioName = 'aClick01'
  }
  // after first beat
  else {
    // use regular colour & sound
    blinkFlashName = 'flash'
    beatAudioName = 'aClick02'
  }

  let beatHolder = beat.meterInc

  // beat audio & flash
  gui.blink01.classList.add(blinkFlashName)
  gui[beatAudioName].play()
  // hide
  setTimeout(function() {
    gui.blink01.classList.remove(blinkFlashName)
  },100)

  var time = 0
  var elapsed = '0.0'

  // loop runBeat()
  if (beat.running) {
    beat.bpmTimeout = setTimeout(runBeat, bpm-adjFix)
    beat.meterTimeout = setTimeout(runMeter, bpm-beat.offset-adjFix)
  }
  
  // count time
  beat.meterInc++

}

//
// change bpm var value, btn display, and slider range value
//

function changeBpm(bpm) {
  // play/pause btn display
  gui.bpmPlayPause.innerHTML = bpm
  // range slider
  gui.bpmSlider.value = bpm
  // var holder for bpm number
  beat.bpmCalc = bpm
}

//
// meter blocks
//

function meterBlockCount() {
  gui.beatMeter.innerHTML = ''
  for (var x=0; x<beat.meter[0]; x++) {
    let block = document.createElement('div')
    block.classList.add('meter-block')
    beat.meterFrag.appendChild(block)
  }

  gui.beatMeter.appendChild(beat.meterFrag)
  gui.meterBlocks = document.getElementsByClassName('meter-block')  
}

meterBlockCount()

//
// meter btns
//

for (var x=0; x<gui.meterBtns.length; x++) {
  (function(index) {
    gui.meterBtns[index].addEventListener(touchEvent, function() {
      clearMeterBtnSel()
      this.classList.add('sel')
      let meterData = this.getAttribute('data-meter-0')
      beat.meter[0] = Number(meterData)
      meterBlockCount()
    })
  })(x)
}

function clearMeterBtnSel() {
  for (var y=0; y<gui.meterBtns.length; y++) {
    gui.meterBtns[y].classList.remove('sel')
  }
}

//
// change bpm via range numbers
//

Array.from(gui.rangeNos).forEach((noCl) => {
  noCl.addEventListener(touchEvent, function() {
    // grab val
    let num = Number(this.innerHTML)
    // assign
    changeBpm(num)
  })
})

//
// tap bpm
//

gui.tapBtn.addEventListener(touchEvent, function() {

  // don't add on first click. will be 0
  if (beat.firstTapFlag) {
    clearInterval(beat.tapTimeout)
    beat.tapTimeoutArray.push(Math.round(6000/beat.tapTimeoutInc))
    beat.tapTimeoutInc = 0
    
    // limit array length to keep bpm input fresh
    if (beat.tapTimeoutArray.length > 5) {
      beat.tapTimeoutArray = beat.tapTimeoutArray.slice(1)
    }

    // change bpm
    changeBpm(getAvg())
    
  // enable pushing after first click
  } else {
    beat.firstTapFlag = true
  }
  
  // counting interval for bpm
  beat.tapTimeout = setInterval(function() {
    beat.tapTimeoutInc++

    // clear values & timeout if delay runs longer than lowest bpm
    if (beat.tapTimeoutInc > 500) {
      clearInterval(beat.tapTimeout)
      beat.tapTimeoutArray = []
    }
  },10)
  
})

// average array indices
function getAvg() {
  var sum = 0
  for (var i=0; i<beat.tapTimeoutArray.length; i++) {
    sum+= beat.tapTimeoutArray[i]
  }
  return Math.round(sum/beat.tapTimeoutArray.length)
}
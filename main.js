// dom & audio
const gui = {
  blink01: document.getElementById('blink-01'),
  iBpm: document.getElementById('i-bpm'),
  bpmReadout: document.getElementById('bpm-readout'),
  btnSS: document.getElementById('btn-start-stop'),
  demo: document.getElementById('demo'),
  aClick01: document.getElementById('a-click-01'),
  aClick02: document.getElementById('a-click-02'),
  meterBlock: document.getElementsByClassName('meter-block')[0],
  beatMeter: document.getElementById('container-beat-meter'),
  meterBtns: document.getElementsByClassName('meter-btn')
}

// numbers & flags pertaining to rhythm & animation
var beat = {
  running: false,
  bpmAnimation: undefined,
  meter: [4,4],
  meterInc: 0,
  meterFrag: document.createDocumentFragment()
}

const touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click'

// set at 60 for refreshes
gui.iBpm.value = 60

// bpm btn toggle
gui.blink01.addEventListener(touchEvent, function() {
  // stop
  if (beat.running) {
    clearInterval(beat.bpmAnimation)
    beat.running = false
  // start
  } else {
    beat.running = true
    startAnimating()  
  }
})

// bpm slider
// update display value on move
gui.iBpm.addEventListener('input', function() {
  // display value
  gui.bpmReadout.innerHTML = this.value
})

// bpm slider
// update value & play (if playing) on release
gui.iBpm.addEventListener('change', function() {
  // display value
  gui.bpmReadout.innerHTML = this.value

  // clear & start again
  if (beat.running) {
    clearInterval(beat.bpmAnimation)
    startAnimating()
  // clear
  } else {
    clearInterval(beat.bpmAnimation)
  }

})

// bpm start
function startAnimating() {

  // beat once immediately
  beat.meterInc = 0
  gui.blink01.classList.add('flash-01')
  gui.aClick01.play()
  setTimeout(function() {
    gui.blink01.classList.remove('flash-01')
  },100)

  // inc through meter blocks
  gui.meterBlocks[beat.meterInc].classList.add('flash')
  let beatHolder = beat.meterInc
  setTimeout(function() {
    gui.meterBlocks[beatHolder].classList.remove('flash')
  },100)

  beat.meterInc++

  // get bpm & setInterval
  let bpm = 1000 / (gui.iBpm.value / 60)
  beat.bpmAnimation = setInterval(animate, bpm)  

}

// bpm animation
function animate() {
  
  // greater than max, reset to 0
  if (beat.meterInc > beat.meter[0]-1) {
    beat.meterInc = 0
    gui.blink01.classList.add('flash-01')
    gui.aClick01.play()

    // hide
    setTimeout(function() {
      gui.blink01.classList.remove('flash-01')
    },100)    

  }
  // after first beat
  else {
    gui.blink01.classList.add('flash')
    gui.aClick02.play()

    // hide
    setTimeout(function() {
      gui.blink01.classList.remove('flash')
    },100)

  }

  // inc through meter blocks
  gui.meterBlocks[beat.meterInc].classList.add('flash')
  let beatHolder = beat.meterInc
  setTimeout(function() {
    gui.meterBlocks[beatHolder].classList.remove('flash')
  },100)

  // count time
  beat.meterInc++
  
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
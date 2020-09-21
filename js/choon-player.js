/*
 * Audio controls for the browser audio player
 *
 * Version: 2.0
 * Date: 12 September 2020
 */

"use strict";

/*
 ###############################################################################
 #
 # Comment out the line with "console.log" to turn off console logging
 #
 ################################################################################
*/
function myDebug(message) {
    console.log(message);
}

var BeginLoopTime = 0;
var EndLoopTime = 0;
var PreviouspButton = null;
var CurrentAudioSlider = null;


function createAudioPlayer() {
    var audioPlayer = `
<!-- declare an Audio Player for this page-->
<audio id="OneAudioPlayer">
    <source id="mp3Source" type="audio/mp3"></source> 
    Your browser does not support the audio format.
</audio>`;

    return (audioPlayer);
}

function createMP3player(tuneID, mp3url) {
    // build the MP3 player for each tune
    var mp3player = `
<!-- MP3 player -->
<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">
    <div id="audioPlayer-${tuneID}" class="choon-audioParent">
        <!-- audio slider -->
        <div id="positionMP3-${tuneID}" "class="choon-mp3AudioControl"></div>
	<!-- loop control -->
	<div class="choon-mp3LoopControl">
            <span title="Play tune, select loop starting point, then select loop end point">
                <input type="button" class="choon-loopButton" id="LoopStart" value=" Loop Start " onclick="setFromSlider()" />
                <input type="button" class="choon-loopButton" id="LoopEnd" value=" Loop End " onclick="setToSlider()" />
                <input type="button" class="choon-loopButton" id="Reset" value=" Reset " onclick="resetFromToSliders()" />
            </span>
        </div>
        <!-- speed slider -->
        <div id="speedControl-${tuneID}" class="choon-mp3SpeedControl">
            <span title="Adjust playback speed with slider">
                <div id="speedSliderMP3-${tuneID}"></div>
            </span>
        </div>                
        <!-- play button -->
        <button id="playMP3-${tuneID}" class="choon-playButton" onclick="playAudio(${tuneID}, '${mp3url}')"></button>
    </div>
</form>
<!-- END of MP3player -->`;

    return (mp3player);
}

function createSliders(tuneID) {
    var audioSlider = document.getElementById(`positionMP3-${tuneID}`);
    var speedSlider = document.getElementById(`speedSliderMP3-${tuneID}`);

    noUiSlider.create(audioSlider, {
        start: [0, 0, 100],
        connect: [false, true, true, false],
        behaviour: 'drag',
        step: 0.25,
        range: {
            'min': 0,
            'max': 100
        }
    });

    noUiSlider.create(speedSlider, {
        start: [100],
        tooltips: [wNumb({
            decimals: 0,
            prefix: 'Speed: ',
            postfix: ' %'
        })],
        range: {
            'min': 51,
            'max': 121
        }
    });

    audioSlider.noUiSlider.on('change', function (values, handle) {
        if (handle === 0) {
            BeginLoopTime = values[0];
            EndLoopTime = assignEndLoopTime(values[2]);
        } else if (handle === 2) {
            BeginLoopTime = values[0];
            EndLoopTime = assignEndLoopTime(values[2]);
        } else if (handle === 1) {
            OneAudioPlayer.currentTime = values[1];
        }
    });
    audioSlider.noUiSlider.on('start', function (value) {
        OneAudioPlayer.onplaying = function () {
            OneAudioPlayer.pause();
        };
    });
    audioSlider.noUiSlider.on('end', function (value) {
        OneAudioPlayer.onplaying = function () {
            OneAudioPlayer.play();
        };
    });

    speedSlider.noUiSlider.on('change', function (value) {
        //myDebug("playbackRate: " + value / 100);
        OneAudioPlayer.playbackRate = value / 100;
    });
    // How to disable handles on audioslider.
    speedSlider.noUiSlider.on('start', function (value) {
        OneAudioPlayer.onplaying = function () {
            OneAudioPlayer.pause();
        };
    });
    speedSlider.noUiSlider.on('end', function (value) {
        OneAudioPlayer.onplaying = function () {
            OneAudioPlayer.play();
        };
    });
}

function playAudio(tuneID, audioSource) {
    var playButton = document.getElementById(`playMP3-${tuneID}`);
    var playPosition = document.getElementById(`positionMP3-${tuneID}`);
    var speedSlider = document.getElementById(`speedSliderMP3-${tuneID}`);

    if (playButton.className == "choon-playButton") {
        if (!OneAudioPlayer.src.includes(audioSource)) {
            if (OneAudioPlayer.src != null) { //reset previous audio player
                if (PreviouspButton != null) {
                    PreviouspButton.className = "playButton";
                }
            }
            PreviouspButton = playButton;
            OneAudioPlayer.src = audioSource;
            playPosition.noUiSlider.updateOptions({
                tooltips: [true, true, true],
            });
            CurrentAudioSlider = playPosition;

            OneAudioPlayer.onloadedmetadata = function () {
                initialiseAudioSlider();
            };
        }
        // Initialise the loop and audioSlider
        if (!EndLoopTime) {
            EndLoopTime = OneAudioPlayer.duration;
        }

        // This event listener keeps track of the cursor and restarts the loops
        // when needed - we don't need to set it elsewhere
        OneAudioPlayer.addEventListener("timeupdate", positionUpdate);
        OneAudioPlayer.addEventListener("ended", restartLoop);

        OneAudioPlayer.playbackRate = speedSlider.noUiSlider.get() / 100;

        playButton.className = "";
        playButton.className = "choon-pauseButton";
        var playPromise = OneAudioPlayer.play();
        if (playPromise) {
            playPromise.catch(function (error) {
                console.error(error);
            });
        }
    } else {
        playButton.className = "";
        playButton.className = "choon-playButton";
        OneAudioPlayer.pause();
    }

}

function initialiseAudioSlider() {
    //myDebug('initialiseAudioSlider: ' + OneAudioPlayer.duration);
    CurrentAudioSlider.noUiSlider.updateOptions({
        range: {
            'min': 0,
            'max': OneAudioPlayer.duration
        }
    });
    resetFromToSliders();
}

function positionUpdate() {
    if (OneAudioPlayer.currentTime >= EndLoopTime) {
        //myDebug("Current time: " + OneAudioPlayer.currentTime);
        OneAudioPlayer.currentTime = BeginLoopTime;
        //myDebug("Reset loop start to: " + OneAudioPlayer.currentTime);
    }
    CurrentAudioSlider.noUiSlider.setHandle(1, OneAudioPlayer.currentTime);
}

function restartLoop() {
    OneAudioPlayer.currentTime = BeginLoopTime;
    //myDebug("Restarting loop at: " + OneAudioPlayer.currentTime);
    OneAudioPlayer.play();
}

function setFromSlider() {
    CurrentAudioSlider.noUiSlider.setHandle(0, OneAudioPlayer.currentTime);
    BeginLoopTime = OneAudioPlayer.currentTime;
}

function setToSlider() {
    CurrentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.currentTime);
    EndLoopTime = OneAudioPlayer.currentTime;
}

function resetFromToSliders() {
    CurrentAudioSlider.noUiSlider.setHandle(0, 0);
    BeginLoopTime = 0;
    CurrentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.duration);
    EndLoopTime = OneAudioPlayer.duration;
}

function assignEndLoopTime(endLoopValue) {
    // Don't allow EndLoopTime to be >= OneAudioPlayer.duration
    if (endLoopValue > OneAudioPlayer.duration) {
        endLoopValue = OneAudioPlayer.duration;
    }
    return (endLoopValue);
}
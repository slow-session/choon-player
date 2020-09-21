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
function choon_Debug(message) {
    console.log(message);
}

var choon_BeginLoopTime = 0;
var choon_EndLoopTime = 0;
var choon_PreviouspButton = null;
var choon_CurrentAudioSlider = null;

function choon_createAudioPlayer() {
    var audioPlayer = `
<!-- declare an Audio Player for this page-->
<audio id="AudioPlayer">
    <source id="choon-MP3Source" type="audio/mp3"></source> 
    Your browser does not support the audio format.
</audio>`;

    return (audioPlayer);
}

function choon_createMP3player(tuneID, mp3url) {
    // build the MP3 player for each tune
    var mp3player = `
<!-- MP3 player -->
<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">
    <div id="choon-MP3Player-${tuneID}" class="choon-audioParent">
        <!-- audio slider -->
        <div id="choon-positionMP3-${tuneID}" "class="choon-mp3AudioControl"></div>
	<!-- loop control -->
	<div class="choon-mp3LoopControl">
            <span title="Play tune, select loop starting point, then select loop end point">
                <input type="button" class="choon-loopButton"
id="LoopStart" value=" Loop Start " onclick="choon_setFromSlider()" />
                <input type="button" class="choon-loopButton"
id="LoopEnd" value=" Loop End " onclick="choon_setToSlider()" />
                <input type="button" class="choon-loopButton"
id="Reset" value=" Reset " onclick="choon_resetFromToSliders()" />
            </span>
        </div>
        <!-- speed slider -->
        <div id="choon-speedControl-${tuneID}" class="choon-mp3SpeedControl">
            <span title="Adjust playback speed with slider">
                <div id="choon-speedSliderMP3-${tuneID}"></div>
            </span>
        </div>                
        <!-- play button -->
        <button id="choon-playMP3-${tuneID}" class="choon-playButton"
onclick="choon_playAudio(${tuneID}, '${mp3url}')"></button>
    </div>
</form>
<!-- END of MP3player -->`;

    return (mp3player);
}

function choon_createSliders(tuneID) {
    var audioSlider = document.getElementById(`choon-positionMP3-${tuneID}`);
    var speedSlider = document.getElementById(`choon-speedSliderMP3-${tuneID}`);

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
            choon_BeginLoopTime = values[0];
            choon_EndLoopTime = choon_assignEndLoopTime(values[2]);
        } else if (handle === 2) {
            choon_BeginLoopTime = values[0];
            choon_EndLoopTime = choon_assignEndLoopTime(values[2]);
        } else if (handle === 1) {
            AudioPlayer.currentTime = values[1];
        }
    });
    audioSlider.noUiSlider.on('start', function (value) {
        AudioPlayer.onplaying = function () {
            AudioPlayer.pause();
        };
    });
    audioSlider.noUiSlider.on('end', function (value) {
        AudioPlayer.onplaying = function () {
            AudioPlayer.play();
        };
    });

    speedSlider.noUiSlider.on('change', function (value) {
        //choon_Debug("playbackRate: " + value / 100);
        AudioPlayer.playbackRate = value / 100;
    });
    // How to disable handles on audioslider.
    speedSlider.noUiSlider.on('start', function (value) {
        AudioPlayer.onplaying = function () {
            AudioPlayer.pause();
        };
    });
    speedSlider.noUiSlider.on('end', function (value) {
        AudioPlayer.onplaying = function () {
            AudioPlayer.play();
        };
    });
}

function choon_playAudio(tuneID, audioSource) {
    var playButton = document.getElementById(`choon-playMP3-${tuneID}`);
    var playPosition = document.getElementById(`choon-positionMP3-${tuneID}`);
    var speedSlider = document.getElementById(`choon-speedSliderMP3-${tuneID}`);

    if (playButton.className == "choon-playButton") {
        if (!AudioPlayer.src.includes(audioSource)) {
            if (AudioPlayer.src != null) { //reset previous audio player
                if (choon_PreviouspButton != null) {
                    choon_PreviouspButton.className = "choon-playButton";
                }
            }
            choon_PreviouspButton = playButton;
	    AudioPlayer.src = audioSource;
            playPosition.noUiSlider.updateOptions({
                tooltips: [true, true, true],
            });
            choon_CurrentAudioSlider = playPosition;

            AudioPlayer.onloadedmetadata = function () {
                choon_initialiseAudioSlider();
            };
        }
        // Initialise the loop and audioSlider
        if (!choon_EndLoopTime) {
            choon_EndLoopTime = AudioPlayer.duration;
        }

        // This event listener keeps track of the cursor and restarts the loops
        // when needed - we don't need to set it elsewhere
        AudioPlayer.addEventListener("timeupdate", choon_positionUpdate);
        AudioPlayer.addEventListener("ended", choon_restartLoop);

        AudioPlayer.playbackRate = speedSlider.noUiSlider.get() / 100;

        playButton.className = "";
        playButton.className = "choon-pauseButton";
        var playPromise = AudioPlayer.play();
        if (playPromise) {
            playPromise.catch(function (error) {
                console.error(error);
            });
        }
    } else {
        playButton.className = "";
        playButton.className = "choon-playButton";
        AudioPlayer.pause();
    }

}

function choon_initialiseAudioSlider() {
    //choon_Debug('initialiseAudioSlider: ' + AudioPlayer.duration);
    choon_CurrentAudioSlider.noUiSlider.updateOptions({
        range: {
            'min': 0,
            'max': AudioPlayer.duration
        }
    });
    choon_resetFromToSliders();
}

function choon_positionUpdate() {
    if (AudioPlayer.currentTime >= choon_EndLoopTime) {
        //choon_Debug("Current time: " + AudioPlayer.currentTime);
        AudioPlayer.currentTime = choon_BeginLoopTime;
        //choon_Debug("Reset loop start to: " + AudioPlayer.currentTime);
    }
    choon_CurrentAudioSlider.noUiSlider.setHandle(1, AudioPlayer.currentTime);
}

function choon_restartLoop() {
    AudioPlayer.currentTime = choon_BeginLoopTime;
    //choon_Debug("Restarting loop at: " + AudioPlayer.currentTime);
    AudioPlayer.play();
}

function choon_setFromSlider() {
    choon_CurrentAudioSlider.noUiSlider.setHandle(0, AudioPlayer.currentTime);
    choon_BeginLoopTime = AudioPlayer.currentTime;
}

function choon_setToSlider() {
    choon_CurrentAudioSlider.noUiSlider.setHandle(2, AudioPlayer.currentTime);
    choon_EndLoopTime = AudioPlayer.currentTime;
}

function choon_resetFromToSliders() {
    choon_CurrentAudioSlider.noUiSlider.setHandle(0, 0);
    choon_BeginLoopTime = 0;
    choon_CurrentAudioSlider.noUiSlider.setHandle(2, AudioPlayer.duration);
    choon_EndLoopTime = AudioPlayer.duration;
}

function choon_assignEndLoopTime(endLoopValue) {
    // Don't allow choon_EndLoopTime to be >= AudioPlayer.duration
    if (endLoopValue > AudioPlayer.duration) {
        endLoopValue = AudioPlayer.duration;
    }
    return (endLoopValue);
}

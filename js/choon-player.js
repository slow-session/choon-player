/*
 * Audio controls for the browser audio player
 *
 * Version: 2.0
 * Date: 12 September 2020
 */

"use strict";

const choon = (function () {
    /*
  ###############################################################################
  #
  # Comment out the line with "console.log" to turn off console logging
  #
  ################################################################################
 */
    function myDebug(message) {
        //console.log(message);
    }

    var beginLoopTime = 0;
    var endLoopTime = 0;
    var previousPlayButton = null;
    var audioSlider = null;

    function createAudioPlayer() {
        let audioPlayer = `
<!-- declare an Audio Player for this page-->
<audio id="AudioPlayer">
    <source id="choon-MP3Source" type="audio/mp3"></source> 
    Your browser does not support the audio format.
</audio>`;

        return audioPlayer;
    }

    function createMP3player(tuneID, mp3url) {
        // build the MP3 player for each tune
        let mp3player = `
<!-- MP3 player -->
<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">
    <div id="choon-MP3Player-${tuneID}" class="choon-audioParent">
        <!-- audio slider -->
        <div id="choon-positionMP3-${tuneID}" "class="choon-audioControlMP3"></div>
	    <!-- loop control -->
	    <div class="choon-loopControlMP3">
            <span title="Play tune, select loop starting point, then select loop end point">
                <input type="button" class="choon-loopButton" id="LoopStart" value=" Loop Start " onclick="choon.setFromSlider()" />
                <input type="button" class="choon-loopButton" id="LoopEnd" value=" Loop End " onclick="choon.setToSlider()" />
                <input type="button" class="choon-loopButton" id="Reset" value=" Reset " onclick="choon.resetFromToSliders()" />
            </span>
        </div>
        <!-- speed slider -->
        <div id="choon-speedControl-${tuneID}" class="choon-speedControl">
            <span title="Adjust playback speed with slider">
                <div id="choon-speedSliderMP3-${tuneID}"></div>
            </span>
        </div>                
        <!-- play button -->
        <button id="choon-playMP3-${tuneID}" class="choon-playButton" onclick="choon.playAudio(${tuneID}, '${mp3url}')"></button>
    </div>
</form>
<!-- END of MP3player -->`;

        return mp3player;
    }

    function createAudioSliders(tuneID) {
        let audioSlider = document.getElementById(
            `choon-positionMP3-${tuneID}`
        );
        let speedSlider = document.getElementById(
            `choon-speedSliderMP3-${tuneID}`
        );

        noUiSlider.create(audioSlider, {
            start: [0, 0, 100],
            connect: [false, true, true, false],
            behaviour: "drag",
            step: 0.25,
            range: {
                min: 0,
                max: 100,
            },
        });

        noUiSlider.create(speedSlider, {
            start: [100],
            tooltips: [
                wNumb({
                    decimals: 0,
                    prefix: "Speed: ",
                    postfix: " %",
                }),
            ],
            range: {
                min: 51,
                max: 121,
            },
        });

        audioSlider.noUiSlider.on("change", function (values, handle) {
            if (handle === 0) {
                beginLoopTime = values[0];
                endLoopTime = assignEndLoopTime(values[2]);
            } else if (handle === 2) {
                beginLoopTime = values[0];
                endLoopTime = assignEndLoopTime(values[2]);
            } else if (handle === 1) {
                AudioPlayer.currentTime = values[1];
            }
        });
        audioSlider.noUiSlider.on("start", function (value) {
            AudioPlayer.onplaying = function () {
                AudioPlayer.pause();
            };
        });
        audioSlider.noUiSlider.on("end", function (value) {
            AudioPlayer.onplaying = function () {
                AudioPlayer.play();
            };
        });

        speedSlider.noUiSlider.on("change", function (value) {
            myDebug("playbackRate: " + value / 100);
            AudioPlayer.playbackRate = value / 100;
        });
        // How to disable handles on audioslider.
        speedSlider.noUiSlider.on("start", function (value) {
            AudioPlayer.onplaying = function () {
                AudioPlayer.pause();
            };
        });
        speedSlider.noUiSlider.on("end", function (value) {
            AudioPlayer.onplaying = function () {
                AudioPlayer.play();
            };
        });
    }

    function playAudio(tuneID, audioSource) {
        let playButton = document.getElementById(`choon-playMP3-${tuneID}`);
        let playPosition = document.getElementById(
            `choon-positionMP3-${tuneID}`
        );
        let speedSlider = document.getElementById(
            `choon-speedSliderMP3-${tuneID}`
        );

        if (playButton.className == "choon-playButton") {
            if (!AudioPlayer.src.includes(audioSource)) {
                if (AudioPlayer.src != null) {
                    //reset previous audio player
                    if (previousPlayButton != null) {
                        previousPlayButton.className = "choon-playButton";
                    }
                }
                previousPlayButton = playButton;
                AudioPlayer.src = audioSource;
                playPosition.noUiSlider.updateOptions({
                    tooltips: [true, true, true],
                });
                audioSlider = playPosition;

                AudioPlayer.onloadedmetadata = function () {
                    initialiseAudioSlider();
                };
            }
            // Initialise the loop and audioSlider
            if (!endLoopTime) {
                endLoopTime = AudioPlayer.duration;
            }

            // This event listener keeps track of the cursor and restarts the loops
            // when needed - we don't need to set it elsewhere
            AudioPlayer.addEventListener("timeupdate", positionUpdate);
            AudioPlayer.addEventListener("ended", restartLoop);

            AudioPlayer.playbackRate = speedSlider.noUiSlider.get() / 100;

            playButton.className = "";
            playButton.className = "choon-pauseButton";
            let playPromise = AudioPlayer.play();
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

    function setFromSlider() {
        audioSlider.noUiSlider.setHandle(
            0,
            AudioPlayer.currentTime
        );
        beginLoopTime = AudioPlayer.currentTime;
    }

    function setToSlider() {
        audioSlider.noUiSlider.setHandle(
            2,
            AudioPlayer.currentTime
        );
        endLoopTime = AudioPlayer.currentTime;
    }

    function resetFromToSliders() {
        audioSlider.noUiSlider.setHandle(0, 0);
        beginLoopTime = 0;
        audioSlider.noUiSlider.setHandle(2, AudioPlayer.duration);
        endLoopTime = AudioPlayer.duration;
    }

    //
    // Internal functions
    //
    function initialiseAudioSlider() {
        myDebug('initialiseAudioSlider: ' + AudioPlayer.duration);
        audioSlider.noUiSlider.updateOptions({
            range: {
                min: 0,
                max: AudioPlayer.duration,
            },
        });
        resetFromToSliders();
    }

    function positionUpdate() {
        if (AudioPlayer.currentTime >= endLoopTime) {
            myDebug("Current time: " + AudioPlayer.currentTime);
            AudioPlayer.currentTime = beginLoopTime;
            myDebug("Reset loop start to: " + AudioPlayer.currentTime);
        }
        audioSlider.noUiSlider.setHandle(
            1,
            AudioPlayer.currentTime
        );
    }

    function restartLoop() {
        AudioPlayer.currentTime = beginLoopTime;
        myDebug("Restarting loop at: " + AudioPlayer.currentTime);
        AudioPlayer.play();
    }

    function assignEndLoopTime(endLoopValue) {
        // Don't allow endLoopTime to be >= AudioPlayer.duration
        if (endLoopValue > AudioPlayer.duration) {
            endLoopValue = AudioPlayer.duration;
        }
        return endLoopValue;
    }

    return {
        createAudioPlayer: createAudioPlayer,
        createMP3player: createMP3player,
        createAudioSliders: createAudioSliders,
        playAudio: playAudio,
        setFromSlider: setFromSlider,
        setToSlider: setToSlider,
        resetFromToSliders: resetFromToSliders,
    };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = choon;
}

/*
 * Audio controls for the browser audio player
 *
 * Version: 2.2
 * Date: 4 Mar 2021
 */

"use strict";

const choon = (function () {

    let beginLoopTime = 0;
    let endLoopTime = 0;
    let currentTuneID = null;
    let currentAudioSlider = null;

    function createMP3player(tuneID, mp3url) {
        // build the MP3 player for each tune
        let mp3player = `
<!-- MP3 player -->
<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">
    <div id="choon-MP3Player-${tuneID}" class="choon-audioParent">
        <!-- audio slider -->
        <div id="choon-audioSliderMP3-${tuneID}" "class="choon-audioControlMP3"></div>
	    <!-- loop control -->
	    <div class="choon-loopControlMP3">
            <span title="Play tune, select loop starting point, then select loop end point">
                <input type="button" class="choon-loopButton"
		    id="LoopStart-${tuneID}" value=" Loop Start "
		    onclick="choon.setFromSlider('${tuneID}')" />
                <input type="button" class="choon-loopButton"
		    id="LoopEnd-${tuneID}" value=" Loop End "
		    onclick="choon.setToSlider('${tuneID}')" />
                <input type="button" class="choon-loopButton" 
		    id="Reset-${tuneID}" value=" Reset "
		    onclick="choon.resetFromToSliders('${tuneID}')" />
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
        let audioSlider = document.getElementById(`choon-audioSliderMP3-${tuneID}`);
        let speedSlider = document.getElementById(`choon-speedSliderMP3-${tuneID}`);

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
            }
        });

        audioSlider.noUiSlider.on("start", function (value) {
            choonAudioPlayer.onplaying = function () {
                choonAudioPlayer.pause();
            };
        });
        audioSlider.noUiSlider.on("end", function (value) {
            choonAudioPlayer.onplaying = function () {
                choonAudioPlayer.play();
            };
        });

        // How to disable handles on audioslider.
        speedSlider.noUiSlider.on("start", function (value) {
            choonAudioPlayer.onplaying = function () {
                choonAudioPlayer.pause();
            };
        });
        speedSlider.noUiSlider.on("end", function (value) {
            choonAudioPlayer.onplaying = function () {
                choonAudioPlayer.play();
            };
        });
    }

    function playAudio(tuneID, audioSource) {
        // if there is more than one tune on the page
        // we need to reset it if it has been played
        if (currentTuneID && currentTuneID != tuneID) {
            let playButton = document.getElementById(`choon-playMP3-${currentTuneID}`);
            playButton.className = "";
            playButton.className = "choon-playButton";
            let audioSlider = document.getElementById(`choon-audioSliderMP3-${currentTuneID}`);
            audioSlider.noUiSlider.off("change");
            let speedSlider = document.getElementById(`choon-speedSliderMP3-${currentTuneID}`);
            speedSlider.noUiSlider.off("change");
        }
        currentTuneID = tuneID;

        let playButton = document.getElementById(`choon-playMP3-${tuneID}`);
        let audioSlider = document.getElementById(`choon-audioSliderMP3-${tuneID}`);
        let speedSlider = document.getElementById(`choon-speedSliderMP3-${tuneID}`);

        if (playButton.className == "choon-playButton") {
            if (!choonAudioPlayer.src.includes(audioSource)) {
                choonAudioPlayer.src = audioSource;
                choonAudioPlayer.load();
                audioSlider.noUiSlider.updateOptions({
                    tooltips: [true, true, true],
                });

                choonAudioPlayer.onloadedmetadata = function () {
                    initialiseAudioSlider(tuneID);
                };
            }
            // Initialise the loop
            if (!endLoopTime) {
                endLoopTime = choonAudioPlayer.duration;
            }

            // These event listeners keep track of the cursor and restarts the loops
            // when needed - we don't need to set it elsewhere;
            currentAudioSlider = audioSlider;
            choonAudioPlayer.addEventListener("timeupdate", positionUpdate);
            choonAudioPlayer.addEventListener("ended", restartLoop);

            choonAudioPlayer.playbackRate = speedSlider.noUiSlider.get() / 100;

            playButton.className = "";
            playButton.className = "choon-pauseButton";
            let playPromise = choonAudioPlayer.play();
            if (playPromise) {
                playPromise.catch(function (error) {
                    console.error(error);
                });
            }
        } else {
            playButton.className = "";
            playButton.className = "choon-playButton";
            choonAudioPlayer.pause();
        }
    }

    function setFromSlider(tuneID) {
        if (tuneID == currentTuneID) {
            let audioSlider = document.getElementById(`choon-audioSliderMP3-${tuneID}`);
            audioSlider.noUiSlider.setHandle(
                0,
                choonAudioPlayer.currentTime
            );
            beginLoopTime = choonAudioPlayer.currentTime;
        }
    }

    function setToSlider(tuneID) {
        if (tuneID == currentTuneID) {
            let audioSlider = document.getElementById(`choon-audioSliderMP3-${tuneID}`);
            audioSlider.noUiSlider.setHandle(
                2,
                choonAudioPlayer.currentTime
            );
            endLoopTime = choonAudioPlayer.currentTime;
        }
    }

    function resetFromToSliders(tuneID) {
        if (tuneID == currentTuneID) {
            let audioSlider = document.getElementById(`choon-audioSliderMP3-${tuneID}`);
            audioSlider.noUiSlider.setHandle(0, 0);
            beginLoopTime = 0;
            audioSlider.noUiSlider.setHandle(2, choonAudioPlayer.duration);
            endLoopTime = choonAudioPlayer.duration;
        }
    }

    //
    // Internal functions
    //
    function initialiseAudioSlider(tuneID) {
        //console.log('initialiseAudioSlider: ' + choonAudioPlayer.duration);
        if (tuneID == currentTuneID) {
            let audioSlider = document.getElementById(`choon-audioSliderMP3-${tuneID}`);
            audioSlider.noUiSlider.on("change", function (values, handle) {
                if (handle === 0) {
                    beginLoopTime = values[0];
                    endLoopTime = Math.min(choonAudioPlayer.duration, values[2]);
                } else if (handle === 2) {
                    beginLoopTime = values[0];
                    endLoopTime = Math.min(choonAudioPlayer.duration, values[2]);
                } else if (handle === 1) {
                    choonAudioPlayer.currentTime = values[1];
                }
            });
            audioSlider.noUiSlider.updateOptions({
                range: {
                    min: 0,
                    max: choonAudioPlayer.duration,
                },
            });
            let speedSlider = document.getElementById(`choon-speedSliderMP3-${tuneID}`);
            speedSlider.noUiSlider.on("change", function (value) {
                //console.log("playbackRate: " + value / 100);
                choonAudioPlayer.playbackRate = value / 100;
            });

            resetFromToSliders(tuneID);
        }
    }

    function positionUpdate() {
        if (choonAudioPlayer.currentTime >= endLoopTime) {
            //console.log("Current time: " + choonAudioPlayer.currentTime);
            choonAudioPlayer.currentTime = beginLoopTime;
            //console.log("Reset loop start to: " + choonAudioPlayer.currentTime);
        }
        currentAudioSlider.noUiSlider.setHandle(
            1,
            choonAudioPlayer.currentTime
        );
    }

    function restartLoop() {
        choonAudioPlayer.currentTime = beginLoopTime;
        //console.log("Restarting loop at: " + choonAudioPlayer.currentTime);
        choonAudioPlayer.play();
    }

    return {
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

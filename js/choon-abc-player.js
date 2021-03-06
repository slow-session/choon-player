/*
 * Controls for the abc  player
 *
 * Version: 2.3
 * Date: 4 Mar 2021
 *
 * Developed originally as part of websites for https://wellington.session.nz
 * by Ted Cizadlo and Andy Linton
 * 
 */
"use strict";

const choon_abc = (function () {
    let abcStopped = false;
    let abcCurrentTime = 0;
    let intervalHandle;
    let bpmReset = 0;
    let currentAudioSlider = null;
    let currentSpeedSlider = null;
    let currentTuneID = null;
    let tuneABC = null;

    // Select a timbre that sounds like an electric piano.
    let instrument;

    function createABCplayer(textArea, tuneID, timbre) {
        /*
         * Generate the HTML needed to play ABC tunes
         */
        instrument = makeInstrument(timbre);

        let abcPlayer = `
<form onsubmit="return false" oninput="level.value=flevel.valueAsNumber">
    <div class="choon-audioParent" id="ABC${tuneID}">
        <div id="audioSliderABC${tuneID}" class="choon-audioControlABC"></div>
        <div>
            <span title="Adjust playback speed with slider">
                <div id="speedSliderABC${tuneID}" class="choon-speedControl"></div>
            </span>
        </div>
        <div>
            <button id="playABC${tuneID}" class="choon-playButton" onclick="choon_abc.playABC(${textArea}, ${tuneID}, '100')"></button>
        </div>
    </div>
</form>`;

        return abcPlayer;
    }

    function makeInstrument(timbre) {
        /*
         * Some old iPads break badly running more recent Javascript
         * We abstract this out into a separate function so that when it fails
         * the rest of the code continues on working - Arghh!
         */
        let tempInstrument = new Instrument(timbre);
        return tempInstrument;
    }

    /*
     * Play an ABC tune when the button gets pushed
     */
    function playABC(textArea, tuneID, bpm) {
        // if there is more than one tune on the page
        // we need to reset things if a different has been played
        if (currentTuneID && currentTuneID != tuneID) {
            let playButton = document.getElementById(`playABC${currentTuneID}`);
            if (playButton) {
                playButton.className = "";
                playButton.className = "choon-playButton";
            }
            currentSpeedSlider.noUiSlider.off("change");
            // Stop any current player
            stopABCplayer();
            tuneABC = null;
        }
        currentTuneID = tuneID;

        // now we can play this tune!
        let playButton = document.getElementById(`playABC${tuneID}`);
        currentAudioSlider = document.getElementById(`audioSliderABC${tuneID}`);

        currentSpeedSlider = document.getElementById(`speedSliderABC${tuneID}`);
        changeABCspeed(tuneID, currentSpeedSlider.noUiSlider.get());
        currentSpeedSlider.noUiSlider.on("change", function (value) {
            changeABCspeed(tuneID, value);
        });


        if (playButton.className == "choon-playButton") {
            /*
             * Our simple ABC player doesn't handle repeats well.
             * This function unrolls the ABC so that things play better.
             */
            if (tuneABC == null) {
                tuneABC = preProcessABC(textArea.value);
            }

            // speed was reset before play started
            if (bpmReset) {
                bpm = bpmReset;
            }
            // calculate tune length
            setTuneDuration(tuneABC, bpm);

            let ticks = calculateTicks(tuneABC, bpm);
            startABCplayer(tuneABC, ticks);
            playButton.className = "";
            playButton.className = "choon-stopButton";
        } else {
            stopABCplayer();
            playButton.className = "";
            playButton.className = "choon-playButton";
        }
    }

    function changeABCspeed(tuneID, bpm) {
        let playButton = document.getElementById(`playABC${tuneID}`);
        /*
         * stop any current player
         */
        stopABCplayer();

        // save the speed
        bpmReset = bpm;

        // if there's an active player, restart it at the new speed
        if (playButton.className == "choon-stopButton") {
            // Change the speed of playback
            setTuneDuration(tuneABC, bpm);

            let ticks = calculateTicks(tuneABC, bpm);
            startABCplayer(tuneABC, ticks);
        }
    }

    function setTuneDuration(tuneABC, bpm) {
        // calculate number of bars
        let bars = tuneABC.match(/\|/g || []).length;
        bars = Math.floor(bars / 8) * 8;

        // Get the meter from the ABC
        let meterStr = getABCheaderValue("M:", tuneABC);
        if (meterStr == "C") {
            meterStr = "4/4";
        }
        if (meterStr == "C|") {
            meterStr = "2/2";
        }
        if (!meterStr) {
            console.error("M: not defined - defaulted to 4/4");
            meterStr = "4/4";
        }

        let noteLenStr = getABCheaderValue("L:", tuneABC);
        if (!noteLenStr) {
            noteLenStr = "1/8";
        }

        let tuneDuration = (bars * eval(meterStr) * 16 * eval(noteLenStr) * 60) / bpm;

        currentAudioSlider.noUiSlider.updateOptions({
            range: {
                min: 0,
                max: tuneDuration,
            },
        });
    }

    function calculateTicks(tuneABC, bpm) {
        // The ABC L: value scales the ticks value!
        let noteLenStr = getABCheaderValue("L:", tuneABC);
        if (!noteLenStr) {
            noteLenStr = "1/8";
        }

        return bpm / (2 * eval(noteLenStr));
    }

    function startABCplayer(tuneABC, ticks) {
        abcStopped = false;
        instrument.silence();
        instrument.play({
                tempo: ticks,
            },
            tuneABC,
            function () {
                loopABCplayer(tuneABC, ticks);
            }
        );
        abcCurrentTime = 0;
        currentAudioSlider.noUiSlider.set(0);
        intervalHandle = setInterval(nudgeABCSlider, 300);
    }

    function stopABCplayer() {
        clearInterval(intervalHandle);
        currentAudioSlider.noUiSlider.set(0);
        abcStopped = true;
        instrument.silence();
    }

    function loopABCplayer(tuneABC, ticks) {
        instrument.silence();
        clearInterval(intervalHandle);

        if (abcStopped == false) {
            startABCplayer(tuneABC, ticks);
        }
    }

    function nudgeABCSlider() {
        abcCurrentTime += 0.3;
        currentAudioSlider.noUiSlider.set(abcCurrentTime);
    }

    function createABCSliders(tuneID) {
        let audioSlider = document.getElementById(`audioSliderABC${tuneID}`);
        let speedSlider = document.getElementById(`speedSliderABC${tuneID}`);

        noUiSlider.create(audioSlider, {
            start: [0],
            tooltips: [
                wNumb({
                    decimals: 1,
                }),
            ],
            range: {
                min: [0],
                max: [100],
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

    }

    function getABCheaderValue(key, tuneABC) {
        // Extract the value of one of the ABC keywords e.g. T: Out on the Ocean
        const KEYWORD_PATTERN = new RegExp(`^\\s*${key}`);

        const lines = tuneABC.split(/[\r\n]+/).map(line => line.trim());
        const keyIdx = lines.findIndex(line => line.match(KEYWORD_PATTERN));
        if (keyIdx < 0) {
            return '';
        } else {
            return lines[keyIdx].split(":")[1].trim();
        }
    }

    function preProcessABC(tuneABC) {
        /*
         * Our simple ABC player doesn't handle repeats well.
         * preProcessABC expands the repeats in the ABC so that things play better.
         */

        // Clean out any lines of lyrics from the ABC (starts with 'w:')
        const abcNotes = tuneABC.match(/^(?!w:).+$/gm).join('\n');
  
        let firstBar = /\|/g,
            fEnding = /\|1/g,
            fEnding2 = /\[1/g,
            sEnding = /\|2/g,
            sEnding2 = /\[2/g,
            lRepeat = /\|:/g,
            rRepeat = /:\|/g,
            dblBar = /\|\|/g,
            dblBar2 = /\|\]/g;
        let match,
            fBarPos = [],
            fEndPos = [],
            sEndPos = [],
            lRepPos = [],
            rRepPos = [],
            dblBarPos = [];
        let tokenString = [],
            tokenLocations = [],
            tokenCount = 0,
            sortedTokens = [],
            sortedTokenLocations = [];
        let position = 0;
        let expandedABC = "";

        while ((match = firstBar.exec(abcNotes)) != null) {
            fBarPos.push(match.index);
        }
        tokenString[tokenCount] = "fb";
        if (fBarPos[0] > 6) {
            fBarPos[0] = 0;
        }
        // first bar
        tokenLocations[tokenCount++] = fBarPos[0];
        while (
            ((match = fEnding.exec(abcNotes)) || (match = fEnding2.exec(abcNotes))) !=
            null
        ) {
            fEndPos.push(match.index);
            tokenString[tokenCount] = "fe";
            // first endings
            tokenLocations[tokenCount++] = match.index;
        }
        while (
            ((match = sEnding.exec(abcNotes)) || (match = sEnding2.exec(abcNotes))) !=
            null
        ) {
            sEndPos.push(match.index);
            tokenString[tokenCount] = "se";
            // second endings
            tokenLocations[tokenCount++] = match.index;
        }
        while ((match = rRepeat.exec(abcNotes)) != null) {
            rRepPos.push(match.index);
            tokenString[tokenCount] = "rr";
            // right repeats
            tokenLocations[tokenCount++] = match.index;
        }
        while ((match = lRepeat.exec(abcNotes)) != null) {
            lRepPos.push(match.index);
            tokenString[tokenCount] = "lr";
            // left repeats
            tokenLocations[tokenCount++] = match.index;
        }
        while (
            ((match = dblBar.exec(abcNotes)) || (match = dblBar2.exec(abcNotes))) !=
            null
        ) {
            dblBarPos.push(match.index);
            tokenString[tokenCount] = "db";
            // double bars
            tokenLocations[tokenCount++] = match.index;
        }
        tokenString[tokenCount] = "lb";
        // last bar
        tokenLocations[tokenCount++] = fBarPos[fBarPos.length - 1];

        let indices = tokenLocations.map(function (elem, index) {
            return index;
        });
        indices.sort(function (a, b) {
            return tokenLocations[a] - tokenLocations[b];
        });

        for (let i = 0; i < tokenLocations.length; i++) {
            sortedTokens[i] = tokenString[indices[i]];
            sortedTokenLocations[i] = tokenLocations[indices[i]];
        }

        for (let i = 0; i < sortedTokens.length; i++) {
            // safety check - is 1000 enough? ASJL 2020/11/23
            if (expandedABC.length > 1000) {
                break;
            }
            // find next repeat or second ending
            if (sortedTokens[i] == "rr" || sortedTokens[i] == "se") {
                //notes from last location to rr or se
                expandedABC += abcNotes.substr(position, sortedTokenLocations[i] - position);
                // march backward from there
                for (let j = i - 1; j >= 0; j--) {
                    // check for likely loop point
                    if (
                        sortedTokens[j] == "se" ||
                        sortedTokens[j] == "rr" ||
                        sortedTokens[j] == "fb" ||
                        sortedTokens[j] == "lr"
                    ) {
                        // mark loop beginning point
                        position = sortedTokenLocations[j];
                        // walk forward from there
                        for (let k = j + 1; k < sortedTokens.length; k++) {
                            // walk to likely stopping point (first ending or repeat)
                            if (sortedTokens[k] == "fe" || sortedTokens[k] == "rr") {
                                expandedABC += abcNotes.substr(
                                    position,
                                    sortedTokenLocations[k] - position
                                );
                                // mark last position encountered
                                position = sortedTokenLocations[k];
                                // consume tokens from big loop
                                i = j + 1;
                                // if we got to a first ending we have to skip it..
                                if (sortedTokens[k] == "fe") {
                                    // walk forward from here until the second ending
                                    for (let l = k; l < sortedTokens.length; l++) {
                                        if (sortedTokens[l] == "se") {
                                            // look for end of second ending
                                            for (let m = l; m < sortedTokens.length; m++) {
                                                // a double bar marks the end of a second ending
                                                if (sortedTokens[m] == "db") {
                                                    // record second ending
                                                    expandedABC += abcNotes.substr(
                                                        sortedTokenLocations[l],
                                                        sortedTokenLocations[m] - sortedTokenLocations[l]
                                                    );
                                                    //mark most forward progress
                                                    position = sortedTokenLocations[m];
                                                    // consume the tokens from the main loop
                                                    i = m + 1;
                                                    // quit looking
                                                    break;
                                                }
                                            } // END of for m loop
                                            // consume tokens TED: CHECK THIS
                                            i = l + 1;
                                            // quit looking
                                            break;
                                        }
                                    } // END of for l loop
                                } // END of first ending we have to skip it
                                break;
                            }
                        } // END of for k loop
                        break;
                    } // END of check for likely loop point
                } // END of for j loop
            } // END of check for likely loop point
        } // END of for i loop

        expandedABC += abcNotes.substr(position, sortedTokenLocations[sortedTokens.length - 1] - position);

        // remove chords
        expandedABC = expandedABC.replace(/[“”]/g, "\"");
        expandedABC = expandedABC.replace(/".*?"/g, "");
        // insert blank line before T: field
        expandedABC = expandedABC.replace(/\|[\n\r]T:/g, "|\n\nT:");
        // collapse note lines into one
        expandedABC = expandedABC.replace(/\|[\n\r]/g, "|");

        // Clean up the ABC repeat markers - we don't need them now!
        expandedABC = expandedABC.replace(/:\|/g, "|");
        expandedABC = expandedABC.replace(/\|:/g, "|");
        expandedABC = expandedABC.replace(/::/g, "|");
        expandedABC = expandedABC.replace(/\|+/g, "|");
        expandedABC = expandedABC.replace(/:$/, "|");
        expandedABC = expandedABC.replace(/:"$/, "|");

        //console.log(expandedABC);
    
        return expandedABC + "\n";
    }

    return {
        createABCplayer: createABCplayer,
        createABCSliders: createABCSliders,
        playABC: playABC,
        changeABCspeed: changeABCspeed,
    };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = choon_abc;
}

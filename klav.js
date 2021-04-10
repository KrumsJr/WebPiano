let osc = [];
let taustini = [];
let apaksina = [1, 3, 5, 6, 8, 10, 12, 13, 15, 17];
let speleTagad = [];
let frekvences = [];
let tet = Math.pow(2, (1 / 12));
let a0 = 27.5;
let octModifier = 39;
let wave = `sine`;
let skalums = 0.2;
let nospiestsIr = [];
let peleNospiesta = false;
let sustainTime = 0.25;
let sustainVol = 0;
let foreverSustain = false;
let sustained = [];

let arp = {
    interval: false,
    intervalInp: false,
    time: 100,
    masivs: [],
    iet: false,
    i: 0,
    chTime: () => {
        let a = document.getElementById(`arpIntervalInput`).value;
        clearInterval(arp.interval);
        arp.time = parseInt(a);
        arp.start();
    },
    stop: () => {
        if (arp.iet) {
            clearInterval(arp.interval);
            arp.iet = false;
            for (let i = 1; i < 18; i++) {
                atlaidaTaustinu(i);
            }
            arp.i = 0;
        };
    },
    start: () => {
        if (arp.iet) {
            clearInterval(arp.interval);
        }
        arp.iet = true;

        arp.i = 0;
        arp.interval = setInterval(() => {
            if (arp.masivs.length > arp.i) {
                if (arp.i !== 0) { atlaidaTaustinu(arp.masivs[arp.i - 1]) };
                nospiedaTaustinu(arp.masivs[arp.i]);
                arp.i++;
            } else {
                atlaidaTaustinu(arp.masivs[arp.i - 1]);
                arp.i = 0;
                if (arp.masivs[arp.i] > 0) {
                    nospiedaTaustinu(arp.masivs[arp.i]);
                }
                arp.i++;
            }
        }, arp.time);
    }
}

{
    taustini[65] = 1;
    taustini[87] = 2;
    taustini[83] = 3;
    taustini[69] = 4;
    taustini[68] = 5;
    taustini[70] = 6;
    taustini[84] = 7;
    taustini[71] = 8;
    taustini[89] = 9;
    taustini[72] = 10;
    taustini[85] = 11;
    taustini[74] = 12;
    taustini[75] = 13;
    taustini[79] = 14;
    taustini[76] = 15;
    taustini[80] = 16;
    taustini[59] = 17;
    taustini[186] = 17; //jo dažādos browseros ir dažāda adresācija bļ
}

document.addEventListener('keydown', KeyDwn);
document.addEventListener('keyup', KeyUp);
document.getElementById(`susInp`).addEventListener(`keydown`, enterSusTime);
document.addEventListener(`mousedown`, () => {
    if (!peleNospiesta) {
        peleNospiesta = true;
    }
});
document.addEventListener(`mouseup`, () => {
    if (peleNospiesta) {
        peleNospiesta = false;
    }
});

function enterSusTime(e) {
    if (e.keyCode == 13) {
        newSusTime = (document.getElementById(`susInp`).value);
        //console.log(newSusTime);
        sustainTime = parseFloat(newSusTime);
    }
}

function KeyDwn(e) {

    //console.log(`${e.key} = ${e.keyCode}`);
    if (!isNaN(taustini[e.keyCode]) && !nospiestsIr[taustini[e.keyCode]]) {

        nospiestsIr[taustini[e.keyCode]] = true;

        if (e.getModifierState(`CapsLock`)) {
            arp.masivs.push(taustini[e.keyCode]);
            arp.start();
            //console.log(arp.masivs);
        } else {
            nospiedaTaustinu(taustini[e.keyCode]);
        }
        return;
    }

    if ((e.keyCode === 13) && (arp.intervalInput)) {
        arp.chTime();
        return;
    }

    if (e.keyCode == 39) {
        shiftOctave(2)
        return;
    } else if (e.keyCode == 37) {
        shiftOctave(0)
        return;
    }

    if (e.keyCode == 16) {
        foreverSustain = true;
    }

}

function KeyUp(e) {
    if (!isNaN(taustini[e.keyCode])) {
        atlaidaTaustinu(taustini[e.keyCode]);
        nospiestsIr[taustini[e.keyCode]] = false;
        
        if ((arp.iet) && (arp.masivs.length < 1)) {
            arp.stop();
        }
        if (e.getModifierState(`CapsLock`)) {
            arp.masivs.splice(arp.masivs.indexOf(taustini[e.keycode]), 1);
        }

        if (foreverSustain) {
            sustained.push(taustini[e.keyCode]);
            console.table(sustained);
        }
    }

    if (e.keyCode == 16) {
        foreverSustain = false;

        sustained.forEach (a => atlaidaTaustinu(a));
        sustained = [];
    }
}

function nospiedaTaustinu(a) {
    if (!speleTagad[a]) {
        osc[a] = new p5.Oscillator(frekvences[a + octModifier], wave);

        osc[a].start();
        osc[a].amp(skalums);
        speleTagad[a] = true;
        //console.log(osc[a]);

        if (apaksina.includes(a)) {
            document.getElementById(`k${a}`).style.backgroundColor = `gray`;
            document.getElementById(`b${a}`).style.backgroundColor = `gray`;
        } else {
            document.getElementById(`k${a}`).style.backgroundColor = `gray`;
        }
    }
}

function atlaidaTaustinu(a) {
    if (speleTagad[a]) {
        if (foreverSustain) return;
        osc[a].amp(0, sustainTime);
        osc[a].stop(sustainTime + 0.1);
        speleTagad[a] = false;

        if (apaksina.includes(a)) {
            document.getElementById(`k${a}`).style.backgroundColor = `whitesmoke`;
            document.getElementById(`b${a}`).style.backgroundColor = `whitesmoke`;
        } else {
            document.getElementById(`k${a}`).style.backgroundColor = `black`;
        } 
    }
}

function iebrauca(a) {
    if (peleNospiesta) nospiedaTaustinu(a);
}

function chBaseFreq() {
    if (!isNaN(document.getElementById(`baseFreq`).value)) {
        a0 = document.getElementById(`baseFreq`).value / 16;
    }
    reloadFreq();
    reloadFreqIndicators();
}

function reloadFreq() {
    for (let i = 1; i < 100; i++) {
        frekvences[i] = a0;
        a0 = a0 * tet;
        speleTagad[i] = false;
    }
}

function reloadFreqIndicators() {
    if (document.getElementById(`vajagRadit`).value == `false`) return;
    for (const i in taustini) {
        if (apaksina.includes(taustini[i])) {
            document
                .querySelector(`#b${taustini[i]} .freq-indicator`)
                .textContent = +(frekvences[taustini[i] + octModifier]).toFixed(1);
        } else {
            document
                .querySelector(`#k${taustini[i]} .freq-indicator`)
                .textContent = +(frekvences[taustini[i] + octModifier]).toFixed(1);
        }
    }
}

function clearFreqIndicators() {
    for (const i in taustini) {
        if (apaksina.includes(taustini[i])) {
            document
                .querySelector(`#b${taustini[i]} .freq-indicator`)
                .textContent = ``;
        } else {
            document
                .querySelector(`#k${taustini[i]} .freq-indicator`)
                .textContent = ``;
        }
    }
}        

function shiftOctave(a) {
    if (a == 0 && octModifier > 12) {
        octModifier -= 12;
    } else if (a == 1) {
        octModifier = 39;
    } else if (a == 2 && octModifier < 75) {
        octModifier += 12;
    }
    reloadFreqIndicators();
}

function changeTemperament(a) {
    tet = Math.pow(2, (1 / a));
    chBaseFreq();
}

function changeWave(a) {
    wave = a;
}

function chVol(a) {
    // console.log(a);
    skalums = parseFloat(a);
    for (let i = 1; i <= speleTagad.length; i++) {
        if (speleTagad[i]) {
            osc[i].amp(skalums);
        }
    }
}

reloadFreq();

function toggleFreq() {
    if (document.getElementById(`vajagRadit`).value == `false`) {
        document.getElementById(`vajagRadit`).value = true;
        reloadFreqIndicators();        
    } else {
        document.getElementById(`vajagRadit`).value = false;
        clearFreqIndicators();
    }
    // console.log(document.getElementById(`vajagRadit`).value);
}

document.addEventListener(`DOMContentLoaded`, function (event) {
    reloadFreqIndicators();
});

/*

Tudū:
-)sačinīt sākuma troksni (izprast envelopu)
-)ARPEDŽIATORS! uz kasploka
-)pitch shift uz scrolwheela
-)custom frekvences katram taustiņam
✓)sakārtot lapu
✓)spiež uz taustiņa skan
✓)glissando nevis iesprūst tas uz kā uzspieda.
✓)volume slideris
✓)frekvenču lodziņi pie taustiņiem (iespēja izslēgt/ieslēgt)

*/
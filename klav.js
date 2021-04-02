let osc = [];
let taustini = [];
let speleTagad = [];
let frekvences = [];
let tet = Math.pow(2, (1/12));
let a0 = 27.5;
let octModifier = 39;
let wave = `sine`;
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
taustini[186] = 17;
}

document.addEventListener('keydown', KeyDwn);
document.addEventListener('keyup', KeyUp);


function KeyDwn(e) {

    //console.log(`${e.key} = ${e.keyCode}`);
    if (!isNaN(taustini[e.keyCode])) {
        nospiedaTaustinu(taustini[e.keyCode]);
    }

    if (e.keyCode == 39) {
        shiftOctave(2)
    } else if (e.keyCode == 37) {
        shiftOctave(0)
    }
}

function KeyUp(e) {
    atlaidaTaustinu(taustini[e.keyCode]);
}

function nospiedaTaustinu(a) {
    if (!speleTagad[a]) {
        osc[a] = new p5.Oscillator(frekvences[a+octModifier], wave);

        osc[a].start();
        osc[a].amp(0.2);
        speleTagad[a] = true;

        if (a == 1 || a == 3 || a == 5 || a == 6 || a == 8 || a == 10 || a == 12 || a == 13 || a == 15 || a == 17) {
            document.getElementById(`k${a}`).style.backgroundColor = `gray`;
            document.getElementById(`b${a}`).style.backgroundColor = `gray`;
        } else {
            document.getElementById(`k${a}`).style.backgroundColor = `gray`;
        }
    }
}

function atlaidaTaustinu(a) {
    if (speleTagad[a]) {
        osc[a].stop();
        speleTagad[a] = false;
        if (a == 1 || a == 3 || a == 5 || a == 6 || a == 8 || a == 10 || a == 12 || a == 13 || a == 15 || a == 17) {
            document.getElementById(`k${a}`).style.backgroundColor = `whitesmoke`;
            document.getElementById(`b${a}`).style.backgroundColor = `whitesmoke`;
        } else {
            document.getElementById(`k${a}`).style.backgroundColor = `black`;
        }
    }
}

function chBaseFreq() {
    if (!isNaN(document.getElementById(`baseFreq`).value)){
        a0 = document.getElementById(`baseFreq`).value / 16;
    }
    //console.log(a0);
    reloadFreq();
}

function reloadFreq() {
    for (let i = 1; i < 100; i++) {
        frekvences[i] = a0;
        a0 = a0 * tet;
        speleTagad[i] = false;
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
}

function changeTemperament(a) {
   tet = Math.pow(2, (1/a));
   chBaseFreq(); 
}

function changeWave(a) {
    wave = a;
}

reloadFreq();
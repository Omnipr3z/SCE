/**
 * ╔════════════════════════════════════════╗
 * ║        SIMCRAFT ENGINE (SCE)           ║
 * ║        Cinematic Visual Editor         ║
 * ╚════════════════════════════════════════╝
 */

Number.prototype.approach = function(goal, speed) {
    if (this < goal) return Math.min(this + speed, goal);
    if (this > goal) return Math.max(this - speed, goal);
    return goal;
};

const Graphics = { width: 1280, height: 720 };
const ImageCache = {};

function getImage(projectName, bitmapName) {
    if (!bitmapName) return null;
    const path = `img/cinematics/${projectName}/${bitmapName}.png`;
    if (!ImageCache[path]) {
        const img = new Image();
        img.src = path;
        img.onload = () => { img.ready = true; };
        img.onerror = () => { img.error = true; };
        ImageCache[path] = img;
    }
    return ImageCache[path];
}

class LayerPreview {
    constructor(id) {
        this.id = id;
        this.reset();
    }
    reset() {
        this.bitmap = "";
        this.x = 640; this.y = 360;
        this.opacity = 0; this.scale = 1; this.rotation = 0;
        this.xG = 640; this.yG = 360; this.opG = 0; this.zG = 1; this.rotG = 0;
        this.mSpd = 8; this.fSpd = 3; this.zSpd = 0.05; this.rSpd = 0.6;
    }
    // Détection de mouvement en cours (fidèle à Sprite_CinematicLayer.js)
    isBusy() {
        return Math.abs(this.x - this.xG) > 0.1 || 
               Math.abs(this.y - this.yG) > 0.1 || 
               Math.abs(this.opacity - this.opG) > 0.1 || 
               Math.abs(this.scale - this.zG) > 0.01;
    }
    update() {
        this.x = this.x.approach(this.xG, this.mSpd);
        this.y = this.y.approach(this.yG, this.mSpd);
        this.opacity = this.opacity.approach(this.opG, this.fSpd);
        this.scale = this.scale.approach(this.zG, this.zSpd);
        this.rotation = this.rotation.approach(this.rotG, this.rSpd * (Math.PI/180));
    }
    draw(ctx, projectName) {
        if (this.opacity <= 0) return;
        const img = getImage(projectName, this.bitmap);
        ctx.save();
        ctx.globalAlpha = this.opacity / 255;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        if (img && img.ready) {
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
        } else {
            ctx.fillStyle = img && img.error ? "rgba(255,0,0,0.5)" : "rgba(0,150,255,0.3)";
            ctx.fillRect(-100, -100, 200, 200);
            ctx.strokeStyle = "white"; ctx.strokeRect(-100, -100, 200, 200);
        }
        ctx.restore();
    }
}

// --- ETAT ---
let cinematic = { name: "New_Cinematic", sequencies: [] };
let selectedSeq = -1;
let selectedLayer = 0;
let isPlaying = true;
let isAutoPlaying = false; // Mode "Play All"
const layers = Array.from({length: 13}, (_, i) => new LayerPreview(i));

let canvas, ctx, seqList, inspector, projectNameInput;

window.onload = () => {
    canvas = document.getElementById('view');
    ctx = canvas.getContext('2d');
    seqList = document.getElementById('sequence-list');
    inspector = document.getElementById('ins-content');
    projectNameInput = document.getElementById('project-name');
    
    projectNameInput.addEventListener('input', (e) => {
        cinematic.name = e.target.value;
    });

    addSequence();
    requestAnimationFrame(updateLoop);
};

function updateLoop() {
    if (isPlaying) {
        ctx.clearRect(0, 0, 1280, 720);
        layers.forEach(l => {
            l.update();
            l.draw(ctx, cinematic.name);
        });

        // Logique "Play All" : Auto-advance
        if (isAutoPlaying) {
            const anyBusy = layers.some(l => l.isBusy());
            if (!anyBusy) {
                if (selectedSeq < cinematic.sequencies.length - 1) {
                    selectSeq(selectedSeq + 1);
                } else {
                    isAutoPlaying = false;
                    document.getElementById('status').innerText = "FIN DE CINÉMATIQUE";
                }
            }
        }
    }
    requestAnimationFrame(updateLoop);
}

// --- COMMANDES ---

function resetAll() {
    if (!confirm("Voulez-vous vraiment tout vider ?")) return;
    cinematic.sequencies = [];
    isAutoPlaying = false;
    isPlaying = false;
    layers.forEach(l => l.reset());
    addSequence(); // Repart sur une base propre
    document.getElementById('status').innerText = "RESET EFFECTUÉ";
}

function startPlayAll() {
    if (cinematic.sequencies.length === 0) return;
    isAutoPlaying = true;
    isPlaying = true;
    selectSeq(0); // On repart du début
    document.getElementById('status').innerText = "LECTURE AUTOMATIQUE...";
}

function addSequence() {
    cinematic.sequencies.push({
        layers: {},
        storyWindow: { txt: ["Nouvelle Séquence"], style: "Title" },
        needPressOk: true
    });
    refreshList();
    selectSeq(cinematic.sequencies.length - 1);
}

function refreshList() {
    seqList.innerHTML = cinematic.sequencies.map((s, i) => {
        const txt = (s.storyWindow && s.storyWindow.txt) ? s.storyWindow.txt[0] : "(Action)";
        return `
            <div class="seq-item ${i === selectedSeq ? 'active' : ''}" onclick="selectSeq(${i})">
                <strong>#${i}</strong> - ${txt.substring(0, 20)}...
            </div>
        `;
    }).join('');
}

function selectSeq(i) {
    selectedSeq = i;
    refreshList();
    renderInspector();
    applyDataToLayers(cinematic.sequencies[i]);
}

function applyDataToLayers(data) {
    if(!data.layers) return;
    for(let id in data.layers) {
        const l = layers[id]; if(!l) continue;
        const d = data.layers[id];
        if(d.bitmap) l.bitmap = d.bitmap;
        if(d.opacity !== undefined) l.opacity = d.opacity;
        if(d.opacityGoal !== undefined) l.opG = d.opacityGoal;
        if(d.xGoal !== undefined) l.xG = evalVal(d.xGoal);
        if(d.yGoal !== undefined) l.yG = evalVal(d.yGoal);
        if(d.zoomGoal !== undefined) l.zG = d.zoomGoal;
        if(d.fadeSpeed !== undefined) l.fSpd = d.fadeSpeed;
        if(d.moveSpeed !== undefined) l.mSpd = d.moveSpeed;
    }
}

function updateData(path, val) {
    const keys = path.split('.');
    let obj = cinematic.sequencies[selectedSeq];
    for(let i=0; i<keys.length-1; i++) {
        if(!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
    }
    obj[keys[keys.length-1]] = val;
    applyDataToLayers(cinematic.sequencies[selectedSeq]);
}

function renderInspector() {
    const seq = cinematic.sequencies[selectedSeq];
    if(!seq) return;
    const ld = seq.layers[selectedLayer] || {};
    const storyTxt = (seq.storyWindow && seq.storyWindow.txt) ? seq.storyWindow.txt.join('\n') : "";

    inspector.innerHTML = `
        <div class="prop-group">
            <label>Texte Story</label>
            <textarea rows="3" onchange="updateData('storyWindow.txt', this.value.split('\\n'))">${storyTxt}</textarea>
        </div>
        
        <label>Layer Sélectionné</label>
        <div class="layer-grid">
            ${Array.from({length:12}, (_,i)=> `<div class="layer-btn ${i==selectedLayer?'active':''}" onclick="changeLayer(${i})">${i}</div>`).join('')}
        </div>
        `;
}

function evalVal(v) {
    if(typeof v === 'string') {
        if(v.includes("Graphics.boxWidth")) return 1280;
        if(v.includes("Graphics.boxHeight")) return 720;
    }
    return parseFloat(v) || 0;
}

// --- IMPORT / EXPORT ---
function exportJSON() {
    const blob = new Blob([JSON.stringify(cinematic, null, 4)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = cinematic.name + ".json";
    a.click();
}

function importJSON(input) {
    const file = input.files[0];
    if(!file) return;

    // Récupération du nom du fichier pour l'input
    const fileName = file.name.split('.').slice(0, -1).join('.');
    cinematic.name = fileName;
    projectNameInput.value = fileName;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = JSON.parse(e.target.result);
            cinematic.sequencies = Array.isArray(content) ? content : (content.sequencies || []);
            refreshList();
            if(cinematic.sequencies.length > 0) selectSeq(0);
        } catch(err) { alert("Erreur JSON malformé"); }
    };
    reader.readAsText(file);
}

function togglePlay() { isPlaying = !isPlaying; }
function restartSeq() { applyDataToLayers(cinematic.sequencies[selectedSeq]); }
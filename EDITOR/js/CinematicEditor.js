/**
 * ╔════════════════════════════════════════╗
 * ║        SIMCRAFT ENGINE (SCE)           ║
 * ║        Cinematic Visual Editor         ║
 * ╚════════════════════════════════════════╝
 */

// --- CONFIGURATION & MOTEUR ---
Number.prototype.approach = function(goal, speed) {
    if (this < goal) return Math.min(this + speed, goal);
    if (this > goal) return Math.max(this - speed, goal);
    return goal;
};

const Graphics = { width: 1280, height: 720 };
const ImageCache = {}; // Cache pour éviter de recharger les images à chaque frame

/**
 * Charge ou récupère une image du cache
 * @param {string} projectName 
 * @param {string} bitmapName 
 */
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
            // Dessin de l'image réelle (centrée sur son anchor 0.5)
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
        } else {
            // Placeholder si l'image est manquante ou en cours de chargement
            ctx.fillStyle = img && img.error ? "rgba(255,0,0,0.5)" : "rgba(0,150,255,0.3)";
            ctx.fillRect(-100, -100, 200, 200);
            ctx.strokeStyle = "white"; ctx.strokeRect(-100, -100, 200, 200);
            ctx.fillStyle = "white"; ctx.textAlign = "center";
            ctx.fillText(img && img.error ? "NOT FOUND" : "LOADING...", 0, -10);
            ctx.fillText(this.bitmap || `Layer ${this.id}`, 0, 15);
        }
        ctx.restore();
    }
}

// --- ETAT DE L'APPLICATION ---
let cinematic = { name: "New_Cinematic", sequencies: [] };
let selectedSeq = -1;
let selectedLayer = 0;
let isPlaying = true;
const layers = Array.from({length: 13}, (_, i) => new LayerPreview(i));

// --- INITIALISATION DES ELEMENTS DOM ---
let canvas, ctx, seqList, inspector, projectNameInput;

window.onload = () => {
    canvas = document.getElementById('view');
    ctx = canvas.getContext('2d');
    seqList = document.getElementById('sequence-list');
    inspector = document.getElementById('ins-content');
    projectNameInput = document.getElementById('project-name');
    
    // Écouteur pour le nom du projet
    projectNameInput.addEventListener('input', (e) => {
        cinematic.name = e.target.value;
    });

    addSequence();
    requestAnimationFrame(updateLoop);
};

// --- LOGIQUE DE JEU / BOUCLE ---
function updateLoop() {
    if (isPlaying) {
        ctx.clearRect(0, 0, 1280, 720);
        layers.forEach(l => {
            l.update();
            l.draw(ctx, cinematic.name);
        });
    }
    requestAnimationFrame(updateLoop);
}

// --- ACTIONS UI ---
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

        <div class="prop-group">
            <label>Image (img/cinematics/${cinematic.name}/...)</label>
            <input type="text" value="${ld.bitmap||''}" placeholder="nom_image" onchange="updateData('layers.${selectedLayer}.bitmap', this.value)">
            
            <div style="display:flex; gap:5px; margin-top:10px">
                <div style="flex:1"><label>X Goal</label><input type="text" value="${ld.xGoal||640}" onchange="updateData('layers.${selectedLayer}.xGoal', this.value)"></div>
                <div style="flex:1"><label>Y Goal</label><input type="text" value="${ld.yGoal||360}" onchange="updateData('layers.${selectedLayer}.yGoal', this.value)"></div>
            </div>

            <div style="display:flex; gap:5px; margin-top:10px">
                <div style="flex:1"><label>Opacité Goal</label><input type="number" value="${ld.opacityGoal??255}" onchange="updateData('layers.${selectedLayer}.opacityGoal', parseInt(this.value))"></div>
                <div style="flex:1"><label>Zoom Goal</label><input type="number" step="0.1" value="${ld.zoomGoal??1}" onchange="updateData('layers.${selectedLayer}.zoomGoal', parseFloat(this.value))"></div>
            </div>
            <div  style="display:flex; gap:5px; margin-top:10px">
                <img src="img/cinematics/Prologue_40K/blackBG.png" id="blackBG" style="width:250;height:140px; border:1px solid #333; object-fit:cover; background:#000">
            </div>
        </div>
        
        
    `;
}

function changeLayer(i) {
    selectedLayer = i;
    renderInspector();
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
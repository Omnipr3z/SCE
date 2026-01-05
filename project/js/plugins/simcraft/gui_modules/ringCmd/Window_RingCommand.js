/**
 * ╔════════════════════════════════════════╗
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v1.1.2] Fenêtre de commande circulaire (Ring Menu).
 * @author By '0mnipr3z'
 *
 * @help
 * Window_RingCommand.js
 *
 * Une fenêtre de sélection où les éléments sont disposés en cercle.
 * Le menu tourne pour placer l'élément sélectionné à la position "focus" (par défaut en haut).
 */

class Window_RingCommand extends Window_Command {
    initialize(rect) {
        super.initialize(rect);
        
        this._center = { x: rect.width / 2, y: rect.height / 2 };
        
        // Calcul du rayon : On prend la plus petite dimension et on retire la taille d'un item + marge
        // Cela évite que les éléments sur les cotés ne dépassent de la fenêtre
        const minDim = Math.min(rect.width, rect.height);
        this._targetRadius = (minDim / 2) - (this.itemWidth() / 1.2) - 20;
        
        this._radius = 0; // Pour l'animation d'ouverture
        this._startAngle = -Math.PI / 2; // Angle de départ (midi)
        this._commandData = [];
        
        
        this.opacity = 0;
    }

    // --- Configuration ---

    makeCommandList() {
        if (this._commandData) {
            for (const command of this._commandData) {
                this.addCommand(command.name, command.symbol, command.enabled, command.icon, command.ext);
            }
        }
    }

    addCommand(name, symbol, enabled = true, icon = null, ext = null) {
        this._list.push({ name: name, symbol: symbol, enabled: enabled, icon: icon, ext: ext });
    }

    setCommands(commands) {
        this._commandData = commands || [];
        this.refresh();
        this.select(this._commandData.length > 0 ? 0 : -1);
    }

    // --- Logique de Placement & Mise à jour ---

    // La sélection ne déclenche plus de rotation. On se contente d'appeler le parent.
    select(index) {
        super.select(index);
    }

    update() {
        super.update();
        // L'update de Window_Selectable (le parent) gère le curseur et la sélection.
        // Nous n'avons plus que l'animation d'ouverture à gérer.
        this.updateOpening();
    }

    updateOpening() {
        if (this._radius < this._targetRadius) {
            // Animation fluide d'ouverture (Ease-out)
            this._radius += (this._targetRadius - this._radius) * 0.15 + 0.5;
            if (this._radius > this._targetRadius) this._radius = this._targetRadius;
            
            // Optimisation : On appelle le refresh de Window_Selectable pour redessiner
            // sans reconstruire la liste des commandes (évite le spam de makeCommandList)
            Window_Selectable.prototype.refresh.call(this);
        }
    }

    // --- Rendu ---

    itemRect(index) {
        const max = this.maxItems();
        if (max === 0) {
            return new Rectangle();
        }
        const step = (Math.PI * 2) / max;
        const angle = this._startAngle + (index * step);
        
        const w = this.itemWidth();
        const h = this.itemHeight();
        
        const x = this._center.x + Math.cos(angle) * this._radius - w / 2;
        const y = this._center.y + Math.sin(angle) * this._radius - h / 2;

        return new Rectangle(x, y, w, h);
    }

    itemWidth() { return 120; }
    itemHeight() { return 40; }

    drawItem(index) {
        const rect = this.itemRect(index);
        const item = this._list[index];
        if (!item) return;
        
        this.resetTextColor();
        // Utilisation directe de la propriété enabled pour éviter les erreurs de contexte
        this.changePaintOpacity(item.enabled);

        if (item.icon) {
            // Si vous avez un système d'icônes via escape codes ou drawIcon
            this.drawText(item.name, rect.x, rect.y, rect.width, "center");
        } else {
            this.drawText(item.name, rect.x, rect.y, rect.width, "center");
        }
    }

    // --- Gestion du curseur (Natif RMMZ) ---

    // On désactive le curseur rectangulaire standard car on utilise une rotation
    updateCursor() {
        if (this.index() >= 0) {
            const rect = this.itemRect(this.index());
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    }

    // --- Navigation ---
    
    // On inverse gauche/droite pour que ça soit intuitif avec la rotation
    cursorRight(wrap) {
        this.cursorDown(wrap);
    }
    
    cursorLeft(wrap) {
        this.cursorUp(wrap);
    }

    // --- Handlers ---
    
    callOkHandler() {
        const item = this._list[this.index()];
        const symbol = item.symbol;
        if (this.isHandled(symbol)) {
            this.callHandler(symbol);
        } else if (this.isHandled('ok')) {
            super.callOkHandler();
        } else {
            this.activate();
        }
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Window_RingCommand",
    version: "1.0.0",
    icon: "⭕",
    author: "0mnipr3z",
    license: "CC BY-NC-SA 4.0",
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
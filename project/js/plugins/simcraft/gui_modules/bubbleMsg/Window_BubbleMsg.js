//=============================================================================
// Window_BubbleMsg.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Bubble Message Window with dynamic positioning and sizing
 * @author SimCraft Team
 * @help
 * This window displays messages with dynamic positioning relative to a map target (character or event).
 */

(() => {

    const PLUGIN_NAME = 'Window_BubbleMsg';

    // Configuration constants
    const BUBBLE_CONFIG = {
        verticalPadding: 16,
        horizontalPadding: 16,
        verticalGap: 72,        // Distance between target and bubble
        characterWidth: 8,      // Average character width in pixels
        lineHeight: 36          // Standard line height
    };

    /**
     * Window_BubbleMsg - Bubble message window with dynamic positioning
     */
    function Window_BubbleMsg() {
        this.initialize(...arguments);
    }

    Window_BubbleMsg.prototype = Object.create(Window_Message.prototype);
    Window_BubbleMsg.prototype.constructor = Window_BubbleMsg;

    /**
     * Initialize the bubble message window
     */
    Window_BubbleMsg.prototype.initialize = function(rect) {
        Window_Message.prototype.initialize.call(this, rect);
        this._mapTarget = null;
        this._autoSizing = false;
    };

    /**
     * Get the current map target
     */
    Window_BubbleMsg.prototype.mapTarget = function() {
        return this._mapTarget || null;
    };

    /**
     * Set the map target (can be an event, character, or coordinates object)
     */
    Window_BubbleMsg.prototype.setMapTarget = function(target) {
        if (target === null || target === undefined) {
            this._mapTarget = null;
        } else if (typeof target === 'object') {
            // Handle event, character, or Point/coordinate object
            if (target.x !== undefined && target.y !== undefined) {
                this._mapTarget = target;
            } else {
                this._mapTarget = null;
            }
        } else {
            this._mapTarget = null;
        }
    };

    /**
     * Get the coordinates of the target
     */
    Window_BubbleMsg.prototype.getTargetCoordinates = function() {
        if (!this._mapTarget) {
            return null;
        }

        let x, y;

        // Handle different types of targets
        if (this._mapTarget.screenX !== undefined) {
            // Event or character (has screenX/screenY)
            x = this._mapTarget.screenX();
            y = this._mapTarget.screenY();
        } else if (this._mapTarget.x !== undefined && this._mapTarget.y !== undefined) {
            // Raw coordinates
            x = this._mapTarget.x;
            y = this._mapTarget.y;
        } else {
            return null;
        }

        return { x, y };
    };

    /**
     * Calculate the width needed based on the text content
     */
    Window_BubbleMsg.prototype.calculateContentWidth = function() {
        const texts = $gameMessage && ($gameMessage._texts || $gameMessage.texts) ? ($gameMessage._texts || $gameMessage.texts) : [];
        if (texts.length === 0) {
            return this.width;
        }

        let maxLineWidth = 0;

        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
            const lineWidth = this.textWidth(text);
            maxLineWidth = Math.max(maxLineWidth, lineWidth);
        }

        // Add padding
        const totalWidth = maxLineWidth + BUBBLE_CONFIG.horizontalPadding * 2;
        return Math.max(totalWidth, 96); // Minimum width
    };

    /**
     * Calculate the height needed based on the number of lines
     */
    Window_BubbleMsg.prototype.calculateContentHeight = function() {
        const texts = $gameMessage && ($gameMessage._texts || $gameMessage.texts) ? ($gameMessage._texts || $gameMessage.texts) : [];
        if (texts.length === 0) {
            return this.height;
        }

        const lineCount = texts.length;
        const totalHeight = lineCount * BUBBLE_CONFIG.lineHeight + BUBBLE_CONFIG.verticalPadding * 2;
        return Math.max(totalHeight, 72); // Minimum height
    };

    Window_BubbleMsg.prototype.update = function() {
        Window_Message.prototype.update.call(this);
        if(this._mapTarget !== null) {
            this.updatePlacement();
            
        }
    }  
    /**
     * Update placement - custom positioning if map target is set
     */
    Window_BubbleMsg.prototype.updatePlacement = function() {
        if (this._mapTarget === null) {
            // Use default placement
            Window_Message.prototype.updatePlacement.call(this);
        } else {
            // Use custom placement based on map target
            this.updateBubblePlacement();
        }
    };

    /**
     * Update bubble placement relative to map target
     */
    Window_BubbleMsg.prototype.updateBubblePlacement = function() {
        const targetCoords = this.getTargetCoordinates();
        if (!targetCoords) {
            Window_Message.prototype.updatePlacement.call(this);
            return;
        }

        const targetX = targetCoords.x;
        const targetY = targetCoords.y;
        const goldWindow = this._goldWindow;

        // Get position type (0=top, 1=middle, 2=bottom, 3=custom)
        const positionType = $gameMessage.positionType();

        // Vertical positioning
        if (positionType === 0) {
            // Top - position above target
            this.y = Math.max(0, targetY - this.height - BUBBLE_CONFIG.verticalGap);
        } else if (positionType === 1) {
            // Middle - center vertically on target
            this.y = Math.max(0, Math.min(
                targetY - (this.height / 2),
                Graphics.boxHeight - this.height
            ));
        } else {
            // Bottom (positionType === 2) - position below target
            this.y = Math.min(
                Graphics.boxHeight - this.height,
                targetY + (BUBBLE_CONFIG.verticalGap  - this.height));
        }

        // Horizontal positioning - center on target
        this.x = Math.max(
            0,
            Math.min(
                targetX - (this.width / 2),
                Graphics.boxWidth - this.width
            )
        );

        // Position gold window
        if (goldWindow) {
            goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - goldWindow.height;
        }
    };

    /**
     * Open the window and apply auto-sizing if target is set
     */
    Window_BubbleMsg.prototype.open = function() {
        const texts = $gameMessage && ($gameMessage._texts || $gameMessage.texts) ? ($gameMessage._texts || $gameMessage.texts) : [];
        if (this._mapTarget !== null && texts.length > 0) {
            // Calculate and apply new size
            const newWidth = this.calculateContentWidth();
            const newHeight = this.calculateContentHeight();

            // Resize the window
            this.width = Math.min(newWidth, Graphics.boxWidth * 0.9);
            this.height = Math.min(newHeight, Graphics.boxHeight * 0.9);

            // Update the contents rectangle
            this._refreshCursorArea();
        }

        Window_Message.prototype.open.call(this);
    };

    /**
     * Called when a new page of text is displayed
     */
    Window_BubbleMsg.prototype.newPage = function(textState) {
        Window_Message.prototype.newPage.call(this, textState);

        // Update placement after text state is set up
        if (this._mapTarget !== null) {
            this.updatePlacement();
        }
    };

    /**
     * Override to ensure proper sizing and refresh
     */
    Window_BubbleMsg.prototype._refreshCursorArea = function() {
        // This ensures the window sizes are properly applied
        if (this._refreshPauseSignArea) {
            this._refreshPauseSignArea();
        }
    };

    window.Window_BubbleMsg = Window_BubbleMsg;

    // ============================================================================
    // Script de test interactif (à utiliser via la console du jeu)
    // ============================================================================
    
    /**
     * Test Window_BubbleMsg avec le joueur
     * Utilisation: testBubbleMsg("test", 0) ou testBubbleMsg("test", 1) ou testBubbleMsg("test", 2)
     * @param {string} message - Le message à afficher
     * @param {number} positionType - 0=top, 1=middle, 2=bottom
     */
    window.testBubbleMsg = function(message = "Test Message", positionType = 0) {
        if (!SceneManager._scene._messageWindow) {
            console.error("No message window found in current scene");
            return;
        }

        const msgWindow = SceneManager._scene._messageWindow;
        
        // Set player as target
        msgWindow.setMapTarget($gamePlayer);
        $gameMessage.setBackground(0);
        $gameMessage.setPositionType(positionType);
        $gameMessage.add(message);
        msgWindow.open();
        
        console.log(`Bubble message test: "${message}" (position: ${positionType})`);
    };

    /**
     * Test avec un événement spécifique
     * Utilisation: testBubbleMsgEvent(1, "Message", 0)
     */
    window.testBubbleMsgEvent = function(eventId = 1, message = "Event Message", positionType = 0) {
        if (!SceneManager._scene._messageWindow) {
            console.error("No message window found in current scene");
            return;
        }

        const event = $gameMap.event(eventId);
        if (!event) {
            console.error(`Event with ID ${eventId} not found`);
            return;
        }

        const msgWindow = SceneManager._scene._messageWindow;
        msgWindow.setMapTarget(event);
        $gameMessage.setBackground(0);
        $gameMessage.setPositionType(positionType);
        $gameMessage.add(message);
        msgWindow.open();
        
        console.log(`Bubble message test: "${messages.join(' | ')}" on event ${eventId} (position: ${positionType})`);
    };

    /**
     * Test avec un événement spécifique
     * Utilisation: testBubbleMsgEvent(1, "Message", 0)
     */
    window.testBubbleMsgEventMultiline = function(eventId = 1, messages = ["Line 1", "Line 2","Event Message"], positionType = 0) {
        if (!SceneManager._scene._messageWindow) {
            console.error("No message window found in current scene");
            return;
        }

        const event = $gameMap.event(eventId);
        if (!event) {
            console.error(`Event with ID ${eventId} not found`);
            return;
        }

        const msgWindow = SceneManager._scene._messageWindow;
        msgWindow.setMapTarget(event);
        $gameMessage.setBackground(0);
        $gameMessage.setPositionType(positionType);
        messages.forEach(message => {
            $gameMessage.add(message);
        });
        msgWindow.open();
        
        console.log(`Bubble message test: "${messages.join(' | ')}" on event ${eventId} (position: ${positionType})`);
    };

    /**
     * Test avec coordonnées brutes
     * Utilisation: testBubbleMsgCoords(400, 300, "Message", 1)
     */
    window.testBubbleMsgCoords = function(x = 400, y = 300, message = "Coord Message", positionType = 1) {
        if (!SceneManager._scene._messageWindow) {
            console.error("No message window found in current scene");
            return;
        }

        const msgWindow = SceneManager._scene._messageWindow;
        msgWindow.setMapTarget({ x, y });
        $gameMessage.setBackground(0);
        $gameMessage.setPositionType(positionType);
        $gameMessage.add(message);
        msgWindow.open();
        
        console.log(`Bubble message test: "${message}" at (${x}, ${y}) (position: ${positionType})`);
    };

    /**
     * Test avec texte multiligne
     * Utilisation: testBubbleMsgMultiline()
     */
    window.testBubbleMsgMultiline = function() {
        if (!SceneManager._scene._messageWindow) {
            console.error("No message window found in current scene");
            return;
        }

        const msgWindow = SceneManager._scene._messageWindow;
        msgWindow.setMapTarget($gamePlayer);
        $gameMessage.setBackground(0);
        $gameMessage.setPositionType(0);
        $gameMessage.add("Ceci est une première ligne.");
        $gameMessage.add("Ceci est une deuxième ligne plus longue.");
        $gameMessage.add("Et une troisième ligne!");
        msgWindow.open();
        
        console.log("Bubble message test: Multiline message");
    };

    /**
     * Clear target
     * Utilisation: clearBubbleTarget()
     */
    window.clearBubbleTarget = function() {
        if (!SceneManager._scene._messageWindow) {
            console.error("No message window found in current scene");
            return;
        }

        SceneManager._scene._messageWindow.setMapTarget(null);
        console.log("Bubble target cleared - will use default positioning");
    };

    /**
     * Test avec délai d'attente personnalisé
     * Utilisation: testBubbleMsgWithWait("Message", eventId, waitFrames, positionType)
     */
    window.testBubbleMsgWithWait = function(message = "Delayed Message", eventId = 1, waitFrames = 30, positionType = 0) {
        if (!SceneManager._scene._messageWindow) {
            console.error("No message window found in current scene");
            return;
        }

        const event = $gameMap.event(eventId);
        if (!event) {
            console.error(`Event with ID ${eventId} not found`);
            return;
        }

        const msgWindow = SceneManager._scene._messageWindow;
        msgWindow.setMapTarget(event);
        msgWindow.setWaitTime(waitFrames);  // Set wait time in frames (60 frames = 1 second at 60 FPS)
        $gameMessage.setBackground(0);
        $gameMessage.setPositionType(positionType);
        $gameMessage.add(message);
        msgWindow.open();
        
        console.log(`Bubble message test: "${message}" on event ${eventId} with ${waitFrames} frames delay (position: ${positionType})`);
    };

})();

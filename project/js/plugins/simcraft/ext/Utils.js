

SC.calculateScaledRect = function(refX, refY, refWidth, refHeight, refResWidth = SC.GraphicsConfig.uiReferenceResolution.width, refResHeight = SC.GraphicsConfig.uiReferenceResolution.height) {
    // Résolution actuelle du jeu
    const currentWidth  = Graphics.width;
    const currentHeight = Graphics.height;
    

    // Calcul des ratios par rapport à la résolution de référence
    const xRatio = refX / refResWidth;
    const yRatio = refY / refResHeight;
    const widthRatio = refWidth / refResWidth;
    const heightRatio = refHeight / refResHeight;

    // Application des ratios à la résolution actuelle
    let scaledWidth   = Math.round(currentWidth * widthRatio);
    let scaledHeight  = Math.round(currentHeight * heightRatio);
    let scaledX       = Math.round(currentWidth * xRatio);
    let scaledY       = Math.round(currentHeight * yRatio);
    
    const rect = new Rectangle(scaledX, scaledY, scaledWidth, scaledHeight);

    return rect;
};
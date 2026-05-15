ColorManager.hudTxtBase = function(){
    return "rgba(0, 0, 0)";
};
ColorManager.seasonColor = function(seasonIndex){
    return [
        "rgb(10, 60, 0)",
        "rgb(150, 65, 0)",
        "rgb(55, 30, 7)",
        "rgb(25, 60, 80)"
    ][seasonIndex];
};
ColorManager.seasonOutlineColor = function(seasonIndex){
    return [
        "rgb(170, 235, 195)",
        "rgb(255, 195, 160)",
        "rgb(255, 170, 50)",
        "rgb(195, 245, 255)"
    ][seasonIndex];
};
ColorManager.getGaugeBgColor = function(dir){
    if(dir == "down")
        return this.getColorByNm("lightred");
    else
        return this.getColorByNm("lightgreen");
}
ColorManager.dynamicGaugeColors = function(rate){
    let color1 = this.getColorByNm("green");
    let color2 = this.getColorByNm("green");
    
    if(rate < 0.15){
        color1 = this.getColorByNm("red");
        color2 = this.getColorByNm("red");
    }else if(rate < 0.3){
        color1 = this.getColorByNm("red");
        color2 = this.getColorByNm("orange");
    }else if(rate < 0.5){
        color1 = this.getColorByNm("orange");
        color2 = this.getColorByNm("green");
    }
    
    return [color1, color2];
}
ColorManager.dynamicGaugeColors2 = function(rate){
    let color1 = this.getColorByNm("red");
    let color2 = this.getColorByNm("red");
    
    if(rate < 0.15){
        color1 = this.getColorByNm("yellow");
        color2 = this.getColorByNm("orange");
    }else if(rate < 0.3){
        color1 = this.getColorByNm("orange");
        color2 = this.getColorByNm("orange");
    }else if(rate < 0.5){
        color1 = this.getColorByNm("orange");
        color2 = this.getColorByNm("red");
    }
    
    return [color1, color2];
}
ColorManager.getColorByNm			= function(nm){
	switch(nm.toLowerCase()){
        case "white":           return "rgb(255, 255, 255)";
        case "black":           return "rgb(0, 0, 0)";
		case "simpleblue":	    return this.textColor(1);
		case "lightred":	    return this.textColor(2);
		case "lightgreen":	    return this.textColor(3);
		case "lightcyan":	    return this.textColor(4);
		case "lightpurple":	    return this.textColor(5);
        case "lightyellow":     return this.textColor(6);
        case "grey":            return this.textColor(7);
        case "lightgrey":       return this.textColor(8);
        case "blue":            return this.textColor(9);
		case "red":		        return this.textColor(10);
		case "green":	        return this.textColor(11);
		case "yellow":	        return this.textColor(14);
        case "darkred":         return this.textColor(18);
		case "orange":	        return this.textColor(20);
		case "bluesky":	        return this.textColor(23);
        case "brown":           return this.textColor(25);
		case "purple":	        return this.textColor(30);
        case "shadow":          return "rgba(0,0,0,.5)"
		default:		        return this.textColor(0);
	}
};
ColorManager.getColorByStat          = function(index){
    switch(index){
        case 0: break;
        case 1: break;
        case 2: return("rgb(100,0,0)"); //FORCE
        case 3: return("rgb(142, 133, 0)"); //FORCE
        case 4: return("rgb(100, 58, 0)"); //FORCE
        case 5: return("rgb(95, 0, 100)"); //FORCE
        case 6: return("rgb(0, 2, 100)"); //FORCE
        case 7: return("rgb(15, 100, 0)"); //FORCE
    }
}
ColorManager.makeTransByStr   =function(color, value){
    if(!value) value = 0.5;
    return color.replace(')', `,${value})`).replace('b', 'ba');
}
ColorManager.getColorByType         = function(type){
    switch(type){
        case 0:     return this.getColorByNm("white");          //neutre
        case 1:     return this.getColorByNm("lightyellow");    //foudre
        case 2:     return this.getColorByNm("lightred");       //feu
        case 3:     return this.getColorByNm("lightcyan");      //glace
        case 4:     return this.getColorByNm("bluesky");        //air
        case 5:     return this.getColorByNm("brown");          //terre
        case 6:     return this.getColorByNm("blue");           //eau
        case 7:     return this.getColorByNm("yellow");         //lumiere
        case 8:     return this.getColorByNm("grey");           //tenebre
        case 9:     return this.getColorByNm("green");          //plante
        case 10:    return this.getColorByNm("lightpurple");    //divina
        case 11:    return this.getColorByNm("lightgrey");      //tempus
        case 12:    return this.getColorByNm("white");          //neant

    }
}
ColorManager.getKingdomTone = function(kingdomId){
    switch(kingdomId){
        case 0: return [0,0,0, 255];
        case 1: return [255,255,0, 255];
        default: return [24,72,255, 255];
    }
}
ColorManager.talkTextColor = function(){
    return this.getColorByNm('black')
}
ColorManager.talkOutlineColor = function(){
    return this.getColorByNm('rgba(255,255,255,.5)')
}
ColorManager.getHudBorderColors = function(){
    return [
        "rgb(89,77,61)",
        "rgb(185,156,116)",
        "rgb(213,196,170)"
    ];
}
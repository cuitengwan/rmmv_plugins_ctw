//=============================================================================
// CTW_pinzhi.js
//=============================================================================

/*:
 * @plugindesc Add 5-level quality of equipment and armor.
 * @author cui teng wan
 *
 *
 * @help
 *     Now the equipment has quality.
 *     
 *     Use metadata in note tag, example: <pinzhi:1>
 * 
 *     The number, quality, color and effect:
 *     1 posui     white  x0.8
 *     2 putong    green  x1.0
 *     3 youxiu    blue   x1.1
 *     4 wanmei    purple x1.2
 *     5 guangmang orange x1.4
 *
*/

var CTW = CTW || {};
CTW.pinzhi = CTW.pinzhi || {};
CTW.pinzhi.version = 1.00;

var pinzhiWhite  = '#ffffff';
var pinzhiGreen  = '#00cc00';
var pinzhiBlue   = '#99ccff';
var pinzhiPurple = '#990099';
var pinzhiOrange = '#ff8000';

// draw item
Window_Base.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        console.log("DEBUG1");
        var itemQuality = item.pinzhi;
        console.log(itemQuality);
        var iconBoxWidth = Window_Base._iconWidth + 4;
            switch(itemQuality){
                case 1:
                    this.changeTextColor(pinzhiWhite);
                    break;
                case 2:
                    this.changeTextColor(pinzhiGreen);
                    break;
                case 3:
                    this.changeTextColor(pinzhiBlue);
                    break;
                case 4:
                    this.changeTextColor(pinzhiPurple);
                    break;
                case 5:
                    this.changeTextColor(pinzhiOrange);
                    break;
                default:
                    this.resetTextColor();
                    break;
            }
            this.drawIcon(item.iconIndex, x + 2, y + 2);
            this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
        this.resetTextColor();
    }
};


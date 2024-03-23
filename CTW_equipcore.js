//=============================================================================
// CTW_equipcore.js
//=============================================================================

/*:
 * @plugindesc Core engine of my random armor/weapon plugins.
 * @author cui teng wan
 *
 *
 * @help
 *     Core engine of my random armor/weapon plugins.
 *     Should be on the top of other plugins
 *
*/

    var CTW = CTW || {};
    CTW.equipCore = CTW.equipCore || {};
    CTW.equipCore.version = 1.00;

    // save the randomly weapons/armors/items
    var _make_save_contents = DataManager.prototype.makeSaveContents;
    DataManager.prototype.makeSaveContents = function() {
        var mycontents = {};
        mycontents = _make_save_contents.call(this);
        mycontents.armors = $dataArmors;
        mycontents.weapons = $dataWeapons;
        mycontents.items = $dataItems;
        return mycontents;
    }

    var _extract_save_contents = DataManager.prototype.extractSaveContents;
    DataManager.prototype.extractSaveContents = function(contents) {
        _extract_save_contents.call(this,contents);
        $dataArmors = contents.armors;
        $dataWeapons = contents.weapons;
        $dataItems = mycontents.items;
    }

    // create a new weapon 
    DataManager.prototype.createNewWeaponCTW = function(origin,pinzhi) {
        var l = $dataWeapons.length;
        var newWeapon = $dataWeapons[origin];
        $dataWeapons.push(newWeapon);
        newWeapon.pinzhi = pinzhi;
        newWeapon.id = l;
        newWeapon.qianghua = 0;
        return l;
    }

    // get a weapon
    DataManager.prototype.getNewWeaponCTW = function(id,num) {
        $gameParty.gainItem($dataWeapons[id], num, false);
    }

    // test: qianghua
    DataManager.prototype.weaponQiangHuaCTW = function(id) {
        var a = $dataWeapons[id].qianghua + 1;
        if( a > 7 ) {
            return;
        }
        var b = $dataWeapons[id].name;
        $dataWeapons[id].qianghua = a;
        var c = "  ";
        for(i=0;i<a;i++) {
            c = c + "★";
        }
        $dataWeapons[id].name = b + c; 
    }
    
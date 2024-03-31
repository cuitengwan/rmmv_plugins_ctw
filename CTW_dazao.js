//=============================================================================
// CTW_dazao.js
//=============================================================================

/*:
 * @plugindesc Main of dazao system.
 * @author cui teng wan
 *
 *
 * @help
 *     main of dazao system
 *
*/

    var CTW = CTW || {};
    CTW.dazao = CTW.dazao || {};
    CTW.dazao.version = 1.00;

    // plugin command
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if ( command == 'DAZAO' ) {
            SceneManager.push(Scene_Dazao);
        }
    }

    // dazao menu
    var DazaoMenu = ["打造系统","测试1"];


    // scene
    function Scene_Dazao() {
        this.initialize.apply(this, arguments);
    }

    Scene_Dazao.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Dazao.prototype.constructor = Scene_Dazao;

    Scene_Dazao.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._indexWindow = new Window_DazaoIndex(0, 0);
        this._indexWindow.setHandler('cancel', this.popScene.bind(this));
        //var wy = this._indexWindow.height;
        //var ww = Graphics.boxWidth;
        var wx = this._indexWindow.width;
        var ww = Graphics.boxWidth - this._indexWindow.width;
        var wh = Graphics.boxHeight;
        this._funcWindow = new Window_DazaoFunc(wx, 0, ww, wh);
        this.addWindow(this._indexWindow);
        this.addWindow(this._funcWindow);
    };

    // index window
    function Window_DazaoIndex() {
        this.initialize.apply(this, arguments);
    }

    Window_DazaoIndex.prototype = Object.create(Window_Selectable.prototype);
    Window_DazaoIndex.prototype.constructor = Window_DazaoIndex;

    // index initial
    Window_DazaoIndex.prototype.initialize = function(x, y) {
        //var width = Graphics.boxWidth;
        //var height = this.fittingHeight(6);
        var width = this.fittingHeight(5);
        var height = Graphics.boxHeight;
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.setTopRow(0);
        this.select(0);
        this.activate();
    };

    // index exit
    Window_DazaoIndex.prototype.processCancel = function() {
        Window_Selectable.prototype.processCancel.call(this);
    };

    // index menu
    Window_DazaoIndex.prototype.refresh = function() {
        this.createContents();
        this.drawAllItems();
    }

    Window_DazaoIndex.prototype.drawItem = function(index) {
        var _menu = DazaoMenu[index];
        var rect = this.itemRect(index);
        var width = rect.width - this.textPadding();
        var iw = Window_Base._iconWidth + 4;
        this.drawText(_menu, rect.x, rect.y, width - iw);
    }

    // function window
    function Window_DazaoFunc() {
        this.initialize.apply(this, arguments);
    }

    Window_DazaoFunc.prototype = Object.create(Window_Base.prototype);
    Window_DazaoFunc.prototype.constructor = Window_DazaoFunc;

    Window_DazaoFunc.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };


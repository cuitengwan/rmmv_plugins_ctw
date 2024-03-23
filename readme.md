# 插件编写步骤

插件编写的基本流程：

根据网上的教程，以及官方提供的一两个范例。

网上专栏地址：[https://blog.csdn.net/xmoss/category_8899417.html](https://blog.csdn.net/xmoss/category_8899417.html)

# 1.首先明白基本结构

js文件夹内部包含了以下这些关键文件：

![Untitled](%E6%8F%92%E4%BB%B6%E7%BC%96%E5%86%99%E6%AD%A5%E9%AA%A4%20cc47cb69ff18412c9d4d68a75c6f676a/Untitled.png)

起到的作用如下：

| main | 程序入口 |
| --- | --- |
| plugin | 当前插件列表，不要改 |
| rpg_core | 数学运算，util，cache，点，矩形，写字，bitmap，图片，输入，tilemap，天气，精灵，音乐 等，以及object的一些附加内容 |
| rpg_manager | 各种数据的管理 |
| rpg_objects | Game_开头的内容，包括系统、计时、消息、屏幕、物品、战斗、动作、角色、事件、interpreter等。（附注1） |
| rpg_scenes | 场景，所有场景都继承自scene_base，scene_base直接继承自object。运行的时候切换新场景就压栈，返回旧场景就弹栈，当前在栈顶。 |
| rpg_sprites | 精灵。所有精灵都继承自sprite_base，他也是直接继承自object。这个文件主要是与精灵的显示有关，数据的在core和manager里。 |
| rpg_windows | 窗口（附注2） |

附注1：Game_System包括了全局的数据，例如死亡数、逃跑数等。如果自己新建数据不知道放哪，就直接扔进Game_System。interpreter是用来处理事件的。开发工具里面事件模式双击一块地建立事件，事件内容（显示文字、移动、修改变量、开关、跳转语句、插件命令）等在这里解析和实现。有参数的插件也要interpreter传参。

附注2：根据网上大佬的比喻，例如画画的时候，scene相当于”木头画板“，用来支撑，在切换场景的时候才会换，否则一直在这里，而且大小不会变（屏幕）；window相当于”画纸“，铺在木头画板上，用来绘制，画纸可以放上新的，也可以撤下旧的，画纸可叠加可组合，大小也可定义；在window里面画纸上绘制sprite等图像。

# 2.开始编写

## 1 参数注释

每个插件开头都必须要有参数注释，而且参数注释必须符合一定格式，以便开发工具识别，并在插件管理器呈现。

参数注释的主要格式，用官方的item book来举例子。

首先需要将参数注释用/**/括起来：

/*:en（第一行冒号不能省，冒号后不空格紧跟语言，例如ja，一般英语的话不写en）

* 中间开始写各种选项

*/

同一个插件里面可以有多个不同语言的参数注释。

选项的内容：都要艾特关键词，空一格，再写自己的内容

（1）描述

@plugindesc 这里写描述，会在开发工具里面被解析显示出来

（2）作者

@author 作者名字

（3）参数

@param 参数名，可以带空格

@desc 参数的描述，帮着在开发工具里面看的

@default 默认值

每个参数都是紧挨着的三行，并且上下都要与其他内容空一行

参数其他可选项：

@type 类型，例如number，boolean

@on @OFF 对于boolean型的，有两行on和off指定什么字符串代替true和false

@min @max 对于number型的，有两行min和max指定最大最小值

（4）帮助

@help

帮助在最后写，这个艾特help之后的内容就全是帮助了，会在开发工具里面被解析显示出来。帮助结束之后就*/结束掉这个参数注释。

## 2 命名空间

为了不污染原本的功能，我们自己写的代码要放在自己的命名空间里面。有两种处理方式：

（1）像官方示例插件，直接一个括号（）将自己写的代码全括起来

（2）像yanfly大佬，在代码开头建立命名空间

```jsx
var myspace = myspace || {};
```

意思是建立新命名空间myspace，并且后面代码均在这里。||{}指如果myspace已存在，则不建立新的，后面代码也在myspace里。

可以多层命名空间：

```jsx
var cuitengwan = cuitengwan || {};
cuitengwan.plugin1 = cuitengwan.plugin1 || {};
```

一个人写多个插件的话，第二层命名空间防止他们互相冲突。

## 3 传参

如果插件有参数的话，需要进行传参。

将参数从pluginmanager取回来，我的代码才知道我在开发工具里是怎么配的参数。

```jsx
   	var parameters = PluginManager.parameters('ItemBook');
    var priceText = String(parameters['Price Text'] || 'Price');
    var equipText = String(parameters['Equip Text'] || 'Equip');
```

变量parameters指定从哪个插件取回参数。

自定义变量通过String(parameters[’精准匹配’]取回参数，||后面是缺省值。

## 4 接收插件指令

当在开发工具的事件中选择“插件指令”后，game_interpreter负责找到该插件指令对应的插件，也就是我们的插件，然后传进来。我们的插件需要对插件指令进行翻译。

首先定义一个变量，保存interpreter原版的插件指令。

```jsx
	var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
```

然后重写pluginCommand方法。里面先call this调用一遍存下来的原版指令，然后再写我们的指令。

```jsx
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
				// 写我们的解析指令
    }
```

重写的pluginCommand方法接收2个参数，command和args。

例如开发工具执行脚本指令， itembook open，此时itembook是command，open是args。

我们的解析指令采用if套switch的方式，if判断是不是这个command（严格等于），switch把该插件可能的args轮一遍，每一种情况进行分别的处理。

```jsx
    if (command === 'ItemBook') {
            switch (args[0]) {
            case 'open':
                SceneManager.push(Scene_ItemBook);
                break;
            case 'add':
                $gameSystem.addToItemBook(args[1], Number(args[2]));
                break;
            // ...其他情况
            }
    }
```

## 5 自定义方法

### 1) 添加和保存数据

参数传进来了，也解析好了，然后就该根据不同的args，执行不同的功能。功能代码要写在插件里面。

上面第1部分的附注1所说，自增的全局的数据不知道放在哪里，就直接扔给Game_System。官方的ItemBook就是这样做的。

给Game_System糊上一个新方法，直接新增在其原型prototype。例如：

```jsx
    Game_System.prototype.addToItemBook = function(type, dataId) {
        if (!this._ItemBookFlags) {
            this.clearItemBook();
        }
        var typeIndex = this.itemBookTypeToIndex(type);
        if (typeIndex >= 0) {
            this._ItemBookFlags[typeIndex][dataId] = true;
        }
    };
```

上面示例为，向物品书添加元素，传参“类型”和“ID”。如果_ItemBookFlags（也就是整个游戏中保存物品书的数据“库”）还没有，则先执行一遍Game_System的clearItemBook方法（这个方法在这个插件后面写了，是建立_ItemBookFlags数组并清空。这里这么写也是为了防止写不存在的数组的BUG）。然后执行方法确定物品类型，最后将_ItemBookFlags的该类型的该ID位置置为true。

所说的清空物品书的方法，建立了个二维数组，是三个数组组成的数组。

```jsx
    Game_System.prototype.clearItemBook = function() {
        this._ItemBookFlags = [[], [], []];
    };
```

### 2) 修改原版方法，造成触发我们插件的条件

还是示例物品书ItemBook插件。根据设计，我们想在获得物品的时候填充图鉴。因此我们要修改获得物品的方法，在里面附加上我们的填充图鉴功能。

首先查资料，知道获取物品方法在Game_Party中。名叫gainItem。

其次就开始写了。仍然必须先新建变量，保存原版的方法。然后重写方法，先call调用一遍原版防止出问题，然后实现我们的功能。

```jsx
    var _Game_Party_gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        _Game_Party_gainItem.call(this, item, amount, includeEquip); // 原版
        if (item && amount > 0) {
            var type;
            if (DataManager.isItem(item)) {
                type = 'item';
            } else if (DataManager.isWeapon(item)) {
                type = 'weapon';
            } else if (DataManager.isArmor(item)) {
                type = 'armor';
            }
            $gameSystem.addToItemBook(type, item.id); // 这些都是我们的
        }
    };
```

上面代码中也调用了DataManager的判断方法，判断到type，然后调用本插件内自定义的addToItemBook，写进物品书。

我们的自定义的方法是在Game_System中。在rpg_manager.js文件，DataManager.createGameObjects中，新的Game_System()实例赋值给了$gameSystem全局变量，因此这里我们要用$gameSystem.addToItemBook()。

### 3) 场景

我们的功能如果是个单独的界面，就得自己写个场景scene。

ItemBook插件里面有光标，因此继承自Scene_MenuBase插件。

首先是一些固定写法，新建场景构造函数，继承自Scene_MenuBase，绑定构造函数，设定初始化为父亲的初始化。

```jsx
	  function Scene_ItemBook() {
        this.initialize.apply(this, arguments);
    }

    Scene_ItemBook.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_ItemBook.prototype.constructor = Scene_ItemBook;

    Scene_ItemBook.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
```

然后就是这个场景的创建。首先调用Scene_MenuBase的创建，然后写我们新场景的功能。主要是建立窗口，绑定窗口，设定大小，添加窗口等。

```jsx
    Scene_ItemBook.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this); // 父亲的创建
        this._indexWindow = new Window_ItemBookIndex(0, 0); // 创建顶层窗口
        this._indexWindow.setHandler('cancel', this.popScene.bind(this));
        var wy = this._indexWindow.height;
        var ww = Graphics.boxWidth;
        var wh = Graphics.boxHeight - wy;
        this._statusWindow = new Window_ItemBookStatus(0, wy, ww, wh); //创建其他窗口
        this.addWindow(this._indexWindow);
        this.addWindow(this._statusWindow);
        this._indexWindow.setStatusWindow(this._statusWindow); // 其他窗口的方法在顶层窗口里
    };
```

插件定义了2个窗口，其中indexWindow是顶层，statusWindow是顶层的儿子。非顶层的窗口方法在顶层名下。窗口层次在下面5）。

注意，创建窗口之后，需要绑定关闭顶层窗口的处理。上面方法的第3行绑定了当顶层窗口里执行cancel时，本场景弹出场景栈，即退回原来场景。

### 4) 窗口

有了“画板”场景之后，要在场景里面放窗口，作为“画纸”。

对于物品书插件，有2个窗口，索引窗口_indexWindow和状态窗口_statusWindow。

新建窗口的固定写法和场景一样，四步走。这里继承自可选择窗口Window_Selectable。

```jsx
    function Window_ItemBookIndex() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemBookIndex.prototype = Object.create(Window_Selectable.prototype);
    Window_ItemBookIndex.prototype.constructor = Window_ItemBookIndex;
```

对于initialize，还是要调用父亲。但是根据自己设计的功能特点，本窗口的并没有直接简单调用，而是进行了少量修改。

```jsx
    Window_ItemBookIndex.lastTopRow = 0;
    Window_ItemBookIndex.lastIndex  = 0;

    Window_ItemBookIndex.prototype.initialize = function(x, y) {
        var width = Graphics.boxWidth;
        var height = this.fittingHeight(6);
        Window_Selectable.prototype.initialize.call(this, x, y, width, height); // 父亲
        this.refresh();
        this.setTopRow(Window_ItemBookIndex.lastTopRow);
        this.select(Window_ItemBookIndex.lastIndex);
        this.activate();
    };
```

首先定义了这个窗口的变量，存储住最后一行和最后一个索引的值，实现在游戏中关闭物品书再打开，仍然指向上次关闭时指向的位置。

调用父亲之前，取到了宽高。调用之后，刷新并选择了指向。

窗口刷新：调用了Window_Selectable的刷新，然后调用自己写的自己功能刷新方法。

```jsx
    Window_ItemBookIndex.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateStatus();
    };

    Window_ItemBookIndex.prototype.updateStatus = function() {
        if (this._statusWindow) {
            var item = this._list[this.index()];
            this._statusWindow.setItem(item);
        }
    };
```

关闭窗口：调用Window_Selectable的关闭。当然也可以自增功能。

```jsx
    Window_ItemBookIndex.prototype.processCancel = function() {
        Window_Selectable.prototype.processCancel.call(this);
        Window_ItemBookIndex.lastTopRow = this.topRow();
        Window_ItemBookIndex.lastIndex = this.index();
    };
```

我们这个窗口的关闭功能processCancel，在前面3）我们自定场景的最后，场景创建方法中，绑定到了弹栈方法。这个窗口一关闭，场景也自动切回原来的场景去了。

### 5) 窗口层次

一个场景下，窗口不止一个。例如ItemBook就是有2个窗口。左边选择窗口是个带光标窗口，选中一个物品；右边展示窗口就展示出选择窗口里选中物品的详细信息。

因此，ItemBook的选择窗口在顶层，展示窗口在2层，展示窗口是选择窗口的子窗口。

展示窗口不需要选择，只是看的。因此继承自Window_Base就好。构造函数、创建、initialize这四步走不再重复解释。

再写一遍前面的场景创建。

```jsx
    Scene_ItemBook.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this); // 父亲的创建
        this._indexWindow = new Window_ItemBookIndex(0, 0); // 创建顶层窗口
        this._indexWindow.setHandler('cancel', this.popScene.bind(this));
        var wy = this._indexWindow.height;
        var ww = Graphics.boxWidth;
        var wh = Graphics.boxHeight - wy;
        this._statusWindow = new Window_ItemBookStatus(0, wy, ww, wh); //创建其他窗口
        this.addWindow(this._indexWindow);
        this.addWindow(this._statusWindow);
        this._indexWindow.setStatusWindow(this._statusWindow); // 其他窗口的方法在顶层窗口里
    };
```

非顶层窗口有层次地挂载在父亲名下，最终最大的父亲是顶层窗口。

展示窗口中，给他的prototype糊上新方法，在展示窗口里面计算数据，写字画图。

```jsx
    Window_ItemBookStatus.prototype.refresh = function() {
        var item = this._item;
        var x = 0;
        var y = 0;
        var lineHeight = this.lineHeight();

        this.contents.clear();

        if (!item || !$gameSystem.isInItemBook(item)) {
            return;
        }

        this.drawItemName(item, x, y);

        x = this.textPadding();
        y = lineHeight + this.textPadding();

        var price = item.price > 0 ? item.price : '-';
        this.changeTextColor(this.systemColor());
        this.drawText(priceText, x, y, 120);
        this.resetTextColor();
        this.drawText(price, x + 120, y, 120, 'right');
        y += lineHeight;

        if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
            var etype = $dataSystem.equipTypes[item.etypeId];
            this.changeTextColor(this.systemColor());
            this.drawText(equipText, x, y, 120);
            this.resetTextColor();
            this.drawText(etype, x + 120, y, 120, 'right');
            y += lineHeight;

            var type;
            if (DataManager.isWeapon(item)) {
                type = $dataSystem.weaponTypes[item.wtypeId];
            } else {
                type = $dataSystem.armorTypes[item.atypeId];
            }
            this.changeTextColor(this.systemColor());
            this.drawText(typeText, x, y, 120);
            this.resetTextColor();
            this.drawText(type, x + 120, y, 120, 'right');

            x = this.textPadding() + 300;
            y = lineHeight + this.textPadding();
            for (var i = 2; i < 8; i++) {
                this.changeTextColor(this.systemColor());
                this.drawText(TextManager.param(i), x, y, 160);
                this.resetTextColor();
                this.drawText(item.params[i], x + 160, y, 60, 'right');
                y += lineHeight;
            }
        }

        x = 0;
        y = this.textPadding() * 2 + lineHeight * 7;
        this.drawTextEx(item.description, x, y);
    };
```

以上为展示窗口的方法。

调用展示窗口的方法，则在其父亲，也就是索引窗口，调用this.statuswindow.方法()。

```jsx
    Window_ItemBookIndex.prototype.updateStatus = function() {
        if (this._statusWindow) {
            var item = this._list[this.index()];
            this._statusWindow.setItem(item);
        }
    };
```

# 3.其他

## 1 meta属性

根据官方手册，数据库的物品、装备等可以使用meta储存一些自定义数据，并传递给插件。

在note备注区域，例如在i号物品的备注区写附加数据：

<myname:mydata>

则在插件里面，先读入物品：

```jsx
item = $dataItems[i];
```

然后就可以调用i号物品的meta data了。

```jsx
a = item.meta.myname   // 这个变量a的值是mydata
```

2.
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(_main) {
        _super.call(this);
        this._main = _main;
        this._body = new egret.Bitmap;
        this._body.texture = RES.getRes("3_png");
        this._main.addChild(this._body);
        this._body.anchorOffsetX = 120;
        this._body.anchorOffsetY = 120;
        this._stateMachine = new StateMachine();
        this._body.x = this._main.stage.stageWidth / 2;
        this._body.y = this._main.stage.stageHeight / 2;
        this._ifidle = true;
        this._ifwalk = false;
    }
    var d = __define,c=Player,p=c.prototype;
    p.move = function (targetX, targetY) {
        egret.Tween.removeTweens(this._body);
        if (targetX > this._body.x) {
            this._body.skewY = 180;
        }
        else {
            this._body.skewY = 0;
        }
        this._stateMachine.setState(new PlayerMoveState(this));
        egret.Tween.get(this._body).to({ x: targetX, y: targetY }, 2000).call(function () { this.idle(); }, this);
        // if (this._body.x >= targetX - 5 && this._body.x <= targetX + 5 && this._body.y <= targetY + 5 && this._body.y >= targetY - 5) {
        //    if(this._body.x==targetX&&this._body.y==targetY){
        //     this.idle();
        // }
    };
    p.idle = function () {
        this._stateMachine.setState(new PlayerIdleState(this));
        // this.startidle();
    };
    p.startWalk = function () {
        var _this = this;
        var list = ["1_png", "2_png"];
        var count = -1;
        egret.Ticker.getInstance().register(function () {
            count = count + 0.2;
            if (count >= list.length) {
                count = 0;
            }
            _this._body.texture = RES.getRes(list[Math.floor(count)]);
        }, this);
        //egret.Tween.get(walk).to({ x: targetX, y: targetY }, 300, egret.Ease.sineIn);
        // var tw = egret.Tween.get(walk);
        // tw.wait(200);
        // tw.call(change, self);
    };
    p.startidle = function () {
        var _this = this;
        var list = ["3_png", "4_png"];
        var count = -1;
        egret.Ticker.getInstance().register(function () {
            count = count + 0.2;
            if (count >= list.length) {
                count = 0;
            }
            _this._body.texture = RES.getRes(list[Math.floor(count)]);
        }, this);
    };
    return Player;
}(egret.DisplayObjectContainer));
egret.registerClass(Player,'Player');
var PlayerState = (function () {
    function PlayerState(player) {
        this._player = player;
    }
    var d = __define,c=PlayerState,p=c.prototype;
    p.onEnter = function () { };
    p.onExit = function () { };
    return PlayerState;
}());
egret.registerClass(PlayerState,'PlayerState',["State"]);
var PlayerMoveState = (function (_super) {
    __extends(PlayerMoveState, _super);
    function PlayerMoveState() {
        _super.apply(this, arguments);
    }
    var d = __define,c=PlayerMoveState,p=c.prototype;
    p.onEnter = function () {
        // egret.setTimeout(() => {
        //     this._player.move;
        // }, this, 500)
        this._player._ifwalk = true;
        this._player.startWalk();
    };
    p.onExit = function () {
        this._player._ifwalk = false;
    };
    return PlayerMoveState;
}(PlayerState));
egret.registerClass(PlayerMoveState,'PlayerMoveState');
var PlayerIdleState = (function (_super) {
    __extends(PlayerIdleState, _super);
    function PlayerIdleState() {
        _super.apply(this, arguments);
    }
    var d = __define,c=PlayerIdleState,p=c.prototype;
    p.onEnter = function () {
        // this._player._label.text = "idle";
        // egret.setTimeout(() => {
        //     this._player.idle();
        // }, this, 500)
        this._player._ifidle = true;
        this._player.startidle();
    };
    p.onExit = function () {
        this._player._ifidle = false;
    };
    return PlayerIdleState;
}(PlayerState));
egret.registerClass(PlayerIdleState,'PlayerIdleState');
var StateMachine = (function () {
    function StateMachine() {
    }
    var d = __define,c=StateMachine,p=c.prototype;
    p.setState = function (e) {
        if (this.CurrentState != null) {
            this.CurrentState.onExit();
        }
        this.CurrentState = e;
        e.onEnter();
    };
    return StateMachine;
}());
egret.registerClass(StateMachine,'StateMachine');
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        // var sky: egret.Bitmap = this.createBitmapByName("bg_jpg");
        // //this.addChild(sky);
        // var stageW: number = this.stage.stageWidth;
        // var stageH: number = this.stage.stageHeight;
        // sky.alpha = 0.1;
        // sky.width = stageW;
        // sky.height = stageH;
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0xFFFFFF, 1);
        topMask.graphics.drawRect(0, 0, 600, 1200);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);
        /*
                this._txInfo = new egret.TextField;
                this._txInfo.size = 24;
                this._txInfo.textColor = 0x000000;
                this._txInfo.lineSpacing = 10;
                this._txInfo.multiline = true;
                this._txInfo.text = "判断状态";
                this._txInfo.x = 30;
                this._txInfo.y = 100;
                this.addChild(this._txInfo);
        */
        // this.stage.touchEnabled=true;
        //    var body = new egret.Bitmap;
        //        body.texture = RES.getRes("idle_1_png");
        //         this.addChild(body);
        //           var list = ["idle_1_png", "idle_2_png", "idle_3_png", "idle_4_png", "idle_5_png", "idle_6_png", "idle_7_png", "idle_8_png", "idle_9_png", "idle_10_png", "idle_11_png", "idle_12_png"];
        //         var count = -1;
        //         egret.Ticker.getInstance().register(() => {
        //             count=count + 0.2;
        //             if (count >= list.length) {
        //                 count = 0;
        //             }
        //             body.texture = RES.getRes(list[Math.floor(count)]);
        //         }, this);
        var player = new Player(this);
        player.idle();
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            //this._txInfo.text += "walk\n";
            player.move(evt.stageX, evt.stageY);
        }, this);
    };
    //  mouseDown(evt:egret.TouchEvent,player:Player)
    //     {
    //         console.log("Mouse Down.");
    //         this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,player.move( evt.stageX , evt.stageY ), this);
    //     }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    p.load = function (callback) {
        var count = 0;
        var self = this;
        var check = function () {
            count++;
            if (count == 2) {
                callback.call(self);
            }
        };
        var loader = new egret.URLLoader();
        loader.addEventListener(egret.Event.COMPLETE, function loadOver(e) {
            var loader = e.currentTarget;
            this._mcData = JSON.parse(loader.data);
            check();
        }, this);
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        var request = new egret.URLRequest("resource/assets/mc/animation.json");
        loader.load(request);
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
// class PlayAnimation {
//     public startWalk(_main: Main, walk: egret.Bitmap, targetX: number, targetY: number) {
//         var list = ["walk_1_png", "walk_2_png", "walk_3_png", "walk_4_png", "walk_5_png", "walk_6_png", "walk_7_png", "walk_8_png", "walk_9_png", "walk_10_png", "walk_11_png", "walk_12_png"];
//         var count = -1;
//         var change: Function = function () {
//             count++;
//             if (count >= list.length) {
//                 count = 0;
//             }
//             walk.texture = RES.getRes(list[count]);
//             egret.Tween.get(walk).to({ x: targetX, y: targetY }, 300, egret.Ease.sineIn);
//             _main.addChild(walk);
//             var tw = egret.Tween.get(walk);
//             tw.wait(200);
//             tw.call(change, self);
//         };
//         change();
//     }
//     public startidle(_main: Main, idle: egret.Bitmap) {
//         var list = ["idle_1_png", "idle_2_png", "idle_3_png", "idle_4_png", "idle_5_png", "idle_6_png", "idle_7_png", "idle_8_png", "idle_9_png", "idle_10_png", "idle_11_png", "idle_12_png"];
//         var count = -1;
//         var change: Function = function () {
//             count++;
//             if (count >= list.length) {
//                 count = 0;
//             }
//             idle.texture = RES.getRes(list[count]);
//             _main.addChild(idle);
//             var tw = egret.Tween.get(idle)
//             tw.wait(200);
//             tw.call(change, self);
//         };
//         change();
//     }
// }
//# sourceMappingURL=Main.js.map
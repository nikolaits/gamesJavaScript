var FlappyPlane = {
    score: -1,
    imagesColors: [],
    friendChallenge: false,
    friendName: "",
    friendScore: 0,
    friendChallengeWin: false,
    friendChallengeAlive: false,
    ChallengingFriend: false,
    ChallengingName: ""
};

// remove bot when server callbacks are implemented
var myarr = {};
myarr.name1 = 1;
myarr.name2 = 15;
myarr.name3 = 20;
myarr.name123456789 = 20;
Cookies.set("FlappyPlaneFriendsChallenges", myarr);

var myfrarr = [];
myfrarr.push("Name1");
myfrarr.push("Name2");
myfrarr.push("Name3");
Cookies.set("FlappyPlaneFriends", myfrarr);
// remove top

FlappyPlane.Init = function () { };

FlappyPlane.Init.prototype = {
    preload: function () {
        this.game.load.image("loading", assets_path + "assets/sprites/loading.png");
    },
    create: function () {
        this.game.state.start("Preloader");
    }
};

FlappyPlane.Preloader = function () { };

FlappyPlane.Preloader.prototype = {
    preload: function () {
        var loadingBar = this.add.sprite(this.game.width / 2, this.game.height / 2, "loading");
        loadingBar.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loadingBar);
        this.game.stage.backgroundColor = "#4488AA";
        this.game.canvas.id = "flappyPlane";

        this.game.load.image("paused", assets_path + "assets/sprites/paused.png");
        this.game.load.image("gear", assets_path + "assets/sprites/gear.png");
        this.game.load.image("check", assets_path + "assets/sprites/check.png");
        this.game.load.image("colors", assets_path + "assets/sprites/colors.png");
        this.game.load.image("ResetDefaultColors", assets_path + "assets/sprites/ResetDefaultColors.png");
        this.game.load.image("playbutton", assets_path + "assets/sprites/playbutton.png");
        this.game.load.image("close", assets_path + "assets/sprites/close.png");
        this.game.load.image("title", assets_path + "assets/sprites/titleFP.png");
        this.game.load.spritesheet("plane", assets_path + "assets/sprites/plane.png", 88, 73);
        this.game.load.spritesheet("rocks", assets_path + "assets/sprites/rocks.png", 100, 90);
        this.game.load.image("puff", assets_path + "assets/sprites/puff.png");
        this.game.load.spritesheet("explosion", assets_path + "assets/sprites/explosion.png", 100, 100);
        this.game.load.bitmapFont("font", assets_path + "assets/fonts/font.png", assets_path + "assets/fonts/font.fnt");
        this.game.load.image("background", assets_path + "assets/sprites/backgroundFP.png");
        this.game.load.image("GetReady", assets_path + "assets/sprites/textGetReady.png");
        this.game.load.image("GameOver", assets_path + "assets/sprites/textGameOver.png");
        this.game.load.image("tapTick", assets_path + "assets/sprites/tapTick.png");
        this.game.load.image("tapRight", assets_path + "assets/sprites/tapRight.png");
        this.game.load.image("tapLeft", assets_path + "assets/sprites/tapLeft.png");
        this.game.load.audio("heliLoop", assets_path + "assets/sounds/heliLoop.wav");
        this.game.load.audio("explosion", assets_path + "assets/sounds/explosion.wav");
        this.game.load.audio("explosion1", assets_path + "assets/sounds/explosion1.wav");

        Cookies.remove('FlappyPlaneSaveGame');

        var cookieImagesColors = Cookies.get('FlappyPlaneColors');
        if (cookieImagesColors) {
            FlappyPlane.imagesColors = JSON.parse(cookieImagesColors);
        } else {
            FlappyPlane.imagesColors.push({ image: "playbutton", tint: "0xffffff" });
            FlappyPlane.imagesColors.push({ image: "title", tint: "0xffffff" });
            FlappyPlane.imagesColors.push({ image: "plane", tint: "0xffffff" });
            FlappyPlane.imagesColors.push({ image: "rocks", tint: "0xffffff" });
            FlappyPlane.imagesColors.push({ image: "explosion", tint: "0xffffff" });
            FlappyPlane.imagesColors.push({ image: "background", tint: "0xffffff" });
        }
    },
    create: function () {
        this.game.state.start("MainMenu");
    }
};

FlappyPlane.ChangeColors = function () {
    this.sprites = [];
};

FlappyPlane.ChangeColors.prototype = {
    create: function () {
        var that = this;

        FlappyPlane.imagesColors.forEach(function (e, index) {
            var currentSprite = this.game.add.sprite(100, 50 + 140 * index, e.image);
            currentSprite.width = 100;
            currentSprite.height = 100;
            currentSprite.tint = e.tint;
            that.sprites.push(currentSprite);

            var colors = this.game.add.sprite(250, 50 + 140 * index, "colors");
            colors.imageIndex = index;
            colors.currentSprite = currentSprite;
            colors.height = 90;
            colors.inputEnabled = true;
            colors.events.onInputDown.add(onFlappyPlaneColorsInputDown, this);
        });

        var changeColors = this.game.add.button(35, 35, "check", this.startGame);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);

        var resetColors = this.game.add.button(this.game.width / 2, this.game.height - 50, "ResetDefaultColors", this.ResetDefaultColors, this);
        resetColors.anchor.set(0.5);
    },
    startGame: function () {
        Cookies.set('FlappyPlaneColors', FlappyPlane.imagesColors);
        this.game.state.start("MainMenu");
    },
    ResetDefaultColors: function () {
        Cookies.remove('FlappyPlaneColors');
        this.sprites.forEach(function (e) {
            e.tint = 0xffffff;
        });
        FlappyPlane.imagesColors.forEach(function (e) {
            e.tint = 0xffffff;
        });
    }
};

FlappyPlane.FriendsChallenges = function () { };

FlappyPlane.FriendsChallenges.prototype = {
    create: function () {
        var friendsChallengesCookie = Cookies.get("FlappyPlaneFriendsChallenges");
        if (friendsChallengesCookie) {
            var friendsChallenges = JSON.parse(friendsChallengesCookie);
            var index = 0;
            var that = this;

            $.each(friendsChallenges, function (i, e) {
                index++;
                if (index > 20) return;

                var playerName = i.toString().substring(0, 10);
                var playerScore = e.toString();

                that.game.add.bitmapText(50, 100 + 30 * index, "font", playerName, 26);
                that.game.add.bitmapText(250, 100 + 30 * index, "font", playerScore, 26);

                var acceptText = that.game.add.bitmapText(450, 100 + 30 * index, "font", "accept", 26);
                acceptText.inputEnabled = true;
                acceptText.events.onInputDown.add(function (args) {
                    FlappyPlane.friendChallenge = true;
                    FlappyPlane.friendChallengeAlive = true;
                    FlappyPlane.friendName = this.playerName;
                    FlappyPlane.friendScore = this.playerScore;

                    this.scope.game.state.start("Game");
                }, { playerName: playerName, playerScore: playerScore, scope: that });

            });
        } else {
            var noChallengesText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, "font", "no challenges available", 36);
            noChallengesText.anchor.set(0.5);
        }

        var challengeFriendText = this.game.add.bitmapText(this.game.width / 2, this.game.height - 100, "font", "Challenge a friend", 24);
        challengeFriendText.anchor.set(0.5);
        challengeFriendText.inputEnabled = true;
        challengeFriendText.events.onInputDown.add(function (e) {
            this.game.state.start("ChallengeFriend");
        }, this);

        var backIcon = this.game.add.button(35, 35, "check", this.startGame);
        backIcon.anchor.set(0.5);
        backIcon.scale.set(0.3);
    },
    startGame: function () {
        this.game.state.start("MainMenu");
    },
};

FlappyPlane.ChallengeFriend = function () { };

FlappyPlane.ChallengeFriend.prototype = {
    create: function () {
        var friendsCookie = Cookies.get("FlappyPlaneFriends");
        if (friendsCookie) {
            var friendsChallenges = JSON.parse(friendsCookie);
            var index = 0;
            var that = this;

            $.each(friendsChallenges, function (i, e) {
                index++;
                if (index > 20) return;

                var playerName = e.toString().substring(0, 10);

                that.game.add.bitmapText(100, 100 + 30 * index, "font", playerName, 26);

                var acceptText = that.game.add.bitmapText(350, 100 + 30 * index, "font", "Challenge", 26);
                acceptText.inputEnabled = true;
                acceptText.events.onInputDown.add(function (args) {
                    FlappyPlane.ChallengingName = this.playerName;
                    FlappyPlane.ChallengingFriend = true;

                    this.scope.game.state.start("Game");
                }, { playerName: playerName, scope: that });

            });
        } else {
            var noChallengesText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, "font", "no friends available", 36);
            noChallengesText.anchor.set(0.5);
        }

        var backIcon = this.game.add.button(35, 35, "check", this.startGame);
        backIcon.anchor.set(0.5);
        backIcon.scale.set(0.3);
    },
    startGame: function () {
        this.game.state.start("MainMenu");
    },
};

FlappyPlane.MainMenu = function () { };

FlappyPlane.MainMenu.prototype = {
    create: function () {
        var background = this.game.add.sprite(0, 0, "background");
        background.tint = FlappyPlane.imagesColors[5].tint;
        var title = this.game.add.image(this.game.width / 2, 250, "title");
        title.tint = FlappyPlane.imagesColors[1].tint;
        title.anchor.set(0.5);

        var playButton = this.game.add.button(this.game.width / 2, this.game.height - 150, "playbutton", this.start);
        playButton.anchor.set(0.5);
        playButton.tint = FlappyPlane.imagesColors[0].tint;
        var tween = this.game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
        tween.yoyo(true);

        var changeColors = this.game.add.button(35, 35, "gear", this.startChangeColors);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);

        var savedGameCookie = Cookies.get("FlappyPlaneSaveGame");
        var savedGame;

        if (savedGameCookie || argsSavedGame) {
            if(savedGameCookie){
                savedGame = JSON.parse(savedGameCookie);
            }else{
                savedGame = argsSavedGame;
            }
            var loadGameText = this.game.add.bitmapText(this.game.width - 150, 35, "font", "Load Game", 48);
            loadGameText.anchor.set(0.5);
            loadGameText.inputEnabled = true;
            loadGameText.events.onInputDown.add(function (e) {
                FlappyPlane.score = savedGame.score - 1;
                this.game.state.start("Game");
            }, this);
        }

        var challengesText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2 + 100, "font", "Challenges", 48);
        challengesText.anchor.set(0.5);
        challengesText.inputEnabled = true;
        challengesText.events.onInputDown.add(function (e) {
            this.game.state.start("FriendsChallenges");
        }, this);
    },
    start: function () {
        this.game.state.start("HowToPlay");
    },
    startChangeColors: function () {
        this.game.state.start("ChangeColors");
    }
};

FlappyPlane.HowToPlay = function () { };
FlappyPlane.HowToPlay.prototype = {
    create: function () {
        var background = this.game.add.sprite(0, 0, "background");
        background.tint = FlappyPlane.imagesColors[5].tint;
        this.game.add.sprite(this.game.width / 2, 220, "GetReady").anchor.x = 0.5;
        this.game.add.sprite(this.game.width * 2 / 3, this.game.height / 2, "tapTick").anchor.x = 0.5;
        this.game.add.sprite(this.game.width * 2 / 3 - 80, this.game.height / 2, "tapRight").anchor.x = 0.5;
        this.game.add.sprite(this.game.width * 2 / 3 + 80, this.game.height / 2, "tapLeft").anchor.x = 0.5;
        this.game.add.bitmapText(this.game.width / 2, this.game.height - 220, "font", "Move UP", 60).anchor.x = 0.5;
        this.game.add.bitmapText(this.game.width / 2, this.game.height - 140, "font", "Tap, Click or SPACEBAR key", 36).anchor.x = 0.5;

        this.plane = this.game.add.sprite(this.game.width / 5, this.game.height / 2, "plane");
        this.plane.anchor.set(0.5);
        this.plane.tint = FlappyPlane.imagesColors[2].tint;
        this.plane.animations.add('fly', [0, 1, 2], 7, true);
        this.plane.animations.play('fly');
        this.game.input.onDown.add(this.startGame, this);
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startGame, this);
    },
    update: function () {
        this.plane.animations.play("fly");
    },
    startGame: function () {
        this.game.state.start("Game");
    }
}

FlappyPlane.Game = function () { };

FlappyPlane.Game.prototype = {
    create: function () {
        this.heliLoop = this.game.add.audio("heliLoop");
        this.heliLoop.loopFull(1);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var background = this.game.add.sprite(0, 0, "background");
        background.tint = FlappyPlane.imagesColors[5].tint;
        this.plane = this.game.add.sprite(this.game.width / 5, this.game.height / 2, "plane");
        this.plane.anchor.set(0.5);
        this.plane.tint = FlappyPlane.imagesColors[2].tint;
        this.plane.animations.add('fly', [0, 1, 2], 7, true);
        this.plane.animations.play("fly");
        this.plane.alive = true;
        this.game.physics.arcade.enable(this.plane);
        this.plane.body.gravity.y = 1500;
        this.plane.body.collideWorldBounds = true;
        this.plane.body.bounce.setTo(0, 0.9);
        this.plane.anchor.setTo(-0.2, 0.5);

        if (FlappyPlane.friendChallenge) {
            this.planeFriend = this.game.add.sprite(50, this.game.height / 2, "plane");
            this.planeFriend.anchor.set(0.5);
            this.planeFriend.alpha = 0.5;

            this.scoreFriend = this.game.add.bitmapText(this.game.width / 2, 25, "font", "Challenger Score: " + (FlappyPlane.friendScore).toString(), 28);
            this.scoreFriend.anchor.set(0.5);
        }

        this.smokeEmitter = this.game.add.emitter(this.plane.x + 30, this.plane.y, 20);
        this.smokeEmitter.makeParticles("puff");
        this.smokeEmitter.setXSpeed(-200, -50);
        this.smokeEmitter.setYSpeed(-10, -100);
        this.smokeEmitter.setAlpha(0.5, 1);
        this.smokeEmitter.setScale(0.5, 1.5, 0.5, 1.5);
        this.smokeEmitter.start(false, 1000, 75);

        this.barrierGroup = this.game.add.group();
        this.addBarrierTime = this.game.time.events.loop(2250, this.addBarrier, this);


        this.game.input.onDown.add(this.fly, this);
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.fly, this);
        this.scoreText = this.game.add.bitmapText(this.game.width / 2, 50, "font", (FlappyPlane.score + 1).toString(), 48);

        this.pauseButton = this.game.add.button(this.game.width - 35, 40, "paused", function (e) {
            this.game.paused = true;
        });
        this.pauseButton.anchor.set(0.5);
        this.pauseButton.scale.set(0.15);
        this.pauseButton.tint = "0xff0000";
        if(FlappyPlane.ChallengingFriend || FlappyPlane.friendChallenge){
            this.pauseButton.visible = false;
        }

        this.pauseImage = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "paused");
        this.pauseImage.anchor.set(0.5);
        this.pauseImage.scale.set(0.8);
        this.pauseImage.tint = "0xff0000";
        this.pauseImage.visible = false;

        this.resumeText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2 + 200, "font", "Resume Game", 48);
        this.resumeText.anchor.set(0.5);
        this.resumeText.visible = false;

        this.saveGame = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2 + 300, "font", "Save Game", 48);
        this.saveGame.anchor.set(0.5);
        this.saveGame.visible = false;
    },
    update: function () {
        this.smokeEmitter.y = this.plane.y;
        if (this.plane.angle < 20) this.plane.angle += 1;
        this.game.physics.arcade.overlap(this.plane, this.barrierGroup, this.hitBarrier, null, this);
        if (FlappyPlane.friendChallengeAlive) {
            setTimeout(this.friendChallengeHandler, 300, [this.plane.y, this.planeFriend]);
        }
    },
    friendChallengeHandler: function (args) {
        args[1].y = args[0];
    },
    paused: function () {
        if(!FlappyPlane.ChallengingFriend && !FlappyPlane.friendChallenge){
            this.pauseImage.visible = true;
            this.resumeText.visible = true;
            this.saveGame.visible = true;
        }
    },
    resumed: function () {
        if(!FlappyPlane.ChallengingFriend && !FlappyPlane.friendChallenge){
            this.pauseImage.visible = false;
            this.resumeText.visible = false;
            this.saveGame.visible = false;
        }
    },
    checkPauseButtons: function (e) {
        var resumeTextX = this.resumeText.x;
        var resumeTextY = this.resumeText.y;
        var resumeTextWidth = this.resumeText.width / 2;
        var resumeTextHeight = this.resumeText.height / 2;

        var saveGameX = this.saveGame.x;
        var saveGameY = this.saveGame.y;
        var saveGameWidth = this.saveGame.width / 2;
        var saveGameHeight = this.saveGame.height / 2;


        if ((e.x > resumeTextX - resumeTextWidth && e.x < resumeTextX + resumeTextWidth) &&
            (e.y > resumeTextY - resumeTextHeight && e.y < resumeTextY + resumeTextHeight)) {
            this.game.paused = false;
        }

        if ((e.x > saveGameX - saveGameWidth && e.x < saveGameX + saveGameWidth) &&
            (e.y > saveGameY - saveGameHeight && e.y < saveGameY + saveGameHeight)) {
            var saveArray = {};

            saveArray.score = FlappyPlane.score;
            
            platform_tools("SaveGame", FlappyPlane.score, 0, gameID, saveArray, false);
            Cookies.set('FlappyPlaneSaveGame', saveArray);
        }

    },
    fly: function (e) {
        if (this.plane.alive == false) return;
        this.plane.body.velocity.y = -650;
        var FlappyTween = this.game.add.tween(this.plane).to({ angle: -20 }, 100, "Linear", true);

        if (this.game.paused) {
            this.checkPauseButtons(e);
        }
    },
    addBarrier: function () {
        var hole = this.game.rnd.between(1, 6);
        FlappyPlane.score += 1;
        this.scoreText.text = FlappyPlane.score.toString();
        platform_tools("LiveScore", FlappyPlane.score, 0, gameID, null, false);

        for (var i = 0; i < 10; i++) {
            if ((i === hole) || (i === hole + 1) || (i === hole + 2)) continue;
            var color = FlappyPlane.imagesColors[3].tint;
            var rock = new Barrier(this.game, 100 * i + 10, color);
            this.game.add.existing(rock);
            this.barrierGroup.add(rock);
        }

        if (FlappyPlane.score > FlappyPlane.friendScore && FlappyPlane.friendChallengeAlive) {
            FlappyPlane.friendChallengeWin = true;
            FlappyPlane.friendChallengeAlive = false;
            this.hitBarrier("friendPlane");
        }
    },
    hitBarrier: function (args) {
        if (this.plane.alive == false) return;
        if (args !== "friendPlane") {
            var localPlane = this.plane;

            localPlane.alive = false;
            this.game.time.events.remove(this.addBarrierTime);
            this.pauseButton.visible = false;
            this.heliLoop.stop();
        } else {
            var localPlane = this.planeFriend;
        }
        var explosionSound1 = this.game.add.audio("explosion1");
        explosionSound1.play();
        var destroyTween = this.game.add.tween(localPlane).to({
            x: localPlane.x + this.game.rnd.between(50, 150),
            y: localPlane.y - this.game.rnd.between(-50, 50),
            rotation: 20
        }, 1500, Phaser.Easing.Linear.None, true);
        destroyTween.onComplete.add(function () {
            var explosionSound = this.game.add.audio("explosion");
            explosionSound.play();
            this.expl = this.game.add.sprite(localPlane.x, localPlane.y, "explosion");
            this.expl.tint = FlappyPlane.imagesColors[4].tint;
            this.expl.scale.setTo(2);
            this.smokeEmitter.on = false;
            localPlane.destroy();
            this.expl.anchor.set(0.5);
            this.expl.animations.add('explos', [0, 1, 2, 3, 4, 5, 6, 7, 8], 9, true);
            this.expl.animations.play('explos');
            if (localPlane.alpha === 1) {
                this.barrierGroup.forEach(function (p) { p.body.velocity.x = 0; }, this);
                this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                    this.game.state.start("GameOver");
                }, this);
            } else {
                setTimeout(function (args) {
                    args.scope.expl.animations.stop('explos');
                    args.scope.expl.destroy();
                }, 500, { scope: this })
            }
        }, this);
    }
}

FlappyPlane.GameOver = function () { };
FlappyPlane.GameOver.prototype = {
    create: function () {
        if(game_mode!=="seasonMode"){
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            var background = this.game.add.sprite(0, 0, "background");
            background.tint = FlappyPlane.imagesColors[5].tint;

            var closeButton = this.game.add.button(35, 35, "close", this.close);
            closeButton.anchor.set(0.5);
            closeButton.scale.set(0.15);

            this.game.add.sprite(this.game.width / 2, 75, "GameOver").anchor.x = 0.5;
            this.game.add.bitmapText(this.game.width / 2, 200, "font", "Your score", 48).anchor.x = 0.5;
            this.game.add.bitmapText(this.game.width / 2, 300, "font", FlappyPlane.score.toString(), 72).anchor.x = 0.5;

            var playButton = this.game.add.button(this.game.width / 2, this.game.height - 150, "playbutton", this.startGame.bind(this, "Game"));
            playButton.anchor.set(0.5);
            playButton.tint = FlappyPlane.imagesColors[0].tint;
            var tween = this.game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
            tween.yoyo(true);            

            var mainMenuText = this.game.add.bitmapText(this.game.width / 2, 650, "font", "Back to Main Menu", 28);
            mainMenuText.anchor.set(0.5);
            mainMenuText.inputEnabled = true;
            mainMenuText.events.onInputDown.add(this.startGame.bind(this, "MainMenu"));

            if (FlappyPlane.friendChallenge) {
                if (FlappyPlane.friendChallengeWin) {
                    this.game.add.bitmapText(this.game.width / 2, 400, "font", "You Win", 38).anchor.x = 0.5;
                } else {
                    this.game.add.bitmapText(this.game.width / 2, 400, "font", "You Lose", 38).anchor.x = 0.5;
                }
                this.game.add.bitmapText(this.game.width / 2, 450, "font", "Challenger Score: " + (FlappyPlane.friendScore).toString(), 38).anchor.x = 0.5;

                //
                // add server callback
                //

            } else if (FlappyPlane.ChallengingFriend) {
                this.game.add.bitmapText(this.game.width / 2, 450, "font", (FlappyPlane.ChallengingName).toString() + " challenged", 38).anchor.x = 0.5;

                //
                // add server callback
                //

            } else if (FlappyPlane.score >= 40) {
                platform_tools("GameOver", FlappyPlane.score, 0, gameID, null, true);
            } else {
                platform_tools("GameOver", FlappyPlane.score, 0, gameID, null, false);
            }
        }else{
            //
            //implement sever callback for season mode;
            //
        }
    },
    startGame: function (state) {
        FlappyPlane.score = -1;
        FlappyPlane.friendChallenge = false;   
        FlappyPlane.friendName = "";
        FlappyPlane.friendScore = 0;
        FlappyPlane.friendChallengeWin = false;
        FlappyPlane.friendChallengeAlive = false;

        this.game.state.start(state);
    },
    close: function () {
        platform_tools("Close", FlappyPlane.score, 0, gameID, null, false);
    }
}

Barrier = function (game, y, color) {
    var rockType = game.rnd.integerInRange(0, 3);
    Phaser.Sprite.call(this, game, game.width, y, "rocks", rockType);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
    this.body.velocity.x = -200;
    this.placeBarrier = true;
    this.tint = color;
};

Barrier.prototype = Object.create(Phaser.Sprite.prototype);
Barrier.prototype.constructor = Barrier;
Barrier.prototype.update = function () {
    if (this.x < -100) {
        this.destroy();
    }
};

function onFlappyPlaneColorsInputDown(sprite, pointer) {
    var canvas = game.canvas.getContext('2d');
    var imageData = canvas.getImageData(pointer.x, pointer.y, 1, 1).data;
    var color = rgbToHexFlappyPlane(imageData[0], imageData[1], imageData[2]);

    sprite.currentSprite.tint = color;
    FlappyPlane.imagesColors[sprite.imageIndex].tint = color;
};

function componentToHexFlappyPlane(c) {
    var hex = c.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
};

function rgbToHexFlappyPlane(r, g, b) {
    return "0x" + componentToHexFlappyPlane(r) + componentToHexFlappyPlane(g) + componentToHexFlappyPlane(b);
};

var game;
var platform_tools;
var assets_path;
var game_mode;
var gameID = 1;
var argsSavedGame = undefined;

function start_flappyPlane(windowwidth, windowheight, container, assetsPath, args, gamemode, callback) {
    var inputData = undefined;
    if(args.length > 0){
        inputData = JSON.parse(args);
        if(inputData.savedData){
            argsSaveGame = inputData.savedGame.data;
        }
        
    }
    assets_path = assetsPath;
    platform_tools = callback;
    game_mode = gamemode;
   
    this.game = new Phaser.Game(windowwidth, windowheight, Phaser.CANVAS, container);

    this.game.state.add('Init', FlappyPlane.Init);
    this.game.state.add('Preloader', FlappyPlane.Preloader);
    this.game.state.add('ChangeColors', FlappyPlane.ChangeColors);
    this.game.state.add('FriendsChallenges', FlappyPlane.FriendsChallenges);
    this.game.state.add('ChallengeFriend', FlappyPlane.ChallengeFriend);
    this.game.state.add('MainMenu', FlappyPlane.MainMenu);
    this.game.state.add('HowToPlay', FlappyPlane.HowToPlay);
    this.game.state.add('Game', FlappyPlane.Game);
    this.game.state.add("GameOver", FlappyPlane.GameOver);

    this.game.state.start('Init');
}

function destroy_flappyPlane() {
    document.getElementById("flappyPlane").remove();
}

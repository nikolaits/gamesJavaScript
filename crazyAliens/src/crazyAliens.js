var CrazyAliens = {
    score: 0,
    imagesColors: [],
    friendChallenge: false,
    friendName: "",
    friendUID: "",
    friendScore: 0,
    friendChallengeWin: false,
    friendChallengeAlive: false,
    ChallengingFriend: false,
    ChallengingName: ""
};

CrazyAliens.Init = function () { };

CrazyAliens.Init.prototype = {

    preload: function () {
        this.game.load.image("loading", assets_path + "assets/sprites/loading.png");
    },

    create: function () {
        this.game.state.start("Preloader");
    }
};

CrazyAliens.Preloader = function () { };

CrazyAliens.Preloader.prototype = {

    init: function () {

    },

    preload: function () {
        var loadingBar = this.add.sprite(this.game.width / 2, this.game.height / 2, "loading");
        loadingBar.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loadingBar);
        this.game.stage.backgroundColor = "#4488AA";
        this.game.canvas.id = "crazyAliens";

        this.game.load.image("Space", assets_path + "assets/sprites/Space.png");
        this.game.load.image("spaceship_0", assets_path + "assets/sprites/spaceship_0.png");
        this.game.load.image("spaceship_1", assets_path + "assets/sprites/spaceship_1.png");
        this.game.load.image("spaceship_2", assets_path + "assets/sprites/spaceship_2.png");
        this.game.load.spritesheet("proj_0", assets_path + "assets/sprites/proj_0.png", 23, 12, 4);
        this.game.load.spritesheet("proj_1", assets_path + "assets/sprites/proj_1.png", 23, 12, 4);
        this.game.load.spritesheet("proj_2", assets_path + "assets/sprites/proj_2.png", 23, 12, 4);
        this.game.load.image("live", assets_path + "assets/sprites/live.png");
        this.game.load.spritesheet("enemies_1", assets_path + "assets/sprites/enemies.png", 74, 47, 10);
        this.game.load.image("boss1", assets_path + "assets/sprites/boss_1.png");
        this.game.load.spritesheet("hit_0", assets_path + "assets/sprites/hit_0.png", 20, 20, 3);
        this.game.load.spritesheet("hit_1", assets_path + "assets/sprites/hit_1.png", 20, 20, 3);
        this.game.load.spritesheet("hit_2", assets_path + "assets/sprites/hit_2.png", 20, 20, 3);
        this.game.load.spritesheet("explosion", assets_path + "assets/sprites/explosion.png", 56, 64, 5);
        this.game.load.image("logo", assets_path + "assets/sprites/CrazyAliens_logo.png");
        this.game.load.image("gear", assets_path + "assets/sprites/gear.png");
        this.game.load.image("paused", assets_path + "assets/sprites/paused.png");
        this.game.load.image("check", assets_path + "assets/sprites/check.png");
        this.game.load.image("colors", assets_path + "assets/sprites/colors.png");
        this.game.load.image("ResetDefaultColors", assets_path + "assets/sprites/ResetDefaultColors.png");
        this.game.load.image("playbutton", assets_path + "assets/sprites/playbutton.png");
        this.game.load.image("close", assets_path + "assets/sprites/close.png");
        this.game.load.bitmapFont("font", assets_path + "assets/fonts/font.png", assets_path + "assets/fonts/font.fnt");

        Cookies.remove('CrazyAliensSaveGame');

        var cookieImagesColors = Cookies.get('CrazyAliensColors');
        if (cookieImagesColors) {
            CrazyAliens.imagesColors = JSON.parse(cookieImagesColors);
        } else {
            CrazyAliens.imagesColors.push({ image: "playbutton", tint: "0xffffff" });
            CrazyAliens.imagesColors.push({ image: "spaceship_0", tint: "0xffffff" });
            CrazyAliens.imagesColors.push({ image: "spaceship_1", tint: "0xffffff" });
            CrazyAliens.imagesColors.push({ image: "spaceship_2", tint: "0xffffff" });
            CrazyAliens.imagesColors.push({ image: "enemies_1", tint: "0xffffff" });
            CrazyAliens.imagesColors.push({ image: "boss1", tint: "0xffffff" });
            CrazyAliens.imagesColors.push({ image: "explosion", tint: "0xffffff" });
            CrazyAliens.imagesColors.push({ image: "Space", tint: "0xffffff" });
        }
    },
    create: function () {
        if (game_mode === "seasonMode") {
            CrazyAliens.ChallengingFriend = true;
            this.game.state.start("Game", true, false, 0, 1, 3);
        } else {
            this.game.state.start("MainMenu");
        }
    }
};

CrazyAliens.ChangeColors = function () {
    this.sprites = [];
};

CrazyAliens.ChangeColors.prototype = {
    create: function () {
        var that = this;

        CrazyAliens.imagesColors.forEach(function (e, index) {
            var x = 0;
            var i = 0;

            if (index < 4) {
                x = 100;
                i = index;
            } else {
                x = 550;
                i = index - 4;
            }
            var currentSprite = this.game.add.sprite(x, 50 + 150 * i, e.image);
            currentSprite.width = 100;
            currentSprite.height = 100;
            currentSprite.tint = e.tint;
            that.sprites.push(currentSprite);

            var colors = this.game.add.sprite(x + 150, 50 + 150 * i, "colors");
            colors.imageIndex = index;
            colors.currentSprite = currentSprite;
            colors.height = 90;
            colors.inputEnabled = true;
            colors.events.onInputDown.add(onCrazyAliensColorsInputDown, this);
        });

        var changeColors = this.game.add.button(35, 35, "check", this.startGame);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);

        var resetColors = this.game.add.button(this.game.width / 2, this.game.height - 50, "ResetDefaultColors", this.ResetDefaultColors, this);
        resetColors.anchor.set(0.5);
    },
    startGame: function () {
        Cookies.set('CrazyAliensColors', CrazyAliens.imagesColors);
        this.game.state.start("MainMenu");
    },
    ResetDefaultColors: function () {
        Cookies.remove('CrazyAliensColors');
        this.sprites.forEach(function (e) {
            e.tint = 0xffffff;
        });
        CrazyAliens.imagesColors.forEach(function (e) {
            e.tint = 0xffffff;
        });
    }
};

CrazyAliens.FriendsChallenges = function () { };

CrazyAliens.FriendsChallenges.prototype = {
    create: function () {
        if (argsChallenges) {
            var friendsChallenges = argsChallenges;
            var index = 0;
            var that = this;

            friendsChallenges.forEach(function (e, i) {
                if (i < 20) {
                    var playerName = e.friendusername.toString();
                    var playerScore = e.friendscore.toString();
                    var playerUID = e.frienduid.toString();

                    that.game.add.bitmapText(50, 100 + 30 * i, "font", playerName.substring(0, 10), 26);
                    that.game.add.bitmapText(250, 100 + 30 * i, "font", playerScore, 26);

                    var acceptText = that.game.add.bitmapText(450, 100 + 30 * i, "font", "accept", 26);
                    acceptText.inputEnabled = true;
                    acceptText.events.onInputDown.add(function (args) {
                        CrazyAliens.friendChallenge = true;
                        CrazyAliens.friendChallengeAlive = true;
                        CrazyAliens.friendName = this.playerName;
                        CrazyAliens.friendScore = this.playerScore;
                        CrazyAliens.friendUID = this.playerUID;

                        this.scope.game.state.start("Game", true, false, 0, 1, 3);
                    }, { playerName: playerName, playerScore: playerScore, playerUID: playerUID, scope: that });
                }
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

CrazyAliens.ChallengeFriend = function () { };

CrazyAliens.ChallengeFriend.prototype = {
    create: function () {
        if (argsFriends) {
            var friendsChallenges = argsFriends;
            var that = this;

            friendsChallenges.forEach(function (e, i) {
                if (i < 20) {
                    var playerName = e.username.toString();
                    var playerUID = e.uid.toString();

                    that.game.add.bitmapText(100, 100 + 30 * i, "font", playerName.substring(0, 10), 26);

                    var acceptText = that.game.add.bitmapText(350, 100 + 30 * i, "font", "Challenge", 26);
                    acceptText.inputEnabled = true;
                    acceptText.events.onInputDown.add(function (args) {
                        CrazyAliens.ChallengingName = this.playerName;
                        CrazyAliens.ChallengingFriend = true;
                        CrazyAliens.friendUID = this.playerUID;

                        this.scope.game.state.start("Game", true, false, 0, 1, 3);
                    }, { playerName: playerName, playerUID: playerUID, scope: that });
                }
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

CrazyAliens.MainMenu = function () { };

CrazyAliens.MainMenu.prototype = {
    create: function () {
        var playButton = this.game.add.button(this.game.width / 2, this.game.height - 150, "playbutton", this.start);
        playButton.anchor.set(0.5);
        playButton.tint = CrazyAliens.imagesColors[0].tint;
        var tween = this.game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
        tween.yoyo(true);

        var logo = this.add.sprite(this.game.width / 2, this.game.height / 2 - 100, 'logo');
        logo.anchor.setTo(0.5);
        logo.alpha = 0;
        var tween1 = this.add.tween(logo).to({ alpha: 1 }, 3000, "Linear", true);

        var changeColors = this.game.add.button(35, 35, "gear", this.startChangeColors);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);

        var savedGameCookie = Cookies.get("CrazyAliensSaveGame");
        var savedGame;

        if (savedGameCookie || argsSavedGame) {
            if (savedGameCookie) {
                savedGame = JSON.parse(savedGameCookie);
            } else {
                savedGame = argsSavedGame;
            }
            var loadGameText = this.game.add.bitmapText(this.game.width - 150, 35, "font", "Load Game", 48);
            loadGameText.anchor.set(0.5);
            loadGameText.inputEnabled = true;
            loadGameText.events.onInputDown.add(function (e) {
                CrazyAliens.score = savedGame.score;

                this.game.state.start("Game", true, false, 0, savedGame.curLvl, savedGame.livesRemaining);
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
        this.game.state.start("Game", true, false, 0, 1, 3);
    },
    startChangeColors: function () {
        this.game.state.start("ChangeColors");
    }
};

CrazyAliens.Game = function (game) {
    this.level = 1;
    this.upgradeShip = 0;
    this.shipSpeed = 0;
    this.numberProjectiles = 0;
    this.projectilesArray = [];
    this.Debug = false;
};

CrazyAliens.Game.prototype = {
    init: function (sc, lvl, lives) {
        this.level = lvl;
        this.lives = lives;

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);

        if (this.level == 11) {
            this.upgradeShip = 1;
        } else if (this.level == 21) {
            this.upgradeShip = 2;
        }

        this.initShip();
        this.intiEnemies();

        this.cursor = this.input.keyboard.createCursorKeys();

        if (this.Debug) {
            this.add.plugin(Phaser.Plugin.Debug);
        }
    },
    create: function () {
        this.background = this.game.add.sprite(0, 0, 'Space');
        this.background.tint = CrazyAliens.imagesColors[7].tint;
        this.background.height = this.world.height;
        this.background.width = this.world.width;
        this.createShip();
        this.createEnemies();
        this.scoreText = this.game.add.bitmapText(this.game.width - 100, 50, "font", CrazyAliens.score.toString(), 48);

        for (var i = 0; i < this.lives; i++) {
            var tmp = this.game.add.sprite((80) + (i * 22), 70, 'live');
            tmp.name = i;
            tmp.scale.setTo(0.05);
            tmp.anchor.setTo(0.5);
        }

        if (CrazyAliens.friendChallenge) {
            if (CrazyAliens.friendChallengeAlive) {
                var posX = $(this.game.canvas).position().left + this.game.width;
                var posY = $(this.game.canvas).position().top;
                var canvas = document.createElement('canvas');

                canvas.id = "gameMap";
                canvas.width = this.game.width / 5;
                canvas.height = this.game.height / 5;
                canvas.style.position = "fixed";
                canvas.style.border = "1px solid";
                canvas.style.left = posX + "px";
                canvas.style.top = posY + "px";
                canvas.style.backgroundColor = "black";
                canvas.getContext('2d').scale(0.2, 0.2);
                $("body").append(canvas);
            }

            this.scoreFriend = this.game.add.bitmapText(this.game.width / 2, 25, "font", "Challenger Score: " + (CrazyAliens.friendScore).toString(), 28);
            this.scoreFriend.anchor.set(0.5);
        }

        this.game.input.onDown.add(this.checkPauseButtons, this);

        this.pauseButton = this.game.add.button(this.game.width - 35, 40, "paused", function (e) {
            this.game.paused = true;
        });
        this.pauseButton.anchor.set(0.5);
        this.pauseButton.scale.set(0.15);
        this.pauseButton.tint = "0xff0000";
        if (CrazyAliens.ChallengingFriend || CrazyAliens.friendChallenge) {
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
        this.checkForEndOfGame();
        this.physics.arcade.collide(this.shipProjectiles, this.enemiesGroup, this.CollisionHandler, null, this);
        this.physics.arcade.collide(this.shipProjectiles, this.boss, this.bossCollision, null, this);
        this.physics.arcade.collide(this.enemies_proj_group, this.ship, this.shipCollision, null, this);
        this.updateShip();
        this.updateEnemies();
        if (CrazyAliens.friendChallengeAlive) {
            setTimeout(this.friendChallengeHandler, 1000, [this.game.canvas.getContext('2d').getImageData(0, 0, this.game.width, this.game.height)]);
        }
    },
    friendChallengeHandler: function (args) {
        if ($("#gameMap")[0]) {
            var gameMap = $("#gameMap")[0].getContext('2d');
            var imageData = args[0];
            var newCanvas = $("<canvas>")
                .attr("width", imageData.width)
                .attr("height", imageData.height)[0];
            newCanvas.getContext("2d").putImageData(imageData, 0, 0);

            gameMap.drawImage(newCanvas, 0, 0);
        }
    },
    paused: function () {
        if (!CrazyAliens.ChallengingFriend && !CrazyAliens.friendChallenge) {
            this.pauseImage.visible = true;
            this.resumeText.visible = true;
            this.saveGame.visible = true;
        }
    },
    resumed: function () {
        if (!CrazyAliens.ChallengingFriend && !CrazyAliens.friendChallenge) {
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

            saveArray.score = CrazyAliens.score;
            saveArray.livesRemaining = this.lives;
            saveArray.curLvl = this.level;

            platform_tools("SaveGame", CrazyAliens.score, 0, gameID, saveArray, false);
            Cookies.set('CrazyAliensSaveGame', saveArray);
        }

    },
    killProjectile: function (proj) {
        proj.kill();

    },
    initShip: function () {
        this.shipSpeed = 3.5;
        this.nextFire = 0;
        this.fireRate = 450;
        this.shipProjectiles;
    },
    createShip: function () {
        this.ship = this.add.sprite(this.world.centerX, this.world.height - 55, 'spaceship_' + this.upgradeShip);
        this.ship.tint = CrazyAliens.imagesColors[this.upgradeShip + 1].tint;
        this.physics.enable(this.ship, Phaser.Physics.ARCADE);
        this.ship.enableBody = true;

        this.ship.anchor.setTo(0.5, 0.5);
        this.ship.height = 50;
        this.ship.width = 50;

        this.hitGroup = this.add.group();

        this.shipProjectiles = this.add.group();
        this.shipProjectiles.enableBody = true;

        for (var i = 0; i < 25; i++) {
            var tmp = this.shipProjectiles.create(this.ship.x - 8, this.ship.y - 8, 'proj_' + this.upgradeShip);
            this.physics.p2.enable(tmp, this.Debug);

            tmp.name = 'projectile' + i;
            tmp.scale.setTo(1.1);
            tmp.anchor.y = 0.7;
            tmp.anchor.x = 0.4;
            tmp.checkWorldBounds = true;
            tmp.angle = -90;
            tmp.visible = false;
            tmp.exists = false;

            tmp.body.kinematic = true;
            tmp.body.rotate = -90;
            tmp.events.onOutOfBounds.add(this.killProjectile, this);

            var hit = this.hitGroup.create(0, 0, 'hit_' + this.upgradeShip);
            hit.exists = false;
            hit.visible = false;

        }
        this.shipProjectiles.callAll('animations.add', 'animations', 'shoot', [0, 1, 2, 3], 6, true);
        this.shipProjectiles.callAll('play', 20, 'shoot');
    },
    addShipProjectiles: function () {
        if (this.time.now > this.nextFire) {

            this.nextFire = this.time.now + this.fireRate;

            var proj = this.shipProjectiles.getFirstExists(false);
            if (proj) {
                proj.reset(this.ship.x, this.ship.y - 8);
                proj.body.velocity.y = -300;
            }
        }
    },
    updateShip: function () {

        if (this.cursor.right.isDown) {
            this.ship.body.velocity.x = 200;
        }
        else if (this.cursor.left.isDown) {
            this.ship.body.velocity.x = -200;
        } else {
            this.ship.body.velocity.x = 0;
        }
        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.addShipProjectiles();
        }
    },
    shipCollision: function (ship, proj) {
        this.ship.visible = false;
        if (CrazyAliens.friendChallenge && CrazyAliens.friendChallengeAlive) {
            $("#gameMap").remove();
        }
        if (this.lives > 0) {
            this.state.restart(true, false, 0, this.level, this.lives - 1);
        } else {
            this.game.state.start('GameOver');
        }

    },
    intiEnemies: function () {
        this.spinAnimFPS = 30;
        this.x = 6;
        this.enemiesGroup;
        this.enemiesCollideGroup;
        this.enemiesHP = {};
        this.direction = 1;
        this.EnemiesnextFire = 0;
        this.EnemiesfireRate = 1000;
        this.rndEnemies = 0;

        this.boss;
        this.bossHP = 200;
    },
    createEnemies: function () {
        if (this.level % 10 != 0) {

            this.enemiesGroup = this.add.group();
            this.enemiesGroup.enableBody = true;

            this.enemyExplosion = this.add.group();

            var y = 90
            var buff = 0;
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 9; j++) {
                    var tmp = this.enemiesGroup.create(80 + (j * 66), y, 'enemies_1');
                    tmp.tint = CrazyAliens.imagesColors[4].tint;
                    this.physics.p2.enable(tmp, this.Debug);

                    tmp.name = 'enemy' + buff;
                    this.enemiesHP[tmp.name] = 20;
                    tmp.anchor.setTo(0.3);
                    tmp.angle = 90;
                    tmp.scale.setTo(0.6);

                    tmp.body.static = true;

                    tmp.checkWorldBounds = true;

                    var exp = this.enemyExplosion.create(0, 0, 'explosion');
                    exp.tint = CrazyAliens.imagesColors[6].tint;
                    exp.visible = false;
                    exp.exists = false;
                    exp.anchor.setTo(0.5);

                    buff++;
                }
                y = y + 90;
            };

            this.enemiesGroup.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], this.spinAnimFPS, true);
            this.enemiesGroup.callAll('play', null, 'spin');

            this.enemyExplosion.callAll('animations.add', 'animations', 'boom');
        } else {
            this.boss = this.add.sprite(this.world.centerX, 100, 'boss1');
            this.boss.tint = CrazyAliens.imagesColors[5].tint;
            this.physics.enable(this.boss, Phaser.Physics.ARCADE);
            this.boss.anchor.setTo(0.5);
            this.boss.body.setSize(120, 60, 60, 40);
            this.boss.body.immovable = true;
            this.boss.body.collideWorldBounds = true;

            game.physics.p2.setImpactEvents(true);
        };

        this.enemies_proj_group = this.add.group();
        this.enemies_proj_group.enableBody = true;
        for (var i = 0; i < 25; i++) {
            var tmp = this.enemies_proj_group.create(10, 10, 'proj_1');
            this.physics.p2.enable(tmp, this.Debug);

            tmp.name = 'enemy_projectile' + i;
            tmp.scale.setTo(1.1);
            tmp.anchor.y = 0.7;
            tmp.anchor.x = 0.4;
            tmp.checkWorldBounds = true;
            tmp.angle = 90;
            tmp.visible = false;
            tmp.exists = false;
            tmp.body.kinematic = true;
            tmp.body.rotate = 90;
            tmp.events.onOutOfBounds.add(this.killProjectile, this);

            var hit = this.hitGroup.create(0, 0, 'hit_1');
            hit.exists = false;
            hit.visible = false;

        }
    },
    updateEnemies: function () {
        if (this.level % 10 != 0) {

            let check = false;
            this.enemiesGroup.forEachAlive(function (enemies) {
                if (enemies.x + enemies.width >= this.world.width || enemies.x <= 20) {
                    check = true;
                }
            }, this);
            this.ChoseEnemieFire();

            if (check) {
                this.turnEnemys();
            }

            this.enemiesGroup.forEachAlive(function (enemies) {
                enemies.x += 2 * this.direction;
            }, this);
        } else {
            if (this.boss.width / 2 + this.boss.x >= this.world.width || this.boss.x - this.boss.width / 2 <= 10) {
                this.turnEnemys();
            }
            this.addBossprojectile()
        }
    },
    checkForEndOfGame: function () {
        if (this.level % 10 != 0) {
            if (this.enemiesGroup.total <= 0) {
                if (CrazyAliens.friendChallenge && CrazyAliens.friendChallengeAlive) {
                    $("#gameMap").remove();
                }
                this.state.restart(true, false, 0, this.level + 1, this.lives);
            }
        }
    },
    ChoseEnemieFire: function () {
        count = 0;
        this.rndEnemies = this.rnd.integerInRange(0, this.enemiesGroup.countLiving());
        this.enemiesGroup.forEachAlive(function (enemies) {
            count++;
            if (count == this.rndEnemies) {
                this.addEnemiesprojectile(enemies.x, enemies.y);
            }
        }, this);
    },
    addEnemiesprojectile: function (x, y) {
        if (this.time.now > this.EnemiesnextFire) {

            this.EnemiesnextFire = this.time.now + this.EnemiesfireRate;

            var proj = this.enemies_proj_group.getFirstExists(false);
            if (proj) {
                proj.reset(x, y + 8);
                proj.body.velocity.y += 250;
            }
        }
    },
    addBossprojectile: function () {
        if (this.time.now > this.EnemiesnextFire) {

            this.EnemiesnextFire = this.time.now + this.EnemiesfireRate;

            var proj1 = this.enemies_proj_group.getFirstExists(false);
            if (proj1) {
                proj1.reset(510, 160);
                proj1.body.velocity.y += game.rnd.integerInRange(140, 180);
            }

            var proj2 = this.enemies_proj_group.getFirstExists(false);
            if (proj2) {
                proj2.reset(570, 140);
                proj2.body.velocity.y += game.rnd.integerInRange(200, 250);
            }

            var proj3 = this.enemies_proj_group.getFirstExists(false);
            if (proj3) {
                proj3.reset(450, 140);
                proj3.body.velocity.y += game.rnd.integerInRange(140, 180);
            }
        }
    },
    bossCollision: function (boss, proj) {
        this.bossHP -= 20;
        if (this.bossHP <= 0) {
            this.boss.visible = false;
            CrazyAliens.score += 250;
            this.scoreText.text = CrazyAliens.score.toString();

            platform_tools("LiveScore", CrazyAliens.score, 0, gameID, null, false);
            if (CrazyAliens.score > CrazyAliens.friendScore && CrazyAliens.friendChallengeAlive) {
                CrazyAliens.friendChallengeWin = true;
                CrazyAliens.friendChallengeAlive = false;
                $("#gameMap").remove();
            }
            if (CrazyAliens.friendChallenge && CrazyAliens.friendChallengeAlive) {
                $("#gameMap").remove();
            }

            this.state.restart(true, false, 0, this.level + 1, this.lives);
        }

        var spark = this.hitGroup.getFirstAlive();
        if (spark) {
            spark.reset(proj.x, proj.y - 10);
            spark.animations.play('spark', 50, false, true);
        }
        proj.kill();
    },
    CollisionHandler: function (proj, enemies) {
        enemies.kill();
        CrazyAliens.score += 10;
        this.scoreText.text = CrazyAliens.score.toString();

        platform_tools("LiveScore", CrazyAliens.score, 0, gameID, null, false);
        if (CrazyAliens.score > CrazyAliens.friendScore && CrazyAliens.friendChallengeAlive) {
            CrazyAliens.friendChallengeWin = true;
            CrazyAliens.friendChallengeAlive = false;
            $("#gameMap").remove();
        }

        var bom = this.enemyExplosion.getFirstAlive();
        if (bom) {
            bom.reset(enemies.x, enemies.y);
            bom.animations.play('boom', 20, false, true);
        }
        proj.kill();
    },
    turnEnemys: function () {
        this.direction *= -1
    }
};

CrazyAliens.GameOver = function () { };

CrazyAliens.GameOver.prototype = {
    create: function () {
        if (game_mode === "casualMode") {
            var closeButton = this.game.add.button(35, 35, "close", this.close);
            closeButton.anchor.set(0.5);
            closeButton.scale.set(0.15);

            game.add.bitmapText(game.width / 2 - 100, 100, "font", "Your score", 48).anchor.x = 0.5;
            game.add.bitmapText(game.width / 2 + 175, 88, "font", CrazyAliens.score.toString(), 72).anchor.x = 0.5;

            var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame.bind(this, "Game"));
            playButton.anchor.set(0.5);
            playButton.tint = CrazyAliens.imagesColors[0].tint;
            var tween = game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
            tween.yoyo(true);

            var mainMenuText = this.game.add.bitmapText(this.game.width / 2, 180, "font", "Back to Main Menu", 28);
            mainMenuText.anchor.set(0.5);
            mainMenuText.inputEnabled = true;
            mainMenuText.events.onInputDown.add(this.startGame.bind(this, "MainMenu"));

            if (CrazyAliens.friendChallenge) {
                if (CrazyAliens.friendChallengeWin) {
                    this.game.add.bitmapText(this.game.width / 2, 220, "font", "You Win", 38).anchor.x = 0.5;
                } else {
                    this.game.add.bitmapText(this.game.width / 2, 220, "font", "You Lose", 38).anchor.x = 0.5;
                }
                this.game.add.bitmapText(this.game.width / 2, 260, "font", "Challenger Score: " + (CrazyAliens.friendScore).toString(), 38).anchor.x = 0.5;

                var challengeArray = {};
                challengeArray.oldScore = CrazyAliens.friendScore;
                challengeArray.uid = CrazyAliens.friendUID;

                platform_tools("ChallengeComplete", CrazyAliens.score, 0, gameID, challengeArray, false);

            } else if (CrazyAliens.ChallengingFriend) {
                this.game.add.bitmapText(this.game.width / 2, 220, "font", (CrazyAliens.ChallengingName).toString() + " challenged", 38).anchor.x = 0.5;

                var challengeArray = {};
                challengeArray.username = CrazyAliens.ChallengingName;
                challengeArray.useruid = CrazyAliens.friendUID;

                platform_tools("ChallengeFriend", CrazyAliens.score, 0, gameID, challengeArray, false);

            } else if (CrazyAliens.score >= game_score_weight) {
                platform_tools("GameOver", CrazyAliens.score, 0, gameID, null, true);
            } else {
                platform_tools("GameOver", CrazyAliens.score, 0, gameID, null, false);
            }
        } else if (game_mode === "seasonMode") {
            var virtualScore = CrazyAliens.score / game_score_weight * 100;
            platform_tools("GameOver", virtualScore, 0, gameID, null, false);
        }
    },
    startGame: function (state) {
        CrazyAliens.score = 0;
        CrazyAliens.friendChallenge = false;
        CrazyAliens.friendName = "";
        CrazyAliens.friendUID = "";
        CrazyAliens.friendScore = 0;
        CrazyAliens.friendChallengeWin = false;
        CrazyAliens.friendChallengeAlive = false;
        CrazyAliens.ChallengingFriend = false;
        CrazyAliens.ChallengingName = "";

        if (state === "Game") {
            this.game.state.start("Game", true, false, 0, 1, 3);
        } else {
            this.game.state.start(state);
        }
    },
    close: function () {
        platform_tools("Close", CrazyAliens.score, 0, gameID, null, false);
    }
};

function onCrazyAliensColorsInputDown(sprite, pointer) {
    var canvas = game.canvas.getContext('2d');
    var imageData = canvas.getImageData(pointer.x, pointer.y, 1, 1).data;
    var color = rgbToHexCrazyAliens(imageData[0], imageData[1], imageData[2]);

    sprite.currentSprite.tint = color;
    CrazyAliens.imagesColors[sprite.imageIndex].tint = color;
};

function componentToHexCrazyAliens(c) {
    var hex = c.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
};

function rgbToHexCrazyAliens(r, g, b) {
    return "0x" + componentToHexCrazyAliens(r) + componentToHexCrazyAliens(g) + componentToHexCrazyAliens(b);
};

var game = null;
var platform_tools = null;
var assets_path = "";
var game_mode = "";
var gameID = 3;
var game_score_weight = 3000;
var argsSavedGame = undefined;
var argsFriends = undefined;
var argsChallenges = undefined;

function start_crazyAliens(windowwidth, windowheight, container, assetsPath, args, gamemode, callback) {
    var inputData = undefined;
    if (args.length > 0) {
        inputData = JSON.parse(args);
        if (inputData.savedGame) {
            argsSavedGame = inputData.savedGame.data;
        }
        if (inputData.friends) {
            argsFriends = inputData.friends;
        }
        if (inputData.challenges) {
            argsChallenges = inputData.challenges;
        }
    }
    assets_path = assetsPath;
    platform_tools = callback;
    game_mode = gamemode;

    this.game = new Phaser.Game(windowwidth, windowheight, Phaser.CANVAS, container);

    this.game.state.add('Init', CrazyAliens.Init);
    this.game.state.add('Preloader', CrazyAliens.Preloader);
    this.game.state.add('ChangeColors', CrazyAliens.ChangeColors);
    this.game.state.add('FriendsChallenges', CrazyAliens.FriendsChallenges);
    this.game.state.add('ChallengeFriend', CrazyAliens.ChallengeFriend);
    this.game.state.add('MainMenu', CrazyAliens.MainMenu);
    this.game.state.add('Game', CrazyAliens.Game);
    this.game.state.add("GameOver", CrazyAliens.GameOver);

    this.game.state.start('Init');
}

function destroy_crazyAliens() {
    game_mode = "destroy";
    this.game.state.start("GameOver");

    CrazyAliens.score = 0;
    CrazyAliens.friendChallenge = false;
    CrazyAliens.friendName = "";
    CrazyAliens.friendUID = "";
    CrazyAliens.friendScore = 0;
    CrazyAliens.friendChallengeWin = false;
    CrazyAliens.friendChallengeAlive = false;
    CrazyAliens.ChallengingFriend = false;
    CrazyAliens.ChallengingName = "";

    game = null;
    platform_tools = null;
    assets_path = "";
    game_mode = "";
    gameID = 3;
    game_score_weight = 3000;
    argsSavedGame = undefined;
    argsFriends = undefined;
    argsChallenges = undefined;

    document.getElementById("crazyAliens").remove();
}
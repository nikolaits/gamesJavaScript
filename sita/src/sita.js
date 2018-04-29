var SITA = {
    score: 0,
    timeRemaining: 11,
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

SITA.Init = function () { };

SITA.Init.prototype = {

    preload: function () {
        this.game.load.image("loading", assets_path + "assets/sprites/loading.png");
    },

    create: function () {
        this.game.state.start("Preloader");
    }
};

SITA.Preloader = function () { };

SITA.Preloader.prototype = {

    preload: function () {
        var loadingBar = this.add.sprite(this.game.width / 2, this.game.height / 2, "loading");
        loadingBar.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loadingBar);
        this.game.stage.backgroundColor = "#4488AA";
        this.game.canvas.id = "sita";

        this.game.load.image("paused", assets_path + "assets/sprites/paused.png");
        this.game.load.image("gear", assets_path + "assets/sprites/gear.png");
        this.game.load.image("check", assets_path + "assets/sprites/check.png");
        this.game.load.image("colors", assets_path + "assets/sprites/colors.png");
        this.game.load.image("ResetDefaultColors", assets_path + "assets/sprites/ResetDefaultColors.png");
        this.game.load.image("playbutton", assets_path + "assets/sprites/playbutton.png");
        this.game.load.image("close", assets_path + "assets/sprites/close.png");
        this.game.load.image("player", assets_path + "assets/sprites/player1.png");
        this.game.load.image("collectable", assets_path + "assets/sprites/collectable1.png");
        this.game.load.bitmapFont("font", assets_path + "assets/fonts/font.png", assets_path + "assets/fonts/font.fnt");
        this.game.load.image("bullet", assets_path + "assets/sprites/bullet.png");
        this.game.load.atlas('arcade', assets_path + "assets/sprites/arcade-joystick.png", assets_path + "assets/sprites/arcade-joystick.json");

        Cookies.remove('SITASaveGame');

        var cookieImagesColors = Cookies.get('SITAColors');
        if (cookieImagesColors) {
            SITA.imagesColors = JSON.parse(cookieImagesColors);
        } else {
            SITA.imagesColors.push({ image: "playbutton", tint: "0xffffff" });
            SITA.imagesColors.push({ image: "player", tint: "0xffffff" });
            SITA.imagesColors.push({ image: "collectable", tint: "0xffffff" });
            SITA.imagesColors.push({ image: "bullet", tint: "0xffffff" });
        }
    },

    create: function () {
        this.game.state.start("MainMenu");
    }
};

SITA.ChangeColors = function () {
    this.sprites = [];
};

SITA.ChangeColors.prototype = {
    create: function () {
        var that = this;

        SITA.imagesColors.forEach(function (e, index) {
            var x = 0;
            var i = 0;

            if (index < 2) {
                x = 100;
                i = index;
            } else {
                x = 550;
                i = index - 2;
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
            colors.events.onInputDown.add(onColorsInputDownSITA, this);
        });

        var changeColors = this.game.add.button(35, 35, "check", this.startGame);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);

        var resetColors = this.game.add.button(this.game.width / 2, this.game.height - 50, "ResetDefaultColors", this.ResetDefaultColors, this);
        resetColors.anchor.set(0.5);
    },
    startGame: function () {
        Cookies.set('SITAColors', SITA.imagesColors);
        this.game.state.start("MainMenu");
    },
    ResetDefaultColors: function () {
        Cookies.remove('SITAColors');
        this.sprites.forEach(function (e) {
            e.tint = 0xffffff;
        });
        SITA.imagesColors.forEach(function (e) {
            e.tint = 0xffffff;
        });
    }
};

SITA.FriendsChallenges = function () { };

SITA.FriendsChallenges.prototype = {
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
                        SITA.friendChallenge = true;
                        SITA.friendChallengeAlive = true;
                        SITA.friendName = this.playerName;
                        SITA.friendScore = this.playerScore;
                        SITA.friendUID = this.playerUID;

                        this.scope.game.state.start("Game");
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

SITA.ChallengeFriend = function () { };

SITA.ChallengeFriend.prototype = {
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
                        SITA.ChallengingName = this.playerName;
                        SITA.ChallengingFriend = true;
                        SITA.friendUID = this.playerUID;

                        this.scope.game.state.start("Game");
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

SITA.MainMenu = function () { };

SITA.MainMenu.prototype = {
    create: function () {
        this.game.add.bitmapText(game.width / 2, 50, "font", "Spinning into the", 90).anchor.x = 0.5;
        this.game.add.bitmapText(game.width / 2, 140, "font", "abyss", 90).anchor.x = 0.5;

        var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.start);
        playButton.anchor.set(0.5);
        playButton.tint = SITA.imagesColors[0].tint;
        var tween = game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
        tween.yoyo(true);

        var changeColors = this.game.add.button(35, 35, "gear", this.startChangeColors);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);

        var savedGameCookie = Cookies.get("SITASaveGame");
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
                SITA.score = savedGame.score;
                SITA.timeRemaining = savedGame.timeRemaining;

                this.game.state.start("Game");
            }, this);
        }

        var challengesText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, "font", "Challenges", 48);
        challengesText.anchor.set(0.5);
        challengesText.inputEnabled = true;
        challengesText.events.onInputDown.add(function (e) {
            this.game.state.start("FriendsChallenges");
        }, this);
    },

    start: function () {
        this.game.state.start("Game");
    },
    startChangeColors: function () {
        this.game.state.start("ChangeColors");
    }
};

SITA.Game = function () {
    this.speed = 350;
};

SITA.Game.prototype = {
    init: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.pad = this.game.plugins.add(Phaser.VirtualJoystick);
    },

    create: function () {
        this.player = game.add.sprite(game.width / 2, game.height / 2, "player");
        this.player.anchor.set(0.5);
        this.player.tint = SITA.imagesColors[1].tint;
        this.player.alive = true;
        this.physics.arcade.enable(this.player);
        this.add.tween(this.player).to({ angle: 2160 }, 1000, "Linear", true, 0, -1, false)
        this.cursors = this.input.keyboard.createCursorKeys();

        this.bullets = this.add.group();
        this.bullets.enableBody = true;

        this.collectable = this.add.sprite(this.rnd.between(50, game.width / 2 - 100), this.rnd.between(50, game.height - 50), 'collectable', 0);
        this.collectable.anchor.set(0.5);
        this.collectable.tint = SITA.imagesColors[2].tint;
        this.add.tween(this.collectable).to({ angle: 360 }, 1000, "Linear", true, 0, -1, false)
        this.physics.arcade.enable(this.collectable);

        this.scoreText = game.add.bitmapText(50, 50, "font", "Score: " + SITA.score.toString(), 48);
        this.horizontal = true;

        this.startTime = new Date();
        this.totalTime = SITA.timeRemaining;
        this.timeElapsed = 0;
        this.createTimer();
        this.gameTimer = this.time.events.loop(100, this.updateTimer, this);

        this.addSeconds = game.add.bitmapText(game.width - 200, 100, "font", "+2", 48);
        this.addSeconds.angle += 20;
        this.addSeconds.alpha = 0;

        this.stick = this.pad.addStick(100, 200, 200, 'arcade');
        this.stick.scale = 0.7;
        this.stick.showOnTouch = true;

        this.game.input.onDown.add(this.checkPauseButtons, this);

        this.pauseButton = this.game.add.button(this.game.width - 35, 40, "paused", function (e) {
        this.game.paused = true;
        });
        this.pauseButton.anchor.set(0.5);
        this.pauseButton.scale.set(0.15);
        this.pauseButton.tint = "0xff0000";
        if(SITA.ChallengingFriend || SITA.friendChallenge){
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
        this.player.body.velocity.set(0);

        if (this.stick.isDown && (this.stick.force > 0.3)) {
            this.physics.arcade.velocityFromRotation(this.stick.rotation, this.speed, this.player.body.velocity);
        }
        else {
            if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -this.speed;
            }
            else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = this.speed;
            }
            if (this.cursors.up.isDown) {
                this.player.body.velocity.y = -this.speed;
            }
            else if (this.cursors.down.isDown) {
                this.player.body.velocity.y = this.speed;
            }
        }
        this.physics.arcade.overlap(this.player, this.collectable, this.collect, null, this);
        this.physics.arcade.overlap(this.player, this.bullets, this.hitBullet, null, this);
        this.world.wrap(this.player);
        this.bullets.forEach(this.world.wrap, this.world);
        if (this.timeElapsed >= this.totalTime) {
            this.GameOver(this.player.x, this.player.y);
        }
        if (SITA.friendChallengeAlive) {
            setTimeout(this.friendChallengeHandler, 300, [10, 20]);
        }
    },
    friendChallengeHandler: function (args) {
        //args[1].y = args[0];
    },
    paused: function () {
        if(!SITA.ChallengingFriend && !SITA.friendChallenge){
            this.pauseImage.visible = true;
            this.resumeText.visible = true;
            this.saveGame.visible = true;
        }
        this.pausedTime = new Date();
    },
    resumed: function () {
        if(!SITA.ChallengingFriend && !SITA.friendChallenge){
            this.pauseImage.visible = false;
            this.resumeText.visible = false;
            this.saveGame.visible = false;
        }        
        var timeDifference = new Date().getTime() - this.pausedTime.getTime();
        this.totalTime += Math.abs(timeDifference / 1000);
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
            var timeRemaining = this.totalTime - this.timeElapsed;

            saveArray.score = SITA.score;
            saveArray.timeRemaining = timeRemaining;
            
            platform_tools("SaveGame", SITA.score, 0, gameID, saveArray, false);
            Cookies.set('SITASaveGame', saveArray);
        }

    },
    collect: function (player, collectable) {
        var x = collectable.x;
        var y = collectable.y;
        var collected = game.add.sprite(x, y, "collectable");
        collected.tint = SITA.imagesColors[2].tint;
        collected.anchor.set(0.5);
        SITA.score += 1;
        this.scoreText.text = "Score: " + SITA.score.toString();
        this.totalTime += 2;
        this.addSeconds.alpha = 1;
        platform_tools("LiveScore", SITA.score, 0, gameID, null, false);

        game.add.tween(this.addSeconds).to({ alpha: 0 }, 500, "Linear", true);
        this.placeCollectable();
        this.spinCollectable(collected);

        if (SITA.score > SITA.friendScore && SITA.friendChallengeAlive) {
            SITA.friendChallengeWin = true;
            SITA.friendChallengeAlive = false;
        }
    },
    placeCollectable: function () {
        this.collectable.x = this.rnd.between(50, game.width - 50);
        this.collectable.y = this.rnd.between(50, game.height - 50);
    },
    spinCollectable: function (collected) {
        var tween = game.add.tween(collected).to({ angle: 720 }, 2500, Phaser.Easing.Elastic.In, true);
        game.add.tween(collected.scale).to({ x: 1.5, y: 1.5 }, 2500, Phaser.Easing.Linear.None, true);
        game.add.tween(collected).to({ tint: 0xFF0000 }, 2500, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function () {
            this.fireBullets(collected);
            collected.destroy();
        }, this);
    },
    fireBullets: function (collected) {
        var BulletSpeed = this.rnd.between(150, 250);
        var deadTimer = this.rnd.between(7, 13);
        var x = collected.x;
        var y = collected.y;
        var bullet;
        if (this.horizontal) {
            bullet = this.bullets.create(x, y, "bullet");
            bullet.tint = SITA.imagesColors[3].tint;
            bullet.body.velocity.x = -BulletSpeed;
            this.time.events.add(Phaser.Timer.SECOND * deadTimer, this.destroy, bullet);
            bullet = this.bullets.create(x, y, "bullet");
            bullet.tint = SITA.imagesColors[3].tint;
            bullet.body.velocity.x = BulletSpeed;
            this.time.events.add(Phaser.Timer.SECOND * deadTimer, this.destroy, bullet);
        }
        else {
            bullet = this.bullets.create(x, y, "bullet");
            bullet.tint = SITA.imagesColors[3].tint;
            bullet.body.velocity.y = -BulletSpeed;
            this.time.events.add(Phaser.Timer.SECOND * deadTimer, this.destroy, bullet);
            bullet = this.bullets.create(x, y, "bullet");
            bullet.tint = SITA.imagesColors[3].tint;
            bullet.body.velocity.y = BulletSpeed;
            this.time.events.add(Phaser.Timer.SECOND * deadTimer, this.destroy, bullet);
        }
        this.horizontal = !this.horizontal;

    },
    destroy: function (bullet) {
        this.destroy();
    },
    createTimer: function () {
        this.timeLabel = game.add.bitmapText(game.width - 200, 50, "font", "Time left: " + this.totalTime.toString(), 48);
        this.timeLabel.anchor.setTo(0.5, 0);
        this.timeLabel.align = 'center';
    },
    updateTimer: function () {
        var currentTime = new Date();
        var timeDifference = this.startTime.getTime() - currentTime.getTime();

        this.timeElapsed = Math.abs(timeDifference / 1000);
        var timeRemaining = this.totalTime - this.timeElapsed;
        if (timeRemaining <= 0) this.timeLabel.text = "Time left: 0";
        else this.timeLabel.text = "Time left: " + Math.floor(timeRemaining);

    },
    hitBullet: function (player, bullet) {
        var x = player.x;
        var y = player.y;
        bullet.kill();
        this.GameOver(x, y);

    },
    GameOver: function (x, y) {
        this.totalTime = this.timeElapsed + 1;
        game.time.events.remove(this.gameTimer);
        this.player.kill();
        var Exp1 = this.add.sprite(x, y, "bullet");
        Exp1.tint = SITA.imagesColors[3].tint;
        Exp1.anchor.set(0.5);
        var Exp2 = this.add.sprite(x, y, "bullet");
        Exp2.tint = SITA.imagesColors[3].tint;
        Exp2.angle += 45;
        Exp2.anchor.set(0.5);
        var Exp3 = this.add.sprite(x, y, "bullet");
        Exp3.tint = SITA.imagesColors[3].tint;
        Exp3.angle -= 45;
        Exp3.anchor.set(0.5);
        var Exp4 = this.add.sprite(x, y, "bullet");
        Exp4.tint = SITA.imagesColors[3].tint;
        Exp4.angle += 90;
        Exp4.anchor.set(0.5);

        this.add.tween(Exp1.scale).to({ x: 0.1, y: 100 }, 500, "Linear", true);
        this.add.tween(Exp1).to({ alpha: 0 }, 500, "Linear", true);
        this.add.tween(Exp2.scale).to({ x: 0.1, y: 100 }, 500, "Linear", true);
        this.add.tween(Exp2).to({ alpha: 0 }, 500, "Linear", true);
        this.add.tween(Exp3.scale).to({ x: 0.1, y: 100 }, 500, "Linear", true);
        this.add.tween(Exp3).to({ alpha: 0 }, 500, "Linear", true);
        this.add.tween(Exp4.scale).to({ x: 0.1, y: 100 }, 500, "Linear", true);
        this.add.tween(Exp4).to({ alpha: 0 }, 500, "Linear", true);

        this.time.events.add(1000, this.GOS, this);
    },
    GOS: function () {
        this.game.state.start("GameOver");
    }
};

SITA.GameOver = function () { };

SITA.GameOver.prototype = {
    create: function () {
        if(game_mode!=="seasonMode"){
            var closeButton = this.game.add.button(35, 35, "close", this.close);
            closeButton.anchor.set(0.5);
            closeButton.scale.set(0.15);

            game.add.bitmapText(game.width / 2 - 50, 100, "font", "Your score", 48).anchor.x = 0.5;
            game.add.bitmapText(game.width / 2 + 175, 88, "font", SITA.score.toString(), 72).anchor.x = 0.5;

            var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame.bind(this, "Game"));
            playButton.anchor.set(0.5);
            playButton.tint = SITA.imagesColors[0].tint;
            var tween = game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
            tween.yoyo(true);

            var mainMenuText = this.game.add.bitmapText(this.game.width / 2, 180, "font", "Back to Main Menu", 28);
            mainMenuText.anchor.set(0.5);
            mainMenuText.inputEnabled = true;
            mainMenuText.events.onInputDown.add(this.startGame.bind(this, "MainMenu"));

            if (SITA.friendChallenge) {
                if (SITA.friendChallengeWin) {
                    this.game.add.bitmapText(this.game.width / 2, 220, "font", "You Win", 38).anchor.x = 0.5;
                } else {
                    this.game.add.bitmapText(this.game.width / 2, 220, "font", "You Lose", 38).anchor.x = 0.5;
                }
                this.game.add.bitmapText(this.game.width / 2, 260, "font", "Challenger Score: " + (SITA.friendScore).toString(), 38).anchor.x = 0.5;

                var challengeArray = {};
                challengeArray.oldScore = SITA.friendScore;
                challengeArray.uid = SITA.friendUID;

                platform_tools("ChallengeComplete", SITA.score, 0, gameID, challengeArray, false);

            } else if (SITA.ChallengingFriend) {
                this.game.add.bitmapText(this.game.width / 2, 220, "font", (SITA.ChallengingName).toString() + " challenged", 38).anchor.x = 0.5;
                
                var challengeArray = {};
                challengeArray.username = SITA.ChallengingName;
                challengeArray.useruid = SITA.friendUID;
                
                platform_tools("ChallengeFriend", SITA.score, 0, gameID, challengeArray, false);

            } else if (SITA.score >= 35) {
                platform_tools("GameOver", SITA.score, 0, gameID, null, true);
            } else {
                platform_tools("GameOver", SITA.score, 0, gameID, null, false);
            }
        }else{
            //
            //implement sever callback for season mode;
            //
        }
    },
    startGame: function (state) {
        SITA.score = 0;
        SITA.timeRemaining = 11;
        SITA.friendChallenge = false;   
        SITA.friendName = "";
        SITA.friendUID = "";
        SITA.friendScore = 0;
        SITA.friendChallengeWin = false;
        SITA.friendChallengeAlive = false;        
        SITA.ChallengingFriend = false;
        SITA.ChallengingName = "";

        this.game.state.start(state);
    },
    close: function () {
        platform_tools("Close", SITA.score, 0, gameID, null, false);
    }
};

function onColorsInputDownSITA(sprite, pointer) {
    var canvas = game.canvas.getContext('2d');
    var imageData = canvas.getImageData(pointer.x, pointer.y, 1, 1).data;
    var color = rgbToHexSITA(imageData[0], imageData[1], imageData[2]);

    sprite.currentSprite.tint = color;
    SITA.imagesColors[sprite.imageIndex].tint = color;
};

function componentToHexSITA(c) {
    var hex = c.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
};

function rgbToHexSITA(r, g, b) {
    return "0x" + componentToHexSITA(r) + componentToHexSITA(g) + componentToHexSITA(b);
};

var game;
var platform_tools;
var assets_path;
var game_mode;
var gameID = 4;
var argsSavedGame = undefined;
var argsFriends = undefined;
var argsChallenges = undefined;

function start_sita(windowwidth, windowheight, container, assetsPath, args, gamemode, callback) {
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

    this.game.state.add('Init', SITA.Init);
    this.game.state.add('Preloader', SITA.Preloader);
    this.game.state.add('ChangeColors', SITA.ChangeColors);
    this.game.state.add('FriendsChallenges', SITA.FriendsChallenges);
    this.game.state.add('ChallengeFriend', SITA.ChallengeFriend);
    this.game.state.add('MainMenu', SITA.MainMenu);
    this.game.state.add('Game', SITA.Game);
    this.game.state.add("GameOver", SITA.GameOver);

    this.game.state.start('Init');
}

function destroy_sita() {
    document.getElementById("sita").remove();
}

start_sita(960, 640, "", "", "", "", function (e) { console.log(e) });
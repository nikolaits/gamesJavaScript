var Asteroids = {
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

Asteroids.Init = function () { };

Asteroids.Init.prototype = {

    preload: function () {
        this.game.load.image("loading", assets_path + "assets/sprites/loading.png");
    },

    create: function () {
        this.game.state.start("Preloader");
    }
};


Asteroids.Preloader = function () { };

Asteroids.Preloader.prototype = {

    init: function () {

    },

    preload: function () {
        var loadingBar = this.add.sprite(this.game.width / 2, this.game.height / 2, "loading");
        loadingBar.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loadingBar);
        this.game.stage.backgroundColor = "#4488AA";
        this.game.canvas.id = 'asteroids';

        this.game.load.image("paused", assets_path + "assets/sprites/paused.png");
        this.game.load.image("gear", assets_path + "assets/sprites/gear.png");
        this.game.load.image("check", assets_path + "assets/sprites/check.png");
        this.game.load.image("colors", assets_path + "assets/sprites/colors.png");
        this.game.load.image("ResetDefaultColors", assets_path + "assets/sprites/ResetDefaultColors.png");
        this.game.load.image("playbutton", assets_path + "assets/sprites/playbutton.png");
        this.game.load.image("close", assets_path + "assets/sprites/close.png");
        this.game.load.image("ship", assets_path + "assets/sprites/ship.png");
        this.game.load.image("projectile", assets_path + "assets/sprites/projectile.png");
        this.game.load.image("asteroid", assets_path + "assets/sprites/asteroid.png");
        this.game.load.image("asteroid2", assets_path + "assets/sprites/asteroid2.png");
        this.game.load.image("earth", assets_path + "assets/sprites/earth.png");
        this.game.load.image("space", assets_path + "assets/sprites/space.png");
        this.game.load.image("live", assets_path + "assets/sprites/live.png");
        this.game.load.image("menu_bc", assets_path + "assets/sprites/menu_bc.png");
        this.game.load.bitmapFont("font", assets_path + "assets/fonts/font.png", assets_path + "assets/fonts/font.fnt");

        Cookies.remove('AsteroidsSaveGame');

        var cookieImagesColors = Cookies.get('AsteroidsColors');
        if (cookieImagesColors) {
            Asteroids.imagesColors = JSON.parse(cookieImagesColors);
        } else {
            Asteroids.imagesColors.push({ image: "playbutton", tint: "0xffffff" });
            Asteroids.imagesColors.push({ image: "ship", tint: "0xffffff" });
            Asteroids.imagesColors.push({ image: "asteroid", tint: "0xffffff" });
            Asteroids.imagesColors.push({ image: "asteroid2", tint: "0xffffff" });
            Asteroids.imagesColors.push({ image: "earth", tint: "0xffffff" });
            Asteroids.imagesColors.push({ image: "space", tint: "0xffffff" });
            Asteroids.imagesColors.push({ image: "live", tint: "0xffffff" });
        }
    },
    create: function () {
        if (game_mode === "seasonMode") {
            Asteroids.ChallengingFriend = true;
            this.game.state.start("Game", true, false, 1, 10, 3);
        } else {
            this.game.state.start("MainMenu");
        }
    }
};

Asteroids.ChangeColors = function () {
    this.sprites = [];
};

Asteroids.ChangeColors.prototype = {
    create: function () {
        var that = this;

        Asteroids.imagesColors.forEach(function (e, index) {
            var currentSprite = this.game.add.sprite(50, 25 + 70 * index, e.image);
            currentSprite.width = 50;
            currentSprite.height = 50;
            currentSprite.tint = e.tint;
            that.sprites.push(currentSprite);

            var colors = this.game.add.sprite(150, 25 + 70 * index, "colors");
            colors.imageIndex = index;
            colors.currentSprite = currentSprite;
            colors.height = 50;
            colors.inputEnabled = true;
            colors.events.onInputDown.add(onAsteroidsColorsInputDown, this);
        });

        var changeColors = this.game.add.button(35, 35, "check", this.startGame);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);

        var resetColors = this.game.add.button(this.game.width / 2, this.game.height - 50, "ResetDefaultColors", this.ResetDefaultColors, this);
        resetColors.anchor.set(0.5);
    },
    startGame: function () {
        Cookies.set('AsteroidsColors', Asteroids.imagesColors);
        this.game.state.start("MainMenu");
    },
    ResetDefaultColors: function () {
        Cookies.remove('AsteroidsColors');
        this.sprites.forEach(function (e) {
            e.tint = 0xffffff;
        });
        Asteroids.imagesColors.forEach(function (e) {
            e.tint = 0xffffff;
        });
    }
};

Asteroids.FriendsChallenges = function () { };

Asteroids.FriendsChallenges.prototype = {
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

                    that.game.add.bitmapText(50, 100 + 30 * i, "font", playerName.substring(0, 6), 26);
                    that.game.add.bitmapText(200, 100 + 30 * i, "font", playerScore, 26);

                    var acceptText = that.game.add.bitmapText(300, 100 + 30 * i, "font", "accept", 26);
                    acceptText.inputEnabled = true;
                    acceptText.events.onInputDown.add(function (args) {
                        Asteroids.friendChallenge = true;
                        Asteroids.friendChallengeAlive = true;
                        Asteroids.friendName = this.playerName;
                        Asteroids.friendScore = this.playerScore;
                        Asteroids.friendUID = this.playerUID;

                        this.scope.game.state.start("Game", true, false, 1, 10, 3);
                    }, { playerName: playerName, playerScore: playerScore, playerUID: playerUID, scope: that });
                }
            });
        } else {
            var noChallengesText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, "font", "no challenges available", 30);
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

Asteroids.ChallengeFriend = function () { };

Asteroids.ChallengeFriend.prototype = {
    create: function () {
        if (argsFriends) {
            var friendsChallenges = argsFriends;
            var that = this;

            friendsChallenges.forEach(function (e, i) {
                if (i < 20) {
                    var playerName = e.username.toString();
                    var playerUID = e.uid.toString();

                    that.game.add.bitmapText(50, 100 + 30 * i, "font", playerName.substring(0, 10), 26);

                    var acceptText = that.game.add.bitmapText(250, 100 + 30 * i, "font", "Challenge", 26);
                    acceptText.inputEnabled = true;
                    acceptText.events.onInputDown.add(function (args) {
                        Asteroids.ChallengingName = this.playerName;
                        Asteroids.ChallengingFriend = true;
                        Asteroids.friendUID = this.playerUID;

                        this.scope.game.state.start("Game", true, false, 1, 10, 3);
                    }, { playerName: playerName, playerUID: playerUID, scope: that });
                }
            });
        } else {
            var noChallengesText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, "font", "no friends available", 30);
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

Asteroids.MainMenu = function () { };

Asteroids.MainMenu.prototype = {
    create: function () {

        var background = this.add.sprite(0, 0, 'menu_bc');
        background.height = this.world.height;
        background.width = this.world.width;

        var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.start);
        playButton.anchor.set(0.5);
        playButton.tint = Asteroids.imagesColors[0].tint;
        var tween = game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
        tween.yoyo(true);

        var changeColors = this.game.add.button(35, 35, "gear", this.startChangeColors);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);

        var savedGameCookie = Cookies.get("AsteroidsSaveGame");
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
                Asteroids.score = savedGame.score;

                this.game.state.start("Game", true, false, savedGame.curLvl, savedGame.curMaxAsteroids, savedGame.livesRemaining);
            }, this);
        }

        var challengesText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2 - 200, "font", "Challenges", 48);
        challengesText.anchor.set(0.5);
        challengesText.inputEnabled = true;
        challengesText.events.onInputDown.add(function (e) {
            this.game.state.start("FriendsChallenges");
        }, this);
    },
    start: function () {
        this.game.state.start("Game", true, false, 1, 10, 3);
    },
    startChangeColors: function () {
        this.game.state.start("ChangeColors");
    }
};

Asteroids.Game = function (game) {
    this.Debug = false;
    this.NumberAsteroids;
    this.maxAsteroids;
    this.Level;
};

Asteroids.Game.prototype = {
    init: function (lvl, maxA, lives) {

        this.Level = lvl;
        this.maxAsteroids = maxA;
        this.NumberAsteroids = 0;
        this.Lives = lives;

        var background = this.add.sprite(0, 0, 'space');
        background.tint = Asteroids.imagesColors[5].tint;
        background.height = this.world.height;
        background.width = this.world.width;

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);
        this.world.bounds.setTo(0, 0, 440, 600);

        this.InitShip();
        this.InitAsteroids();

        this.earthCollisionGroup = this.physics.p2.createCollisionGroup();
        this.earth = this.add.sprite(this.world.centerX, this.game.height + 20, 'earth');
        this.earth.tint = Asteroids.imagesColors[4].tint;
        this.earth.anchor.setTo(0.5, 0.5);
        this.earth.scale.setTo(0.5);

        this.physics.p2.enable(this.earth, this.Debug);
        this.earth.body.setCircle(90);
        this.earth.body.collideWorldBounds = true;
        this.earth.body.fixedRotation = true;
        this.earth.body.setCollisionGroup(this.earthCollisionGroup);
        this.earth.body.collides(this.asteroidsCollisionGroup, this.DestroyShip, this);
        this.earth.body.collides(this.asteroids2CollisionGroup, this.DestroyShip, this);

        if (Asteroids.friendChallenge) {
            if (Asteroids.friendChallengeAlive) {
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

            this.scoreFriend = this.game.add.bitmapText(this.game.width / 2, 40, "font", "Challenger Score: " + (Asteroids.friendScore).toString(), 20);
            this.scoreFriend.anchor.set(0.5);
        }

        this.game.input.onDown.add(this.checkPauseButtons, this);

        this.pauseButton = this.game.add.button(this.game.width - 35, 40, "paused", function (e) {
            this.game.paused = true;
        });
        this.pauseButton.anchor.set(0.5);
        this.pauseButton.scale.set(0.15);
        this.pauseButton.tint = "0xff0000";
        if (Asteroids.ChallengingFriend || Asteroids.friendChallenge) {
            this.pauseButton.visible = false;
        }

        this.pauseImage = this.game.add.sprite(this.game.width / 2, this.game.height / 2 - 100, "paused");
        this.pauseImage.anchor.set(0.5);
        this.pauseImage.scale.set(0.8);
        this.pauseImage.tint = "0xff0000";
        this.pauseImage.visible = false;

        this.resumeText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2 + 100, "font", "Resume Game", 48);
        this.resumeText.anchor.set(0.5);
        this.resumeText.visible = false;

        this.saveGame = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2 + 200, "font", "Save Game", 48);
        this.saveGame.anchor.set(0.5);
        this.saveGame.visible = false;
    },
    create: function () {
        this.txtScore = this.game.add.text(10, 10, "Score: " + Asteroids.score.toString(), { font: "15px Fjalla One", fill: "#FF0000" });
        this.txtNumberAsteroids = this.game.add.text(100, 10, "Asteroids left: " + (this.maxAsteroids - this.NumberAsteroids), { font: "15px Fjalla One", fill: "#FF0000" });
        this.txtLVL = this.game.add.text(250, 10, "Level: " + this.Level, { font: "15px Fjalla One", fill: "#FF0000" });

        this.CreateShip();
        this.CreateAsteroids();
    },
    update: function () {
        this.UpdateShip();
        this.UpdateAsteroids();
        if (Asteroids.friendChallengeAlive) {
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
        if (!Asteroids.ChallengingFriend && !Asteroids.friendChallenge) {
            this.pauseImage.visible = true;
            this.resumeText.visible = true;
            this.saveGame.visible = true;
        }
        this.pausedTime = new Date();
    },
    resumed: function () {
        if (!Asteroids.ChallengingFriend && !Asteroids.friendChallenge) {
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

            saveArray.score = Asteroids.score;
            saveArray.livesRemaining = this.Lives;
            saveArray.curLvl = this.Level;
            saveArray.curMaxAsteroids = this.maxAsteroids;

            platform_tools("SaveGame", Asteroids.score, 0, gameID, saveArray, false);
            Cookies.set('AsteroidsSaveGame', saveArray);
        }

    },
    InitShip: function () {
        this.ship;
        this.shipCollisionGroup = this.physics.p2.createCollisionGroup();
        this.Lives;
        this.speed;
        this.fireRate = 450;
        this.nextFire = 0;
        this.dmg = 50;
        this.livesGroup = this.add.group();

        this.InitProjectiles();
    },
    CreateShip: function () {
        this.ship = this.add.sprite(220, 520, 'ship');
        this.ship.tint = Asteroids.imagesColors[1].tint;
        this.ship.smoothed = false;
        this.ship.scale.setTo(0.1);

        this.physics.p2.enable(this.ship, this.Debug);
        this.ship.body.setCircle(15);
        this.ship.body.collideWorldBounds = true;
        this.ship.body.fixedRotation = true;

        this.ship.body.setCollisionGroup(this.shipCollisionGroup);
        this.ship.body.collides(this.asteroidsCollisionGroup, this.DestroyShip, this);
        this.ship.body.collides(this.asteroids2CollisionGroup, this.DestroyShip, this);

        for (var i = 0; i < this.Lives; i++) {
            var tmp = this.livesGroup.create((this.world.width - 20) - (i * 22), 20, 'live');
            tmp.tint = Asteroids.imagesColors[6].tint;
            tmp.name = i;
            tmp.scale.setTo(0.05);
            tmp.anchor.setTo(0.5);
        }

        this.CreateProjectiles();
    },
    DestroyShip: function (s, a) {
        a.x = -200;
        s.x = -200;
        if (Asteroids.friendChallenge && Asteroids.friendChallengeAlive) {
            $("#gameMap").remove();
        }
        if (this.Lives - 1 < 0) {
            this.state.start('GameOver');
        } else {
            this.state.restart(true, false, this.Level, this.maxAsteroids, this.Lives - 1);
        }
    },
    UpdateShip: function () {
        this.ship.body.setZeroVelocity();

        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.ShipShoot();
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.A) || this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.ship.body.velocity.x = -150;
        }
        if (this.input.keyboard.isDown(Phaser.Keyboard.D) || this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.ship.body.velocity.x = 150;
        }
        if (this.input.keyboard.isDown(Phaser.Keyboard.W) || this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.ship.body.velocity.y = -150;
        }
        if (this.input.keyboard.isDown(Phaser.Keyboard.S) || this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.ship.body.velocity.y = 150;
        }
    },
    ShipShoot: function () {
        if (this.time.now > this.nextFire) {
            this.nextFire = this.time.now + this.fireRate;
            var tmp = this.Projectiles.getFirstExists(false);
            if (tmp) {
                tmp.reset(this.ship.x, this.ship.y - 8);
                tmp.body.velocity.y = -400;
            }
        }
    },
    InitProjectiles: function () {
        this.projSpeed;
        this.Projectiles = this.add.group();
        this.projectilesCollisionGroup = this.physics.p2.createCollisionGroup()
    },
    CreateProjectiles: function () {
        this.Projectiles.enableBody = true;
        this.Projectiles.physicsBodyType = Phaser.Physics.P2JS;

        for (var i = 0; i < 25; i++) {
            var tmp = this.Projectiles.create(this.ship.x, this.ship.y, 'projectile');
            this.physics.p2.enable(tmp, this.Debug);

            tmp.name = 'projectile ' + i;
            tmp.anchor.setTo(0.5, 0.5);
            tmp.checkWorldBounds = true;
            tmp.visible = false;
            tmp.exists = false;

            tmp.body.setCircle(8);
            tmp.body.kinematic = true;
            tmp.events.onOutOfBounds.add(this.KillProjectile, this);

            tmp.body.setCollisionGroup(this.projectilesCollisionGroup);
            tmp.body.collides(this.asteroidsCollisionGroup, this.HitAsteroid, this);
            tmp.body.collides(this.asteroids2CollisionGroup, this.HitAsteroid2, this);
        }
    },
    KillProjectile: function (proj) {
        proj.kill();
    },
    HitAsteroid: function (p, a) {
        a.x = -200;
        p.x = -200;
        Asteroids.score += 2;
        this.NumberAsteroids++;
        this.txtNumberAsteroids.setText("Asteroids left: " + (this.maxAsteroids - this.NumberAsteroids));
        this.txtScore.setText("Score: " + Asteroids.score.toString());

        platform_tools("LiveScore", Asteroids.score, 0, gameID, null, false);
        if (Asteroids.score > Asteroids.friendScore && Asteroids.friendChallengeAlive) {
            Asteroids.friendChallengeWin = true;
            Asteroids.friendChallengeAlive = false;
            $("#gameMap").remove();
        }

        if (this.NumberAsteroids >= this.maxAsteroids) {
            if (Asteroids.friendChallenge && Asteroids.friendChallengeAlive) {
                $("#gameMap").remove();
            }
            this.state.restart(true, false, this.Level + 1, this.maxAsteroids + 10, this.Lives)
        }
    },
    HitAsteroid2: function (p, a) {
        this.AsteroidHP[a.sprite.name] -= this.dmg;
        p.x = -200;
        if (this.AsteroidHP[a.sprite.name] <= 0) {
            this.AsteroidHP[a.sprite.name] = 100;
            a.x = -200;
            Asteroids.score += 3;
            this.NumberAsteroids++;
            this.txtNumberAsteroids.setText("Asteroids left: " + (this.maxAsteroids - this.NumberAsteroids));
            this.txtScore.setText("Score: " + Asteroids.score.toString());

            platform_tools("LiveScore", Asteroids.score, 0, gameID, null, false);
            if (Asteroids.score > Asteroids.friendScore && Asteroids.friendChallengeAlive) {
                Asteroids.friendChallengeWin = true;
                Asteroids.friendChallengeAlive = false;
                $("#gameMap").remove();
            }

            if (this.NumberAsteroids >= this.maxAsteroids) {
                if (Asteroids.friendChallenge && Asteroids.friendChallengeAlive) {
                    $("#gameMap").remove();
                }
                this.state.restart(true, false, this.Level + 1, this.maxAsteroids + 10, this.Lives)
            }
        }
    },
    InitAsteroids: function () {
        this.Asteroids = this.add.group();
        this.Asteroids2 = this.add.group();
        this.asteroidsCollisionGroup = game.physics.p2.createCollisionGroup();
        this.asteroids2CollisionGroup = game.physics.p2.createCollisionGroup();
        this.asSpeed;
        this.frequency1 = 2000 - (this.Level * 60);
        if (this.frequency1 < 900) {
            this.frequency1 = 900;
        }
        this.nextAsteroid = this.frequency1;
        this.frequency2 = 5000 - (this.Level * 20);
        if (this.frequency2 < 2000) {
            this.frequency2 = 2000;
        }
        this.nextAsteroid2 = this.frequency2;
        this.AsteroidHP = {};
    },
    CreateAsteroids: function () {
        this.Asteroids.enableBody = true;
        this.Asteroids2.enableBody = true;

        this.Asteroids.physicsBodyType = Phaser.Physics.P2JS;
        for (var i = 0; i < 40; i++) {
            var tmp = this.Asteroids.create(0, 0, 'asteroid');
            tmp.tint = Asteroids.imagesColors[2].tint;
            this.physics.p2.enable(tmp, this.Debug);

            tmp.name = 'Asteroid' + i;
            tmp.anchor.setTo(0.5, 0.5);
            tmp.scale.setTo(0.1);
            tmp.checkWorldBounds = true;
            tmp.visible = false;
            tmp.exists = false;

            tmp.body.setCircle(15);
            tmp.events.onOutOfBounds.add(this.KillProjectile, this);
            tmp.body.rotateRight(100);

            tmp.body.setCollisionGroup(this.asteroidsCollisionGroup);
            tmp.body.collides([this.asteroidsCollisionGroup, this.projectilesCollisionGroup, this.shipCollisionGroup, this.earthCollisionGroup]);
        }

        this.Asteroids2.physicsBodyType = Phaser.Physics.P2JS;
        for (var i = 0; i < 25; i++) {
            var tmp2 = this.Asteroids2.create(0, 0, 'asteroid2');
            tmp2.tint = Asteroids.imagesColors[3].tint;
            this.physics.p2.enable(tmp2, this.Debug);

            tmp2.name = 'AsteroidRED' + i;
            this.AsteroidHP[tmp2.name] = 100;
            tmp2.anchor.setTo(0.5, 0.5);
            tmp2.scale.setTo(0.2);
            tmp2.checkWorldBounds = true;
            tmp2.visible = false;
            tmp2.exists = false;

            tmp2.body.setCircle(10);
            tmp2.events.onOutOfBounds.add(this.KillProjectile, this);

            tmp2.body.setCollisionGroup(this.asteroids2CollisionGroup);
            tmp2.body.collides([this.asteroids2CollisionGroup, this.projectilesCollisionGroup, this.shipCollisionGroup, this.earthCollisionGroup]);
        }
    },
    HitPlanet: function (a) {
        if (Asteroids.friendChallenge && Asteroids.friendChallengeAlive) {
            $("#gameMap").remove();
        }
        if (this.Lives - 1 < 0) {
            this.state.start('GameOver');
        } else {
            this.state.restart(true, false, this.Level, this.maxAsteroids, this.Lives - 1);
        }
    },
    GenerateAsteroids: function () {
        if (this.time.now > this.nextAsteroid) {
            this.nextAsteroid = this.time.now + this.frequency1;
            var tmp = this.Asteroids.getFirstExists(false);
            if (tmp) {
                var randomX = this.rnd.integerInRange(0, 400);
                tmp.reset(randomX, 0);
            }
        }

        if (this.time.now > this.nextAsteroid2) {
            this.nextAsteroid2 = this.time.now + this.frequency2;
            var tmp2 = this.Asteroids2.getFirstExists(false);
            if (tmp2) {
                randomX = this.rnd.integerInRange(0, 400);
                tmp2.reset(randomX, 0);
            }
        }
    },
    MoveAsteroids: function () {
        this.Asteroids.forEachAlive(function (a) {
            var dx = 220 - a.x;
            var dy = 720 - a.y;
            var asterArctangent = Math.atan2(dy, dx);

            a.body.rotation = asterArctangent;
            a.body.velocity.x = 100 * Math.cos(asterArctangent);
            a.body.velocity.y = 100 * Math.sin(asterArctangent);
        }, this);

        this.Asteroids2.forEachAlive(function (a) {
            var dx = 220 - a.x;
            var dy = 720 - a.y;
            var asterArctangent = Math.atan2(dy, dx);

            a.body.rotation = asterArctangent;
            a.body.velocity.x = 100 * Math.cos(asterArctangent);
            a.body.velocity.y = 100 * Math.sin(asterArctangent);
        }, this);
    },
    UpdateAsteroids: function () {
        this.GenerateAsteroids()
        this.MoveAsteroids();
    },

};

Asteroids.GameOver = function () { };

Asteroids.GameOver.prototype = {
    create: function () {
        if (game_mode === "casualMode") {
            var closeButton = this.game.add.button(35, 35, "close", this.close);
            closeButton.anchor.set(0.5);
            closeButton.scale.set(0.15);

            game.add.bitmapText(game.width / 2 - 50, 100, "font", "Your score", 48).anchor.x = 0.5;
            game.add.bitmapText(game.width / 2 + 155, 88, "font", Asteroids.score.toString(), 62).anchor.x = 0.5;

            var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame.bind(this, "Game"));
            playButton.anchor.set(0.5);
            playButton.tint = Asteroids.imagesColors[0].tint;
            var tween = game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
            tween.yoyo(true);

            var mainMenuText = this.game.add.bitmapText(this.game.width / 2, 180, "font", "Back to Main Menu", 28);
            mainMenuText.anchor.set(0.5);
            mainMenuText.inputEnabled = true;
            mainMenuText.events.onInputDown.add(this.startGame.bind(this, "MainMenu"));

            if (Asteroids.friendChallenge) {
                if (Asteroids.friendChallengeWin) {
                    this.game.add.bitmapText(this.game.width / 2, 220, "font", "You Win", 38).anchor.x = 0.5;
                } else {
                    this.game.add.bitmapText(this.game.width / 2, 220, "font", "You Lose", 38).anchor.x = 0.5;
                }
                this.game.add.bitmapText(this.game.width / 2, 260, "font", "Challenger Score: " + (Asteroids.friendScore).toString(), 30).anchor.x = 0.5;

                var challengeArray = {};
                challengeArray.oldScore = Asteroids.friendScore;
                challengeArray.uid = Asteroids.friendUID;

                platform_tools("ChallengeComplete", Asteroids.score, 0, gameID, challengeArray, false);

            } else if (Asteroids.ChallengingFriend) {
                this.game.add.bitmapText(this.game.width / 2, 220, "font", (Asteroids.ChallengingName).toString() + " challenged", 38).anchor.x = 0.5;

                var challengeArray = {};
                challengeArray.username = Asteroids.ChallengingName;
                challengeArray.useruid = Asteroids.friendUID;

                platform_tools("ChallengeFriend", Asteroids.score, 0, gameID, challengeArray, false);

            } else if (Asteroids.score >= game_score_weight) {
                platform_tools("GameOver", Asteroids.score, 0, gameID, null, true);
            } else {
                platform_tools("GameOver", Asteroids.score, 0, gameID, null, false);
            }
        } else if (game_mode === "seasonMode") {
            var virtualScore = Asteroids.score / game_score_weight * 100;
            platform_tools("GameOver", virtualScore, 0, gameID, null, false);
        }
    },
    startGame: function (state) {
        Asteroids.score = 0;
        Asteroids.friendChallenge = false;
        Asteroids.friendName = "";
        Asteroids.friendUID = "";
        Asteroids.friendScore = 0;
        Asteroids.friendChallengeWin = false;
        Asteroids.friendChallengeAlive = false;
        Asteroids.ChallengingFriend = false;
        Asteroids.ChallengingName = "";

        if (state === "Game") {
            this.game.state.start("Game", true, false, 1, 10, 3);
        } else {
            this.game.state.start(state);
        }
    },
    close: function () {
        platform_tools("Close", Asteroids.score, 0, gameID, null, false);
    }
};

function onAsteroidsColorsInputDown(sprite, pointer) {
    var canvas = game.canvas.getContext('2d');
    var imageData = canvas.getImageData(pointer.x, pointer.y, 1, 1).data;
    var color = rgbToHexAsteroids(imageData[0], imageData[1], imageData[2]);

    sprite.currentSprite.tint = color;
    Asteroids.imagesColors[sprite.imageIndex].tint = color;
};

function componentToHexAsteroids(c) {
    var hex = c.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
};

function rgbToHexAsteroids(r, g, b) {
    return "0x" + componentToHexAsteroids(r) + componentToHexAsteroids(g) + componentToHexAsteroids(b);
};

var game = null;
var platform_tools = null;
var assets_path = "";
var game_mode = "";
var gameID = 2;
var game_score_weight = 200;
var argsSavedGame = undefined;
var argsFriends = undefined;
var argsChallenges = undefined;

function start_asteroids(windowwidth, windowheight, container, assetsPath, args, gamemode, callback) {
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

    this.game.state.add('Init', Asteroids.Init);
    this.game.state.add('Preloader', Asteroids.Preloader);
    this.game.state.add('ChangeColors', Asteroids.ChangeColors);
    this.game.state.add('FriendsChallenges', Asteroids.FriendsChallenges);
    this.game.state.add('ChallengeFriend', Asteroids.ChallengeFriend);
    this.game.state.add('MainMenu', Asteroids.MainMenu);
    this.game.state.add('Game', Asteroids.Game);
    this.game.state.add("GameOver", Asteroids.GameOver);

    this.game.state.start('Init');
}

function destroy_asteroids() {
    game_mode = "destroy";
    this.game.state.start("GameOver");

    Asteroids.score = 0;
    Asteroids.friendChallenge = false;
    Asteroids.friendName = "";
    Asteroids.friendUID = "";
    Asteroids.friendScore = 0;
    Asteroids.friendChallengeWin = false;
    Asteroids.friendChallengeAlive = false;
    Asteroids.ChallengingFriend = false;
    Asteroids.ChallengingName = "";

    game = null;
    platform_tools = null;
    assets_path = "";
    game_mode = "";
    gameID = 2;
    game_score_weight = 200;
    argsSavedGame = undefined;
    argsFriends = undefined;
    argsChallenges = undefined;

    document.getElementById("asteroids").remove();
}
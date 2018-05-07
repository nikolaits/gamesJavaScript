var SpaceFlight = {
    score: 0,
    spaceships: [],
    collectibleSpeed: 180,
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

SpaceFlight.Init = function () { };

SpaceFlight.Init.prototype = {
    preload: function () {
        this.game.load.image("loading", assets_path + "assets/sprites/loading.png");
    },
    create: function () {
        this.game.state.start("Preloader");
    }
};

SpaceFlight.Preloader = function () { };

SpaceFlight.Preloader.prototype = {
    preload: function () {
        var loadingBar = this.add.sprite(this.game.width / 2, this.game.height / 2, "loading");
        loadingBar.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loadingBar);
        this.game.stage.backgroundColor = "#4488AA";
        this.game.canvas.id = "spaceFlight";

        this.game.load.image("paused", assets_path + "assets/sprites/paused.png");
        this.game.load.image("gear", assets_path + "assets/sprites/gear.png");
        this.game.load.image("check", assets_path + "assets/sprites/check.png");
        this.game.load.image("colors", assets_path + "assets/sprites/colors.png");
        this.game.load.image("ResetDefaultColors", assets_path + "assets/sprites/ResetDefaultColors.png");
        this.game.load.image("playbutton", assets_path + "assets/sprites/playbutton.png");
        this.game.load.image("close", assets_path + "assets/sprites/close.png");
        this.game.load.image("collectible0", assets_path + "assets/sprites/collectible0.png");
        this.game.load.image("collectible1", assets_path + "assets/sprites/collectible1.png");
        this.game.load.image("spaceship0", assets_path + "assets/sprites/spaceship0.png");
        this.game.load.image("spaceship1", assets_path + "assets/sprites/spaceship1.png");
        this.game.load.image("particle", assets_path + "assets/sprites/particle.png");
        this.game.load.bitmapFont("font", assets_path + "assets/fonts/font.png", assets_path + "assets/fonts/font.fnt");
        this.game.load.audio("explosion", [assets_path + "assets/sounds/explosion.mp3", assets_path + "assets/sounds/explosion.ogg"]);
        this.game.load.audio("hit", [assets_path + "assets/sounds/hit.mp3", assets_path + "assets/sounds/hit.ogg"]);

        Cookies.remove('SpaceFlightSaveGame');

        var cookieImagesColors = Cookies.get('SpaceFlightColors');
        if (cookieImagesColors) {
            SpaceFlight.imagesColors = JSON.parse(cookieImagesColors);
        } else {
            SpaceFlight.imagesColors.push({ image: "playbutton", tint: "0xffffff" });
            SpaceFlight.imagesColors.push({ image: "collectible0", tint: "0xffffff" });
            SpaceFlight.imagesColors.push({ image: "collectible1", tint: "0xffffff" });
            SpaceFlight.imagesColors.push({ image: "spaceship0", tint: "0xffffff" });
            SpaceFlight.imagesColors.push({ image: "spaceship1", tint: "0xffffff" });
        }
    },
    create: function () {
        if (game_mode === "seasonMode") {
            SpaceFlight.ChallengingFriend = true;
            this.game.state.start("Game");
        } else {
            this.game.state.start("MainMenu");
        }
    }
};

SpaceFlight.ChangeColors = function () {
    this.sprites = [];
};

SpaceFlight.ChangeColors.prototype = {
    create: function () {
        var that = this;

        SpaceFlight.imagesColors.forEach(function (e, index) {
            var currentSprite = this.game.add.sprite(100, 50 + 150 * index, e.image);
            currentSprite.width = 100;
            currentSprite.height = 100;
            currentSprite.tint = e.tint;
            that.sprites.push(currentSprite);

            var colors = this.game.add.sprite(250, 50 + 150 * index, "colors");
            colors.imageIndex = index;
            colors.currentSprite = currentSprite;
            colors.height = 90;
            colors.inputEnabled = true;
            colors.events.onInputDown.add(onColorsInputDownSpaceFlight, this);
        });

        var changeColors = this.game.add.button(35, 35, "check", this.startGame);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);

        var resetColors = this.game.add.button(this.game.width / 2, this.game.height - 50, "ResetDefaultColors", this.ResetDefaultColors, this);
        resetColors.anchor.set(0.5);
    },
    startGame: function () {
        Cookies.set('SpaceFlightColors', SpaceFlight.imagesColors);
        this.game.state.start("MainMenu");
    },
    ResetDefaultColors: function () {
        Cookies.remove('SpaceFlightColors');
        this.sprites.forEach(function (e) {
            e.tint = 0xffffff;
        });
        SpaceFlight.imagesColors.forEach(function (e) {
            e.tint = 0xffffff;
        });
    }
};

SpaceFlight.FriendsChallenges = function () { };

SpaceFlight.FriendsChallenges.prototype = {
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
                        SpaceFlight.friendChallenge = true;
                        SpaceFlight.friendChallengeAlive = true;
                        SpaceFlight.friendName = this.playerName;
                        SpaceFlight.friendScore = this.playerScore;
                        SpaceFlight.friendUID = this.playerUID;

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

SpaceFlight.ChallengeFriend = function () { };

SpaceFlight.ChallengeFriend.prototype = {
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
                        SpaceFlight.ChallengingName = this.playerName;
                        SpaceFlight.ChallengingFriend = true;
                        SpaceFlight.friendUID = this.playerUID;

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

SpaceFlight.MainMenu = function () { };

SpaceFlight.MainMenu.prototype = {
    create: function () {
        this.game.add.bitmapText(this.game.width / 2, 70, "font", "SpaceFlight", 80).anchor.x = 0.5;

        var leftSpaceShip = this.game.add.sprite(this.game.width / 2 - 100, this.game.height / 2 + 50, "spaceship0");
        leftSpaceShip.anchor.set(0.5);
        leftSpaceShip.tint = SpaceFlight.imagesColors[3].tint;
        this.game.add.tween(leftSpaceShip).to({ angle: -45 }, 2000, Phaser.Easing.Linear.None, true);
        this.game.add.tween(leftSpaceShip.scale).to({ x: 3, y: 3 }, 2000, Phaser.Easing.Linear.None, true);


        var rightSpaceShip = this.game.add.sprite(this.game.width / 2 + 100, this.game.height / 2 - 50, "spaceship1");
        rightSpaceShip.anchor.set(0.5);
        rightSpaceShip.tint = SpaceFlight.imagesColors[4].tint;
        this.game.add.tween(rightSpaceShip).to({ angle: 45 }, 2000, Phaser.Easing.Linear.None, true);
        this.game.add.tween(rightSpaceShip.scale).to({ x: 3, y: 3 }, 2000, Phaser.Easing.Linear.None, true);

        var playButton = this.game.add.button(this.game.width / 2, this.game.height - 150, "playbutton", this.startGame);
        playButton.anchor.set(0.5);
        playButton.tint = SpaceFlight.imagesColors[0].tint;
        var tween = this.game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
        tween.yoyo(true);

        var changeColors = this.game.add.button(35, 35, "gear", this.startChangeColors);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);

        var savedGameCookie = Cookies.get("SpaceFlightSaveGame");
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
                SpaceFlight.score = savedGame.score - 1;
                this.game.state.start("Game");
            }, this);
        }

        var challengesText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2 + 200, "font", "Challenges", 48);
        challengesText.anchor.set(0.5);
        challengesText.inputEnabled = true;
        challengesText.events.onInputDown.add(function (e) {
            this.game.state.start("FriendsChallenges");
        }, this);
    },
    startGame: function () {
        this.game.state.start("HowToPlay");
    },
    startChangeColors: function () {
        this.game.state.start("ChangeColors");
    }
};

SpaceFlight.HowToPlay = function () { };

SpaceFlight.HowToPlay.prototype = {
    create: function () {
        this.game.add.bitmapText(this.game.width / 2, 70, "font", "To change the SpaceShip lane", 36).anchor.x = 0.5;
        this.game.add.bitmapText(this.game.width / 2, 130, "font", "click or tap the lane", 36).anchor.x = 0.5;
        this.game.add.bitmapText(this.game.width / 2, 190, "font", "or 'Q' and 'P' Keys", 36).anchor.x = 0.5;

        var leftSpaceShip = this.game.add.sprite(this.game.width / 2 - 250, 280, "spaceship0");
        leftSpaceShip.anchor.set(0.5);
        leftSpaceShip.tint = SpaceFlight.imagesColors[3].tint;
        var leftSpaceShipTween = this.game.add.tween(leftSpaceShip).to({ x: this.game.width / 2 - 50 }, 800, "Linear", true, 0, -1);
        leftSpaceShipTween.yoyo(true);

        var rightSpaceShip = this.game.add.sprite(this.game.width / 2 + 250, 280, "spaceship1");
        rightSpaceShip.anchor.set(0.5);
        rightSpaceShip.tint = SpaceFlight.imagesColors[4].tint;
        var rightSpaceShipTween = this.game.add.tween(rightSpaceShip).to({ x: this.game.width / 2 + 50 }, 800, "Linear", true, 0, -1);
        rightSpaceShipTween.yoyo(true);

        var spaceship0 = this.game.add.sprite(150, 400, "spaceship0");
        spaceship0.anchor.set(0.5);
        spaceship0.tint = SpaceFlight.imagesColors[3].tint;
        this.game.add.bitmapText(220, 400, "font", "Collect", 20);

        var collectible0 = this.game.add.sprite(340, 400, "collectible0");
        collectible0.anchor.set(0.5);
        collectible0.tint = SpaceFlight.imagesColors[1].tint;

        this.game.add.bitmapText(390, 400, "font", "Avoid", 20);
        var collectible2 = this.game.add.sprite(480, 400, "collectible1");
        collectible2.anchor.set(0.5);
        collectible2.tint = SpaceFlight.imagesColors[2].tint;


        var spaceship1 = this.game.add.sprite(150, 550, "spaceship1");
        spaceship1.anchor.set(0.5);
        spaceship1.tint = SpaceFlight.imagesColors[4].tint;

        this.game.add.bitmapText(220, 550, "font", "Collect", 20);

        var collectible1 = this.game.add.sprite(340, 550, "collectible1");
        collectible1.anchor.set(0.5);
        collectible1.tint = SpaceFlight.imagesColors[2].tint;

        this.game.add.bitmapText(390, 550, "font", "Avoid", 20);
        var collectible3 = this.game.add.sprite(480, 550, "collectible0");
        collectible3.anchor.set(0.5);
        collectible3.tint = SpaceFlight.imagesColors[1].tint;

        var playButton = this.game.add.button(this.game.width / 2, this.game.height - 150, "playbutton", this.startGame);
        playButton.anchor.set(0.5);
        playButton.tint = SpaceFlight.imagesColors[0].tint;
        var tween = this.game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
        tween.yoyo(true);
    },
    startGame: function () {
        this.game.state.start("Game");
    }
};

SpaceFlight.Game = function () {
    this.laneWidth = 138;
    this.lineWidth = 4;
    this.SpaceShipTurnSpeed = 200;
    this.collectibleDelay = 1200;
    this.spaceShipFried = [];
};

SpaceFlight.Game.prototype = {
    create: function () {
        this.hitSound = this.game.add.audio("hit");
        this.roadWidth = this.laneWidth * 2 + this.lineWidth;
        var roadSeparator = this.game.add.tileSprite(this.roadWidth, 0, this.game.width - (this.roadWidth * 2), this.game.height, "particle");
        var leftLine = this.game.add.tileSprite(this.laneWidth, 0, this.lineWidth, this.game.height, "particle");
        var rightLine = this.game.add.tileSprite(this.game.width - this.laneWidth - this.lineWidth, 0, this.lineWidth, this.game.height, "particle");
        this.SpaceShipGroup = this.game.add.group();
        this.collectibleGroup = this.game.add.group();
        this.scoreText = this.game.add.bitmapText(this.game.width / 2, 40, "font", SpaceFlight.score.toString(), 120)
        this.scoreText.anchor.x = 0.5;
        for (var i = 0; i < 2; i++) {
            SpaceFlight.spaceships[i] = this.game.add.sprite(0, this.game.height - 120, "spaceship" + i);
            SpaceFlight.spaceships[i].positions = [(this.game.width + roadSeparator.width) / 2 * i + this.laneWidth / 2, (this.game.width + roadSeparator.width) / 2 * i + this.laneWidth + this.lineWidth + this.laneWidth / 2];
            SpaceFlight.spaceships[i].anchor.set(0.5);
            SpaceFlight.spaceships[i].canMove = true;
            SpaceFlight.spaceships[i].side = i;
            SpaceFlight.spaceships[i].x = SpaceFlight.spaceships[i].positions[SpaceFlight.spaceships[i].side];
            this.game.physics.enable(SpaceFlight.spaceships[i], Phaser.Physics.ARCADE);
            SpaceFlight.spaceships[i].body.allowRotation = false;
            SpaceFlight.spaceships[i].body.moves = false;
            if (i === 0) {
                SpaceFlight.spaceships[i].tint = SpaceFlight.imagesColors[3].tint;
            } else {
                SpaceFlight.spaceships[i].tint = SpaceFlight.imagesColors[4].tint;
            }
            SpaceFlight.spaceships[i].emittSmoke = this.game.add.emitter(SpaceFlight.spaceships[i].x, SpaceFlight.spaceships[i].y + SpaceFlight.spaceships[i].height / 2 + 2, 20);
            SpaceFlight.spaceships[i].emittSmoke.makeParticles("particle");
            SpaceFlight.spaceships[i].emittSmoke.setXSpeed(-15, 15);
            SpaceFlight.spaceships[i].emittSmoke.setYSpeed(50, 150);
            SpaceFlight.spaceships[i].emittSmoke.setAlpha(0.2, 0.5);
            SpaceFlight.spaceships[i].emittSmoke.start(false, 500, 20);
            SpaceFlight.spaceships[i].emittSmoke.forEach(function (p) {
                p.tint = SpaceFlight.spaceships[i].tint;
            }, this);
            this.SpaceShipGroup.add(SpaceFlight.spaceships[i]);
        }
        this.game.input.onDown.add(this.moveSpaceShip, this);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.leftKey.onDown.add(this.moveSpaceShip, this);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        this.rightKey.onDown.add(this.moveSpaceShip, this);
        this.collectibleLoop = this.game.time.events.loop(this.collectibleDelay, function () {
            for (var i = 0; i < 2; i++) {
                var collectible = new Collectible(game, i);
                if (SpaceFlight.friendChallenge && SpaceFlight.friendChallengeAlive) {
                    this.createMiniCollectible(collectible);
                }
                this.game.add.existing(collectible);
                this.collectibleGroup.add(collectible);
                collectible.missed.add(this.collectibleFail, this);
            }
        }, this);
        this.scoreLoop = this.game.time.events.loop(250, function () {
            SpaceFlight.score++;
            this.scoreText.text = SpaceFlight.score.toString();
            platform_tools("LiveScore", SpaceFlight.score, 0, gameID, null, false);

            if (SpaceFlight.score > SpaceFlight.friendScore && SpaceFlight.friendChallengeAlive) {
                SpaceFlight.friendChallengeWin = true;
                SpaceFlight.friendChallengeAlive = false;

                for (var i = 0; i < 2; i++) {
                    var ship = this.spaceShipFried[i];
                    var emittExplosion = this.game.add.emitter(ship.x, ship.y, 200);
                    emittExplosion.makeParticles("particle");
                    emittExplosion.gravity = 0;
                    emittExplosion.setAlpha(0.2, 1);
                    emittExplosion.minParticleScale = 0.5;
                    emittExplosion.maxParticleScale = 3;
                    emittExplosion.start(true, 2000, null, 200);
                    ship.destroy();
                }
                this.game.add.audio("explosion").play();
            }
        }, this);

        if (SpaceFlight.friendChallenge) {
            for (var i = 0; i < 2; i++) {
                this.spaceShipFried[i] = this.game.add.sprite(0, this.game.height - 20, "spaceship" + i);
                this.spaceShipFried[i].positions = [(this.game.width + roadSeparator.width) / 2 * i + this.laneWidth / 2, (this.game.width + roadSeparator.width) / 2 * i + this.laneWidth + this.lineWidth + this.laneWidth / 2];
                this.spaceShipFried[i].anchor.set(0.5);
                this.spaceShipFried[i].side = i;
                this.spaceShipFried[i].x = SpaceFlight.spaceships[i].positions[SpaceFlight.spaceships[i].side];
                this.spaceShipFried[i].scale.set(0.6);
                this.spaceShipFried[i].alpha = 0.5;
            }

            this.scoreFriend = this.game.add.bitmapText(this.game.width / 2, 25, "font", "Challenger Score: " + (SpaceFlight.friendScore).toString(), 28);
            this.scoreFriend.anchor.set(0.5);
            this.scoreFriend.tint = "0xff0000"
        }

        this.pauseButton = this.game.add.button(this.game.width - 35, 40, "paused", function (e) {
            this.game.paused = true;
        });
        this.pauseButton.anchor.set(0.5);
        this.pauseButton.scale.set(0.15);
        this.pauseButton.tint = "0xff0000";
        if (SpaceFlight.ChallengingFriend || SpaceFlight.friendChallenge) {
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
    moveSpaceShip: function (e) {
        var SpaceShipToMove;
        var isKeyboard = e instanceof Phaser.Key;
        if (this.game.paused) {
            this.checkPauseButtons(e);
        }
        if (isKeyboard) {
            if (e.keyCode == 81) {
                SpaceShipToMove = 0;
            }
            else if (e.keyCode == 80) {
                SpaceShipToMove = 1;
            }
        }
        else {
            SpaceShipToMove = Math.floor(e.position.x / (this.game.width / 2));
        }
        if (SpaceFlight.spaceships[SpaceShipToMove].canMove) {
            SpaceFlight.spaceships[SpaceShipToMove].canMove = false;
            var steerTween = this.game.add.tween(SpaceFlight.spaceships[SpaceShipToMove]).to({
                angle: 20 - 40 * SpaceFlight.spaceships[SpaceShipToMove].side
            }, this.SpaceShipTurnSpeed / 2, Phaser.Easing.Linear.None, true);
            steerTween.onComplete.add(function () {
                var steerTween = this.game.add.tween(SpaceFlight.spaceships[SpaceShipToMove]).to({
                    angle: 0
                }, this.SpaceShipTurnSpeed / 2, Phaser.Easing.Linear.None, true);
            })
            SpaceFlight.spaceships[SpaceShipToMove].side = 1 - SpaceFlight.spaceships[SpaceShipToMove].side;
            var moveTween = this.game.add.tween(SpaceFlight.spaceships[SpaceShipToMove]).to({
                x: SpaceFlight.spaceships[SpaceShipToMove].positions[SpaceFlight.spaceships[SpaceShipToMove].side],
            }, this.SpaceShipTurnSpeed, Phaser.Easing.Linear.None, true);
            moveTween.onComplete.add(function () {
                SpaceFlight.spaceships[SpaceShipToMove].canMove = true;
            })
        }
    },
    update: function (e) {
        SpaceFlight.spaceships[0].emittSmoke.x = SpaceFlight.spaceships[0].x;
        SpaceFlight.spaceships[1].emittSmoke.x = SpaceFlight.spaceships[1].x;
        this.game.physics.arcade.collide(this.SpaceShipGroup, this.collectibleGroup, function (c, t) {
            if (t.mustPickUp) {
                t.destroy();
                this.hitSound.play();
            }
            else {
                this.collectibleFail(t);
            }
        }, null, this);
        if (SpaceFlight.friendChallengeAlive) {
            setTimeout(this.friendChallengeHandler, 900, [SpaceFlight.spaceships[0].x, SpaceFlight.spaceships[1].x, this.spaceShipFried]);
        }
    },
    createMiniCollectible: function (args) {
        var collectible = args;
        var mini = this.game.add.sprite(collectible.x, collectible.y - 60, collectible.key);
        game.physics.enable(mini, Phaser.Physics.ARCADE);
        mini.body.velocity.y = SpaceFlight.collectibleSpeed;
        mini.anchor.set(0.5);
        mini.alpha = 0.5;
        mini.scale.set(0.6);
        mini.checkWorldBounds = true;
        mini.events.onEnterBounds.add(function (e) {
            e.events.onOutOfBounds.add(function (e) {
                e.destroy();
            }, this);
        }, this);
    },
    friendChallengeHandler: function (args) {
        var spaceShipFried = args[2];

        spaceShipFried[0].x = args[0];
        spaceShipFried[1].x = args[1];
    },
    paused: function () {
        if (!SpaceFlight.ChallengingFriend && !SpaceFlight.friendChallenge) {
            this.pauseImage.visible = true;
            this.resumeText.visible = true;
            this.saveGame.visible = true;
        }
    },
    resumed: function () {
        if (!SpaceFlight.ChallengingFriend && !SpaceFlight.friendChallenge) {
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

            saveArray.score = SpaceFlight.score;

            platform_tools("SaveGame", SpaceFlight.score, 0, gameID, saveArray, false);
            Cookies.set('SpaceFlightSaveGame', saveArray);
        }

    },
    collectibleFail: function (t) {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.Q);
        this.game.input.keyboard.removeKey(Phaser.Keyboard.P);
        SpaceFlight.spaceships[0].emittSmoke.on = false;
        SpaceFlight.spaceships[1].emittSmoke.on = false;
        this.game.time.events.remove(this.collectibleLoop);
        this.game.time.events.remove(this.scoreLoop);
        this.game.tweens.removeAll();
        for (var i = 0; i < this.collectibleGroup.length; i++) {
            this.collectibleGroup.getChildAt(i).body.velocity.y = 0;
        }
        this.game.input.onDown.remove(this.moveSpaceShip, this);
        var emittExplosion = this.game.add.emitter(t.x, t.y, 200);
        emittExplosion.makeParticles("particle");
        emittExplosion.gravity = 0;
        emittExplosion.setAlpha(0.2, 1);
        emittExplosion.minParticleScale = 0.5;
        emittExplosion.maxParticleScale = 3;
        emittExplosion.start(true, 2000, null, 200);
        emittExplosion.forEach(function (p) {
            p.tint = t.tint;
        });
        t.destroy();
        var explosionSound = this.game.add.audio("explosion");
        explosionSound.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
            this.game.state.start("GameOver");
        }, this);
    }
};

SpaceFlight.GameOver = function () { };

SpaceFlight.GameOver.prototype = {
    create: function () {
        if (game_mode === "casualMode") {
            var closeButton = this.game.add.button(35, 35, "close", this.close);
            closeButton.anchor.set(0.5);
            closeButton.scale.set(0.15);

            this.game.add.bitmapText(this.game.width / 2, 200, "font", "Your score", 90).anchor.x = 0.5;
            this.game.add.bitmapText(this.game.width / 2, 350, "font", SpaceFlight.score.toString(), 120).anchor.x = 0.5;
            var playButton = this.game.add.button(this.game.width / 2, this.game.height - 150, "playbutton", this.startGame.bind(this, "Game"));
            playButton.anchor.set(0.5);
            playButton.tint = SpaceFlight.imagesColors[0].tint;
            var tween = this.game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
            tween.yoyo(true);

            var mainMenuText = this.game.add.bitmapText(this.game.width / 2, 650, "font", "Back to Main Menu", 28);
            mainMenuText.anchor.set(0.5);
            mainMenuText.inputEnabled = true;
            mainMenuText.events.onInputDown.add(this.startGame.bind(this, "MainMenu"));

            if (SpaceFlight.friendChallenge) {
                if (SpaceFlight.friendChallengeWin) {
                    this.game.add.bitmapText(this.game.width / 2, 480, "font", "You Win", 38).anchor.x = 0.5;
                } else {
                    this.game.add.bitmapText(this.game.width / 2, 480, "font", "You Lose", 38).anchor.x = 0.5;
                }
                this.game.add.bitmapText(this.game.width / 2, 550, "font", "Challenger Score: " + (SpaceFlight.friendScore).toString(), 38).anchor.x = 0.5;

                var challengeArray = {};
                challengeArray.oldScore = SpaceFlight.friendScore;
                challengeArray.uid = SpaceFlight.friendUID;

                platform_tools("ChallengeComplete", SpaceFlight.score, 0, gameID, challengeArray, false);

            } else if (SpaceFlight.ChallengingFriend) {
                this.game.add.bitmapText(this.game.width / 2, 550, "font", (SpaceFlight.ChallengingName).toString() + " challenged", 38).anchor.x = 0.5;

                var challengeArray = {};
                challengeArray.username = SpaceFlight.ChallengingName;
                challengeArray.useruid = SpaceFlight.friendUID;

                platform_tools("ChallengeFriend", SpaceFlight.score, 0, gameID, challengeArray, false);

            } else if (SpaceFlight.score >= game_score_weight) {
                platform_tools("GameOver", SpaceFlight.score, 0, gameID, null, true);
            } else {
                platform_tools("GameOver", SpaceFlight.score, 0, gameID, null, false);
            }
        } else if (game_mode === "seasonMode") {
            var virtualScore = SpaceFlight.score / game_score_weight * 100;
            platform_tools("GameOver", virtualScore, 0, gameID, null, false);
        }
    },
    startGame: function (state) {
        SpaceFlight.score = -1;
        SpaceFlight.friendChallenge = false;
        SpaceFlight.friendName = "";
        SpaceFlight.friendUID = "";
        SpaceFlight.friendScore = 0;
        SpaceFlight.friendChallengeWin = false;
        SpaceFlight.friendChallengeAlive = false;
        SpaceFlight.ChallengingFriend = false;
        SpaceFlight.ChallengingName = "";

        this.game.state.start(state);
    },
    close: function () {
        platform_tools("Close", SpaceFlight.score, 0, gameID, null, false);
    }
};

Collectible = function (game, lane) {
    var position = game.rnd.between(0, 1);
    this.mustPickUp = game.rnd.between(0, 1);

    if (lane === 0) {
        if (this.mustPickUp === 0) {
            Phaser.Sprite.call(this, game, SpaceFlight.spaceships[lane].positions[position], -20, "collectible1");
        } else {
            Phaser.Sprite.call(this, game, SpaceFlight.spaceships[lane].positions[position], -20, "collectible0");
        }
    } else {
        if (this.mustPickUp === 0) {
            Phaser.Sprite.call(this, game, SpaceFlight.spaceships[lane].positions[position], -20, "collectible0");
        } else {
            Phaser.Sprite.call(this, game, SpaceFlight.spaceships[lane].positions[position], -20, "collectible1");
        }
    }
    game.physics.enable(this, Phaser.Physics.ARCADE);
    if (this.key === "collectible0") {
        this.tint = SpaceFlight.imagesColors[1].tint;
    } else {
        this.tint = SpaceFlight.imagesColors[2].tint;
    }
    this.anchor.set(0.5);
    this.body.velocity.y = SpaceFlight.collectibleSpeed;
    this.missed = new Phaser.Signal();
};

Collectible.prototype = Object.create(Phaser.Sprite.prototype);
Collectible.prototype.constructor = Collectible;
Collectible.prototype.update = function () {
    if (this.y > game.height - this.height / 2 && this.mustPickUp) {
        this.missed.dispatch(this);
    }
    if (this.y > game.height + this.height / 2) {
        this.destroy();
    }
};

function onColorsInputDownSpaceFlight(sprite, pointer) {
    var canvas = game.canvas.getContext('2d');
    var imageData = canvas.getImageData(pointer.x, pointer.y, 1, 1).data;
    var color = rgbToHexSpaceFlight(imageData[0], imageData[1], imageData[2]);

    sprite.currentSprite.tint = color;
    SpaceFlight.imagesColors[sprite.imageIndex].tint = color;
};

function componentToHexSpaceFlight(c) {
    var hex = c.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
};

function rgbToHexSpaceFlight(r, g, b) {
    return "0x" + componentToHexSpaceFlight(r) + componentToHexSpaceFlight(g) + componentToHexSpaceFlight(b);
};

var game = null;
var platform_tools = null;
var assets_path = "";
var game_mode = "";
var gameID = 5;
var game_score_weight = 500;
var argsSavedGame = undefined;
var argsFriends = undefined;
var argsChallenges = undefined;

function start_spaceFlight(windowwidth, windowheight, container, assetsPath, args, gamemode, callback) {
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

    this.game.state.add('Init', SpaceFlight.Init);
    this.game.state.add('Preloader', SpaceFlight.Preloader);
    this.game.state.add('ChangeColors', SpaceFlight.ChangeColors);
    this.game.state.add('FriendsChallenges', SpaceFlight.FriendsChallenges);
    this.game.state.add('ChallengeFriend', SpaceFlight.ChallengeFriend);
    this.game.state.add('MainMenu', SpaceFlight.MainMenu);
    this.game.state.add("HowToPlay", SpaceFlight.HowToPlay);
    this.game.state.add('Game', SpaceFlight.Game);
    this.game.state.add("GameOver", SpaceFlight.GameOver);

    this.game.state.start('Init');
};

function destroy_spaceFlight() {
    game_mode = "destroy";
    this.game.state.start("GameOver");

    SpaceFlight.score = -1;
    SpaceFlight.friendChallenge = false;
    SpaceFlight.friendName = "";
    SpaceFlight.friendUID = "";
    SpaceFlight.friendScore = 0;
    SpaceFlight.friendChallengeWin = false;
    SpaceFlight.friendChallengeAlive = false;
    SpaceFlight.ChallengingFriend = false;
    SpaceFlight.ChallengingName = "";

    game = null;
    platform_tools = null;
    assets_path = "";
    game_mode = "";
    gameID = 5;
    game_score_weight = 500;
    argsSavedGame = undefined;
    argsFriends = undefined;
    argsChallenges = undefined;

    document.getElementById("spaceFlight").remove();
};
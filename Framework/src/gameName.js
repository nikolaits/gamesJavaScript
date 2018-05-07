var GameName = {
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

GameName.Init = function () { };
GameName.Init.prototype = {
    preload: function () {
        this.game.load.image("loading", assets_path + "assets/sprites/loading.png");
    },
    create: function () {
        this.game.state.start("Preloader");
    }
};

GameName.Preloader = function () { };
GameName.Preloader.prototype = {
    preload: function () {
        var loadingBar = this.add.sprite(this.game.width / 2, this.game.height / 2, "loading");
        loadingBar.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loadingBar);
        this.game.stage.backgroundColor = "#4488AA";
        this.game.canvas.id = "gameName";

        this.game.load.image("paused", assets_path + "assets/sprites/paused.png");
        this.game.load.image("close", assets_path + "assets/sprites/close.png");
        this.game.load.image("gear", assets_path + "assets/sprites/gear.png");
        this.game.load.image("check", assets_path + "assets/sprites/check.png");
        this.game.load.image("colors", assets_path + "assets/sprites/colors.png");
        this.game.load.image("ResetDefaultColors", assets_path + "assets/sprites/ResetDefaultColors.png");
        this.game.load.image("playbutton", assets_path + "assets/sprites/playbutton.png");
        this.game.load.bitmapFont("font", assets_path + "assets/fonts/font.png", assets_path + "assets/fonts/font.fnt");
        this.game.load.audio("loop", assets_path + "assets/sounds/loop.wav");

        Cookies.remove('GameNameSaveGame');

        var cookieImagesColors = Cookies.get('GameNameColors');
        if (cookieImagesColors) {
            GameName.imagesColors = JSON.parse(cookieImagesColors);
        } else {
            GameName.imagesColors.push({ image: "playbutton", tint: "0xffffff" });
        }
    },
    create: function () {
        if (game_mode === "seasonMode") {
            GameName.ChallengingFriend = true;
            this.game.state.start("Game");
        } else {
            this.game.state.start("MainMenu");
        }
    }
};

GameName.ChangeColors = function () {
    this.sprites = [];
};
GameName.ChangeColors.prototype = {
    create: function () {
        var that = this;
        GameName.imagesColors.forEach(function (e, index) {
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
            colors.events.onInputDown.add(onColorsInputDownGameName, this);
        });
        var changeColors = this.game.add.button(35, 35, "check", this.startGame);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);
        var resetColors = this.game.add.button(this.game.width / 2, this.game.height - 50, "ResetDefaultColors", this.ResetDefaultColors, this);
        resetColors.anchor.set(0.5);
    },
    startGame: function () {
        Cookies.set('GameNameColors', GameName.imagesColors);
        this.game.state.start("MainMenu");
    },
    ResetDefaultColors: function () {
        Cookies.remove('GameNameColors');
        this.sprites.forEach(function (e) {
            e.tint = 0xffffff;
        });
        GameName.imagesColors.forEach(function (e) {
            e.tint = 0xffffff;
        });
    }
};

GameName.FriendsChallenges = function () { };
GameName.FriendsChallenges.prototype = {
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
                        GameName.friendChallenge = true;
                        GameName.friendChallengeAlive = true;
                        GameName.friendName = this.playerName;
                        GameName.friendScore = this.playerScore;
                        GameName.friendUID = this.playerUID;
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

GameName.ChallengeFriend = function () { };
GameName.ChallengeFriend.prototype = {
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
                        GameName.ChallengingName = this.playerName;
                        GameName.ChallengingFriend = true;
                        GameName.friendUID = this.playerUID;
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

GameName.MainMenu = function () { };
GameName.MainMenu.prototype = {
    create: function () {
        this.game.add.bitmapText(this.game.width / 2, 70, "font", "GameName", 80).anchor.x = 0.5;
        var playButton = this.game.add.button(this.game.width / 2, this.game.height - 150, "playbutton", this.startGame);
        playButton.anchor.set(0.5);
        playButton.tint = GameName.imagesColors[0].tint;
        var tween = this.game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
        tween.yoyo(true);

        var changeColors = this.game.add.button(35, 35, "gear", this.startChangeColors);
        changeColors.anchor.set(0.5);
        changeColors.scale.set(0.3);

        var savedGameCookie = Cookies.get("GameNameSaveGame");
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
                GameName.score = savedGame.score - 1;
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

GameName.HowToPlay = function () { };
GameName.HowToPlay.prototype = {
    create: function () {
        this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, "font", "How-To play explanation", 36).anchor.x = 0.5;
        var playButton = this.game.add.button(this.game.width / 2, this.game.height - 150, "playbutton", this.startGame);
        playButton.anchor.set(0.5);
        playButton.tint = GameName.imagesColors[0].tint;
        var tween = this.game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
        tween.yoyo(true);
    },
    startGame: function () {
        this.game.state.start("Game");
    }
};

GameName.Game = function () {
    loop = null;
};
GameName.Game.prototype = {
    create: function () {
        this.loop = this.game.add.audio("loop");
        this.loop.loopFull(1);
        this.scoreText = this.game.add.bitmapText(this.game.width / 2, 50, "font", GameName.score.toString(), 80);
        this.scoreText.anchor.set(0.5);
        this.scoreText.inputEnabled = true;
        this.scoreText.events.onInputDown.add(this.addScore, this);

        if (GameName.friendChallenge) {
            //add this for "Map" challenge functionality;
            if(GameName.friendChallengeAlive){
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
            //add this for "Map" challenge functionality;
            this.scoreFriend = this.game.add.bitmapText(this.game.width / 2, 25, "font", "Challenger Score: " + (GameName.friendScore).toString(), 28);
            this.scoreFriend.anchor.set(0.5);
        }

        this.game.input.onDown.add(this.checkPauseButtons, this);
        this.pauseButton = this.game.add.button(this.game.width - 35, 40, "paused", function (e) {
            this.game.paused = true;
        });
        this.pauseButton.anchor.set(0.5);
        this.pauseButton.scale.set(0.15);
        this.pauseButton.tint = "0xff0000";
        if (GameName.ChallengingFriend || GameName.friendChallenge) {
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

        this.text = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, "font", "Click to start GameOver state", 36);
        this.text.anchor.set(0.5);
        this.text.inputEnabled = true;
        this.text.events.onInputDown.add(this.startGameOver, this);
    },
    update: function () {
        //add this for "Map" challenge functionality;
        if (GameName.friendChallengeAlive) {
            setTimeout(this.friendChallengeHandler, 1000, [this.game.canvas.getContext('2d').getImageData(0, 0, this.game.width, this.game.height)]);
        }//add this for "Map" challenge functionality;
        //add this for "Ghost" challenge functionality;
        if (GameName.friendChallengeAlive) {
            setTimeout(this.friendChallengeHandler, 300, [this.text.y, this.text]);
        }//add this for "Ghost" challenge functionality;
    },
    friendChallengeHandler: function (args) {
        //add this for "Map" challenge functionality;
        if ($("#gameMap")[0]) {
            var gameMap = $("#gameMap")[0].getContext('2d');
            var imageData = args[0];
            var newCanvas = $("<canvas>")
                .attr("width", imageData.width)
                .attr("height", imageData.height)[0];
            newCanvas.getContext("2d").putImageData(imageData, 0, 0);

            gameMap.drawImage(newCanvas, 0, 0);
        }//add this for "Map" challenge functionality;
        //add this for "Ghost" challenge functionality;
        args[1].y = args[0];//add this for "Ghost" challenge functionality;
    },
    paused: function () {
        if (!GameName.ChallengingFriend && !GameName.friendChallenge) {
            this.pauseImage.visible = true;
            this.resumeText.visible = true;
            this.saveGame.visible = true;
        }
    },
    resumed: function () {
        if (!GameName.ChallengingFriend && !GameName.friendChallenge) {
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

            saveArray.score = GameName.score;
            saveArray.livesRemaining = this.lives;
            saveArray.curLvl = this.level;

            platform_tools("SaveGame", GameName.score, 0, gameID, saveArray, false);
            Cookies.set('GameNameSaveGame', saveArray);
        }
    },
    addScore: function () {
        this.scoreChanger();
    },
    scoreChanger: function () {
        GameName.score += 1;
        this.scoreText.text = GameName.score.toString();

        platform_tools("LiveScore", GameName.score, 0, gameID, null, false);
        if (GameName.score > GameName.friendScore && GameName.friendChallengeAlive) {
            GameName.friendChallengeWin = true;
            GameName.friendChallengeAlive = false;
            $("#gameMap").remove();
        }
    },
    startGameOver: function () {
        this.loop.stop();
        this.game.state.start("GameOver");
    }
};

GameName.GameOver = function () { };
GameName.GameOver.prototype = {
    create: function () {
        if (game_mode === "casualMode") {
            var closeButton = this.game.add.button(35, 35, "close", this.close);
            closeButton.anchor.set(0.5);
            closeButton.scale.set(0.15);

            this.game.add.bitmapText(this.game.width / 2, 200, "font", "Your score", 90).anchor.x = 0.5;
            this.game.add.bitmapText(this.game.width / 2, 350, "font", GameName.score.toString(), 120).anchor.x = 0.5;
            var playButton = this.game.add.button(this.game.width / 2, this.game.height - 150, "playbutton", this.startGame.bind(this, "Game"));
            playButton.anchor.set(0.5);
            playButton.tint = GameName.imagesColors[0].tint;
            var tween = this.game.add.tween(playButton).to({ width: 220, height: 220 }, 1500, "Linear", true, 0, -1);
            tween.yoyo(true);

            var mainMenuText = this.game.add.bitmapText(this.game.width / 2, 650, "font", "Back to Main Menu", 28);
            mainMenuText.anchor.set(0.5);
            mainMenuText.inputEnabled = true;
            mainMenuText.events.onInputDown.add(this.startGame.bind(this, "MainMenu"));

            if (GameName.friendChallenge) {
                if (GameName.friendChallengeWin) {
                    this.game.add.bitmapText(this.game.width / 2, 480, "font", "You Win", 38).anchor.x = 0.5;
                } else {
                    this.game.add.bitmapText(this.game.width / 2, 480, "font", "You Lose", 38).anchor.x = 0.5;
                }
                this.game.add.bitmapText(this.game.width / 2, 550, "font", "Challenger Score: " + (GameName.friendScore).toString(), 38).anchor.x = 0.5;
                var challengeArray = {};
                challengeArray.oldScore = GameName.friendScore;
                challengeArray.uid = GameName.friendUID;
                platform_tools("ChallengeComplete", GameName.score, 0, gameID, challengeArray, false);
            } else if (GameName.ChallengingFriend) {
                this.game.add.bitmapText(this.game.width / 2, 550, "font", (GameName.ChallengingName).toString() + " challenged", 38).anchor.x = 0.5;
                var challengeArray = {};
                challengeArray.username = GameName.ChallengingName;
                challengeArray.useruid = GameName.friendUID;
                platform_tools("ChallengeFriend", GameName.score, 0, gameID, challengeArray, false);
            } else if (GameName.score >= game_score_weight) {
                platform_tools("GameOver", GameName.score, 0, gameID, null, true);
            } else {
                platform_tools("GameOver", GameName.score, 0, gameID, null, false);
            }
        } else if (game_mode === "seasonMode") {
            var virtualScore = GameName.score / game_score_weight * 100;
            platform_tools("GameOver", virtualScore, 0, gameID, null, false);
        }
    },
    startGame: function (state) {
        GameName.score = 0;
        GameName.friendChallenge = false;
        GameName.friendName = "";
        GameName.friendUID = "";
        GameName.friendScore = 0;
        GameName.friendChallengeWin = false;
        GameName.friendChallengeAlive = false;
        GameName.ChallengingFriend = false;
        GameName.ChallengingName = "";

        this.game.state.start(state);
    },
    close: function () {
        platform_tools("Close", GameName.score, 0, gameID, null, false);
    }
};
function onColorsInputDownGameName(sprite, pointer) {
    var canvas = game.canvas.getContext('2d');
    var imageData = canvas.getImageData(pointer.x, pointer.y, 1, 1).data;
    var color = rgbToHexGameName(imageData[0], imageData[1], imageData[2]);

    sprite.currentSprite.tint = color;
    GameName.imagesColors[sprite.imageIndex].tint = color;
};
function componentToHexGameName(c) {
    var hex = c.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
};
function rgbToHexGameName(r, g, b) {
    return "0x" + componentToHexGameName(r) + componentToHexGameName(g) + componentToHexGameName(b);
};

var game = null;
var platform_tools = null;
var assets_path = "";
var game_mode = "";
var gameID = 0;//set game ID;
var game_score_weight = 500;//set score weight;
var argsSavedGame = undefined;
var argsFriends = undefined;
var argsChallenges = undefined;

function start_gameName(windowwidth, windowheight, container, assetsPath, args, gamemode, callback) {
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
    this.game.state.add('Init', GameName.Init);
    this.game.state.add('Preloader', GameName.Preloader);
    this.game.state.add('ChangeColors', GameName.ChangeColors);
    this.game.state.add('FriendsChallenges', GameName.FriendsChallenges);
    this.game.state.add('ChallengeFriend', GameName.ChallengeFriend);
    this.game.state.add('MainMenu', GameName.MainMenu);
    this.game.state.add("HowToPlay", GameName.HowToPlay);
    this.game.state.add('Game', GameName.Game);
    this.game.state.add("GameOver", GameName.GameOver);

    this.game.state.start('Init');
};
function destroy_gameName() {
    game_mode = "destroy";
    this.game.state.start("GameOver");
    document.getElementById("GameName").remove();
};

start_gameName(640, 960, "", "", "", "casualMode", function (e) { console.log(e) });//remove this line before upload;
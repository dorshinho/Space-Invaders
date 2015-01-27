(function() {
    var Game = function(canvasId) {
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext('2d');
        var gameSize = {
            x: canvas.width,
            y: canvas.height
        };
        //console.log("hi")
        var self = this;
        this.bodies = createInvaders(this).concat(new Player(this, gameSize));
        var tick = function() {
            //Call update on the game
            self.update();
            //Call draw
            self.draw(screen, gameSize);
            //Run the tick 60x times a second
            requestAnimationFrame(tick);
        };
        //Call the tick
        tick();
    };
    Game.prototype = {
        update: function() {
            //console.log("hi")
            var bodies = this.bodies;
            var notCollidingWithAnything = function(b1) {
                return bodies.filter(function(b2) {
                    return colliding(b1, b2);
                }).length === 0;
            }
            this.bodies = this.bodies.filter(notCollidingWithAnything);
            for (var i = 0; i < this.bodies.length; i++) {
                this.bodies[i].update();
            };
        },
        draw: function(screen, gameSize) {
            screen.clearRect(0, 0, gameSize.x, gameSize.y);
            for (var i = 0; i < this.bodies.length; i++) {
                drawRect(screen, this.bodies[i]);
            };
        },
        addBody: function(body) {
            this.bodies.push(body);
        },
        invadersBelow: function(invader) {
            return this.bodies.filter(function(b) {
                return b instanceof Invader && b.center.y > invader.center.y && b.center.x - invader.center.x < invader.size.x;
            }).length > 0;
        }
    };
    var Player = function(game, gameSize) {
        this.game = game;
        this.size = {
            x: 15,
            y: 15
        };
        this.center = {
            x: gameSize.x / 2,
            y: gameSize.y - this.size.x
        };

        this.keyboader = new KeyBoarder();
    };
    Player.prototype = {
        update: function() {
            if (this.keyboader.isDown(this.keyboader.KEYS.LEFT)) {
                this.center.x -= 2;
            } else if (this.keyboader.isDown(this.keyboader.KEYS.RIGHT)) {
                this.center.x += 2;
            }
            if (this.keyboader.isDown(this.keyboader.KEYS.SPACE)) {
                var bullet = new Bullet({
                    x: this.center.x,
                    y: this.center.y - this.size.x / 2
                }, {
                    x: 0,
                    y: -6
                });
                this.game.addBody(bullet);
            }
        }
    };
    var Invader = function(game, center) {
        this.game = game;
        this.size = {
            x: 15,
            y: 15
        };
        this.center = center;
        this.patrolX = 0;
        this.speedX = 0.3;
    };
    Invader.prototype = {
        update: function() {
            if (this.patrolX < 0 || this.patrolX > 40) {
                this.speedX = -this.speedX;
            }
            this.center.x += this.speedX;
            this.patrolX += this.speedX;
            if (Math.random() > 0.995 && !this.game.invadersBelow(this)) {
                var bullet = new Bullet({
                    x: this.center.x,
                    y: this.center.y + this.size.x / 2
                }, {
                    x: Math.random() - 0.5,
                    y: 2
                });
                this.game.addBody(bullet);
            }
        }
    };
    var createInvaders = function(game) {
        var invaders = [];
        for (var i = 0; i < 24; i++) {
            var x = 30 + (i % 8) * 30;
            var y = 30 + (i % 3) * 30;
            invaders.push(new Invader(game, {
                x: x,
                y: y
            }));
        };
        return invaders;
    };

    var Bullet = function(center, velocity) {
        this.size = {
            x: 3,
            y: 3
        };
        this.center = center;
        this.velocity = velocity;
    };
    Bullet.prototype = {
        update: function() {
            this.center.x += this.velocity.x;
            this.center.y += this.velocity.y;
        }
    };
    var drawRect = function(screen, body) {
        screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y);
    };
    ///Keyboard event functions
    var KeyBoarder = function() {
        var keyState = {};
        window.onkeydown = function(e) {
            keyState[e.keyCode] = true;
        };
        window.onkeyup = function(e) {
            keyState[e.keyCode] = false;
        };
        this.isDown = function(keyCode) {
            return keyState[keyCode] === true;
        };
        this.KEYS = {
            LEFT: 37,
            RIGHT: 39,
            SPACE: 32
        };
    };
    // Takes body 1+2
    var colliding = function(b1, b2) {
        return !(b1 === b2 || b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 || b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 || b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 || b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
    };
    window.onload = function() {
        new Game('screen');
    };
})();

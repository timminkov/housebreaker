
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {

      this.cursors = this.input.keyboard.createCursorKeys();
      this.flashlightKey = this.input.keyboard.addKey(Phaser.Keyboard.F);
      this.flashlightKey.onDown.add(function() {
        if (this.flashlight === true) {
          this.flashlight = false;
        } else {
          this.flashlight = true;
        }
      }, this);
      this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Keyboard.W),
        down: this.input.keyboard.addKey(Phaser.Keyboard.S),
        left: this.input.keyboard.addKey(Phaser.Keyboard.A),
        right: this.input.keyboard.addKey(Phaser.Keyboard.D),
      };

      this.map = this.game.add.tilemap('map');
      this.map.addTilesetImage('tileset-standard', 'tileset');
      var backgroundLayer = this.map.createLayer('Background');
      backgroundLayer.resizeWorld();
      var roadLayer = this.map.createLayer('Road');
      roadLayer.resizeWorld();
      this.wallLayer = this.map.createLayer('Walls');
      this.map.setCollision(53, true, this.wallLayer);
      this.map.setCollision(52, true, this.wallLayer);
      this.map.setCollision(51, true, this.wallLayer);
      this.map.setCollision(41, true, this.wallLayer);
      this.map.setCollision(42, true, this.wallLayer);
      this.map.setCollision(43, true, this.wallLayer);
      this.map.setCollision(33, true, this.wallLayer);
      this.map.setCollision(32, true, this.wallLayer);

      this.surpriseLayer = this.map.createLayer('Surprise');
      this.map.setCollision(85, true, this.surpriseLayer);
      this.surpriseLayer.visible = false;

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.player = this.game.add.sprite(800, 2300, 'player');
      //this.player = this.game.add.sprite(275, 3050, 'player');
      this.player.animations.add('run');
      this.player.inputEnabled = true;
      this.player.anchor.setTo(0.5, 0.5);

      this.createPartyMembers();
      this.createCoins();

      this.LIGHT_RADIUS = 100;
      this.shadowTexture = this.game.add.bitmapData(1600, 3200);
      var lightSprite = this.game.add.image(0, 0, this.shadowTexture);
      lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

      this.game.physics.arcade.enable(this.player);
      this.player.body.collideWorldBounds = true;

      this.game.camera.follow(this.player);

      if (this.flashlightKey.isDown) {
        this.text.text = 'pressing f';
        if (this.flashlight === true) {
          this.flashlight = false;
        } else {
          this.flashlight = true;
        }
      }

      var style = { font: "90px Arial", fill: "#ff0044", align: "center" };
      this.text = this.add.text(150, 200, "", style);
      this.text.fixedToCamera = true;
    },

    totalCoins: 0,

    update: function() {
      this.game.physics.arcade.collide(this.player, this.wallLayer);
      if (this.game.physics.arcade.overlap(this.player, this.surpriseLayer)) {
        this.map.setCollision(85, false, this.surpriseLayer);
        this.gameOver();
      }

      //this.text.text = this.game.input.activePointer.worldX + ' ' + this.game.input.activePointer.worldY;
      this.player.body.velocity.y = 0;
      this.player.body.velocity.x = 0;

      if (!this.gameIsOver) {

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
          this.player.body.velocity.y = -150;
        }

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
          this.player.body.velocity.x = -150;
        }

        if (this.cursors.right.isDown || this.wasd.right.isDown) {
          this.player.body.velocity.x = 150;
        }

        if (this.cursors.down.isDown || this.wasd.down.isDown) {
          this.player.body.velocity.y = 150;
        }

      }

      if (this.player.body.velocity.y > 0 ||
            this.player.body.velocity.x > 0 ||
            this.player.body.velocity.x < 0 ||
            this.player.body.velocity.y < 0) {
        this.player.animations.play('run', 15, false);
      }

      if (this.checkOverlap(this.player, this.coin)) {
        this.text.text = "You got it!";
        this.gameIsOver = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 3, function() {
          this.game.state.start('win');
        }, this);
      }

      this.updateShadowTexture();

      this.player.angle = this.getAngleForSprite() + 90;
    },

    checkOverlap: function(spriteA, spriteB) {
      var boundsA = spriteA.getBounds();
      var boundsB = spriteB.getBounds();

      return Phaser.Rectangle.intersects(boundsA, boundsB);
    },

    gameOver: function() {
      this.gameIsOver = true;
      this.text.text = 'SURPRISE!';
      this.game.time.events.add(Phaser.Timer.SECOND * 3, this.gameOverState, this);
    },

    gameOverState: function() {
      this.game.state.start('gameover');
    },

    gameIsOver: false,

    render: function() {
      this.game.debug.spriteCoords(this.player, 32, 500);
    },

    createCoins: function() {
      this.coin = this.game.add.sprite(720, 1800, 'goldCoin');
    },

    createPartyMembers: function() {
      var sprite = this.game.add.sprite(1400, 1800, 'partyman');
      sprite.anchor.setTo(0.5, 0.5);
      sprite.angle = this.getAngleToDoor(sprite);

      var sprite = this.game.add.sprite(1150, 1900, 'partyman');
      sprite.anchor.setTo(0.5, 0.5);
      sprite.angle = this.getAngleToDoor(sprite);

      var sprite = this.game.add.sprite(1250, 2000, 'partyman');
      sprite.anchor.setTo(0.5, 0.5);
      sprite.angle = this.getAngleToDoor(sprite);

      var sprite = this.game.add.sprite(1300, 2150, 'partyman');
      sprite.anchor.setTo(0.5, 0.5);
      sprite.angle = this.getAngleToDoor(sprite);

      var sprite = this.game.add.sprite(1200, 2100, 'partyman');
      sprite.anchor.setTo(0.5, 0.5);
      sprite.angle = this.getAngleToDoor(sprite);

      var sprite = this.game.add.sprite(1100, 2200, 'partyman');
      sprite.anchor.setTo(0.5, 0.5);
      sprite.angle = this.getAngleToDoor(sprite);

      var sprite = this.game.add.sprite(1000, 1950, 'partyman');
      sprite.anchor.setTo(0.5, 0.5);
      sprite.angle = this.getAngleToDoor(sprite);
    },

    getAngleToDoor: function(sprite) {
      var dx = sprite.x - 896;
      var dy = sprite.y - 2250;

      return ((Math.atan2(dy, dx) * (180/Math.PI)) - 90);
    },

    getAngleForSprite: function() {
      var dx = this.game.input.activePointer.worldX - this.player.x;
      var dy = this.game.input.activePointer.worldY - this.player.y;

      return (Math.atan2(dy, dx) * (180/Math.PI));
    },

    flashlight: false,

    updateShadowTexture: function() {
      // Draw shadow
      this.shadowTexture.context.fillStyle = 'rgb(100, 100, 100)';
      this.shadowTexture.context.fillRect(0, 0, 1600, 3200);

      this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
      //left side
      this.shadowTexture.context.fillRect(240, 1104, 576, 1148);
      //right side
      this.shadowTexture.context.fillRect(816, 1104, 320, 512);
      //living room
      if (this.gameIsOver) {
        this.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
        this.shadowTexture.context.fillRect(816, 1616, 700, 636);
      } else {
        this.shadowTexture.context.fillRect(816, 1616, 700, 636);
      }


      if (this.flashlight) {
        // Draw flashlight
        this.shadowTexture.context.beginPath();
        this.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
        this.shadowTexture.context.strokeStyle = 'rgb(255, 255, 255)';
        this.shadowTexture.context.lineWidth = 50;
        //this.shadowTexture.context.moveTo(this.game.input.activePointer.x - 20, this.game.input.activePointer.y);
        //this.shadowTexture.context.lineTo(this.game.input.activePointer.x + 20, this.game.input.activePointer.y);
        //this.shadowTexture.context.lineTo(this.player.x + 20, this.player.y);
        //this.shadowTexture.context.lineTo(this.player.x - 20, this.player.y);
        this.shadowTexture.context.moveTo(this.player.x, this.player.y);
        this.shadowTexture.context.lineTo(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
        //this.shadowTexture.context.lineTo(this.player.x + 1000 * Math.cos(this.getAngleForSprite() / 100), this.player.y + 500 * Math.sin(this.getAngleForSprite() / 100));
        //this.shadowTexture.context.lineTo(this.player.x + 1000 * Math.cos(this.getAngleForSprite() / 100), this.player.y + 500 * Math.sin(this.getAngleForSprite() / 100));

        //this.shadowTexture.context.fill();
        this.shadowTexture.context.stroke();
      }

      // This just tells the engine it should update the texture cache
      this.shadowTexture.dirty = true;
    }
  };

  module.exports = Play;

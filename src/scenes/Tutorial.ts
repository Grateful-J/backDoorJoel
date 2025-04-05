import { Scene, GameObjects } from "phaser";

let platforms;
let player: Phaser.Physics.Arcade.Sprite;

let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let stars: Phaser.Physics.Arcade.Group;
let bombs: Phaser.Physics.Arcade.Group;
let gameOver = false;

function collectStar(player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite) {
  star.disableBody(true, true);
  score += 10;
  scoreText.setText(`Score: ${score}`);

  // Check if all stars are collected
  if (stars.countActive(true) === 0) {
    console.log("All stars collected, creating new batch and bombs");

    //  A new batch of stars to collect
    stars.children.iterate((child: any) => {
      child.enableBody(true, child.x, 0, true, true);
    });

    // Create a bomb on the opposite side of the player
    let xPos = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    let bomb = bombs.create(xPos, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
}

function hitBomb(player: Phaser.Physics.Arcade.Sprite, bomb: Phaser.Physics.Arcade.Sprite) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.setVelocity(0, 0);
  bomb.setTint(0x00ff00);
  bomb.setVelocityY(200);
  player.anims.play("turn");
  gameOver = true;
}

let score = 0;
let scoreText: Phaser.GameObjects.Text;

export class Tutorial extends Scene {
  title: GameObjects.Text;

  constructor() {
    super("Tutorial");
  }

  preload(): void {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create(): void {
    this.add.image(400, 300, "sky");

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, "ground").setScale(2).refreshBody();

    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    player = this.physics.add.sprite(100, 100, "dude");
    player.setBounce(0.5);
    player.setCollideWorldBounds(true);
    //player.body.setAllowGravity(true);
    // player.setGravityY(300);

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, platforms);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNames("dude", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNames("dude", {
        start: 4,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    // Create stars group with proper configuration
    stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: {
        x: 12,
        y: 0,
        stepX: 70,
      },
    });

    // Set bounce for each star
    stars.children.iterate((child: any) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Create bombs group before setting up collisions
    bombs = this.physics.add.group();

    // Set up all collisions
    this.physics.add.collider(platforms, stars);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(platforms, bombs);

    scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: 32,
      fill: "#fff",
    });

    // Add debug text to show star count
    this.add.text(16, 50, "Stars: 12", {
      fontSize: 32,
      color: "#fff",
    });
  }

  update(): void {
    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }
}

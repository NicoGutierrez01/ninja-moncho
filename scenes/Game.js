// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {}

  preload() {
    //cargar assets

    //import Cielo
    this.load.image("cielo", "../public/assets/Cielo.webp");

    //import plataforma
    this.load.image("plataforma", "../public/assets/platform.png")

    //import personaje
    this.load.image("personaje", "../public/assets/Ninja.png");

    //import recoletables
    this.load.image("triangulo", "../public/assets/triangulo.png");

    this.load.image("cuadrado", "../public/assets/cuadrado.png");

    this.load.image("rombo", "../public/assets/rombo.png");

  }

  create() {
    //crear elementos
    
    this.cielo = this.add.image(400, 300, "cielo");
    this.cielo.setScale(2);

    //crear grupo plataforma
    this.plataformas = this.physics.add.staticGroup();
    //al grupo de plataforma agregar una plataforma
    this.plataformas.create(400, 568, "plataforma").setScale(2).refreshBody();
    //agregamos otra plataforma en otro lugar 
    this.plataformas.create(200, 200, "plataforma")

    //crear personaje
    this.personaje = this.physics.add.sprite(400, 300, "personaje");
    this.personaje.setScale(0.1);
    this.personaje.setCollideWorldBounds(true);

    //agregar colision entre personaje y plataforma
    this.physics.add.collider(this.personaje, this.plataformas);

    //crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();

    //crear grupo recolectables
    this.recolectables = this.physics.add.group();
    this.physics.add.collider(this.personaje, this.recolectables);
    
    //evento 1 segundo
    this.time.addEvent(
      {delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
  }

  onSecond(){
    //crear recoletable
    const tipos = ["triangulo", "cuadrado", "rombo"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo 
    );
    recolectable.setVelocityY(0,100);
  }

  update() {
    //movimiento personaje
    if (this.cursor.left.isDown){
      this.personaje.setVelocityX(-160);
    } else if (this.cursor.right.isDown) {
      this.personaje.setVelocityX(160);
    } else {
      this.personaje.setVelocityX(0);
    }
    if (this.cursor.up.isDown && this.personaje.body.touching.down) { 
      this.personaje.setVelocityY(-330);
    }
  }
}

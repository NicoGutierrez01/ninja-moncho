// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {
    this.gameOver = false;
    this.timer = 50;
    this.score = 0;
    this.shapes = {
      "balon": {points: 10, count: 0},
      "bota": {points: 20, count: 0},
      "mundial": {points: 30, count: 0},
      "bicho": {points: -15, count: 0},
    }
  }

  preload() {
    //cargar assets

    //import Cielo
    this.load.image("cielo", "../public/assets/Cielo.png");

    //import plataforma
    this.load.image("plataforma", "../public/assets/platform.png")

    //import personaje
    this.load.image("personaje", "../public/assets/messi.png");

    //import recoletables
    this.load.image("balon", "../public/assets/balon.png");

    this.load.image("bota", "../public/assets/bota.png");

    this.load.image("mundial", "../public/assets/mundial.png");

    this.load.image("bicho", "../public/assets/bicho.png");

  }

  create() {
    //crear elementos
    
    this.cielo = this.add.image(400, 300, "cielo");
    this.cielo.setScale(0.87);

    //crear grupo plataforma
    this.plataformas = this.physics.add.staticGroup();
    //al grupo de plataforma agregar una plataforma
    this.plataformas.create(400, 568, "plataforma").setScale(2).refreshBody();
    //agregamos otra plataforma en otro lugar 
    this.plataformas.create(80, 350, "plataforma")
    this.plataformas.create(-50, 200, "plataforma")
    this.plataformas.create(850, 100, "plataforma")
    this.plataformas.create(700, 300, "plataforma")


    //crear personaje
    this.personaje = this.physics.add.sprite(400, 300, "personaje");
    this.personaje.setScale(0.05);
    this.personaje.setCollideWorldBounds(true);

    //agregar colision entre personaje y plataforma
    this.physics.add.collider(this.personaje, this.plataformas);

    //crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();

    //una tecla a la vez

    //this.w = input.keyboard.addKey(Phaser.Input.Keyboard.Keycodes.W)
    //this.a = input.keyboard.addKey(Phaser.Input.Keyboard.Keycodes.A)
    //this.s = input.keyboard.addKey(Phaser.Input.Keyboard.Keycodes.S)
    //this.d = input.keyboard.addKey(Phaser.Input.Keyboard.Keycodes.D)

    //crear grupo recolectables
    this.recolectables = this.physics.add.group();
    this.physics.add.collider(this.personaje, this.recolectables, this.pj, null, this);
    
    //agregar colision entre recolectores y plataforma
    this.physics.add.overlap(this.plataformas, this.recolectables, this.floor, null, this);
    
    //evento 1 segundo
    this.time.addEvent(
      {delay: 500,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });

    // tecla r

    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);


    //timer cada 1 seg
    
    this.time.addEvent({
      delay: 1000,
      callback: this.handlerTimer,
      callbackScope: this,
      loop: true,
    });
    
   // agregar el score arriba
    
   this.scoreText = this.add.text(10, 50, `Puntaje: ${this.score} / BA: ${this.shapes["balon"].count} / BO: ${this.shapes["bota"].count} / MU: ${this.shapes["mundial"].count}`)
    
   //agregar texto de timer en la esquina superior
    
   this.timerText = this.add.text(10,10, `Tiempo Restante: ${this.timer}`,{
    
     fontSize: "32px",
     fill: "#000000",
    })
  }

  pj(personaje, recolectables){
    const nombreFig = recolectables.texture.key;
    const puntosFig = this.shapes[nombreFig].points;
    this.score += puntosFig;
    this.shapes [nombreFig].count += 1;
    console.table(this.shapes);
    console.log("score", this.score);
    recolectables.destroy();

    this.scoreText.setText(
      `Puntaje: ${this.score} / BA: ${this.shapes["balon"].count} / BO: ${this.shapes["bota"].count} / MU: ${this.shapes["mundial"].count} /BI: ${this.shapes["bicho"].count}`
    );

    this.checkWin();
    
  }

  checkWin(){
    const cumplePuntos = this.score >= 100;
    const cumpleFiguras = 
    this.shapes["balon"].count >= 2 &&
    this.shapes["bota"].count >= 2 &&
    this.shapes["mundial"].count >= 2 &&
    this.shapes["bicho"].count >= 2;

    if (cumplePuntos && cumpleFiguras) {
      console.log("Ganaste");
      this.scene.start("end",{
        score: this.score,
        gameOver: this.gameOver,
      })
    }
  }

  floor(plataformas, recolectables){
    recolectables.disableBody(true,true)
  }

  onSecond() {
    //crear recolectables

    const tipos = ["balon", "bota", "mundial", "bicho"];
    const tipo = Phaser.Math.RND.pick(tipos);

    let recolectable = this.recolectables.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo
    );

    // Ajustar la escala del recolectable
    recolectable.setScale(0.18);

    recolectable.setVelocity(0, 100);
    this.physics.add.collider(recolectable, this.recolectables)
  }

  handlerTimer() {
    this.timer -= 1;
    this.timerText.setText(`Tiempo Restante: ${this.timer}`);
    if (this.timer === 0){
      this.gameOver = true;
      this.scene.start("end",{
        score: this.score,
        gameOver: this.gameOver,
      })
    }
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

    this.physics.overlap(this.personaje, this.recolectables, this.collectRecolectable, null, this);
    
  }
}

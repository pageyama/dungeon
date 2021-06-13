import p5 from 'p5';
import { Player } from './player';
import { Dungeon } from './dungeon/index'
import { DungeonMapGenerator, choiceRandomFloor } from './dungeon/map';
import { Bullet } from './bullet';

export class Game {

  public static P5: p5;

  public static screen = {
    x: 0,
    y: 0,
    width : 960,
    height : 640,
  };

  private player: Player;
  private dungeon: Dungeon;
  private bullets: Bullet[];

  public setup(p: p5) {
    Game.P5 = p;

    const mapGenerator = new DungeonMapGenerator({
      col : 30,
      row : 20,
      minRoomCol : 6,
      minRoomRow : 4,
      roomPadding : 2,
      maxArea : 6,
    });

    const map = mapGenerator.generate();

    const tileSize = 32;

    this.dungeon = new Dungeon(map, tileSize);

    const [col, row] = choiceRandomFloor(map.rooms);
    this.player = new Player(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 16, 4);

    this.bullets = [];

    p.createCanvas(Game.screen.width, Game.screen.height);
  }

  public draw(p: p5) {
    p.background(100);
    this.dungeon.draw(p);
    this.player.draw(p);

    //draw aiming line
    p.push();
    const v = p.createVector(p.mouseX - this.player.x, p.mouseY - this.player.y).setMag(32);
    p.strokeWeight(4);
    p.stroke(255, 0, 0);
    p.line(this.player.x, this.player.y,  this.player.x + v.x, this.player.y + v.y);
    p.pop();

    this.bullets.forEach(b => {
      b.draw(p);
    });
  }

  public update(p: p5) {
    this.player.update(p);

    this.bullets.forEach(b => {
      b.update(p);
    });

    this.player.checkCollisionWithWall(this.dungeon);

    this.bullets.forEach(b => {
      b.isAlive = !this.dungeon.isWall(b.x, b.y);
    });

    this.bullets = this.bullets.filter(b => b.isAlive);
  }

  public keyPressed(keyCode: number) {
    this.player.keyPressed(keyCode);
  }

  public keyReleased(keyCode: number) {
    this.player.keyReleased(keyCode);
  }

  public mousePressed() {
    const mouseX = Game.P5.mouseX;
    const mouseY = Game.P5.mouseY;

    const angle = Game.P5.createVector(mouseX - this.player.x, mouseY - this.player.y).heading();
    this.bullets.push(new Bullet(this.player.x, this.player.y, angle));
  }
}

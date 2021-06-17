import p5 from 'p5';
import { Dungeon } from './dungeon'
import { DungeonMapGenerator } from './dungeon/map';
import { Gun } from './gun';
import { Player } from './player';
import {Enemy} from './enemy';
import { EnemyManager } from './enemy/manager';
import {SqureCollider} from './collider/squre';

export class Game {

  public static P5: p5;

  public static screen = {
    x: 0,
    y: 0,
    width : 960,
    height : 640,
  };

  private dungeon: Dungeon;
  private gun : Gun;
  private player: Player;
  private enemyManager: EnemyManager;

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

    const dungeonMap = mapGenerator.generate();

    const tileSize = 32;

    this.dungeon = new Dungeon(dungeonMap, tileSize);

    this.gun = new Gun();

    const {col, row} = dungeonMap.choiceRandomFloor();
    this.player = new Player(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 16, 4);

    this.enemyManager = new EnemyManager(5);

    for(let i = 0; i < 3; i++) {
      this.enemyManager.spawn(this.player.x, this.player.y, this.dungeon);
    }

    p.createCanvas(Game.screen.width, Game.screen.height);
  }

  public draw(p: p5) {
   p.background(100);
    this.dungeon.draw(p);
    this.player.draw(p);
    this.gun.draw(p);
    this.enemyManager.draw(p);
  }

  public update(p: p5) {
    this.player.update(p);
    this.gun.update(p);
    this.enemyManager.update(p);

    this.player.checkCollisionWithWall(this.dungeon);
    this.enemyManager.checkCollisionWithWall(this.dungeon);
    this.gun.checkCollisionWithWall(this.dungeon);
    this.gun.checkCollisionWithSqure(this.enemyManager.enemies, (s: SqureCollider) => {
      (s as Enemy).isAlive = false;
      this.enemyManager.spawn(this.player.x, this.player.y, this.dungeon);
    });

    this.gun.filterAlive();
    this.enemyManager.filterAlive();
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
    this.gun.shoot(this.player.x, this.player.y, mouseX, mouseY);
  }
}

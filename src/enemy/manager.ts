import p5 from 'p5';
import { Game } from '../game';
import { Enemy } from './index';
import { Dungeon } from '../dungeon';

export class EnemyManager {

  public enemies: Enemy[];
  private capacity: number;

  public constructor(capacity: number) {
    this.enemies = [];
    this.capacity = capacity;
  }

  public update(p: p5) {
    this.enemies.forEach(e => e.update(p));
  }

  public draw(p: p5) {
    this.enemies.forEach(e => e.draw(p));
  }

  public spawn(playerX: number, playerY: number, dungeon: Dungeon) {
    if(this.enemies.length > this.capacity) {
      return;
    }

    const map = dungeon.map;
    const tileSize = dungeon.tileSize;

    const roomID = map.findRoomIDByPosition(playerX, playerY, tileSize);
    const {col, row} = map.choiceRandomFloor([roomID]);

    const pos = Game.P5.createVector(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2);
    const vel = Game.P5.createVector(0, 0);
    const enemy = new Enemy(pos, vel, 16);
    this.enemies.push(enemy);
  }

  public checkCollisionWithWall(dungeon: Dungeon) {
    this.enemies.forEach(e => {
      e.checkCollisionWithWall(dungeon);
    });
  }

  public filterAlive() {
    this.enemies = this.enemies.filter(e => e.isAlive);
  }

}

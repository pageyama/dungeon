import p5 from 'p5';
import { Game } from '../game';
import { Enemy } from './index';
import { DungeonMap } from '../dungeon/map';
import { sample } from '../random';

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

  public spawn(col: number, row: number, tileSize: number) {
    if(this.enemies.length > this.capacity) {
      return;
    }

    const pos = Game.P5.createVector(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2);
    const vel = Game.P5.createVector(0, 0);
    const enemy = new Enemy(pos, vel, 16);
    this.enemies.push(enemy);
  }

  public checkCollisionWithWall(map: DungeonMap, tileSize: number) {
    this.enemies.forEach(e => {
      e.checkCollisionWithWall(map, tileSize);
    });
  }

  public filterAlive() {
    this.enemies = this.enemies.filter(e => e.isAlive);
  }

  public onEnemyDies(enemy: Enemy, map: DungeonMap, tileSize: number) {
    const areaIDs = map.areaIDs;
    const enemyAreaID = map.findAreaIDByPosition(enemy.x, enemy.y, tileSize);
    const spawnableAreaIDs = areaIDs.filter(id => id != enemyAreaID)
    const areaID = sample(spawnableAreaIDs)
    const {col, row} = map.choiceRandomFloor(areaID);

    this.spawn(col, row, tileSize);
  }
}

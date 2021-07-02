import p5 from 'p5';
import { Game } from '../game';
import { Bullet } from './bullet';
import { DungeonMap } from '../dungeon/map';
import { SqureCollider } from '../collider/squre';

export class Gun {

  private bullets: Bullet[];

  public constructor() {
    this.bullets = [];
  }

  public update(p: p5) {
    this.bullets.forEach(b => b.update(p));
  }

  public draw(p: p5) {
    this.bullets.forEach(b => b.draw(p));
  }

  public checkCollisionWithWall(map: DungeonMap, tileSize: number) {
    this.bullets.forEach(b => {
      b.isAlive = !map.isWall(b.x, b.y, tileSize);
    });
  }

  public checkCollisionWithSqure(squres: SqureCollider[], cb: (s: SqureCollider)=>void) {
    for(let b of this.bullets) {
      for(let s of squres) {
        if(!b.isAlive) {
          break;
        }

        if(s.isCollidedWithPoint(b.x, b.y)) {
          cb(s);
          b.isAlive = false;
        }
      }
    }
  }

  public filterAlive() {
    this.bullets = this.bullets.filter(b => b.isAlive);
  }

  public shoot(playerX: number, playerY: number, mouseX: number, mouseY: number) {
    const angle = Game.P5.createVector(mouseX - playerX, mouseY - playerY).heading();
    this.bullets.push(new Bullet(playerX, playerY, angle));
  }
}

import p5 from 'p5';
import { Actor } from '../actor';
import { DungeonMap } from '../dungeon/map';

export class SqureCollider extends Actor{

  protected size: number;
  protected sizeHalf: number;

  public constructor(pos: p5.Vector, vel: p5.Vector, size: number) {
    super(pos, vel);

    this.size = size;
    this.sizeHalf = size / 2;
  }

  public checkCollisionWithWall(map: DungeonMap, tileSize: number) : [boolean, boolean] {

    let r : [boolean, boolean] = [false, false];

    if(this.vel.x != 0) {
      const y = this.pos.y - this.vel.y;

      if(this.vel.x < 0) {
        const topLeft = map.isWall(this.left, y - this.sizeHalf, tileSize);
        const bottomLeft = map.isWall(this.left, y + this.sizeHalf, tileSize);

        if(topLeft || bottomLeft) {
          this.pos.x += tileSize - this.left % tileSize;
          r[0] = true;
        }

      } else if(this.vel.x > 0) {
        const topRight = map.isWall(this.right, y - this.sizeHalf, tileSize);
        const bottomRight = map.isWall(this.right, y + this.sizeHalf, tileSize);

        if(topRight || bottomRight) {
          this.pos.x -= this.right % tileSize + 1;
          r[0] = true;
        }
      }

    }

    if(this.vel.y != 0) {
      const x = this.pos.x - this.vel.x;

      if(this.vel.y < 0) {
        const topLeft = map.isWall(x - this.sizeHalf, this.top, tileSize);
        const topRight = map.isWall(x + this.sizeHalf, this.top, tileSize);

        if(topLeft || topRight) {
          this.pos.y += tileSize - this.top % tileSize;
          r[1] = true;
        }

      } else if(this.vel.y > 0) {
        const bottomLeft = map.isWall(x - this.sizeHalf, this.bottom, tileSize);
        const bottomRight = map.isWall(x + this.sizeHalf, this.bottom, tileSize);

        if(bottomLeft || bottomRight) {
          this.pos.y -= this.bottom % tileSize + 1;
          r[1] = true;
        }
      }

    }

    return r;
  }

  public isCollidedWithPoint(x: number, y: number): boolean {
    return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom;
  }

  public get top(): number {
    return this.pos.y - this.sizeHalf;
  }

  public get bottom(): number {
    return this.pos.y + this.sizeHalf;
  }

  public get left(): number {
    return this.pos.x - this.sizeHalf;
  }

  public get right(): number {
    return this.pos.x + this.sizeHalf;
  }
}

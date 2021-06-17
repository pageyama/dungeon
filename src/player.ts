import p5 from 'p5';
import { Game } from './game';
import { SqureCollider } from './collider/squre';

export class Player extends SqureCollider {

  private directions: Map<string, p5.Vector>;

  public constructor(x: number, y: number, size: number, speed: number) {

    const pos = Game.P5.createVector(x, y);
    const directions = newDirectionMap(speed);
    const vel = directions['IDLE'];

    super(pos, vel, size);
    this.directions = directions;
  }

  public draw(p: p5) {
    p.push();
    p.noStroke();
    p.translate(this.pos.x, this.pos.y);
    p.rectMode(p.CENTER);
    p.fill('blue');
    p.rect(0, 0, this.size, this.size);
    p.pop();

    //draw aiming line
    p.push();
    const v = p.createVector(p.mouseX - this.x, p.mouseY - this.y).setMag(16);
    p.strokeWeight(4);
    p.stroke(0, 200, 0);
    p.line(this.x, this.y,  this.x + v.x, this.y + v.y);
    p.pop();
  }

  public keyPressed(keyCode: number) {
    if(DIRECTION_KEYS.includes(keyCode)) {
      let x = this.vel.x;
      let y = this.vel.y;

      switch(keyCode) {
        case 87:
          //w
          y = -1;
          break;
        case 83:
          //s
          y = 1;
          break;
        case 65:
          //a
          x = -1;
          break;
        case 68:
          //d
          x = 1;
          break;
      }

      this.vel = this.selectDirection(x, y);
    }
  }

  public keyReleased(keyCode: number) {
    if(DIRECTION_KEYS.includes(keyCode)) {
      let x = this.vel.x;
      let y = this.vel.y;

      if(keyCode == 87 || keyCode == 83) {

        if(Game.P5.keyIsDown(83)) {
          y = 1;
        } else if(Game.P5.keyIsDown(87)){
          y = -1;
        } else {
          y = 0;
        }

      } else if(keyCode == 65 || keyCode == 68) {

        if(Game.P5.keyIsDown(68)) {
          x = 1;
        } else if(Game.P5.keyIsDown(65)){
          x = -1;
        } else {
          x = 0;
        }

      }

      this.vel = this.selectDirection(x, y);
    }

  }

  public selectDirection(x: number, y: number) {
    if(y < 0) {
      if(x == 0) {
        return this.directions['UP'];
      } else if(x < 0) {
        return this.directions['UP_LEFT'];
      } else if(x > 0) {
        return this.directions['UP_RIGHT'];
      }
    } else if (y > 0) {
      if(x == 0) {
        return this.directions['DOWN'];
      } else if(x < 0) {
        return this.directions['DOWN_LEFT'];
      } else if(x > 0) {
        return this.directions['DOWN_RIGHT'];
      }
    } else {
      if(x == 0) {
        return this.directions['IDLE'];
      } else if(x < 0) {
        return this.directions['LEFT'];
      } else if(x > 0) {
        return this.directions['RIGHT'];
      }
    }
  }
}

const DIRECTION_KEYS = [87, 83, 65, 68];

const newDirectionMap = (speed: number): Map<string, p5.Vector> => {
    const directions = new Map<string, p5.Vector>();
    directions['IDLE'] = Game.P5.createVector(0, 0);

    directions['UP'] = Game.P5.createVector(0, -speed);
    directions['DOWN'] = Game.P5.createVector(0, speed);
    directions['LEFT'] = Game.P5.createVector(-speed, 0);
    directions['RIGHT'] = Game.P5.createVector(speed, 0);

    directions['UP_LEFT'] = Game.P5.createVector(-1, -1).setMag(speed);
    directions['UP_RIGHT'] = Game.P5.createVector(1, -1).setMag(speed);
    directions['DOWN_LEFT'] = Game.P5.createVector(-1, 1).setMag(speed);
    directions['DOWN_RIGHT'] = Game.P5.createVector(1, 1).setMag(speed);

    return directions;
}

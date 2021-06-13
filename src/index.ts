import p5 from 'p5';
import { Game } from './game';

const game = new Game();

export const P5 = new p5((p: p5) => {

  p.setup = () => {
    game.setup(p);
  };

  p.draw = () => {
    game.draw(p);
    game.update(p);
  };

  p.keyPressed = () => {
    game.keyPressed(p.keyCode);
  };

  p.keyReleased = () => {
    game.keyReleased(p.keyCode);
  };

  p.mousePressed = () => {
    game.mousePressed();
  };

});


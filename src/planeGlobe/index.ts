import PointEarth from './pointEarth';
import './index.css';

window.addEventListener('DOMContentLoaded', () => {
  const earth = new PointEarth('renderCanvas');
  earth.createScene();
  earth.doRender();
});

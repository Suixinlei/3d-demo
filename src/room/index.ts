import App from "./app";
import './reactSetup.jsx';
import './index.css';

window.addEventListener('DOMContentLoaded', () => {
  const app = new App('renderCanvas');

  app.createScene();
  app.doRender();

  app.createCabinets();

  (<any>window).createCpuHotMap = app.createCpuHotMap;
  (<any>window).closeCpuHotMap = app.closeCpuHotMap;
});

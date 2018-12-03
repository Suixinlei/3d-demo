import App from "./app";
import Earth from './earth';
import './index.css';

window.addEventListener('DOMContentLoaded', () => {
    // let app = new App('renderCanvas');

    // app.createScene();
    // app.createAssetsManager();
    // app.doRender();
    const earth = new Earth('renderCanvas');
    earth.createScene();
    earth.doRender();
});

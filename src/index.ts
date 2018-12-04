import App from "./app";
import Earth from './earth';
import './index.css';

window.addEventListener('DOMContentLoaded', () => {

    const earth = new Earth('renderCanvas');
    earth.createScene();
    earth.doRender();

    window.destory = () => {
        earth.destory();
        let app = new App('renderCanvas');

        app.createScene();
        app.createAssetsManager();
        app.doRender();
    };
});

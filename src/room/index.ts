import App from "./app";
import './reactSetup';
import './index.css';

window.addEventListener('DOMContentLoaded', () => {
    const app = new App('renderCanvas');

    app.createScene();
    app.createAssetsManager();
    app.doRender();
});

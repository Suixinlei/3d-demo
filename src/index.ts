import App from "./app";
import './index.css';

window.addEventListener('DOMContentLoaded', () => {
    let app = new App('renderCanvas');

    app.createScene();
    app.createAssetsManager();
    app.doRender();
});

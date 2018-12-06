import App from "./app";
import './reactSetup.jsx';
import './index.css';

window.addEventListener('DOMContentLoaded', () => {
    const app = new App('renderCanvas');

    app.createScene();
    app.createAssetsManager();
    app.doRender();

    app.createCabinets();

    window.createCpuHotMap = app.createCpuHotMap;
    window.closeCpuHotMap = app.closeCpuHotMap;
});

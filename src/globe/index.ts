import Earth from './earth';
import './index.css';

window.addEventListener('DOMContentLoaded', () => {
    const earth = new Earth('renderCanvas');
    earth.createScene();
    earth.doRender();
});

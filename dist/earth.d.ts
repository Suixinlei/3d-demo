declare class Earth {
    private _canvas;
    private _engine;
    private _scene;
    private _camera;
    private _light;
    private earth;
    constructor(canvasElement: string);
    createScene(): void;
    doRender(): void;
}
export default Earth;

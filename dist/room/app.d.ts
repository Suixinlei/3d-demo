declare class App {
    private _canvas;
    private _engine;
    private _scene;
    private _camera;
    private _globalCamera;
    private _light;
    private _assetsManager;
    constructor(canvasElement: string);
    createScene(): void;
    createAssetsManager(): void;
    doRender(): void;
}
export default App;

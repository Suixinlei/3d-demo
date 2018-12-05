declare class App {
    private _idcName;
    private _canvas;
    private _engine;
    private _scene;
    private _camera;
    private _light;
    private _assetsManager;
    private exitStatus;
    constructor(canvasElement: string);
    createScene(): void;
    createAssetsManager(): void;
    doRender(): void;
}
export default App;

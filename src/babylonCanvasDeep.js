global_canvasRef = document.getElementById('renderCanvas');
global_engineRef = new BABYLON.Engine(global_canvasRef, true, { deterministicLockstep: true, lockstepMaxSteps: 4});
global_sceneRef = new BABYLON.Scene(global_engineRef);
global_sceneRef.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(envTex_environmentTex, global_sceneRef);
global_sceneRef.clearColor = new BABYLON.Color3.FromHexString('#' + global_ambientSkyLightHex);

let OnUpdateCanvasResolution = function()
{
    global_screenWidth = global_canvasRef.width;
    global_screenHeight = global_canvasRef.height;
}

let SetMousePos = function(_X, _Y)
{
    global_mouseX = _X;
    global_mouseY = _Y;
}

gameManagerDeep.InitGame();
audioPlayer.InitAudio();
OnUpdateCanvasResolution();

global_engineRef.runRenderLoop(function () {
        global_sceneRef.render();

     if(debug_updateFPSMeter)
     {
         try{
             UpdateFPSMeter(global_engineRef.getFps().toFixed());
         }
         catch(e)
         {
             console.log("failed to update fps meter!");
         }
     }
});

window.addEventListener("resize", function () {
        global_engineRef.resize();
        OnUpdateCanvasResolution();
});



document.body.addEventListener("mousemove", (event) => {
    SetMousePos(event.x, event.y);
});

document.body.addEventListener("onmousedown", (event) => {
    SetMousePos(event.x, event.y);
});

function cameraManager()
{
    let cameraPosTarget;
    let isTopDown = false;
    var cameraRotTarget = BABYLON.Quaternion.Identity();
    var intermTest = BABYLON.Quaternion.Identity();
    //var tempQuat = BABYLON.Quaternion.Identity();
    //let tempDummy;

    let parallaxTargetX = 0;
    let parallaxTargetY = 0;

    let isTransitioning = false;

    let camPosLerpFactor = 0.04;
    let camRotLerpFactor = 0.02;//set later!
    let timeoutRef;
    let cameraLookAroundLerper = false;

    function SetCameraTarget(_dummyRef, _isTopDown, _ignoreLerp)
    {
        isTopDown = _isTopDown;

        camRotLerpFactor = isTopDown?0.2:0.02;   //slower rotation lerp when exiting

        cameraPosTarget = _dummyRef.position;
        //_dummyRef.rotation = new BABYLON.Vector3(0, 0, 0)
        //_dummyRef.rotationQuaternion = null;
        //camHolder.rotationQuaternion = null;
        cameraRotTarget = _dummyRef.rotationQuaternion.toEulerAngles();

        if(_ignoreLerp === true)
        {
            camHolder.position = cameraPosTarget;
            camHolder.rotation = cameraRotTarget;
        }


        //add and remove mouse control

        gameCamera.detachControl(global_canvasRef, true);

        clearTimeout(timeoutRef);
        cameraLookAroundLerper = true;
        timeoutRef = setTimeout(() => {
            cameraLookAroundLerper = false;
            gameCamera.rotation = new BABYLON.Vector3.Zero();
            if(!isTopDown)
            {
                gameCamera.attachControl(global_canvasRef, true);
            }
        }, 2000);




    //    camHolder.rotation = _dummyRef.rotationQuaternion.toEulerAngles();
    //    intermTest.copyFrom(_dummyRef.rotationQuaternion);
        //cameraRotTarget = intermTest;
    }



    let gameCamera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2.3, -20), global_sceneRef);

    var camHolder = BABYLON.MeshBuilder.CreateSphere("Cam Holder", {}, global_sceneRef);
    var camParallax = BABYLON.MeshBuilder.CreateSphere("Cam Parallax", {}, global_sceneRef);
    camHolder.isVisible = false;
    camParallax.isVisible = false;
    camParallax.parent = camHolder;
    gameCamera.parent = camParallax;
    camHolder.position = gameCamera.position;
    gameCamera.position = BABYLON.Vector3.Zero();

    //REMOVE FOR MOBILE TO WORK:
    let defaultPipeline = new BABYLON.DefaultRenderingPipeline("defaultRenderPipeline", true, global_sceneRef, [gameCamera]);
    defaultPipeline.samples = 8;
    //https://doc.babylonjs.com/divingDeeper/postProcesses/defaultRenderingPipeline#antialiasing
    defaultPipeline.glowLayerEnabled = true;
    if (defaultPipeline.glowLayerEnabled) {
        defaultPipeline.glowLayer.blurKernelSize = 10.000; // 16 by default
        defaultPipeline.glowLayer.intensity = 0.700; // 1 by default
    }


    //defaultPipeline.fxaaEnabled = true;

    //gameCamera.rotation.x = 90 - gameCamera.rotation.x;

    //gameCamera.attachControl(global_canvasRef, true);

    cameraPosTarget = gameCamera.position;
    cameraRotTarget = gameCamera.rotationQuaternion;


    //camHolder.rotationQuaternion = cameraRotTarget;

    //fix this with event that would be called and this would sub to it!!!


    //vignette:
/*    var postProcess = new BABYLON.ImageProcessingPostProcess("Vignette", 1.0, gameCamera);
   postProcess.vignetteWeight = 2;
   postProcess.vignetteStretch = 1;
   postProcess.vignetteColor = new BABYLON.Color4(0, 0, 0, 0);
   postProcess.vignetteEnabled = true;
*/

    //FXAA
    //var aa = new BABYLON.FxaaPostProcess("fxaa", 1, gameCamera);
    //aa.samples = 8;


    /*var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 128, height: 128 }, global_sceneRef);
    console.log(ground);
    //ground.position = BABYLON.Vector3(0,0.6,0);
    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", global_sceneRef);
       groundMaterial.diffuseTexture = new BABYLON.Texture("zz.jpg", global_sceneRef);
       groundMaterial.diffuseTexture.uScale = 16;
       groundMaterial.diffuseTexture.vScale = 16;
       groundMaterial.specularTexture = new BABYLON.Texture("zz.jpg", global_sceneRef);
       groundMaterial.specularTexture.uScale = 16;
       groundMaterial.specularTexture.vScale = 16;
       ground.material = groundMaterial;

*/

    //create SSR:
    /*var ssr = new BABYLON.ScreenSpaceReflectionPostProcess("ssr", global_sceneRef, 1.0, gameCamera);
    ssr.reflectionSamples = 32;
    ssr.strength = 1; // Set default strength of reflections.
    ssr.reflectionSpecularFalloffExponent = 2; // Attenuate the reflections a little bit. (typically in interval [1, 3])
    */



    //create SSAO:

    // Create SSAO and configure all properties (for the example)

  /* var ssaoRatio = {
       ssaoRatio: 0.1, // Ratio of the SSAO post-process, in a lower resolution
       combineRatio: 1.0 // Ratio of the combine post-process (combines the SSAO and the scene)
   };

   var ssao = new BABYLON.SSAORenderingPipeline("ssao", global_sceneRef, ssaoRatio);
   ssao.fallOff = 0.000001;
   ssao.area = 1;
   ssao.radius = 0.0001;
   ssao.totalStrength = 1.0;
   ssao.base = 0.5;

   // Attach camera to the SSAO render pipeline
   global_sceneRef.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", gameCamera);


   */






















    global_sceneRef.registerBeforeRender(function(){

        let limited =  Math.PI*2;
        gameCamera.rotation = new BABYLON.Vector3( gameCamera.rotation.x % limited,  gameCamera.rotation.y % limited,  gameCamera.rotation.z % limited);

        camHolder.position = BABYLON.Vector3.Lerp(camHolder.position, cameraPosTarget, camPosLerpFactor);
        if(cameraRotTarget != null)
            camHolder.rotation = BABYLON.Vector3.Lerp(camHolder.rotation, cameraRotTarget, camRotLerpFactor);

        if(cameraLookAroundLerper)
        {
            gameCamera.rotation =  BABYLON.Vector3.Lerp(gameCamera.rotation, new BABYLON.Vector3.Zero(), 0.05);
            gameCamera.position =  BABYLON.Vector3.Lerp(gameCamera.position, new BABYLON.Vector3.Zero(), 0.05);
        }
        //parallax effect:
        if(isTransitioning)
        {
            //camera is transitioning, don't apply parallax
        }
        else {
            parallaxTargetX = (isTopDown===true?global_TopDownParallaxMultiplierX:global_parallaxMultiplierX) * (-0.5 + (global_mouseX / global_screenWidth));
            parallaxTargetY = -(isTopDown===true?global_TopDownParallaxMultiplierY:global_parallaxMultiplierY) * (-0.5 + (global_mouseY / global_screenHeight));
        }

        camParallax.position = BABYLON.Vector3.Lerp(camParallax.position, new BABYLON.Vector3(parallaxTargetX, parallaxTargetY, camParallax.position.z), 0.04);
    });

    function GetCamRef()
    {
        return  gameCamera;
    }


    return{SetCameraTarget:SetCameraTarget, GetCamRef:GetCamRef}
}

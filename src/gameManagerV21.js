gameManager = function()
{
    let InitGame = function()
    {
        // Lights
        let skyLight = new BABYLON.DirectionalLight("SkyLight", new BABYLON.Vector3(-1, -1, 1), global_sceneRef);
        skyLight.position = new BABYLON.Vector3(100, 100, 100);

        camManager = new cameraManager();
        vaManager = new assistantVideoManager(camManager.GetCamRef());
        setTimeout(() => {vaManager.PlayVA(0); }, 3000);


        let topDownCameraPoint;
        let cameraPoints = [];
        let uiButtonRefs = [];
        let lightRefs = [];
        let videoRefs = [];
        let lightTargetIntensity = [];
        let ceilingObjects = [];

        if(global_enableShadows === true)
        {
            var shadowGenerator = new BABYLON.ShadowGenerator(4096, skyLight);
            shadowGenerator.usePoissonSampling = true;
        }

        let demoAreaInterface;
        let ceilintTimeoutRef;
        let UpdateCeilingState = function(_selection, _isVisible)
        {
            clearTimeout(ceilintTimeoutRef);

            for(let i = 0; i < ceilingObjects.length; i++)
            {
                let ceilingIdentifier = ceilingObjects[i].name.split("_")[1];
                if(ceilingIdentifier == "All" )  //add more conditions if each room has it's own ceiling
                {
                    ceilintTimeoutRef = setTimeout(() => {ceilingObjects[i].isVisible = _isVisible; }, _isVisible?2000:0);
                }
                else {
                    ceilingObjects[i].isVisible = false;
                }
            }
        }

        //test objAnimationLoad


        ////////////new customAnimation();
        //global_sceneRef.debugLayer.show();




        BABYLON.SceneLoader.ImportMesh("", fileFolderLocation, fileName, global_sceneRef, function (newMeshes)
        {

            //show this UI when you get in the demo area!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
             demoAreaInterface = new demoAreaUI();

             for(let i = 0; i < newMeshes.length; i++)
             {

                 if(global_enableShadows === true)
                 {
                     shadowGenerator.addShadowCaster(newMeshes[i]);
                     newMeshes[i].receiveShadows = true;
                     //add the instances:
                     for(let y = 0; y < newMeshes[i].instances.length; y++)
                     {
                         shadowGenerator.addShadowCaster(newMeshes[i].instances[y]);
                         newMeshes[i].instances[y].receiveShadows = true;
                     }
                 }



                if( newMeshes[i].material !== null)
                    newMeshes[i].material.maxSimultaneousLights = 7;   //just in case increase max lights to handle

                if(newMeshes[i].name.includes(dummyPrefix_ConstantLight))
                {
                    newMeshes[i].isVisible = false;
                    let constantLight = new BABYLON.PointLight(newMeshes[i].name, newMeshes[i].position, global_sceneRef);
                    constantLight.intensity = Number(newMeshes[i].name.split("_")[2]);
                    constantLight.diffuse = new BABYLON.Color3.FromHexString('#' + newMeshes[i].name.split("_")[1]);
                    constantLight.shadowEnabled = false;
                }


                if(newMeshes[i].name.includes(dummyPrefix_Ceiling))
                {
                    ceilingObjects.push(newMeshes[i]);
                    newMeshes[i].isVisible = false;
                }


                 if(newMeshes[i].name.includes(dummyPrefix_Video))
                 {
                     var vidMat = new BABYLON.StandardMaterial("vidMat", global_sceneRef);
                     let videoTex =  new BABYLON.VideoTexture(newMeshes[i].name, globalVideosFolder + newMeshes[i].name.split("_")[2], global_sceneRef, false);
                     vidMat.diffuseTexture = videoTex;
                     vidMat.specularColor = new BABYLON.Color3(0,0,0);
                     videoTex.video.volume = 0.2;
                     vidMat.roughness = 1;
                     //vidMat.emissiveColor = new BABYLON.Color3.White();
                     newMeshes[i].material = vidMat;
                     videoTex.video.pause();
                     videoTex.video.loop = false;
                     videoRefs.push(videoTex);
                 }

                 if(newMeshes[i].name.includes(dummyPrefix_Camera))
                 {
                     newMeshes[i].isVisible = false;
                     if(newMeshes[i].name === dummyPrefix_Camera + dummySuffix_TopDownCamera)
                     {
                         topDownCameraPoint = newMeshes[i];
                         camManager.SetCameraTarget(topDownCameraPoint, true, true);
                         //Set return to lobby UI button:
                         var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
                         var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Exit to lobby");
                         button1.fontFamily = 'EricssonHilda';
                         button1.width = "150px"
                         button1.height = "40px";
                         button1.color = "white";
                         button1.cornerRadius = 5;
                         //button1.background = "green";
                         button1.color = "000000";
                         button1.background = "#ffffff";
                         button1.top = "-50px";
                         button1.left = "-50px";
                         button1.onPointerUpObservable.add(function() {
                              demoAreaInterface.ToggleUI(false, 0);
                              camManager.SetCameraTarget(topDownCameraPoint, true, false);
                              vaManager.PlayVA(0);
                              UpdateCeilingState(topDownCameraPoint, false);
                              toggleUIButtons(-1);
                              UpdateVideosState(-1);
                         });
                         advancedTexture.addControl(button1);

                         //set up mute/unmute button:

                         var unmuteButton = BABYLON.GUI.Button.CreateImageOnlyButton("but", globalTex_unmuteTexture);
                         unmuteButton.width = "40px"
                         unmuteButton.height = "40px";
                         unmuteButton.color = "white";
                         unmuteButton.top = "-50px";
                         unmuteButton.left = "-220px";
                         unmuteButton.thickness =0

                         advancedTexture.addControl(unmuteButton);

                         var muteButton = BABYLON.GUI.Button.CreateImageOnlyButton("but", globalTex_muteTexture);
                         muteButton.width = "40px"
                         muteButton.height = "40px";
                         muteButton.color = "white";
                         muteButton.top = "-50px";
                         muteButton.left = "-220px";
                         muteButton.thickness =0
                         muteButton.isVisible = false;


                         let OnMuteToggle = function()
                         {
                            audioPlayer.OnMuteToggled(videoRefs);
                            global_muteStatus = !global_muteStatus;
                            unmuteButton.isVisible = !global_muteStatus;
                            muteButton.isVisible = global_muteStatus;
                         }
                         unmuteButton.onPointerUpObservable.add(function() {
                            OnMuteToggle();
                         });

                         muteButton.onPointerUpObservable.add(function() {
                            OnMuteToggle();
                         });
                         advancedTexture.addControl(muteButton);

                         let personalJourneyTool = new personalJourneyToolPlacegolder(advancedTexture);


                         //anchor all ui buttons
                         if(debug_debugLayer===false)
                         {
                             button1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                             muteButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                             unmuteButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                         }
                         button1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                         muteButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                         unmuteButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                     }
                 else {
                     cameraPoints.push(newMeshes[i]);
                 }




             }





                /* if(newMeshes[i].name.includes(dummyPrefix_Light))
                 {
                     newMeshes[i].isVisible = false;
                     let thisLight = new BABYLON.PointLight(newMeshes[i].name, newMeshes[i].position, global_sceneRef);
                     lightRefs.push(thisLight);
                     lightTargetIntensity.push(0);
                 }*/




                 if(newMeshes[i].name.includes(dummyPrefix_UI))
                 {
                     newMeshes[i].isVisible = false
                     var _3dButton = new locked3DButton(newMeshes[i].name.split("_")[1], newMeshes[i].name.split("_")[1], "/assets/2D/UI/AreaOfInterestBackgroundBubble@4x.png", newMeshes[i], new BABYLON.Vector3(0, 1, 0));
                     uiButtonRefs.push(_3dButton.button);

                     /*newMeshes[i].isVisible = false;
                     uiHolder = BABYLON.MeshBuilder.CreateBox("uiHolder", {}, global_sceneRef);
                     uiHolder.position = new BABYLON.Vector3(newMeshes[i].position.x, newMeshes[i].position.y+8, newMeshes[i].position.z);
                     uiHolder.rotation.x = (Math.PI/2);
                     uiHolder.isVisible = false;
                     var thisButtonPanel = new BABYLON.GUI.StackPanel();
                     var thisButtonPlane = BABYLON.Mesh.CreatePlane("floorButtonHolder", 1);
                     thisButtonPlane.parent = uiHolder;
                     thisButtonPlane.position = new BABYLON.Vector3(0, 0, 0);//i/10
                     thisButtonPlane.scaling = new BABYLON.Vector3(15, 15, 15);
                    var thisButtonDynamicTex = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(thisButtonPlane);
                    thisButtonDynamicTex.addControl(thisButtonPanel);
                    let thisButtonName = newMeshes[i].name.split("_")[1];
                    var thisButton = BABYLON.GUI.Button.CreateSimpleButton(thisButtonName, thisButtonName);
                    thisButton.width = "2000px"
                    thisButton.height = "300px";
                    thisButton.color = "black";
                    thisButton.background = "white";
                    thisButton.fontSize = 100;
                    thisButtonPanel.addControl(thisButton);

                    uiButtonRefs.push(thisButton);*/
                 }
             }


             //configude all:

             //configure lights:
             for(let z = 0; z < lightRefs.length; z++)
             {
                 //lightRefs[z].intensity = 400;
                 lightRefs[z].diffuse = new BABYLON.Color3.FromHexString('#' + lightRefs[z].name.split("_")[2]);
                 //lightRefs[z].setEnabled(false);
             }

             //adjust light intensity
             global_sceneRef.registerBeforeRender(function(){
                 for(let z = 0; z < lightRefs.length; z++)
                 {
                    if(lightRefs[z].intensity <= 1) lightRefs[z].setEnabled(false);
                    else lightRefs[z].setEnabled(true);

                    if(lightTargetIntensity[z] !== lightRefs[z].intensity)
                    {
                        lightRefs[z].intensity = (lightRefs[z].intensity * (1 - global_UILightInterpolationVal)) + (lightTargetIntensity[z] * global_UILightInterpolationVal);
                         //(X*(1-t))+(Y*y)
                    }
                 }
             });

             let UpdateVideosState = function (_currentlyPressedIndex)
             {
                 for(let v = 0; v < videoRefs.length; v++)
                 {
                      if(_currentlyPressedIndex > -1 && videoRefs[v].name.split("_")[1] === uiButtonRefs[_currentlyPressedIndex].name)
                          videoRefs[v].video.play();
                      else
                          videoRefs[v].video.pause();
                 }
             }

             let toggleUIButtons = function(_currentlyPressed)
             {
                 for(let z = 0; z < uiButtonRefs.length; z++)
                    if(toggleUIButtons[z] === _currentlyPressed) uiButtonRefs[z].isVisible = false;
                    else uiButtonRefs[z].isVisible = true;
             }


             for(let z = 0; z < uiButtonRefs.length; z++)
             {
                 for(let j = 0; j < cameraPoints.length; j++)
                 {
                     if(uiButtonRefs[z].name === cameraPoints[j].name.split("_")[1])
                     {

                         uiButtonRefs[z].onPointerClickObservable.add(() =>
                         {
                             if(cameraPoints[j].name.split("_")[1] === "Demo area")
                                 demoAreaInterface.ToggleUI(true, 2000);
                             else
                                 //hide demo area UI
                                 demoAreaInterface.ToggleUI(false, 0);

                             camManager.SetCameraTarget(cameraPoints[j], false, false, false);
                             vaManager.PlayVAViaLabel(cameraPoints[j].name.split("_")[1]);
                             UpdateCeilingState(cameraPoints[j], true);
                             toggleUIButtons(uiButtonRefs[z]);
                              UpdateVideosState(z);
                         });
                     }
                 }




                 for(let q = 0; q < lightRefs.length; q++)
                 {
                     if(lightRefs[q].name.split("_")[1] == uiButtonRefs[z].name)
                     {
                        // uiButtonRefs[z].onPointerEnterObservable.add(function() {
                            // lightTargetIntensity[z] = global_UILightIntensity;
                        // });
                     }
                    // uiButtonRefs[q].onPointerOutObservable.add(function() {
                        //lightTargetIntensity[z] = 0;
                    // });
                 }

             }
         });



       //arcCam = new BABYLON.ArcRotateCamera("ArkCam", 0, 0.2, 100,  new BABYLON.Vector3(0, 0, 0), scene);

       //Ground
       /*var ground = BABYLON.Mesh.CreatePlane("ground", 20.0, scene);
       ground.material = new BABYLON.StandardMaterial("groundMat", scene);
       ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
       ground.material.backFaceCulling = false;
       ground.position = new BABYLON.Vector3(5, 0, -15);
       ground.scaling = new BABYLON.Vector3(100,100,100);
       ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);//*/

       //Simple crate
       //var box = BABYLON.Mesh.CreateBox("crate", 2, _sceneRef);
      // box.material = new BABYLON.StandardMaterial("Mat", _sceneRef);
       //box.position = new BABYLON.Vector3(5, 1, -10);

       //Set gravity for the scene (G force like, on Y-axis)
       //_sceneRef.gravity = new BABYLON.Vector3(0, -0.9, 0);

       // Enable Collisions
      // _sceneRef.collisionsEnabled = true;

       //Then apply collisions and gravity to the active camera
      // camera.checkCollisions = true;
     //  camera.applyGravity = true;

       //Set the ellipsoid around the camera (e.g. your player's size)
      // camera.ellipsoid = new BABYLON.Vector3(1, 1.3, 1);

       //finally, say which mesh will be collisionable
       //ground.checkCollisions = true;
      // box.checkCollisions = true;



      /* BABYLON.SceneLoader.ImportMesh("", "/assets/3D/TestCity/", "TestCity.babylon", scene, function (newMeshes) {

           for(let i = 0; i < newMeshes.length; i++)
           {
               //console.log(newMeshes[i].name);
               if(newMeshes[i].name.includes("SpawnPoint_"))
               {
                    uiHolder = BABYLON.MeshBuilder.CreateBox("uiHolder", {}, scene);
                    uiHolder.position = new BABYLON.Vector3(newMeshes[i].position.x, newMeshes[i].position.y+8, newMeshes[i].position.z);
                     uiHolder.rotation.y = -(Math.PI/2);
                      uiHolder.isVisible = false;
                     var panel = new BABYLON.GUI.StackPanel();

                     var floorButton1Holder = BABYLON.Mesh.CreatePlane("floorButtonHolder", 1);
                       floorButton1Holder.parent = uiHolder;
                       floorButton1Holder.position = new BABYLON.Vector3(0, 0, 0);//i/10
                       floorButton1Holder.scaling = new BABYLON.Vector3(15, 15, 15);
                       var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(floorButton1Holder);

                       advancedTexture.addControl(panel);
                       var floorButton1 = BABYLON.GUI.Button.CreateSimpleButton("onoff",newMeshes[i].name.split("_")[1]);
                       floorButton1.width = "2000px"
                       floorButton1.height = "300px";
                       floorButton1.color = "black";
                       floorButton1.background = "white";
                       floorButton1.fontSize = 120;
                       panel.addControl(floorButton1);

                       floorButton1.onPointerClickObservable.add(() => {
                           scene.activeCamera = camera;
                           camera.position = new BABYLON.Vector3(newMeshes[i].position.x,camera.position.y, newMeshes[i].position.z);
                           //console.log("button pressed!");
                       });


                   //spawn point UI setup
               }
           }
       });*/




       // BABYLON.SceneLoader.Append("/assets/3D/TestCity/", "TestCity.babylon", scene, function (scene) {
       // Create a default arc rotate camera and light.
       //scene.createDefaultCameraOrLight(true, true, true);

       // The default camera looks at the back of the asset.
       // Rotate the camera by 180 degrees to the front of the asset.
       // scene.activeCamera.alpha += Math.PI;
       //});




       //modale loader:
       /*    let loadStaticModel = function(_path, _file, _scene, _renderGroupID, _callback)
           {
           return BABYLON.SceneLoader.LoadAssetContainer(_path, _file, _scene, function (container) {
           container.addAllToScene();
           for(var meshIndex = 0; meshIndex < container.meshes.length; meshIndex++)
           {
               if(container.meshes[meshIndex] !== null)
               {
                   container.meshes[meshIndex].renderingGroupId = _renderGroupID;
                   container.meshes[meshIndex].isPickable = false;
                   container.meshes[meshIndex].freezeWorldMatrix();
                   container.meshes[meshIndex].doNotSyncBoundingInfo = true;
               }
           }

           if(_callback != null)
           {
               try {
                   _callback(container);//container.transformNodes[0]._parentNode);
               } catch (e) {
                    _callback();
               }
           }
           });
       }

        loadStaticModel("/assets/3D/TestCity/", "TestCity.gltf", scene, 0);*/






        // canvas.onclick = function()
        // {
             //canvas.requestPointerLock();

            /* if(canvas.RequestFullScreen)            canvas.RequestFullScreen();
             else if(canvas.webkitRequestFullScreen) canvas.webkitRequestFullScreen();
             else if(canvas.mozRequestFullScreen)    canvas.mozRequestFullScreen();
             else if(canvas.msRequestFullscreen)     canvas.msRequestFullscreen();
             else console.log("This browser doesn't supporter fullscreen");*/
        // }
















        if(debug_debugLayer) {
            global_sceneRef.debugLayer.show();
        }



    }



    return{InitGame:InitGame}
}();

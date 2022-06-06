function assistantVideoManager(_camManagerRef)
{
    let camRef = _camManagerRef;

    let aspectRation = 604/448;
    let width =  0.3;
    let height = width * aspectRation;

    const videoBox = BABYLON.MeshBuilder.CreatePlane("VA_pannel", {height: height, width: width});
    videoBox.isVisible = false;
    videoBox.renderingGroupId = 2;
    videoBox.parent = camRef
    videoBox.position = new BABYLON.Vector3(1.4,0.5,2);
    //videoBox.position = new BABYLON.Vector3(0,0,2);


    var videoMat = new BABYLON.StandardMaterial("VA_material", global_sceneRef);
    videoMat.unlit = true;
    videoMat.specularColor = BABYLON.Color3.Black();
    videoMat.roughness = 1;
    videoBox.material = videoMat;
    videoBox.material.disableLighting = true

    let videoTextures = [];
    let wasPlayed = [];

    for(let i = 0; i < global_va.length; i++)
    {
        var videoTex = new BABYLON.VideoTexture("VA_" +i, global_vaFolder+ global_va[i][0], global_sceneRef);
        videoTex.video.pause();
        videoTextures.push(videoTex);
        wasPlayed.push(false);
        videoTex.video.loop = false;
    }

    let vidStopTimeout;
    let currentlyPlayingIndex = -1;

    let PlayVAViaLabel = function (_label)
    {
        StopCurrentlyPlaying(); //stop the video when the user clicks on any room!
        for(let i = 0; i < global_va.length; i++)
        {
            if(global_va[i][1] === _label)
                PlayVA(i);
        }
    }

    let PlayVA = function(_index)
    {
        StopCurrentlyPlaying();
        if(wasPlayed[_index] === false)
        {
            clearTimeout(vidStopTimeout);
            currentlyPlayingIndex = _index;
            vidStopTimeout = setTimeout(() => {StopCurrentlyPlaying(); }, global_va[_index][2] + 2000);
            videoMat.emissiveTexture = videoTextures[_index];


            videoTextures[_index].video.play();
            videoBox.isVisible = true;
        }
    }

    let StopCurrentlyPlaying = function()
    {
        if(currentlyPlayingIndex >= 0)
        {
            StopPlayingAndTagAsPlayed(currentlyPlayingIndex);
            currentlyPlayingIndex = -1;
        }
    }

    let StopPlayingAndTagAsPlayed = function(_index)
    {
        videoTextures[_index].video.pause();
        wasPlayed[_index] = true;
        videoBox.isVisible = false;
    }

    let idleIndex = -1;

    for(let i = 0; i < global_va.length; i++)
    {
        if(global_va[i][1] === "Idle")
        {
            idleIndex = i;//console.log("Idle index set to : " + idleIndex)
        }
    }
    let playIdleVideoTimeout;
    global_canvasRef.addEventListener("click", function(){
        if(idleIndex >=0 )
        {
            clearTimeout(playIdleVideoTimeout);
            if(wasPlayed[idleIndex] === false)
                playIdleVideoTimeout = setTimeout(() => { PlayVA(idleIndex);}, 110000);
        }
    });


    return{PlayVA:PlayVA, PlayVAViaLabel:PlayVAViaLabel}
}

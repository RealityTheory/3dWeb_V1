function customAnimation()
{
    let animMeshes = [];
    let animatedAsset;
    let frameDelay = 1000/30;    //30 fps
    let currentFrame = 0;
    let frameCount = -1;

    let OnFrameChange = function()
    {
        animMeshes[currentFrame].isVisible = false;
        currentFrame++;

        setTimeout(() => {OnFrameChange(); }, frameDelay);

    }

    let OnAnimatedAssetLoaded = function()
    {

    }

    animatedAsset = BABYLON.SceneLoader.Append("/assets/3D/_customAnimTest/", "zzz.gltf", global_sceneRef, function (container)
    {
        frameCount = container.meshes.length;
        for(let i = 0; i < container.meshes.length; i++)
        {
            container.meshes[i].isVisible = false;
            animMeshes.push(container.meshes[i]);
        }
        OnAnimatedAssetLoaded();
    });



    return{}
}

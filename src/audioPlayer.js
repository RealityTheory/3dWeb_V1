audioPlayer = function()
{
    let initialized = false, ambient;

    let OnMuteToggled = function(_allVideos)
    {
        if(initialized === true)
        {
            BABYLON.Engine.audioEngine.setGlobalVolume(global_muteStatus?0.5:0);
            for(let i = 0; i < _allVideos.length; i++)
            {
                _allVideos[i].video.volume = global_muteStatus?0.5:0;
            }
        }
    }

    let InitAudio = function()
    {
        if(debug_muteSounds === true) return;
        BABYLON.Engine.audioEngine.setGlobalVolume(0.5);
        ambient = new BABYLON.Sound("ambient sound", global_ambientMusic , global_sceneRef, null, {volume: 0.01, loop: true,autoplay: true,spatialSound: false});//theme sound
        initialized = true;
    }


    return{OnMuteToggled:OnMuteToggled, InitAudio:InitAudio}
}();

//debug toggles:
let debug_updateFPSMeter = true;
let debug_muteSounds = false;
let debug_debugLayer = false;
let global_muteStatus = false;


//Prefix of 3D dummys
let dummyPrefix_UI = "UI_";
let dummyPrefix_Camera = "CamPoint_";
let dummyPrefix_Light = "Light_";
let dummyPrefix_ConstantLight = "ConstantLight_";
let dummyPrefix_Video = "Video_";
let dummyPrefix_Ceiling = "Ceiling_";
let dummySuffix_TopDownCamera = "TopDown";

//global
let global_canvasRef;
let global_sceneRef;
let global_engineRef;

let global_enableShadows = true;
let global_ambientSkyLightHex = "AADBFB";
let envTex_environmentTex = "/assets/environments/environment.dds";

let globalTex_muteTexture = "/assets/2D/music/mute.png";
let globalTex_unmuteTexture = "/assets/2D/music/unmute.png";

//Other
let global_mouseX = 0;
let global_mouseY = 0;
let global_screenWidth = 0;
let global_screenHeight = 0;

//font
let global_topdownLabelFont = "assets/fonts/EricssonHilda-Bold.otf";

let global_journeyOpen = "assets/2D/placeholder/placeholderJourneyOpen.png";
let global_journeyClose = "assets/2D/placeholder/placeholderJourneyClose.png";

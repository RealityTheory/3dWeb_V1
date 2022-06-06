BABYLON.GUI.Button.DemoArea_DemoSelectionButton = function(_advancedTex, _imageUrl, _text , _index) {

    var bgShadow = new BABYLON.GUI.Image(name + "_icon", "/assets/2D/UI/DemoBackground@4x.png");
    //bgShadow.zIndex(-1);

    let helper_buttomAspectRatio = 266/408;//9/16;
    let maxButtonCount = 5;
    let index = _index;
    var button = new BABYLON.GUI.Button(_text);
    button.thickness = 0;
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    //button.pointerDownAnimation = function () { };  //to disable scaling on up and down
    //button.pointerUpAnimation = function () { }; //to disable scaling on up and down
    button.pointerEnterAnimation = function (){};
    button.pointerOutAnimation = function (){};
    //button.zIndex(1);


    button.addControl(bgShadow);


    let OnResize = function()
    {
        let distBetweenButtons = -60;//global_screenWidth/80;
        let leftDist = 120;//distBetweenButtons * 4.5;
        let buttonWidth = global_screenWidth/(maxButtonCount * 1);
        button.width = buttonWidth + "px"
        button.height = (buttonWidth * helper_buttomAspectRatio) +"px";

        bgShadow.width = "110%";
        bgShadow.height = "110%";

        //button.fontSize = buttonWidth / 8;
        button.left = (leftDist + (buttonWidth * index) + (distBetweenButtons * (index))) + "px";
    }

    // Adding image

    //let videoTexture =  new BABYLON.VideoTexture("test", globalVideosFolder + "theOfficeOpening.mp4", global_sceneRef, false);
    //var iconImage = new BABYLON.GUI.Image(name + "_icon", videoTexture);
    var iconImage = new BABYLON.GUI.Image(name + "_icon", _imageUrl);
    iconImage.width = "80%";
    iconImage.height = "80%";
    button.addControl(iconImage);

    //adding text:
    //var buttonTextBlock = new BABYLON.GUI.TextBlock(name + "_button", _text);
    //buttonTextBlock.textWrapping = true;
    //buttonTextBlock.fontFamily = 'EricssonHilda';
    //button.addControl(buttonTextBlock);
    //buttonTextBlock.color = "white";
    //buttonTextBlock.outlineWidth = 2;
    //buttonTextBlock.shadowBlur = 4;
    //buttonTextBlock.outlineColor = "black";
    //buttonTextBlock.left = "12%";
    //buttonTextBlock.top = "12%";
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    //buttonTextBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    //buttonTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

    _advancedTex.addControl(button);
    OnResize();

    return {};
};

function demoAreaUI_CloseButton(_advancedTex, _onPressCall)
{
    var button = BABYLON.GUI.Button.CreateImageOnlyButton("userJourneyButton", "/assets/2D/exitDemoButton.png");
    let buttonWidth =  global_screenWidth/35;
    button.width = buttonWidth + "px";
    button.height = buttonWidth + "px";
    button.thickness = 0
    button.top = (-global_screenHeight / 4) + "px"; //"-140px";
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    _advancedTex.addControl(button);

    button.onPointerUpObservable.add(function() {
       _onPressCall(false);
    });
}

function demoAreaUI_ScreenBG(_advancedTex)
{
    var bg = new BABYLON.GUI.Image("_icon", "/assets/2D/demoAreaScreenBackground.png");
    _advancedTex.addControl(bg);
}

function demoAreaUI_Filter(_advancedTex)
{
    // Adding image
    let filterAspectRation = 107/867;
    var iconImage = new BABYLON.GUI.Image("_icon", "/assets/2D/filterBackgroundPannel.png");
    iconImage.thickness = 0
    let widthInt = global_screenWidth/2;
    let heightInt = filterAspectRation * widthInt;

    iconImage.width = widthInt + "px";
    iconImage.height = heightInt + "px";
    iconImage.top = (-global_screenHeight/30) + "px"; //"-140px";
    //iconImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    iconImage.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    _advancedTex.addControl(iconImage);


    /*
    var panel = new BABYLON.GUI.StackPanel();
    panel.isVertical = false;

    var addRadio = function(text, parent) {
       var button = new BABYLON.GUI.Checkbox();
       button.width = "20px";
       button.height = "20px";
       button.color = "white";
       button.background = "green";

       button.onIsCheckedChangedObservable.add(function(state) {
           // TODO: Actions on state change go here.
       });

       var header = BABYLON.GUI.Control.AddHeader(button, text, "100px", { isHorizontal: true, controlFirst: true });
       header.height = "30px";

       parent.addControl(header);
    }

    addRadio("option 1", panel);
    addRadio("option 2", panel);
    addRadio("option 3", panel);
    addRadio("option 4", panel);
    addRadio("option 5", panel);

    _advancedTex.addControl(panel);*/


}



function demoAreaUI()
{
     var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("DemoAreaUIInterfaceDynamicTexture");
     let buttonArray = [];
     advancedTexture.rootContainer.alpha = 0;
     advancedTexture.rootContainer.isVisible = false;
     let targetAlpha = 0;

     let timeoutRef;
     let ToggleUI = function(_newVal, _timeout)
     {
         clearTimeout(timeoutRef);
        timeoutRef = setTimeout(() => { targetAlpha = _newVal?1:0; }, _timeout);
     }
     ToggleUI(false, 0);





     new demoAreaUI_ScreenBG(advancedTexture);




     for(let i = 0; i < global_demoAreaButtons.length; i++)
     {
        buttonArray.push(new BABYLON.GUI.Button.DemoArea_DemoSelectionButton(advancedTexture, global_demoAreaButtons[i][0], global_demoAreaButtons[i][1], i));
     }




     new demoAreaUI_CloseButton(advancedTexture, ToggleUI);

     window.addEventListener("resize", function () {

         if(advancedTexture.rootContainer.alpha !== 0)
         {
             for(let i = 0; i < buttonArray.length; i++)
             {
                 buttonArray[i].OnResize();
             }
         }
     });

     global_sceneRef.registerBeforeRender(function(){
         if( advancedTexture.rootContainer.alpha !== targetAlpha)
         {
             if(advancedTexture.rootContainer.alpha < targetAlpha) advancedTexture.rootContainer.alpha +=0.01;
             else advancedTexture.rootContainer.alpha -=0.1;
             if(advancedTexture.rootContainer.alpha > 1) advancedTexture.rootContainer.alpha = 1;
             if(advancedTexture.rootContainer.alpha < 0) advancedTexture.rootContainer.alpha = 0;
             //fix mouse blocking when alpha is 0...
            if(advancedTexture.rootContainer.alpha <= 0) advancedTexture.rootContainer.isVisible = false;
            else advancedTexture.rootContainer.isVisible = true;
         }
    });


    new demoAreaUI_Filter(advancedTexture);



    return{ToggleUI:ToggleUI}
}

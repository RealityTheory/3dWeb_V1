function locked3DButton(_name, _text, _texturePath, _3DLockObject, _offsetVector)
{

    //make this so it works with anchor object instead
    //let buttonBackgroundAsset = "/assets/2D/UI/AreaOfInterestBackgroundBubble@4x.png"

    //Init:
    /*let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(_name + "_advancedTexture");

    let image = new BABYLON.GUI.Image(_name + "_image", _texturePath);
    image.width = 0.1;
    image.height = "40px";
    advancedTexture.addControl(image);
    image.linkWithMesh(_3DLockObject);*/





     /*uiHolder = BABYLON.MeshBuilder.CreateBox("uiHolder", {}, global_sceneRef);
     uiHolder.position = new BABYLON.Vector3(_3DLockObject.position.x, _3DLockObject.position.y -2, _3DLockObject.position.z);
     uiHolder.rotation.x = (Math.PI/2);
     uiHolder.isVisible = false;
     var thisButtonPanel = new BABYLON.GUI.StackPanel();
     var thisButtonPlane = BABYLON.Mesh.CreatePlane("floorButtonHolder", 1);
     thisButtonPlane.parent = uiHolder;
     thisButtonPlane.position = new BABYLON.Vector3(0, 0, 0);//i/10
     thisButtonPlane.scaling = new BABYLON.Vector3(15, 15, 15);
    var thisButtonDynamicTex = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(thisButtonPlane);
    thisButtonDynamicTex.addControl(thisButtonPanel);
    let thisButtonName = _name.split("_")[1];
    var thisButton = BABYLON.GUI.Button.CreateSimpleButton(thisButtonName, thisButtonName);
    thisButton.width = "2000px"
    thisButton.height = "300px";
    thisButton.color = "black";
    thisButton.background = "white";
    thisButton.fontSize = 100;
    thisButtonPanel.addControl(thisButton);*/



    /*let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(_name + "_advancedTexture");

    var font = "bold 14px monospace";

    let image = new BABYLON.GUI.Image(_name + "_image", _texturePath);
    let imgWidth = _name.length/400
    image.width = imgWidth;
    image.height = "40px";
    advancedTexture.addControl(image);
    image.linkWithMesh(_3DLockObject);

    //useful: https://www.babylonjs-playground.com/#XCPP9Y#1192
    var button = BABYLON.GUI.Button.CreateSimpleButton(_name, _text);
    button.top = "30px";
    advancedTexture.addControl(button);
    button.width =  imgWidth;
    button.height =  "40px";


    button.linkWithMesh(_3DLockObject);*/



    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(_name + "_advancedTexture");

    var button = BABYLON.GUI.Button.CreateImageWithCenterTextButton(_name, _text, _texturePath);
    let imgWidth = 0.08;//_name.length/120;
    button.width = imgWidth;
    button.height = "65px";
    button.thickness = 0;
    button.outlineColor = "black";
    button.outlineWidth = 2;
    button.linkOffsetY = -70;
    button.textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    button.textBlock.paddingBottom = "12px";
    button.fontFamily = 'EricssonHilda';
    advancedTexture.addControl(button);
    button.linkWithMesh(_3DLockObject);

    button.pointerDownAnimation = function () { };  //to disable scaling on up and down
    button.pointerUpAnimation = function () { }; //to disable scaling on up and down
    button.pointerEnterAnimation = function (){};
    button.pointerOutAnimation = function (){};


    //circle button:

    var circleButton = BABYLON.GUI.Button.CreateImageWithCenterTextButton("circle_" + _name, "", "/assets/2D/UI/CircularSelector@4x_shadow.png");
    circleButton.width = "50px";
    circleButton.height = "50px";
    circleButton.thickness = 0;
    circleButton.outlineColor = "black";
    circleButton.outlineWidth = 2;
    circleButton.textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    //circleButton.fontFamily = 'EricssonHilda';
    advancedTexture.addControl(circleButton);
    circleButton.linkWithMesh(_3DLockObject);

    circleButton.pointerDownAnimation = function () { };  //to disable scaling on up and down
    circleButton.pointerUpAnimation = function () { }; //to disable scaling on up and down
    circleButton.pointerEnterAnimation = function (){};
    circleButton.pointerOutAnimation = function (){};



    /*let get2dPoint = function(_3DPoint, _camera, _width, _height) //implement this conversion instead of linkWithMesh for firefox support!
    {
        let viewMatrix =  _camera.getViewMatrix();
        let projectionMatrix = _camera.getProjectionMatrix();
    }*/


    /*

    let rect1 = new BABYLON.GUI.Rectangle(_name + "_UIRectangle");
    rect1.width = 0.2;
    rect1.height = "40px";
    rect1.cornerRadius = 20;
    rect1.color = "white";
    rect1.thickness = 4;
    //rect1.background = "green";

    //advancedTexture.addControl(rect1);

    let label = new BABYLON.GUI.TextBlock(_name + "_label");
    label.text = _text;
    ////image.addControl(label);

    //rect1.addControl(label);

    //rect1.linkWithMesh(lockNode);

    //rect1.linkOffsetX = _offsetVector.X;
    //rect1.linkOffsetY = _offsetVector.y;
    //rect1.linkOffsetZ = _offsetVector.Z;
*/
//    image.linkWithMesh(_3DLockObject);
    //image.linkOffsetX = _offsetVector.X;
    //image.linkOffsetY = _offsetVector.y;
    //image.linkOffsetZ = _offsetVector.Z;

    return {button:button, circleButton:circleButton}
}

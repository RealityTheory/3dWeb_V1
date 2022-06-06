function personalJourneyToolPlacegolder(_advancedTexture)
{
    let startLeftNumber = -740/1.45;
    let currentLeftNumber = startLeftNumber;
    let userJourneyLeftTarget = startLeftNumber;
    let userJourneyState = false;
    let userJourneyAnimationSpeed = 20;

    let personalJourneyToolPlaceholder_button = function(_texture)
    {
        //user journey open:
        var button = BABYLON.GUI.Button.CreateImageOnlyButton("userJourneyButton", _texture);
        let aspectRation = 740/870;
        let height = global_screenHeight /1.5;
        let width = aspectRation * height;
        //button.width = 740/2 +"px"
        //button.height = 870/2 +"px";
        button.width = width +"px"
        button.height = height +"px";
        button.color = "white";
        button.left = startLeftNumber +"px";
        button.thickness = 0
        _advancedTexture.addControl(button);
        button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        button.pointerDownAnimation = function () { };  //to disable scaling on up and down
        button.pointerUpAnimation = function () { }; //to disable scaling on up and down
        button.pointerEnterAnimation = function (){};
        button.pointerOutAnimation = function (){};
        return button;
    }

    let openButton = personalJourneyToolPlaceholder_button(global_journeyOpen);
    let closeButton = personalJourneyToolPlaceholder_button(global_journeyClose);
    closeButton.isVisible = false;

    let changeUserJourneyTarget = function()
    {
       userJourneyState = !userJourneyState;
       userJourneyLeftTarget = userJourneyState?10:startLeftNumber;

       openButton.isVisible = !userJourneyState;
       closeButton.isVisible = userJourneyState;
    }

    openButton.onPointerUpObservable.add(function() {
        changeUserJourneyTarget();
    });

    closeButton.onPointerUpObservable.add(function() {
        changeUserJourneyTarget();
    });

    global_sceneRef.registerBeforeRender(function(){
       if(currentLeftNumber  < userJourneyLeftTarget) currentLeftNumber += userJourneyAnimationSpeed;
       if(currentLeftNumber > userJourneyLeftTarget) currentLeftNumber -= userJourneyAnimationSpeed;
       openButton.left = currentLeftNumber + "px";
       closeButton.left = currentLeftNumber + "px";

   });



    return{}
}

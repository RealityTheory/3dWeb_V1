let fpsMeterRef = document.getElementById("fps");

var UpdateFPSMeter = function(_newVal) {
    fpsMeterRef.innerHTML = "FPS: " + _newVal;
    if(_newVal>45) fpsMeterRef.style.color = 'green';
    else if(_newVal<=45 && _newVal>30) fpsMeterRef.style.color = 'yellow';
    else if(_newVal<=30 && _newVal>15) fpsMeterRef.style.color = 'orange';
    else fpsMeterRef.style.color = 'red';
}

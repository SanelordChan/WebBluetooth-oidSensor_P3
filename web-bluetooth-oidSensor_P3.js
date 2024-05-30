/**
 * Connects to a Bluetooth device.
 * The background color shows if a Bluetooth device is connected (green) or
 * disconnected (red).
 * Allows to interact with the characteristics of the micro:bit Bluetooth UART
 * service.
 */

var bluetoothDevice;



/**
 * Object containing the Bluetooth UUIDs of all the services and
 * characteristics of the micro:bit.
 */
microbitUuid = {
    /**
     * Services
     */
    genericAccess:                              ["00001800-0000-1000-8000-00805f9b34fb", "Generic Access"],
    genericAttribute:                           ["00001801-0000-1000-8000-00805f9b34fb", "Generic Attribute"],
    deviceInformation:                          ["0000180a-0000-1000-8000-00805f9b34fb", "Device Information"],
    accelerometerService:                       ["e95d0753-251d-470a-a062-fa1922dfa9a8", "Accelerometer Service"],
    magnetometerService:                        ["e95df2d8-251d-470a-a062-fa1922dfa9a8", "Magnetometer Service"],
    buttonService:                              ["e95d9882-251d-470a-a062-fa1922dfa9a8", "Button Service"],
    ledService:                                 ["e95dd91d-251d-470a-a062-fa1922dfa9a8", "LED Service"],
    eventService:                               ["e95d93af-251d-470a-a062-fa1922dfa9a8", "Event Service"],
    dfuControlService:                          ["e95d93b0-251d-470a-a062-fa1922dfa9a8", "DFU Control Service"],
    ioPinService:                               ["e95d127b-251d-470a-a062-fa1922dfa9a8", "IO Pin Service"],
    temperatureService:                         ["e95d6100-251d-470a-a062-fa1922dfa9a8", "Temperature Service"],
    uartService:                                ["6e400001-b5a3-f393-e0a9-e50e24dcca9e", "UART Service"],
    /**
     * Characteristics
     */
    deviceName:                                 ["00002a00-0000-1000-8000-00805f9b34fb", "Device Name"],
    appearance:                                 ["00002a01-0000-1000-8000-00805f9b34fb", "Appearance"],
    peripheralPreferredConnectionParameters:    ["00002a04-0000-1000-8000-00805f9b34fb", "Peripheral Preferred Connection Parameters"],
    serviceChanged:                             ["00002a05-0000-1000-8000-00805f9b34fb", "Service Changed"],
    modelNumberString:                          ["00002a24-0000-1000-8000-00805f9b34fb", "Model Number String"],
    serialNumberString:                         ["00002a25-0000-1000-8000-00805f9b34fb", "Serial Number String"],
    hardwareRevisionString:                     ["00002a27-0000-1000-8000-00805f9b34fb", "Hardware Revision String"],
    firmwareRevisionString:                     ["00002a26-0000-1000-8000-00805f9b34fb", "Firmware Revision String"],
    manufacturerNameString:                     ["00002a29-0000-1000-8000-00805f9b34fb", "Manufacturer Name String"],
    accelerometerData:                          ["e95dca4b-251d-470a-a062-fa1922dfa9a8", "Accelerometer Data"],
    accelerometerPeriod:                        ["e95dfb24-251d-470a-a062-fa1922dfa9a8", "Accelerometer Period"],
    magnetometerData:                           ["e95dfb11-251d-470a-a062-fa1922dfa9a8", "Magnetometer Data"],
    magnetometerPeriod:                         ["e95d386c-251d-470a-a062-fa1922dfa9a8", "Magnetometer Period"],
    magnetometerBearing:                        ["e95d9715-251d-470a-a062-fa1922dfa9a8", "Magnetometer Bearing"],
    magnetometerCalibration:                    ["e95db358-251d-470a-a062-fa1922dfa9a8", "Magnetometer Calibration"],
    buttonAState:                               ["e95dda90-251d-470a-a062-fa1922dfa9a8", "Button A State"],
    buttonBState:                               ["e95dda91-251d-470a-a062-fa1922dfa9a8", "Button B State"],
    pinData:                                    ["e95d8d00-251d-470a-a062-fa1922dfa9a8", "Pin Data"],
    pinADConfiguration:                         ["e95d5899-251d-470a-a062-fa1922dfa9a8", "Pin AD Configuration"],
    pinIOConfiguration:                         ["e95db9fe-251d-470a-a062-fa1922dfa9a8", "Pin IO Configuration"],
    pwmControl:                                 ["e95dd822-251d-470a-a062-fa1922dfa9a8", "PWM Control"],
    ledMatrixState:                             ["e95d7b77-251d-470a-a062-fa1922dfa9a8", "LED Matrix State"],
    ledText:                                    ["e95d93ee-251d-470a-a062-fa1922dfa9a8", "LED Text"],
    scrollingDelay:                             ["e95d0d2d-251d-470a-a062-fa1922dfa9a8", "Scrolling Delay"],
    microbitRequirements:                       ["e95db84c-251d-470a-a062-fa1922dfa9a8", "MicroBit Requirements"],
    microbitEvent:                              ["e95d9775-251d-470a-a062-fa1922dfa9a8", "MicroBit Event"],
    clientRequirements:                         ["e95d23c4-251d-470a-a062-fa1922dfa9a8", "Client Requirements"],
    clientEvent:                                ["e95d5404-251d-470a-a062-fa1922dfa9a8", "Client Event"],
    dfuControl:                                 ["e95d93b1-251d-470a-a062-fa1922dfa9a8", "DFU Control"],
    temperature:                                ["e95d9250-251d-470a-a062-fa1922dfa9a8", "Temperature"],
    temperaturePeriod:                          ["e95d1b25-251d-470a-a062-fa1922dfa9a8", "Temperature Period"],
    txCharacteristic:                           ["6e400003-b5a3-f393-e0a9-e50e24dcca9e", "Tx Characteristic"],
    rxCharacteristic:                           ["6e400002-b5a3-f393-e0a9-e50e24dcca9e", "Rx Characteristic"],
    /**
     * Method that searches an UUID among the UUIDs of all the services and
     * characteristics and returns:
     * - in HTML blue color the name of the service/characteristic found.
     * - in HTML red color a message if the UUID has not been found.
     * @param uuid The service or characteristic UUID.
     * @param serviceOrCharacteristic True (or 1) if it is a service, and false
     * (or 0) if it is a characteristic.
     */
    searchUuid(uuid, serviceOrCharacteristic) {
        for (const key in microbitUuid) {
            if (uuid === microbitUuid[key][0]) {
                return "<font color='blue'>" + microbitUuid[key][1] + "</font>";
            }
        }
        if (serviceOrCharacteristic) {
            return "<font color='red'>Unknown Micro:Bit Service</font>";
        } else {
            return "<font color='red'>Unknown Micro:Bit Characteristic</font>";
        }
    },
}



/**
 * Function that adds string to the log. If newLine is true, it adds a new line
 * at the end of the string.
 * @param string String to print to the log.
 * @param newLine Boolean that specifies whether to start a new line or not.
 */
function addLog(string, newLine) {
    document.getElementById("log").innerHTML += string;
    if (newLine) {
        document.getElementById("log").innerHTML += "<br>";
    };
}

/**
 * Function that adds string (and newline) to the log in bold and red color.
 * @param string String to print to the log.
 */
function addLogError(string) {
    addLog("<b><font color='red'>" + string + "</font></b>", true);
}

/**
 * Function that empties the log.
 */
function clearLog() {
    document.getElementById("log").innerHTML = "";
}

/**
 * Function that empties the UART TX field.
 */
function clearTx() {
    document.getElementById("tx").innerHTML = "";
    //document.getElementById("tx_last1").innerHTML = "";
    //document.getElementById("tx_last2").innerHTML = "";
}

/**
 * Function that turns the background color red.
 */
function onDisconnected() {
    document.getElementById("body").style = "background-color:#FFD0D0";
}

/**
 * Function that shows 2-digit hexdecimal in string.
 */
 function padHex(value) {
    return ('00' + value.toString(16).toUpperCase()).slice(-2);
}

/**
 * Function that shows 4-digit decimal in string.
 */
 function padDec(value) {
    return ('0000' + value.toString(10).toUpperCase()).slice(-4);
}

/**
 * Function that convert hex string to uint8 array.
 */
 function hexStringToUint8Array(hexString) {
    if (hexString.length % 2 != 0) {
      throw "Invalid hexString";
    }
    let arrayBuffer = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      let byteValue = parseInt(hexString.substr(i, 2), 16);
      if (byteValue == NaN) {
        throw "Invalid hexString";
      }
      arrayBuffer[i / 2] = byteValue;
    }
    return arrayBuffer;
}

/**
 * Function that decode the button state to string.
 */
function decodePuckState(stateValue) {
    var decodeState = "C:";

    if(stateValue & 0x80) { 
        decodeState += "ON "}
    else { 
        decodeState += "OFF "}

    decodeState += "B:"
    switch(stateValue & 0x60) {
        case 0x20:
            decodeState += "PRESS ";
            break;

        case 0x40:
            decodeState += "DOUBLE ";
            break;

        case 0x60:
            decodeState += "LONG "
            break;

        default:
            decodeState += "NONE "
            break;
    }

    decodeState += "NPM:"
    switch(stateValue & 0x18) {
        case 0x08:
            decodeState += "CHARGING STOP "
            break;

        case 0x10:
            decodeState += "CHARGING "
            break;

        case 0x18:
            decodeState += "CHARGING ERROR! "
            break;
    
        default:
            decodeState += "NO USB "
            break;
    }
    return decodeState;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

var txCharacteristic;
var rxCharacteristic;
var logCounter;

var nspPID_ID1;
var nspCS_ID1;
var nspMaxIdx_ID1 = 0;
var nspPID_ID2;
var nspCS_ID2;
var nspMaxIdx_ID2 = 0;
var nspPID_ID3;
var nspCS_ID3;
var nspMaxIdx_ID3 = 0;
var nspPID_ID4;
var nspCS_ID4;
var nspMaxIdx_ID4 = 0;


/**
 * Function that updates the HTML element according to the UART characteristic.
 */
function readTx(event) {
    //addLog("Reading TX... ", false);
    if (!("TextDecoder") in window) {
        addLogError("Sorry, this browser does not support TextDecoder...");
    } else {
        //let enc = new TextDecoder("utf-8");
        //document.getElementById("tx").innerHTML += enc.decode(event.target.value) + "<br>";
        let angle;
        let positionID;
        let nspStatus;
        let battery;
        let voltage = 0.00;
        let volume = 0;
        let report;

        // document.getElementById("tx_last1").innerHTML = "";
        // document.getElementById("tx_last2").innerHTML = "";

        logCounter += 0x01;
        let data_ID1 = "ID1:0x" ;
        data_ID1 += padHex(event.target.value.getUint8(0)).toString(16); // data byte 0
        data_ID1 += padHex(event.target.value.getUint8(1)).toString(16); // data byte 1
        data_ID1 += padHex(event.target.value.getUint8(2)).toString(16); // data byte 2
        data_ID1 += padHex(event.target.value.getUint8(3)).toString(16); // data byte 3
        data_ID1 += padHex(event.target.value.getUint8(4)).toString(16); // Puck status
        data_ID1 += " ";

        let rpt_type_ID1 = (event.target.value.getUint8(4) & 0x07);
        if(rpt_type_ID1 == 3){
            nspPID_ID1 = "";
            nspPID_ID1 += padHex(event.target.value.getUint8(3)).toString(16);
            nspPID_ID1 += padHex(event.target.value.getUint8(2)).toString(16);
            nspPID_ID1 += padHex(event.target.value.getUint8(1)).toString(16);
            nspPID_ID1 += padHex(event.target.value.getUint8(0)).toString(16);
        }
        else if(rpt_type_ID1 == 2){
            nspCS_ID1 ="";
            nspCS_ID1 += padHex(event.target.value.getUint8(1)).toString(16);
            nspCS_ID1 += padHex(event.target.value.getUint8(0)).toString(16);
            nspMaxIdx_ID1 = ((event.target.value.getUint8(3) << 8) | (event.target.value.getUint8(2)));
        }
        else if(rpt_type_ID1 == 1){
            // Battery level and NSP report
            nspStatus = "Ready"
            if((event.target.value.getUint8(3)) & 0x01)
            {   nspStatus = "Error!"    }
            volume = event.target.value.getUint8(2);
            battery = ((event.target.value.getUint8(1) << 8) | (event.target.value.getUint8(0)));
            voltage = ((battery * 4.2) / 1023);

            report = " " + battery.toString(10) + " (" + Math.ceil(voltage*100)/100 +"v)";
            document.getElementById("batt_p1").innerHTML = report;
            report = " " + nspStatus + " PID:" + nspPID_ID1 + " CS:0x" + nspCS_ID1 + " Max.index:" + nspMaxIdx_ID1.toString(10) + " Vol:" + volume.toString(10);
            document.getElementById("nspRpt_p1").innerHTML = report;
        }
        else{
            // OID report
            angle = (((event.target.value.getUint8(3) << 8) | (event.target.value.getUint8(2))) & 0x01FF); // 9 bits angle value (0 - 359)
            positionID = ((event.target.value.getUint8(1) << 8) | (event.target.value.getUint8(0)));
            report ="";
            report += " A:" + angle.toString(10) + " P:" + positionID.toString(10);
            document.getElementById("oidRpt_p1").innerHTML = report;
        }

        // Puck status report
        report = " ";
        report += decodePuckState(event.target.value.getUint8(4));
        document.getElementById("puckRpt_p1").innerHTML = report;

        let data_ID2 = "ID2:0x" ;
        data_ID2 += padHex(event.target.value.getUint8(5)).toString(16); // Puck status
        data_ID2 += padHex(event.target.value.getUint8(6)).toString(16); // Report data byte 3
        data_ID2 += padHex(event.target.value.getUint8(7)).toString(16); // Report data byte 2
        data_ID2 += padHex(event.target.value.getUint8(8)).toString(16); // Report data byte 1
        data_ID2 += padHex(event.target.value.getUint8(9)).toString(16); // Report data byte 0
        data_ID2 += " ";

        let rpt_type_ID2 = (event.target.value.getUint8(9) & 0x07);
        if(rpt_type_ID2 == 3){
            nspPID_ID2 = "";
            nspPID_ID2 += padHex(event.target.value.getUint8(8)).toString(16);
            nspPID_ID2 += padHex(event.target.value.getUint8(7)).toString(16);
            nspPID_ID2 += padHex(event.target.value.getUint8(6)).toString(16);
            nspPID_ID2 += padHex(event.target.value.getUint8(5)).toString(16);
        }
        else if(rpt_type_ID2 == 2){
            nspCS_ID2 ="";
            nspCS_ID2 += padHex(event.target.value.getUint8(6)).toString(16);
            nspCS_ID2 += padHex(event.target.value.getUint8(5)).toString(16);
            nspMaxIdx_ID2 = ((event.target.value.getUint8(8) << 8) | (event.target.value.getUint8(7)));
        }
        else if(rpt_type_ID2 == 1){
            // Battery level and NSP report
            nspStatus = "Ready"
            if((event.target.value.getUint8(8)) & 0x01)
            {   nspStatus = "Error!"    }
            volume = event.target.value.getUint8(7);
            battery = ((event.target.value.getUint8(6) << 8) | (event.target.value.getUint8(5)));
            voltage = ((battery * 4.2) / 1023);

            report = " " + battery.toString(10) + " (" + Math.ceil(voltage*100)/100 +"v)";
            document.getElementById("batt_p2").innerHTML = report;
            report = " " + nspStatus + " PID:" + nspPID_ID2 + " CS:0x" + nspCS_ID2 + " Max.index:" + nspMaxIdx_ID2.toString(10) + " Vol:" + volume.toString(10);
            document.getElementById("nspRpt_p2").innerHTML = report;
        }
        else{
            // OID report
            angle = (((event.target.value.getUint8(8) << 8) | (event.target.value.getUint8(7))) & 0x01FF); // 9 bits angle value (0 - 359)
            positionID = ((event.target.value.getUint8(6) << 8) | (event.target.value.getUint8(5)));
            report ="";
            report += " A:" + angle.toString(10) + " P:" + positionID.toString(10);
            document.getElementById("oidRpt_p2").innerHTML = report;
        }

        // Puck status report
        report = " ";
        report += decodePuckState(event.target.value.getUint8(9));
        document.getElementById("puckRpt_p2").innerHTML = report;

        let data_ID3 = "ID3:0x" ;
        data_ID3 += padHex(event.target.value.getUint8(10)).toString(16); // Puck status
        data_ID3 += padHex(event.target.value.getUint8(11)).toString(16); // Report data byte 3
        data_ID3 += padHex(event.target.value.getUint8(12)).toString(16); // Report data byte 2
        data_ID3 += padHex(event.target.value.getUint8(13)).toString(16); // Report data byte 1
        data_ID3 += padHex(event.target.value.getUint8(14)).toString(16); // Report data byte 0
        data_ID3 += " ";

        let rpt_type_ID3 = (event.target.value.getUint8(14) & 0x07);
        if(rpt_type_ID3 == 3){
            nspPID_ID3 = "";
            nspPID_ID3 += padHex(event.target.value.getUint8(13)).toString(16);
            nspPID_ID3 += padHex(event.target.value.getUint8(12)).toString(16);
            nspPID_ID3 += padHex(event.target.value.getUint8(11)).toString(16);
            nspPID_ID3 += padHex(event.target.value.getUint8(10)).toString(16);
        }
        else if(rpt_type_ID3 == 2){
            nspCS_ID3 ="";
            nspCS_ID3 += padHex(event.target.value.getUint8(11)).toString(16);
            nspCS_ID3 += padHex(event.target.value.getUint8(10)).toString(16);
            nspMaxIdx_ID3 = ((event.target.value.getUint8(13) << 8) | (event.target.value.getUint8(12)));
        }
        else if(rpt_type_ID3 == 1){
            // Battery level and NSP report
            nspStatus = "Ready"
            if((event.target.value.getUint8(13)) & 0x01)
            {   nspStatus = "Error!"    }
            volume = event.target.value.getUint8(12);
            battery = ((event.target.value.getUint8(11) << 8) | (event.target.value.getUint8(10)));
            voltage = ((battery * 4.2) / 1023);

            report = " " + battery.toString(10) + " (" + Math.ceil(voltage*100)/100 +"v)";
            document.getElementById("batt_p3").innerHTML = report;
            report = " " + nspStatus + " PID:" + nspPID_ID3 + " CS:0x" + nspCS_ID3 + " Max.index:" + nspMaxIdx_ID3.toString(10) + " Vol:" + volume.toString(10);
            document.getElementById("nspRpt_p3").innerHTML = report;
        }
        else{
            // OID report
            angle = (((event.target.value.getUint8(13) << 8) | (event.target.value.getUint8(12))) & 0x01FF); // 9 bits angle value (0 - 359)
            positionID = ((event.target.value.getUint8(11) << 8) | (event.target.value.getUint8(10)));
            report ="";
            report += " A:" + angle.toString(10) + " P:" + positionID.toString(10);
            document.getElementById("oidRpt_p3").innerHTML = report;
        }
        
        // Puck status report
        report = " ";
        report += decodePuckState(event.target.value.getUint8(14));
        document.getElementById("puckRpt_p3").innerHTML = report;

        let data_ID4 = "ID4:0x" ;
        data_ID4 += padHex(event.target.value.getUint8(15)).toString(16); // Puck status
        data_ID4 += padHex(event.target.value.getUint8(16)).toString(16); // Report data byte 3
        data_ID4 += padHex(event.target.value.getUint8(17)).toString(16); // Report data byte 2
        data_ID4 += padHex(event.target.value.getUint8(18)).toString(16); // Report data byte 1
        data_ID4 += padHex(event.target.value.getUint8(19)).toString(16); // Report data byte 0
        data_ID4 += " ";

        let rpt_type_ID4 = (event.target.value.getUint8(19) & 0x07);
        if(rpt_type_ID4 == 3){
            nspPID_ID4 = "";
            nspPID_ID4 += padHex(event.target.value.getUint8(18)).toString(16);
            nspPID_ID4 += padHex(event.target.value.getUint8(17)).toString(16);
            nspPID_ID4 += padHex(event.target.value.getUint8(16)).toString(16);
            nspPID_ID4 += padHex(event.target.value.getUint8(15)).toString(16);
        }
        else if(rpt_type_ID4 == 2){
            nspCS_ID4 ="";
            nspCS_ID4 += padHex(event.target.value.getUint8(16)).toString(16);
            nspCS_ID4 += padHex(event.target.value.getUint8(15)).toString(16);
            nspMaxIdx_ID4 = ((event.target.value.getUint8(18) << 8) | (event.target.value.getUint8(17)));
        }
        else if(rpt_type_ID4 == 1){
            // Battery level and NSP report
            nspStatus = "Ready"
            if((event.target.value.getUint8(18)) & 0x01)
            {   nspStatus = "Error!"    }
            volume = event.target.value.getUint8(17);
            battery = ((event.target.value.getUint8(16) << 8) | (event.target.value.getUint8(15)));
            voltage = ((battery * 4.2) / 1023);

            report = " " + battery.toString(10) + " (" + Math.ceil(voltage*100)/100 +"v)";
            document.getElementById("batt_p4").innerHTML = report;
            report = " " + nspStatus + " PID:" + nspPID_ID4 + " CS:0x" + nspCS_ID4 + " Max.index:" + nspMaxIdx_ID4.toString(10) + " Vol:" + volume.toString(10);
            document.getElementById("nspRpt_p4").innerHTML = report;
        }
        else{
            // OID report
            angle = (((event.target.value.getUint8(18) << 8) | (event.target.value.getUint8(17))) & 0x01FF); // 9 bits angle value (0 - 359)
            positionID = ((event.target.value.getUint8(16) << 8) | (event.target.value.getUint8(15)));
            report ="";
            report += " A:" + angle.toString(10) + " P:" + positionID.toString(10);
            document.getElementById("oidRpt_p4").innerHTML = report;
        }

        // Puck status report
        report = " ";
        report += decodePuckState(event.target.value.getUint8(19));
        document.getElementById("puckRpt_p4").innerHTML = report;

        // document.getElementById("rx_log").innerHTML = "Disabled the Rx log!!";
        document.getElementById("rx_log").innerHTML = "(" + padDec(logCounter).toString(10) + ") " + data_ID1 + data_ID2 + data_ID3 + data_ID4 + "<br>";
    };
}

/**
 * Function that updates the command using the corresponding
 * micro:bit Bluetooth characteristic.
 */
 function writeCmd() {
    addLog("Writing command... ", false);
    if (!bluetoothDevice) {
        addLogError("There is no device connected.");
    } else {
        if (bluetoothDevice.gatt.connected) {
            if (!rxCharacteristic) {
                addLogError("There is no Magnetometer Period characteristic.");
            } else {
                let buffer = new ArrayBuffer(16);
                let txData = new DataView(buffer, 0, 16);

                let colorInputP1 = document.getElementById("colorPicker_p1");
                colorInputP1.addEventListener("input", () => {document.getElementById("colorVal_p1").innerHTML = colorInputP1.value;});
                let colorInputP2 = document.getElementById("colorPicker_p2");
                colorInputP2.addEventListener("input", () => {document.getElementById("colorVal_p2").innerHTML = colorInputP2.value;});
                let colorInputP3 = document.getElementById("colorPicker_p3");
                colorInputP3.addEventListener("input", () => {document.getElementById("colorVal_p3").innerHTML = colorInputP3.value;});
                let colorInputP4 = document.getElementById("colorPicker_p4");
                colorInputP4.addEventListener("input", () => {document.getElementById("colorVal_p4").innerHTML = colorInputP4.value;});

                let volumeP1 = document.getElementById("sndVol_p1");
                volumeP1.addEventListener("input", () => {document.getElementById("sndVolSet_p1").innerHTML = volumeP1.value;});
                let volumeP2 = document.getElementById("sndVol_p2");
                volumeP2.addEventListener("input", () => {document.getElementById("sndVolSet_p2").innerHTML = volumeP2.value;});
                let volumeP3 = document.getElementById("sndVol_p3");
                volumeP3.addEventListener("input", () => {document.getElementById("sndVolSet_p3").innerHTML = volumeP3.value;});
                let volumeP4 = document.getElementById("sndVol_p4");
                volumeP4.addEventListener("input", () => {document.getElementById("sndVolSet_p4").innerHTML = volumeP4.value;});

                // console.log(colorInputP1.value);
                // console.log(txData.getUint8(0), txData.getUint8(1), txData.getUint8(2));

                if(document.getElementById("cmd_p1").value == 4){
                    // CMD_LED_SET
                    txData.setUint8(0, hexToRgb(colorInputP1.value).b);          // Blue
                    txData.setUint8(1, hexToRgb(colorInputP1.value).g);          // Green
                    txData.setUint8(2, hexToRgb(colorInputP1.value).r);          // Red
                    txData.setUint8(3, (((document.getElementById("cmd_p1").value << 4) & 0xF0) | (document.getElementById("pattern_p1").value & 0x0F)));
                }
                else if(document.getElementById("cmd_p1").value == 5){
                    // CMD_NSP_SET
                    txData.setUint8(0, ((document.getElementById("sndIdx_p1").value >> 0) & 0x00FF));
                    txData.setUint8(1, ((document.getElementById("sndIdx_p1").value >> 8) & 0x00FF));
                    txData.setUint8(2, (document.getElementById("sndVol_p1").value));
                    if(document.getElementById("sndMode_p1").checked == true)
                    {   txData.setUint8(3, (((document.getElementById("cmd_p1").value << 4) & 0xF0) | 0x01));   }
                    else
                    {   txData.setUint8(3, (((document.getElementById("cmd_p1").value << 4) & 0xF0) | 0x00));   }
                }
                else if(document.getElementById("cmd_p1").value == 6){
                    // CMD_NSP_INFO_GET
                    document.getElementById("nspRpt_p1").innerHTML = "&ensp; ---";
                    txData.setUint8(3, (((document.getElementById("cmd_p1").value << 4) & 0xF0) | 0x00));
                }
                else{
                    // CMD set only
                    txData.setUint8(3, (((document.getElementById("cmd_p1").value << 4) & 0xF0) | 0x00));
                }

                if(document.getElementById("cmd_p2").value == 4){
                    // CMD_LED_SET
                    txData.setUint8(4, hexToRgb(colorInputP2.value).b);          // Blue
                    txData.setUint8(5, hexToRgb(colorInputP2.value).g);          // Green
                    txData.setUint8(6, hexToRgb(colorInputP2.value).r);          // Red
                    txData.setUint8(7, (((document.getElementById("cmd_p2").value << 4) & 0xF0) | (document.getElementById("pattern_p2").value & 0x0F)));
                }
                else if(document.getElementById("cmd_p2").value == 5){
                    // CMD_NSP_SET
                    txData.setUint8(4, ((document.getElementById("sndIdx_p2").value >> 0) & 0x00FF));
                    txData.setUint8(5, ((document.getElementById("sndIdx_p2").value >> 8) & 0x00FF));
                    txData.setUint8(6, (document.getElementById("sndVol_p2").value));
                    if(document.getElementById("sndMode_p2").checked == true)
                    {   txData.setUint8(7, (((document.getElementById("cmd_p2").value << 4) & 0xF0) | 0x01));   }
                    else
                    {   txData.setUint8(7, (((document.getElementById("cmd_p2").value << 4) & 0xF0) | 0x00));   }
                }
                else if(document.getElementById("cmd_p2").value == 6){
                    // CMD_NSP_INFO_GET
                    document.getElementById("nspRpt_p2").innerHTML = "&ensp; ---";
                    txData.setUint8(7, (((document.getElementById("cmd_p2").value << 4) & 0xF0) | 0x00));
                }
                else{
                    // CMD set only
                    txData.setUint8(7, (((document.getElementById("cmd_p2").value << 4) & 0xF0) | 0x00));
                }

                if(document.getElementById("cmd_p3").value == 4){
                    // CMD_LED_SET
                    txData.setUint8(8, hexToRgb(colorInputP3.value).b);          // Blue
                    txData.setUint8(9, hexToRgb(colorInputP3.value).g);          // Green
                    txData.setUint8(10, hexToRgb(colorInputP3.value).r);          // Red
                    txData.setUint8(11, (((document.getElementById("cmd_p3").value << 4) & 0xF0) | (document.getElementById("pattern_p3").value & 0x0F)));
                }
                else if(document.getElementById("cmd_p3").value == 5){
                    // CMD_NSP_SET
                    txData.setUint8(8, ((document.getElementById("sndIdx_p3").value >> 0) & 0x00FF));
                    txData.setUint8(9, ((document.getElementById("sndIdx_p3").value >> 8) & 0x00FF));
                    txData.setUint8(10, (document.getElementById("sndVol_p3").value));
                    if(document.getElementById("sndMode_p3").checked == true)
                    {   txData.setUint8(11, (((document.getElementById("cmd_p3").value << 4) & 0xF0) | 0x01));   }
                    else
                    {   txData.setUint8(11, (((document.getElementById("cmd_p3").value << 4) & 0xF0) | 0x00));   }
                }
                else if(document.getElementById("cmd_p3").value == 6){
                    // CMD_NSP_INFO_GET
                    document.getElementById("nspRpt_p3").innerHTML = "&ensp; ---";
                    txData.setUint8(11, (((document.getElementById("cmd_p3").value << 4) & 0xF0) | 0x00));
                }
                else{
                    // CMD set only
                    txData.setUint8(11, (((document.getElementById("cmd_p3").value << 4) & 0xF0) | 0x00));
                }

                if(document.getElementById("cmd_p4").value == 4){
                    // CMD_LED_SET
                    txData.setUint8(12, hexToRgb(colorInputP4.value).b);          // Blue
                    txData.setUint8(13, hexToRgb(colorInputP4.value).g);          // Green
                    txData.setUint8(14, hexToRgb(colorInputP4.value).r);          // Red
                    txData.setUint8(15, (((document.getElementById("cmd_p4").value << 4) & 0xF0) | (document.getElementById("pattern_p4").value & 0x0F)));
                }
                else if(document.getElementById("cmd_p4").value == 5){
                    // CMD_NSP_SET
                    txData.setUint8(12, ((document.getElementById("sndIdx_p4").value >> 0) & 0x00FF));
                    txData.setUint8(13, ((document.getElementById("sndIdx_p4").value >> 8) & 0x00FF));
                    txData.setUint8(14, (document.getElementById("sndVol_p4").value));
                    if(document.getElementById("sndMode_p4").checked == true)
                    {   txData.setUint8(15, (((document.getElementById("cmd_p4").value << 4) & 0xF0) | 0x01));   }
                    else
                    {   txData.setUint8(15, (((document.getElementById("cmd_p4").value << 4) & 0xF0) | 0x00));   }
                }
                else if(document.getElementById("cmd_p4").value == 6){
                    // CMD_NSP_INFO_GET
                    document.getElementById("nspRpt_p4").innerHTML = "&ensp; ---";
                    txData.setUint8(15, (((document.getElementById("cmd_p4").value << 4) & 0xF0) | 0x00));
                }
                else{
                    // CMD set only
                    txData.setUint8(15, (((document.getElementById("cmd_p4").value << 4) & 0xF0) | 0x00));
                }

                let txDataRpt = "Write: [0x" + padHex(txData.getUint8(3)) + " 0x" + padHex(txData.getUint8(2)) + 
                                       " 0x" + padHex(txData.getUint8(1)) + " 0x" + padHex(txData.getUint8(0)) + 
                                       " 0x" + padHex(txData.getUint8(7)) + " 0x" + padHex(txData.getUint8(6)) + 
                                       " 0x" + padHex(txData.getUint8(5)) + " 0x" + padHex(txData.getUint8(4)) + 
                                       " 0x" + padHex(txData.getUint8(11)) + " 0x" + padHex(txData.getUint8(10)) + 
                                       " 0x" + padHex(txData.getUint8(9)) + " 0x" + padHex(txData.getUint8(8)) + 
                                       " 0x" + padHex(txData.getUint8(15)) + " 0x" + padHex(txData.getUint8(14)) + 
                                       " 0x" + padHex(txData.getUint8(13)) + " 0x" + padHex(txData.getUint8(12)) + "]<br>";
                document.getElementById("oidCommand").innerHTML = txDataRpt;
                rxCharacteristic.writeValue(txData)
                .then(_ => {
                    addLog("<font color='green'>OK</font>", true);
                })
                .catch(error => {
                    addLogError(error);
                });
            };
        } else {
            addLogError("There is no device connected.");
        };
    };
}

/**
 * Function that connects to a Bluetooth device, and saves the characteristics
 * associated with the UART service.
 */
function connect() {
    const boardCode = document.querySelector('#BoardCode').value;
    const boardCodeLen = document.querySelector('#BoardCode').value.length;
    if(boardCodeLen == 6) {
        let manufacturerData = {};

        const filterCompanyIdentifier = "0xFFFF";
        if (filterCompanyIdentifier) {
            manufacturerData.companyIdentifier = parseInt(filterCompanyIdentifier);
        }

        const filterDataPrefix = boardCode;
        // const filterDataPrefix = document.querySelector('#BoardCode').value;
        if (filterDataPrefix) {
            manufacturerData.dataPrefix = hexStringToUint8Array(filterDataPrefix);
        }

        const filterMask = boardCode;
        // const filterMask = document.querySelector('#BoardCode').value;
        if (filterMask) {
            manufacturerData.mask = hexStringToUint8Array(filterMask);
        }
        console.log(manufacturerData);
        addLog("Requesting Bluetooth devices... ", false);

        if (!navigator.bluetooth) {
            addErrorLog("Bluetooth not available in this browser or computer.");
        } 
        else {
            const options = { 
                            filters: [{ manufacturerData: [manufacturerData] }],
                            acceptAllDevices: false,
                            optionalServices: [microbitUuid.genericAccess[0], microbitUuid.genericAttribute[0], microbitUuid.deviceInformation[0], microbitUuid.uartService[0]],
            };
            addLog('with ' + JSON.stringify(options));
            navigator.bluetooth.requestDevice(options)
            .then(device => {
                addLog("<font color='green'>OK</font>", true);
                bluetoothDevice = device;
                addLog("Connecting to GATT server (name: <font color='blue'>" + device.name + "</font>, ID: <font color='blue'>" + device.id + "</font>)... ", false);            
                device.addEventListener('gattserverdisconnected', onDisconnected);
                document.getElementById("body").style = "background-color:#D0FFD0";
                return device.gatt.connect();
            })
            .then(server => {
                addLog("<font color='green'>OK</font>", true);
                addLog("Getting UART service (UUID: " + microbitUuid.uartService[0] + ")... ", false);
                return server.getPrimaryService(microbitUuid.uartService[0]);
            })
            .then(service => {
                addLog("<font color='green'>OK</font>", true);
                addLog("Getting TX characteristic... ", false);
                service.getCharacteristic(microbitUuid.txCharacteristic[0])
                .then(txChar => {
                    addLog("<font color='green'>OK</font>", true);
                    txCharacteristic = txChar;
                    addLog("Starting TX notifications... ", false);
                    return txChar.startNotifications()
                    .then(_ => {
                        txChar.addEventListener('characteristicvaluechanged', readTx);
                        addLog("<font color='green'>OK</font>", true);
                        addLog("Getting RX characteristic... ", false);
                        service.getCharacteristic(microbitUuid.rxCharacteristic[0])
                        .then(rxChar => {
                            rxCharacteristic = rxChar;
                            addLog("<font color='green'>OK</font>", true);
                            logCounter = 0x00;
                        })
                        .catch(error => {
                            addErrorLog(error);
                        });
                    })
                    .catch(error => {
                        addLogError(error);
                    });
                })
                .catch(error => {
                    addLogError(error);
                });
            })
            .catch(error => {
                addLogError(error);
            });
        };
    }
    else {
        addLogError("Entered invalid 6-digits board code!!");
    }
}

/**
 * Function that disconnects from the Bluetooth device (if connected).
 */
function disconnect() {
    addLog("Disconnecting... ", false);
    if (!bluetoothDevice) {
        addLogError("There is no device connected.");
    } else {
        if (bluetoothDevice.gatt.connected) {
            bluetoothDevice.gatt.disconnect();
            if (!bluetoothDevice.gatt.connected) {
                addLog("<font color='green'>OK</font>", true);
            }
        } else {
            addLogError("There is no device connected.");
        };
    };
}

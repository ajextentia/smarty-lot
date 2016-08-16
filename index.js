/**
 * Created by Arjun Sabharwal on 22/07/16 10:38 for Extentia Information Technology
 * Main Content : Alexa Skill for Smart Parking lot
 * Discription : Take a dweet.io Link and check status of the parking lot occupied or not and program addiotnal information questions.
 */


var slotStatus;
/**
 * App ID for the skill
 */
var APP_ID = ""; // Removed to Preserve Privacy

/**
 * The AlexaSkill prototype and helper functions
 */
var http = require('http'), AlexaSkill = require('./AlexaSkill');
var smartyLot = function () {
    AlexaSkill.call(this, APP_ID);
};

smartyLot.prototype = Object.create(AlexaSkill.prototype);
smartyLot.prototype.constructor = smartyLot;


smartyLot.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    getParkingStatus();
};

smartyLot.prototype.eventHandlers.onSessionEnded = function (event, context) {

};

smartyLot.prototype.intentHandlers = {
    HelpIntent: function (intent, session, response) {
        var speechOutput = "I am here to help you find parking Easily. Please Ask me, is there a free parking slot ?";
        var repromptText = "I am sorry I didn't quite catch that. Please try once again!";
        response.ask(speechOutput, repromptText, false);

    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye User!";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye User !";
        response.tell(speechOutput);
    },

    parkingIntent: function (intent, session, response) {
        //Questions : Is there a free parking slot ?
        //getParkingStatus();
        getData();
        var speechOutput;
        if(slotStatus == "true")
        {
            speechOutput = "There is a free Parking slot at Parking Lot 1 at Position A2. You may park there";
        }
        else if(slotStatus == "false")
        {
            speechOutput="There is No free Parking slot. Please check back Later.";
        }
        else if (slotStatus == "undefined")
        {
            speechOutput="Error in Dweet Server URL ; Please check";
        }

        console.log('speechOutput ' + speechOutput);
        response.tellWithCard(speechOutput, "Smarty Lot", speechOutput)
    },

    parkingIntentDebug: function (intent, session, response) {
        var response = getData();
        console.log("Alexa Debug Response");
        console.log(response);
    },

    typeofSlotIntent: function(intent,session,response){
      //Question : What sort of Parking is the Slot A2 ?
     var speechOutput = "The Parking lot is a Four Wheeler Parking";
        response.tellWithCard(speechOutput, "Smarty Lot", speechOutput);
    },

    navigateToSlotIntent : function(intent, session, response){
        //How do i reach Parking Position A2
        var speechOutput = "You take the Second Left from the Entrance Gate";
        response.tellWithCard(speechOutput, "Smarty Lot", speechOutput);

    }
};

function getData()
{
    var newData = '';
   http.get("",function(res){ // Removed to prevent Privacy.
        console.log('Response Before Parsing',res);
        
        res.setEncoding('utf8');
        res.on('data', function (dataresult) {
        console.log('inside before', dataresult);
        newData = JSON.parse(dataresult);
        console.log('inside parsed', newData);
        console.log('inside ', newData.with);
        if(newData.with[0].content.free == "true")
        {
            slotStatus = "true";
        }
        else
        {
            slotStatus = "false";
        } 
    
         });
    });
  }

function getParkingStatus()
{
    var response = getData();

    console.log('response ' + JSON.stringify(response));
    if(response.with[0].content.free == "true")
    {
        slotStatus = "true";
    }
    else
    {
        slotStatus = "false";
    } 
}

function debug() {
     getData();
   // console.log(getData);
}



// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SmartyLot skill.
    var instanceSmartyLot = new smartyLot();
    instanceSmartyLot.execute(event, context);
};


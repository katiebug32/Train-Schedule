// Initialize Firebase

var config = {
    apiKey: "AIzaSyAl5A3A0QVBpa2MD3umpBpdBrqWSyej4R0",
    authDomain: "yew-nork-train-schedule.firebaseapp.com",
    databaseURL: "https://yew-nork-train-schedule.firebaseio.com",
    projectId: "yew-nork-train-schedule",
    storageBucket: "yew-nork-train-schedule.appspot.com",
    messagingSenderId: "712529038242"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName;
var destination;
var firstArrivalTime;
var trainFrequency;
// var nextArrival;
// var minutesAway;
// var currTime;
// var firstArrivalConverted;
// var diffInTime;
// var timeRemainder;
// var updateTrainTimer;
var currentSnapshot;

setInterval(updateDBTimes, 30000);
 


function updateDBTimes() {
    $("#tbody").empty();
    renderTrainTable(currentSnapshot); //recalc and display as time changes
}


// grabs current values from firebase and loops through to get & calculate data
function renderTrainTable(snapshot) {
    $("#tbody").empty();
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val(); // values currently in firebase
        var trainData = getTrainData(childData.firstArrivalTime, childData.trainFrequency); //grabs and calcs data and returns updated values to refresh in DOM
        $("#tbody").append("<tr><td>" + childData.trainName +  "</td><td>" + 
        childData.destination + "</td><td>" + 
        childData.trainFrequency + "</td><td>" + 
        trainData.nextArrival + "</td><td>" + //calculated value
        trainData.minutesAway + "</td>"); //calculated value
    });
}

function getTrainData(firstArrivalTime, trainFrequency) {
    var firstArrivalConverted = moment(firstArrivalTime, "HH:mm").subtract(1, "days");
    console.log("FIRST TIME CONVERTED: ", moment(firstArrivalConverted).format("HH:mm"));
    var currTime = moment();
    console.log("CURRENT TIME: " + moment(currTime).format("HH:mm"));
    var diffInTime = moment().diff(moment(firstArrivalConverted), "minutes");
    console.log("DIFF IN TIME: ", diffInTime);
    var timeRemainder = diffInTime % trainFrequency;
    console.log("remainder: ", timeRemainder);
    var minutesAway = trainFrequency - timeRemainder;
    console.log("mins till train arrive: ", minutesAway);
    var nextArrival = moment().add(minutesAway, "minutes");
    nextArrival = moment(nextArrival).format("HH:mm");
    console.log("Next arrival: ", nextArrival);
    return { //calculated values returned to use in next step
        nextArrival: nextArrival,
        minutesAway: minutesAway
    }
};

//when any new data is input or changed, update and grab/store most current snapshot of values
database.ref().on("value", function (snapshot) {
    console.log(snapshot.val().destination);
    renderTrainTable(snapshot); 
    currentSnapshot = snapshot; // save the snapshot info for interval use
}, function (error) {
    console.log("error", error);
});


$("#submitButton").on("click", function (event) {
    event.preventDefault();
    trainName = $("#train").val().trim();
    destination = $("#dest").val().trim();
    firstArrivalTime = $("#firstArriv").val().trim();
    console.log("firstarrivaltime: ", firstArrivalTime); //needed this to verify time calcs
    trainFrequency = $("#freq").val().trim();

//making sure no input fields were left empty
    if (trainName == '' || destination == '' || firstArrivalTime == NaN || firstArrivalTime == "" || trainFrequency == '') {
        alert("Please fill out all input fields.");
    }
    else {
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstArrivalTime: firstArrivalTime,
            trainFrequency: trainFrequency,

            //didn't need these:
            // currTime: currTime,
            // diffInTime: diffInTime,
            // timeRemainder: timeRemainder,
            // minutesAway: minutesAway,
            // nextArrival: nextArrival
        });
    
    $("input").val("");
    }
});
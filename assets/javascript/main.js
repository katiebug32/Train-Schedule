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
var nextArrival;
var minutesAway;
var currTime;
var firstArrivalConverted;
var diffInTime;
var timeRemainder;
var updateTrainTimer;
var currentSnapshot;

setInterval(updateDBTimes, 30000);
 


function updateDBTimes() {
    $("#tbody").empty();
    renderTrainTable(currentSnapshot);
    // currentSnapshot.forEach(function (childSnapshot) {
    //     var childData = childSnapshot.val();
    //     // childData.firstArrivalConverted = moment(firstArrivalTime, "HH:mm").subtract(1, "years");
    //     // console.log("FIRST TIME CONVERTED: ", firstArrivalConverted);
    //     childData.currTime = moment().format("LLLL");
    //     // console.log("CURRENT TIME: ", childData.currTime);
    //     childData.diffInTime = moment().diff(moment(childData.firstArrivalConverted, "minutes"));
    //     // console.log("DIFF IN TIME: ", diffInTime);
    //     childData.timeRemainder = childData.diffInTime % childData.trainFrequency;
    //     // console.log("remainder: ", timeRemainder);
    //     childData.minutesAway = childData.trainFrequency - childData.timeRemainder;
    //     // console.log("mins till train arrive: ", minutesAway);
    //     childData.nextArrival = moment().add(childData.minutesAway, "minutes");
    //     childData.nextArrival = moment(childData.nextArrival).format("hh:mm");
    //     // console.log("Next arrival: ", nextArrival);
    
    //     // database.ref().set({
    //     //     trainName: childData.trainName,
    //     //     destination: childData.destination,
    //     //     firstArrivalTime: childData.firstArrivalTime,
    //     //     trainFrequency: childData.trainFrequency,
    //     //     currTime: childData.currTime,
    //     //     diffInTime: childData.diffInTime,
    //     //     timeRemainder: childData.timeRemainder,
    //     //     minutesAway: childData.minutesAway,
    //     //     nextArrival: childData.nextArrival
    //     // });
    //     $("#tbody").append("<tr><td>" + childData.trainName + "</td><td>" + childData.destination + "</td><td>" + childData.trainFrequency + "</td><td>" + childData.nextArrival + "</td><td>" + childData.minutesAway + "</td>");
    // });
}

function renderTrainTable(snapshot) {
    $("#tbody").empty();
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        var trainData = getTrainData(childData.firstArrivalTime, childData.trainFrequency);
        $("#tbody").append("<tr><td>" + childData.trainName +  "</td><td>" + 
        childData.destination + "</td><td>" + 
        childData.trainFrequency + "</td><td>" + 
        trainData.nextArrival + "</td><td>" + 
        trainData.minutesAway + "</td>");
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
    return {
        nextArrival: nextArrival,
        minutesAway: minutesAway
    }
};


database.ref().on("value", function (snapshot) {
    console.log(snapshot.val().destination);
    renderTrainTable(snapshot);
    currentSnapshot = snapshot;
}, function (error) {
    console.log("error", error);
});


$("#submitButton").on("click", function (event) {
    event.preventDefault();
    trainName = $("#train").val().trim();
    destination = $("#dest").val().trim();
    firstArrivalTime = $("#firstArriv").val().trim();
    console.log("firstarrivaltime: ", firstArrivalTime);
    trainFrequency = $("#freq").val().trim();


    if (trainName == '' || destination == '' || firstArrivalTime == NaN || firstArrivalTime == "" || trainFrequency == '') {
        alert("Please fill out all input fields.");
    }
    else {
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstArrivalTime: firstArrivalTime,
            trainFrequency: trainFrequency,
            // currTime: currTime,
            // diffInTime: diffInTime,
            // timeRemainder: timeRemainder,
            // minutesAway: minutesAway,
            // nextArrival: nextArrival
        });
        // getTrainData();
    // <td>" + startDate + "</td><td>" + monthPay + "</td>");
    //   $("<tr>").appendTo("#tbody").attr("id", "empData");
    //   $("<td>").text(name).appendTo("#empData");
    $("input").val("");
    }
});
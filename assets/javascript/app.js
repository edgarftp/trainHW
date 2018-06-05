var config = {
    apiKey: "AIzaSyAFfl3o73EeF7ZaROrEeWiDB-k1WcnzgX8",
    authDomain: "trains-46e55.firebaseapp.com",
    databaseURL: "https://trains-46e55.firebaseio.com",
    projectId: "trains-46e55",
    storageBucket: "trains-46e55.appspot.com",
    messagingSenderId: "1066324173746"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var train = 0;
  var array = null;

  database.ref().on("value", function(snapshot) {
  var obje = snapshot.val();
  train =0;
  $("#divHolder").empty();
  console.log(obje);
  for (i=0; i<Object.keys(obje).length;i++){
    var index = ("train" + i);
    var data = obje[index];
    train++;
    console.log(data);
    var newDiv = $("<div>").addClass("row p-0 m-0 m-0 col-md-12 line-table");
    var spanName = $("<span>").text(data.name).addClass("col-md-3 header-3");
    var spanDest = $("<span>").text(data.destination).addClass("col-md-2 header-3");
    var spanFreq = $("<span>").text(data.frequency).addClass("col-md-2 header-3");
    var spanNext = $("<span>").text(data.next).addClass("col-md-2 header-3");
    var spanMin = $("<span>").text(data.minAway).addClass("col-md-2 header-3");

    newDiv.append(spanName, spanDest, spanFreq, spanNext, spanMin);
    $("#divHolder").append(newDiv);
  }

  
});

var update = function () {
  console.log("update?");
  var ref = database.ref();
  ref.once("value").then(function (snapshot){
    var object = snapshot.val();
    for (i=0; i<Object.keys(object).length; i++){
      var index = ("train" + i);
      var data = object[index];
      var now = moment().format("hh:mm a");
      var differ= moment(now,"hh:mm a").diff(moment(data.firstTrain, "hh:mm a"), "m");
      var minAway = data.frequency - (differ % data.frequency);
      var nextArrival = moment(now, "hh:mm a").add(minAway, "m").format("hh:mm a");
      database.ref("/train"+ i).update({
        next: nextArrival,
        minAway: minAway
      });
    }

  })

}

var interval = setInterval(function() {
  var ref = database.ref()
  ref.once("value").then(function (snapshot){
    var object = snapshot.val();
    for (i=0; i<Object.keys(object).length;i++){
      var index = ("train" + i);
      var data = object[index];
      var now = moment().format("hh:mm a");
      var differ= moment(now,"hh:mm a").diff(moment(data.firstTrain, "hh:mm a"), "m");
      var minAway = data.frequency - (differ % data.frequency);
      var nextArrival = moment(now, "hh:mm a").add(minAway, "m").format("hh:mm a");
      database.ref("/train"+ i).update({
        next: nextArrival,
        minAway: minAway
      });
    }

  })
}, 60000);

  $("#submitBtn").on("click", function() {

    event.preventDefault();
    var name = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var frequency = $("#frequency").val().trim();
    var now = moment().format("hh:mm a");
    firstTrain = moment(firstTrain, "HH:mm").format("hh:mm a");
    var differ= moment(now,"hh:mm a").diff(moment(firstTrain, "hh:mm a"), "m");
    var minAway = frequency - (differ % frequency);
    var nextArrival = moment(now, "hh:mm a").add(minAway, "m").format("hh:mm a");
    database.ref("/train" + train).set({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      next: nextArrival,
      minAway: minAway,
      train: train
    });

    train++;

    console.log(name);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);
  })

  update();
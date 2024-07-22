const express = require("express");
const cors = require("cors");
const model = require("./model");
const session = require("express-session");

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret:
      "jkgajfidpafjkdla;jreihvnaejklfjdaipeipdnkavajdfiejaifdkvbaghifiejkl;",
    saveUninitialized: true,
    resave: false,
  })
);

//this one might not need to be here
app.use(express.static("public"));

async function AuthMiddleware(request, response, next) {
  // step one check if they have a session
  if (request.session && request.session.userID) {
    //  step two check if that session user id connects to a user in our database
    let user = await model.User.findOne({ _id: request.session.userID });
    if (!user) {
      return response.status(401).send("unauthenticated");
    }
    // if they are autheticated just pass them to the endpoint
    request.user = user;
    console.log("REQUEST", request.user);
    next();
  } else {
    return response.status(401).send("unauthenticated");
  }
}

//
// Users
//

app.get("/users", async (request, response) => {
  try {
    let users = await model.User.find({}, { password: 0 });
    response.send(users);
  } catch (error) {
    console.log(error);
    response.status(500).send("bad Request");
  }
});

app.get("/users/:userID", async (req, res) => {
  try {
    let user = await model.User.findOne({ _id: req.params.userID });
    if (!user) {
      console.log("oops lost the user");
      res.status(404).send("oops lost the user");
      return;
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    console.log("Bad request (GET)");
    res.status(400).send("User not found");
  }
});

app.post("/users", async (request, response) => {
  try {
    let newUser = await new model.User({
      email: request.body.email,
      name: request.body.name,
      rsw: [],
    });
    await newUser.setPassword(request.body.password);
    const error = await newUser.validateSync();
    if (error) {
      console.log(error);
      return response.status(422).send(error);
    }
    await newUser.save();
    request.session.userID = newUser._id;
    response.status(201).send("new User created");
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});
app.put("/users/:userID", AuthMiddleware, async function (req, res) {
  try {
    let user = await model.User.findOne({
      _id: req.params.userID,
    });

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    user.rsw.set(req.body.workoutID, req.body.rsw);

    const error = await user.validateSync();
    if (error) {
      res.status(422).send(error);
      console.log(error);
      return;
    }
    await user.save();
    res.status(201).send("added RSW");
  } catch (error) {
    console.error(error);
    res.status(422).send(error);
  }
});

//
// Workouts
//

// might want to add a post for workouts

// for the workout one where would we be getting the information and how?
// we just pluged in the info into the database
app.get("/workouts", async (request, response) => {
  try {
    let workout = await model.Workout.find();
    response.send(workout);
    // console.log(workout);
  } catch (error) {
    console.log(error);
    response.status(500).send("Generic error");
  }
});

//
// Days
//

app.put("/days/:id", AuthMiddleware, async function (request, response) {
  try {
    let day = await model.Day.findOne({
      _id: request.params.id,
      owner: request.session.userID,
    }).populate("owner", "-password");

    // console.log(day);
    if (!day) {
      response.status(404).send("Could not find that workout");
      return;
    }
    console.log("Session", request.user._id, "OWNER", day.owner);
    if (request.user._id.toString() === day.owner._id.toString()) {
      // console.log("miau");
      day.name = request.body.name;
      day.workouts = request.body.workouts;
    }
    const error = await day.validateSync();
    if (error) {
      response.status(402).send(error);
      return;
    }
    await day.save();
    response.status(204).send("Updated");
  } catch (error) {
    console.log(error);
    response.status(500).send("Generic error");
  }
});
app.delete("/days/:id", AuthMiddleware, async function (request, response) {
  try {
    let isDeleted = await model.Day.findOneAndDelete({
      _id: request.params.id,
      owner: request.user._id,
    });
    if (!isDeleted) {
      return response.status(404).send("could not delete that");
    }
    response.status(204).send("Deleted");
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.get("/days/:dayID", async function (req, res) {
  try {
    // console.log(req.params.daysid);
    let day = await model.Day.findOne({ _id: req.params.dayID })
      .populate("owner", "-password")
      .populate("workouts");
    // console.log(day);
    if (!day) {
      console.log("Day not found");
      res.status(404).send("day not found");
      return;
    }
    res.json(day);
  } catch (error) {
    console.log(error);
    console.log("bad request (Get day)");
    res.status(400).send("day is not found");
  }
});

app.get("/days", async function (request, response) {
  try {
    let day = await model.Day.find()
      .populate("owner", "-password")
      .populate("workouts");
    if (!day) {
      return response.status(404).send("Could not find that workout");
    }
    response.json(day);
    // console.log(day);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});
// got to fix post for days too include exercise maybe we dont need it. we will talk about this and if needed go back to old repo

app.post("/days", AuthMiddleware, async function (req, res) {
  try {
    const newDay = new model.Day({
      name: req.body.name,
      workouts: req.body.workouts,
      owner: req.session.userID,
      reviews: req.body.reviews,
    });

    const error = await newDay.validateSync();
    if (error) {
      res.status(422).send(error);
      console.error(error);
      return;
    }

    await newDay.save();
    res.status(201).json(newDay);
  } catch (error) {
    console.error(error);
    res.status(422).send(error);
  }
});

//
// Sessions
//

app.get("/session", (request, response) => {
  response.send(request.session);
});

app.delete("/session", function (request, response) {
  request.session.userID = undefined;
  response.status(204).send();
});

app.post("/session", async (request, response) => {
  console.log("1");
  try {
    let user = await model.User.findOne({ email: request.body.email });
    console.log("2");
    if (!user) {
      console.log("3");
      return response.status(401).send("Authentication failed");
    }
    let isGoodPassword = await user.verifyPassword(request.body.password);
    console.log("4");
    if (!isGoodPassword) {
      console.log("%");
      return response.status(401).send("Authentication failed");
    }
    request.session.userID = user._id;
    request.session.name = user.name;
    request.session.rsw = user.rsw;
    // console.log("request session", request.session);

    response.status(201).send(request.session);
  } catch (error) {
    response.status(500);
    console.log(error);
  }
});

//
// Weeks
//

app.put("/weeks/:id", AuthMiddleware, async function (request, response) {
  try {
    console.log("request", request.body);
    let week = await model.Week.findOne({
      _id: request.params.id,
      owner: request.session.userID,
    }).populate("owner", "-password");
    // console.log(week);
    if (!week) {
      response.status(404).send("could not find that workout");
      return;
    }
    console.log("week", week);
    // This might not be needed as when we go to fecth the week we also pass in the owner and it will only return the one with the owner the same as the session id.
    if (request.user._id.toString() === week.owner._id.toString()) {
      console.log("TESTING");
      week.name = request.body.name;
      week.dow = request.body.dow;
      week.description = request.body.description;
      week.days = request.body.days;
    }
    const error = await week.validateSync();
    if (error) {
      console.log("Hello");
      response.status(402).send(error);
      return;
    }
    await week.save();
    response.status(204).send("Updated");
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.get("/weeks", async function (req, res) {
  try {
    let week = await model.Week.find()
      .populate("owner", "-password")
      .populate("days")
      .populate({ path: "days", populate: { path: "workouts" } });
    // console.log(week);
    if (!week) {
      res.status(404).send("Weeks not found");
      return;
    }
    res.json(week);
  } catch (error) {
    console.log(error);
    res.status(404).send("Wees not found");
  }
});

app.post("/weeks", AuthMiddleware, async function (req, res) {
  try {
    const newWeek = new model.Week({
      name: req.body.name,
      dow: req.body.dow,
      description: req.body.description,
      days: req.body.days,
      owner: req.session.userID,
      reviews: req.body.reviews,
    });

    const error = await newWeek.validateSync();
    if (error) {
      res.status(422).send(error);
      console.log(error);
      return;
    }

    await newWeek.save();
    res.status(201).send("Week created :3");
  } catch (error) {
    console.error(error);
    res.status(422).send(error);
  }
});

// need to maybe add when we delete a week we delete the day.
// unless the day is a seperate thing that they just add.

app.delete("/weeks/:weekID", AuthMiddleware, async function (req, res) {
  try {
    let isDeleted = await model.Week.findOneAndDelete({
      _id: req.params.weekID,
      owner: req.session.userID,
    });
    // console.log(isDeleted);
    if (!isDeleted) {
      res.status(404).send("Week not found");
      return;
    }
    res.status(204).send("Removed");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.get("/weeks/:weekID", async function (req, res) {
  try {
    console.log(req.params.weekID);
    let week = await model.Week.find({ _id: req.params.weekID })
      .populate("owner", "-password")
      .populate("days")
      .populate({ path: "days", populate: { path: "workouts" } });

    console.log(week);
    if (!week) {
      console.log("week not found");
      res.status(404).send("week not found");
      return;
    }
    res.json(week);
  } catch (error) {
    console.log(error);
    console.log("bad requst (GET week)");
    res.status(400).send("week not found");
  }
});

// incrimenting code

app.post("/time", AuthMiddleware, async function (req, res) {
  try {
    const timestamp = new model.Time({
      owner: req.session.userID,
      weekInt: req.body.weekInt,
    });

    const error = await timestamp.validateSync();
    if (error) {
      res.status(422).send(error);
      console.log(error);
      return;
    }

    await timestamp.save();
    res.status(201).send("Created Stamp");
  } catch (error) {
    console.error(error);
    res.status(422).send(error);
  }
});

app.put("/time", AuthMiddleware, async function (req, res) {
  try {
    let timestamp = await model.Time.findOne({
      owner: req.session.userID,
    }).populate("owner");

    if (!timestamp) {
      res.status(404).send("Could not find timestamp");
      return;
    }

    timestamp.weekInt = req.body.weekInt;

    const error = await timestamp.validateSync();
    if (error) {
      res.status(422).send(error);
      console.log(error);
      return;
    }
    await timestamp.save();
    res.status(201).send("successfully updated");
  } catch (error) {
    console.error(error);
    res.status(422).send(error);
  }
});

app.get("/time/:userID", async function (req, res) {
  try {
    let timestamp = await model.Time.findOne({ owner: req.params.userID });
    if (!timestamp) {
      console.log("Timestamp not found");
      res.status(404).send("Timestamp not found");
      return;
    }
    res.json(timestamp);
  } catch (error) {
    console.log(error);
    console.log("Bad request (GET)");
    res.status(400).send("Timestamp not found");
  }
});

// Personal GET,POST,PUT(and splice), and DELETE

app.get("/personal/:userID", AuthMiddleware, async function (req, res) {
  try {
    let week = await model.Personal.find({ owner: req.params.userID })
      .populate("owner", "-password")
      .populate({ path: "days", populate: { path: "workouts" } });
    // console.log(week);
    if (!week) {
      res.status(404).send("Weeks not found");
      return;
    }
    res.json(week);
  } catch (error) {
    console.log(error);
    res.status(404).send("Wees not found");
  }
});

app.post("/personal/:userID", AuthMiddleware, async function (req, res) {
  try {
    console.log(req.body);

    const newWeek = new model.Personal({
      name: req.body.name,
      dow: req.body.dow,
      description: req.body.description,
      days: req.body.days,
      owner: req.session.userID,
      reviews: req.body.reviews,
    });

    const error = await newWeek.validateSync();
    if (error) {
      res.status(422).send(error);
      console.log(error);
      return;
    }

    await newWeek.save();
    res.status(201).send("Created personal Quiz :3");
  } catch (error) {
    console.error(error);
    res.status(422).send(error);
  }
});

app.put("/personal/:weekID", AuthMiddleware, async function (req, res) {
  try {
    let week = await model.Personal.findOne({
      _id: req.params.weekID,
      owner: req.session.userID,
    }).populate("owner");

    if (!week) {
      res.status(404).send("Could not find week.");
      return;
    }

    week.name = req.body.name;
    week.dow = req.body.dow;
    week.description = req.body.dow;
    week.days = req.body.days;
    week.reviews = req.body.reviews;

    const error = await week.validateSync();
    if (error) {
      res.status(422).send(error);
      console.log(error);
      return;
    }
    await week.save();
    res.status(201).send("week updated :3");
  } catch (error) {
    console.log(error);
    res.status(422).send(error);
  }
});

app.delete("/personal/:weekID", AuthMiddleware, async function (req, res) {
  try {
    let isDeleted = await model.Personal.findOneAndDelete({
      _id: req.params.weekID,
      owner: req.session.userID,
    });
    if (!isDeleted) {
      res.status(404).send("Week not found");
      return;
    }

    res.status(204).send("Removed week ;3");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.listen(8080, function () {
  console.log("server is running on http://localhost:8080...");
});

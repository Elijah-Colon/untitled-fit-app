const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

mongoose.connect(process.env.DBPASSWORD);

const UserSchema = Schema(
  {
    email: {
      type: String,
      required: [true, "User MUST have an email"],
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "User MUST have a password"],
    },
    rsw: {
      type: Map,
      of: {
        reps: {
          type: Number,
        },
        sets: {
          type: Number,
        },
        weight: {
          type: Number,
        },
      },
    },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const WorkoutSchema = Schema({
  Name: {
    type: String,
    required: true,
  },
  muscle: [{ type: String, required: true }],
  reps: {
    type: Number,
    required: false,
  },
  sets: {
    type: Number,
    required: false,
  },
});
// got to make front end work with this
const DaySchema = Schema({
  name: {
    type: String,
    required: [true, "Day needs a name"],
  },
  workouts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Workout",
      required: [true, "day needs a workout"],
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A day needs an owner"],
  },
  reviews: {
    type: String,
  },
});

const WeekSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Week needs a name"],
    },
    dow: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: [true, "Week needs a description"],
    },
    days: [
      {
        type: Schema.Types.ObjectId,
        ref: "Day",
        required: [true, "Week needs days"],
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A week needs an owner"],
    },
    reviews: {
      type: String,
    },
  },
  { timestamps: true }
);

const PersonalSchema = Schema({
  name: {
    type: String,
    required: [true, "week needs a name"],
  },
  dow: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: [true, "Week needs a description"],
  },
  days: [
    {
      name: {
        type: String,
        required: [true, "Day needs a name"],
      },
      workouts: [
        {
          type: Schema.Types.ObjectId,
          ref: "Workout",
          required: [true, "day needs a workout"],
        },
      ],
      owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [false, "A day needs an owner"],
      },
      reviews: {
        type: String,
      },
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A week needs an owner"],
  },
  reviews: {
    type: String,
  },
});

const IncrSchema = Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [
        true,
        "You need to have a user to incriment (or however you spell it)",
      ],
    },
    weekInt: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6],
      required: [true, "You need to tell if you've passed a week"],
    },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.methods.setPassword = async function (plainPassword) {
  try {
    let hashedWord = await bcrypt.hash(plainPassword, 12);
    this.password = hashedWord;
  } catch (error) {}
};

UserSchema.methods.verifyPassword = async function (plainPassword) {
  // first param is the plane password from user
  //   second one is the hashed one from the user
  let isGood = await bcrypt.compare(plainPassword, this.password);
  return isGood;
};

const User = mongoose.model("User", UserSchema);
const Workout = mongoose.model("Workout", WorkoutSchema);
const Day = mongoose.model("Day", DaySchema);
const Week = mongoose.model("Week", WeekSchema);
const Time = mongoose.model("Time", IncrSchema);
const Personal = mongoose.model("Personal", PersonalSchema);

module.exports = {
  User,
  Workout,
  Day,
  Week,
  Time,
  Personal,
};

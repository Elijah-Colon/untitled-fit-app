const URL = "http://localhost:8080";
const { createVuetify } = Vuetify;
const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
  },
});
Vue.createApp({
  data() {
    return {
      workouts: [],
      days: [],
      weeks: [],
      randomNum: 0,
      currentPage: "Browse",
      user: {
        name: "",
        email: "",
        password: "",
        _id: "",
        rsw: [],
      },
      searchInput: "",

      newDay: {
        name: "",
        workouts: [],
      },
      newWorkout: [
        {
          work: "",
          searchInput: "",
        },
      ],
      sort: "",
      currentUser: {},
      currentWeek: [],
      currentDay: [],
      newWeek: {
        name: "",
        description: "",
        days: [],
      },
      newWeekDay: [],
      timestamp: "",
      weekInt: null,
      modalOpen: true,
      modal: {
        name: "",
        workout: [],
        id: "",
        show: false,
      },
      incrUser: {},
      lastPage: "",
      personalDay: [],
      editingday: [],
      editingdayWorkouts: [],
      warning: 0,
      rswSetups: [
        {
          workoutID: "",
          rsw: {
            reps: 0,
            sets: 0,
            weight: 0,
          },
          amount: 1,
        },
      ],
      inputRWS: {
        workoutID: "",
        rsw: {
          reps: 0,
          sets: 0,
          weight: 0,
        },
        amount: 1,
      },

      rswSET: [
        {
          input: "RSW",
        },
      ],
      personalWeeks: [],
      incrWorkID: "",
      newPersonalWeek: {
        name: "",
        description: "",
        days: [],
      },
      newPersonalDay: [
        {
          name: "",
          workouts: [],
        },
      ],
      personalModalOpen: true,
      personalModal: {
        name: "",
        workout: [],
        id: "",
        show: false,
      },
      editingPersonalDay: [],
      editingPersonalDayWorkouts: [],
      personalDayIndex: -1,
      personalDayArray: [],
      modalDay: {},
      flag: 0,
      whichEdit: 0,
      tempRSW: [
        {
          workoutID: "",
          rsw: {
            reps: 0,
            sets: 0,
            weight: 0,
          },
          amount: 1,
        },
      ],
      tempSET: [
        {
          input: "RSW",
        },
      ],
      temp: 0,
      flag: 0,
      bol: true,
      instructionsRandomDay: "",
    };
  },
  methods: {
    addRSW: function (index) {
      this.rswSetups.push({
        workoutID: "",
        rsw: {
          reps: 0,
          sets: 0,
          weight: 0,
        },
        amount: 1,
      });
    },
    // addRSWweek: function () {
    //   if (this.flag > 0) {
    //     this.rswSetups.push({
    //       workoutID: "",
    //       rsw: {
    //         reps: 0,
    //         sets: 0,
    //         weight: 0,
    //       },
    //       amount: 1,
    //     });
    //     console.log(this.rswSetups);
    //   } else {
    //     this.flag++;
    //     console.log(this.rswSetups);
    //   }
    // },
    clearTEMP: function () {
      this.tempSET = [
        {
          input: "RSW",
        },
      ];
      this.tempRSW = {
        workoutID: "",
        rsw: {
          reps: 0,
          sets: 0,
          weight: 0,
        },
        amount: 1,
      };
    },
    setRSW: function (option, index) {
      if (option === "RSW") {
        this.rswSET[index].input = "time";
        this.rswSetups[index].rsw.reps = 0;
        this.rswSetups[index].rsw.sets = 0;
        this.rswSetups[index].rsw.weight = 0;
      } else {
        this.rswSET[index].input = "RSW";
        this.rswSetups[index].rsw.weight = 0;
      }
    },
    setWeek: function (option, dayindex, index) {
      if (option === "RSW") {
        this.newWeekDay[dayindex].set[index].input = "time";
        this.newWeekDay[dayindex].rsw[index].rsw.reps = 0;
        this.newWeekDay[dayindex].rsw[index].rsw.sets = 0;

        this.newWeekDay[dayindex].rsw[index].rsw.weight = 0;
      } else {
        this.newWeekDay[dayindex].set[index].input = "RSW";
        this.newWeekDay[dayindex].rsw[index].rsw.weight = 0;
      }
    },
    setTEMP: function (option, dayindex, index) {
      if (option === "RSW") {
        this.newWeekDay[dayindex].set[index].input = "time";
        this.newWeekDay[dayindex].rsw[index].rsw.reps = 0;
        this.newWeekDay[dayindex].rsw[index].rsw.sets = 0;

        this.newWeekDay[dayindex].rsw[index].rsw.weight = 0;
      } else {
        this.newWeekDay[dayindex].set[index].input = "RSW";
        this.newWeekDay[dayindex].rsw[index].rsw.weight = 0;
      }
    },

    makeRSW: async function () {
      this.flag = 0;
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      for (let element of this.rswSetups) {
        console.log(element);
        let TEMP = {
          workoutID: "",
          rsw: {
            reps: 0,
            sets: 0,
            weight: 0,
          },
        };
        TEMP.workoutID = element.workoutID;
        TEMP.rsw.reps = element.rsw.reps;
        TEMP.rsw.sets = element.rsw.sets;
        TEMP.rsw.weight = element.rsw.weight;
        console.log(TEMP);

        let requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify(TEMP),
        };
        let userID = this.currentUser.userID;
        let response = await fetch(`${URL}/users/${userID}`, requestOptions);
        if (response.status === 201) {
          this.clearRSW();
          console.log("Succesfully created workout reps/sets/time");
        }
      }
      let userID = this.currentUser.userID;
      let response = await fetch(`${URL}/users/${userID}`);
      let data = await response.json();
      let Temp = {
        rsw: data.rsw,
      };
      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(Temp),
      };
      console.log(data.rsw);

      let sessionResponse = await fetch(`${URL}/session`, requestOptions);
      let sessionData = await sessionResponse.json();
      console.log("sessionData", sessionData);
      this.clearTEMP();
    },
    clearRSW: function () {
      this.rswSET = [
        {
          input: "RSW",
        },
      ];
      this.rswSetups = [
        {
          workoutID: "",
          rsw: {
            reps: 0,
            sets: 0,
            weight: 0,
          },
          amount: 1,
        },
      ];
      console.log("SET", this.rswSET);
      console.log(this.rswSetups);
    },

    // Workouts
    getWorkouts: async function () {
      let response = await fetch(`${URL}/workouts`);

      let data = await response.json();
      this.workouts = data;
      for (let string of this.workouts[this.randomNum].instructions) {
        this.instructionsRandomDay += string;
      }
    },
    // Days
    getDays: async function () {
      let response = await fetch(`${URL}/days`);

      let data = await response.json();
      this.days = data;
      console.log(data);
    },
    // Weeks
    getWeeks: async function () {
      let response = await fetch(`${URL}/weeks`);

      let data = await response.json();
      this.weeks = data;
      console.log(data);
    },
    addDay: function () {
      this.newWeekDay.push({
        name: "",
        workout: [],
        id: "",
        show: true,
        set: [],
        rsw: [],
      });
    },
    toggleModal: function () {
      this.modalOpen = !this.modalOpen;
    },
    updateNewWeekday: async function () {
      if (this.modal.id != "") {
        let response = await fetch(`${URL}/days/${this.modal.id}`);
        let data = await response.json();
        let modal = {
          name: "",
          workout: [],
          id: "",
          show: false,
        };
        modal.name = data.name;
        modal.id = this.modal.id;
        this.newWeekDay.push(modal);
        console.log("LOCal", modal);
        console.log("modal", this.modal);
        console.log("week", this.newWeekDay);
        this.modal.name = "";
        this.modal.id = "";
        this.toggleModal();
      } else {
        alert("Please enter a day");
      }
    },
    changeTEMP: function () {
      this.temp = 1;
    },
    makeWorkout: function (index) {
      console.log(this.newWeekDay);
      console.log(index);
      this.newWeekDay[index].workout.push({
        work: "",
        searchInput: "",
        filterWorkout: [],
      });
      if (this.temp === 0) {
        this.rswSET.push({
          input: "RSW",
        });
      } else {
        // if (this.newWeekDay[index].rsw.length === 1) {
        // this.bol = false;
        // this.newWeekDay[index].rsw.push("HELLO");

        // }
        // if (this.bol) {
        this.newWeekDay[index].set.push({
          input: "RSW",
        });
        this.newWeekDay[index].rsw.push({
          workoutID: "",
          rsw: {
            reps: 0,
            sets: 0,
            weight: 0,
          },
          amount: 1,
        });
        // } else {
        // this.bol = true;
        // }
      }
      // this.temp = 0;
    },
    // Page switch
    setPage: function (page) {
      this.lastPage = this.currentPage;
      this.currentPage = page;
    },

    LastPage: function () {
      this.currentPage = this.lastPage;
    },
    addworkout: function () {
      this.newWorkout.push({
        work: {},
        searchInput: "",
        filterWorkout: [],
      });

      this.rswSET.push({
        input: "RSW",
      });
    },
    removeWorkout: function (index) {
      this.newWorkout.splice(index, 1);
      this.rswSET.splice(index, 1);
      this.rswSetups.splice(index, 1);
      console.log(this.rswSetups);
      console.log(this.rswSET);
    },
    removeWorkoutWeek: function (day, index) {
      console.log(day);
      day.workout.splice(index, 1);
      day.set.splice(index, 1);
      day.rsw.splice(index, 1);
      this.rswSET.splice(index, 1);
      this.rswSetups.splice(index, 1);
      console.log(day.workout);
      console.log(this.newWeekDay);
    },
    removeDayWeek: function (index) {
      this.newWeekDay.splice(index, 1);
    },
    createDay: async function () {
      let myHeaders = new Headers();
      let index = 0;
      myHeaders.append("Content-Type", "application/json");
      this.newWorkout.forEach((element) => {
        this.newDay.workouts.push(element.work);
        this.rswSetups[index].workoutID = element.work;
        index++;
      });
      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.newDay),
      };
      let response = await fetch(`${URL}/days`, requestOptions);
      console.log(response);
      if (response.status === 201) {
        this.getDays();
        this.clearday();
        this.currentPage = "Browse";
        await this.makeRSW();
        console.log("Succesfully created");
      } else {
        console.log("Failed");
      }
    },

    createWeekdays: async function () {
      let days = [];
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      this.tempRSW = [];
      console.log(this.newWeekDay);
      for (let element of this.newWeekDay) {
        console.log("Day", element);
        if (element.id === "") {
          for (let rsw of element.rsw) {
            console.log("RSW", rsw);
            this.tempRSW.push({
              workoutID: "",
              rsw: {
                reps: rsw.rsw.reps,
                sets: rsw.rsw.sets,
                weight: rsw.rsw.weight,
              },
            });
          }
        }
      }
      this.rswSetups = this.tempRSW;
      console.log("DONERSW", this.rswSetups);
      let index = 0;
      for (let element of this.newWeekDay) {
        console.log(element.id);
        console.log(element);
        console.log(element.id === "");
        if (element.id === "") {
          this.newDay.name = element.name;
          // this.newDay.name.push(element.name);
          for (let id of element.workout) {
            this.newDay.workouts.push(id.work);
            this.rswSetups[index].workoutID = id.work;
            console.log("rswSetups", this.rswSetups);
            index++;
          }
          //
          // end of second loop
          //

          let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(this.newDay),
          };
          let response = await fetch(`${URL}/days`, requestOptions);

          let data = await response.json();
          console.log("data", data);
          console.log("ID", data._id);

          days.push(data._id.toString());
          console.log("inside loop", days);

          console.log("new week object", this.newWeek);
          console.log(response);
          if (response.status === 201) {
            this.clearday();
            console.log("Succesfully created");
          } else {
            console.log("Failed to make weekday");
          }
        } else {
          console.log("YOOO IT WORKS");
          days.push(element.id.toString());
          console.log(days);
        }
      }

      this.newWeek.days = days;
    },
    createWeek: async function () {
      await this.createWeekdays();

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log("OUTSIDE");

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.newWeek),
      };
      console.log(this.newWeek);
      let response = await fetch(`${URL}/weeks`, requestOptions);
      console.log(response);
      if (response.status === 201) {
        this.makeRSW();
        this.getDays();
        this.getWeeks();
        this.clearday();
        this.clearWeek();
        this.currentPage = "Browse";
        console.log("Succesfully created");
      } else {
        console.log("Failed to create week");
      }
    },

    clearday: function () {
      this.newDay = {
        name: "",
        workouts: [],
      };
      this.newWorkout = [
        {
          work: "",
          searchInput: "",
        },
      ];
    },

    //  this is for register
    registerUser: async function () {
      console.log(this.user);
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.user),
      };
      let response = await fetch(`${URL}/users`, requestOptions);
      if (response.status === 201) {
        console.log("Successfully registered");
        this.newTimestamp();
      } else {
        console.log("failed to register");
      }
    },

    loginUser: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.user),
      };
      let response = await fetch(`${URL}/session`, requestOptions);
      let data = await response.json();

      if (response.status === 201) {
        console.log("successfully logged in");
        this.currentUser = data;
        this.user.name = "";
        this.user.email = "";
        this.user.password = "";
        this.currentPage = "Browse";
        console.log(this.currentUser);
        this.runTimestamp();
        this.getPersonalWeek(this.currentUser.userID);
      } else {
        console.log("Failed to log in");
      }
    },

    loginUserIncr: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.user),
      };
      let response = await fetch(`${URL}/session`, requestOptions);
      let data = await response.json();

      if (response.status === 201) {
        console.log("successfully logged in");
        this.currentUser = data;
        this.user.name = "";
        this.user.email = "";
        this.user.password = "";
        this.currentPage = "Browse";
      } else {
        console.log("Failed to log in");
      }
    },

    getSession: async function () {
      let response = await fetch(`${URL}/session`);
      if (response.status === 200) {
        let data = await response.json();
        this.currentUser = data;
        console.log(this.currentUser);
        this.currentPage = "Browse";
      } else {
        this.currentPage = "login";
      }
      this.getDays();
      this.getWeeks();
      this.getPersonalWeek(this.currentUser.userID);
    },
    deleteSession: async function () {
      let requestOptions = {
        method: "DELETE",
      };
      let response = await fetch(`${URL}/session`, requestOptions);
      if (response.status === 204) {
        this.currentPage = "login";
        this.currentUser = {};
      }
    },
    sortWorkouts: function (sort) {
      this.sort = sort;
    },

    // open week view
    openWeek: async function (weekID) {
      let response = await fetch(`${URL}/weeks/${weekID}`);
      let data = await response.json();
      this.currentWeek = data;
      this.currentPage = "singleWeek";
      console.log("DATA", data);
      console.log(this.currentWeek);
      console.log("currentPage", this.currentPage);
    },

    openDay: async function (dayID) {
      let response = await fetch(`${URL}/days/${dayID}`);
      let data = await response.json();
      this.currentDay = data;
      this.currentPage = "singleDay";
      console.log(data);
    },

    // Incriment and Timestamp code

    getTimestamp: async function () {
      let res = await fetch(`${URL}/time/${this.currentUser.userID}`);
      let data = await res.json();
      console.log("data", data);
      this.timestamp = data.time;
      this.weekInt = data.weekInt;
      let day = new Date(this.timestamp);
      this.weekInt = day.getDay();
      if (res.status === 404) {
        return false;
      }
    },
    createTimestamp: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log("timestamp", this.timestamp);

      let day = new Date(this.timestamp);
      dayNum = day.getDay();
      console.log(day.getDay());
      console.log("2");

      console.log(dayNum);

      let reqBody = {
        weekInt: dayNum,
      };
      console.log("3");

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(reqBody),
      };
      console.log("4");

      let res = await fetch(`${URL}/time`, requestOptions);
      console.log("5");
      if (res.status === 201) {
        console.log("Timestamp made");
      } else {
        console.log("failed to create timestamp");
      }
    },
    updateTimestamp: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log("timestamp", this.timestamp);
      let day = new Date();
      dayNum = day.getDay();

      console.log(dayNum);

      let reqBody = {
        weekInt: dayNum,
      };

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(reqBody),
      };

      let res = await fetch(`${URL}/time/${this.user._id}`, requestOptions);

      if (res.status === 201) {
        console.log("updated Timestamp");
      } else {
        console.log("failed to update Timestamp");
      }
    },

    getIncrUser: async function () {
      let res = await fetch(`${URL}/users/${this.currentUser.userID}`);
      let data = await res.json();
      this.incrUser = data;
      this.timestamp = data.time;
      let thisDay = new Date();
      dayNum = thisDay.getDay();

      this.weekInt = dayNum;
      console.log("week number", this.weekInt);
    },

    updateUser: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      console.log(this.incrWorkID);

      let rsw = {
        workoutID: this.incrWorkID,
        rsw: {
          reps: this.incrUser.rsw[this.incrWorkID].reps,
          sets: this.incrUser.rsw[this.incrWorkID].sets,
          weight: this.incrUser.rsw[this.incrWorkID].weight,
        },
      };
      console.log(rsw);

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(rsw),
      };

      let res = await fetch(
        `${URL}/users/${this.currentUser.userID}`,
        requestOptions
      );

      if (res.status === 201) {
        console.log("RSW updated");
      } else {
        console.log("Could not update RSW");
      }
    },

    runTimestamp: async function () {
      await this.getTimestamp();
      oldNum = this.weekInt;
      this.updateTimestamp();
      await this.getIncrUser();
      newNum = this.weekInt;
      if (newNum < oldNum) {
        console.log("change");
        await this.getIncrUser();
        for (let workoutID of Object.keys(this.incrUser.rsw)) {
          this.incrWorkID = workoutID;
          this.incrUser.rsw[workoutID].weight += 5;
          this.updateUser();
          console.log(this.incrUser.rsw[workoutID].weight);
        }
      } else {
        console.log("No change");
      }
    },

    newTimestamp: async function () {
      await this.loginUserIncr();
      await this.getIncrUser();
      await this.createTimestamp();
      await this.getTimestamp();
      console.log("Timestamp made");
    },

    clearWeek: function () {
      (this.newWeekDay = []),
        (this.newDay = {
          name: "",
          workouts: [],
        });
      this.newWeek = {
        name: "",
        description: "",
        days: [],
      };
    },
    filteredWorkouts: function (weeksworkout) {
      return this.workouts.filter((workout) => {
        return workout.name
          .toLowerCase()
          .includes(weeksworkout.searchInput.toLowerCase());
      });
    },
    deleteDay: async function (dayID) {
      console.log(dayID);
      let requestOptions = {
        method: "DELETE",
      };
      for (let element of this.ownedFilteredWeeks) {
        console.log(element);
        for (let day of element.days) {
          if (day._id === dayID) {
            if (this.trys === 0) {
              alert(
                "this day is within a week. If you want to remove this try again"
              );
              this.lastTryDelete = dayID;
              this.trys++;
              return;
            } else if (this.lastTryDelete === dayID) {
              break;
            } else {
              alert(
                "this day is within a week. If you want to remove this hit the delete button again"
              );
              this.lastTryDelete = dayID;
              return;
            }
          }
        }
      }
      let response = await fetch(`${URL}/days/${dayID}`, requestOptions);
      console.log(response);
      this.trys = 0;
      this.lastTryDelete = null;
      if (response.status === 204) {
        this.getDays();
      } else {
        alert("Failed to delete");
      }
    },

    deleteWeek: async function (weekID) {
      console.log(weekID);
      let requestOptions = {
        method: "DELETE",
      };
      let response = await fetch(`${URL}/weeks/${weekID}`, requestOptions);
      console.log(response);
      if (response.status === 204) {
        this.getWeeks();
      } else {
        alert("Failed to delete");
      }
    },
    editWeek: async function (weekID) {
      this.clearWeek();
      this.clearday();
      console.log(weekID);
      let response = await fetch(`${URL}/weeks/${weekID}`);
      let data = await response.json();
      this.currentWeek = data;

      console.log(this.newWeekDay);
      console.log("DATA", data);
      console.log("week", this.currentWeek);
      for (let element of this.currentWeek[0].days) {
        console.log(element);
        let newDay = {
          name: "",
          workout: [],
          id: "",
          show: true,
        };
        newDay.id = element._id;
        newDay.name = element.name;

        this.newWeekDay.push(newDay);
      }
    },

    // personal database stuff
    getPersonalDay: async function (dayID) {
      let response = await fetch(`${URL}/days/${dayID}`);
      let data = await response.json();
      this.personalDay.push(data);
      console.log("personal week", this.personalDay);
    },

    stealWeek: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      this.currentWeek[0].days = this.personalDay;

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.currentWeek[0]),
      };

      let res = await fetch(
        `${URL}/personal/${this.currentUser._id}`,
        requestOptions
      );
      if (res.status === 201) {
        console.log("Week added to personal");
        this.getPersonalWeek(this.currentUser.userID);
      } else {
        console.log("Something went wrong");
      }
    },

    getPersonalWeek: async function (userID) {
      let res = await fetch(`${URL}/personal/${userID}`);
      let data = await res.json();
      console.log(res);
      this.personalWeeks = data;

      for (let element of this.personalWeeks) {
        for (let newEl of element.days) {
          this.personalDayArray.push(newEl);
        }
      }
    },

    splicePersonalDay: async function (week, weekID, index) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      console.log(week);
      week.days.splice(index, 1);

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(week),
      };

      let res = await fetch(`${URL}/personal/${weekID}`, requestOptions);

      if (res.status === 201) {
        console.log("day removed");
      } else {
        console.log("failed to remove day");
      }
    },

    deletePersonalWeek: async function (weekID) {
      requestOptions = {
        method: "DELETE",
      };

      let res = await fetch(`${URL}/personal/${weekID}`, requestOptions);
      if (res.status === 204) {
        console.log("Week has been removed");
        this.getPersonalWeek(this.currentUser.userID);
      } else {
        console.log("Failed to remove week");
      }
    },

    editPersonalWeek: async function (week) {
      this.newPersonalWeek = week;
      this.newPersonalDay = week.days;
      console.log("Week", this.newPersonalWeek);
      console.log("Day", this.newPersonalDay);
      this.currentPage = "editPersonalWeek";
    },

    updatePersonalWeek: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      this.newPersonalWeek.days = this.newPersonalDay;

      console.log(this.personalDayArray);

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(this.newPersonalWeek),
      };

      let res = await fetch(
        `${URL}/personal/${this.newPersonalWeek._id}`,
        requestOptions
      );

      if ((res.status = 201)) {
        console.log("Week updated");
        this.getPersonalWeek(this.currentUser.userID);
      } else {
        console.log("Failed to update week");
      }
    },
    togglePersonalModal: function () {
      this.personalModalOpen = !this.personalModalOpen;
    },

    editPersonalDay: async function (weekID, index) {
      this.personalDayIndex = index;
      this.currentPage = "editPersonalDay";
      this.editingPersonalDay = this.newPersonalDay[index];
      for (let element of this.editingPersonalDay.workouts) {
        this.editingPersonalDayWorkouts.push({
          searchInput: "",
          work: element._id,
        });
      }
    },

    updatePersonalWorkDay: function (index) {
      this.editingPersonalDayWorkouts.push({
        searchInput: "",
        work: "",
      });
    },

    clearPersonalWeek: function () {
      this.editingPersonalDay = [];
      this.editingPersonalDayWorkouts = [];
      this.newPersonalDay = [];
    },

    savePersonalDay: async function (index) {
      this.newPersonalDay[this.personalDayIndex].workouts = [];
      for (let element of this.editingPersonalDayWorkouts) {
        this.newPersonalDay[this.personalDayIndex].workouts.push(element.work);
      }
    },

    splicePersonalWorkout: function (index) {
      this.editingPersonalDayWorkouts.splice(index, 1);
      console.log(this.editingPersonalDayWorkouts);
    },

    addworkoutDayEdit: function (index) {
      this.editingdayWorkouts.push({
        searchInput: "",
        work: "",
      });
      this.rswSET.push({
        input: "RSW",
      });
    },

    pushPersonalDay: function () {
      console.log(this.modalDay);
      this.newPersonalDay.push(this.modalDay);
      console.log(this.editingPersonalDay);
    },

    addPersonalDay: function () {
      this.newPersonalDay = {
        name: "",
        workout: [],
      };
    },

    makePersonalWorkout: async function (index) {
      console.log(this.newPersonalDay);
      console.log(index);
      this.newPersonalDay[index].workout.push({
        work: "",
        searchInput: "",
        filterWorkout: [],
      });
      console.log(this.newPersonalDay[index]);
    },

    removeDayWorkoutEdit: function (index) {
      this.editingdayWorkouts.splice(index, 1);
      this.rswSetups.splice(index, 1);
      this.rswSET.splice(index, 1);
      console.log(this.editingdayWorkouts);
    },
    editDay: async function (dayID) {
      console.log(dayID);
      let response = await fetch(`${URL}/days/${dayID}`);
      this.editingday = await response.json();
      console.log("day", this.editingday);
      let index = 0;
      for (let element of this.editingday.workouts) {
        this.editingdayWorkouts.push({
          searchInput: "",
          work: element._id,
        });
        if (index > 0) {
          this.rswSET.push({
            input: "RSW",
          });
          this.addRSW();
        }
        if (element._id in this.currentUser.rsw) {
          this.rswSetups[index].rsw.reps =
            this.currentUser.rsw[element._id].reps;
          this.rswSetups[index].rsw.sets =
            this.currentUser.rsw[element._id].sets;
          this.rswSetups[index].rsw.weight =
            this.currentUser.rsw[element._id].weight;
        }
        if (
          this.rswSetups[index].rsw.reps === 0 &&
          this.rswSetups[index].rsw.sets === 0
        ) {
          this.rswSET[index].input = "time";
        }
        index++;
      }
      console.log(this.editingdayWorkouts);
    },
    edit: function (num) {
      this.whichEdit = num;
    },
    clearEditDay: function () {
      this.editingday = [];
      this.editingdayWorkouts = [];
      this.warning = 0;
      console.log("boi", this.editingday);
      console.log(this.editingdayWorkouts);
    },
    UpdateWeekDay: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log("1", this.editingday);
      console.log(this.editingdayWorkouts);
      this.editingday.workouts = [];
      let index = 0;
      for (let element of this.editingdayWorkouts) {
        this.rswSetups[index].workoutID = element.work;
        this.editingday.workouts.push(element.work);
        index++;
      }
      console.log("2", this.editingday);
      console.log("hello");
      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(this.editingday),
      };
      console.log("hello");
      let dayID = this.editingday._id;
      console.log("ID", dayID);
      let response = await fetch(`${URL}/days/${dayID}`, requestOptions);
      console.log(response);
      if (response.status === 204) {
        this.getDays();
        this.clearEditDay();
        await this.makeRSW();
        this.clearRSW();
        if (this.whichEdit === 0) {
          this.setPage("personal");
        } else {
          this.setPage("editweek");
        }
      } else {
        console.log("Failed to update quiz");
      }
    },
    Warn: function () {
      alert("This will get rid of all progress");
      this.warning = 1;
    },
    saveWeek: async function () {
      let days = [];
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log("TEMP", this.tempRSW);
      // this.rswSetups = this.tempRSW;
      this.tempRSW = [];
      for (let element of this.newWeekDay) {
        console.log(element);
        if (element.id === "") {
          for (let rsw of element.rsw) {
            console.log("FORLOOP RSW", rsw);
            this.tempRSW.push({
              workoutID: "",
              rsw: {
                reps: rsw.rsw.reps,
                sets: rsw.rsw.sets,
                weight: rsw.rsw.weight,
              },
            });
          }
        }
      }
      console.log("FORLOOPRSW", this.tempRSW);
      this.rswSetups = this.tempRSW;
      console.log(this.rswSetups);
      let index = 0;
      for (let element of this.newWeekDay) {
        console.log(element.id);
        console.log(element);

        console.log(element.id === "");
        if (element.id === "") {
          this.newDay.name = element.name;
          for (let id of element.workout) {
            console.log("FORLOOPID", id);
            this.newDay.workouts.push(id.work);
            this.rswSetups[index].workoutID = id.work;
            console.log("RSW", this.rswSetups);
            index++;
          }
          //
          // end of second loop
          //
          console.log(this.newDay);
          let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(this.newDay),
          };
          let response = await fetch(`${URL}/days`, requestOptions);
          let data = await response.json();
          console.log("ID", data._id);

          days.push(data._id.toString());
          console.log("inside loop", days);

          console.log("new week object", this.currentWeek);
          console.log(response);
          if (response.status === 201) {
            this.clearday();
            console.log("Succesfully created");
          } else {
            console.log("Failed to make weekday");
          }
        } else {
          console.log("YOOO IT WORKS");
          days.push(element.id.toString());
          console.log(days);
        }
      }
      console.log(this.currentWeek);
      this.currentWeek[0].days = days;
    },
    updateWeek: async function () {
      await this.saveWeek();

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(this.currentWeek[0]),
      };
      let weekID = this.currentWeek[0]._id;
      console.log(weekID);
      let response = await fetch(`${URL}/weeks/${weekID}`, requestOptions);
      if (response.status === 204) {
        await this.makeRSW();
        this.getDays();
        this.clearEditDay();
        this.cleareditWeek();
      } else {
        console.log("Failed to update week");
      }
    },
    // when people get off of edit make sure to clear the feilds to the defualt
    cleareditWeek: function () {
      this.currentWeek = [];
      this.newWeekDay = [];
    },
    removeWEEKDAy: function (index) {
      this.newWeekDay.splice(index, 1);
    },
    clearAll: function () {
      this.clearEditDay();
      this.clearRSW();
      this.clearWeek();
      this.clearday();
      this.cleareditWeek();
    },
    random: function () {
      this.randomNum = Math.floor(Math.random() * this.workouts.length);
    },
  },
  computed: {
    filteredDays: function () {
      return this.days.filter((day) => {
        return day.name.toLowerCase().includes(this.searchInput.toLowerCase());
      });
    },

    filteredWeeks: function () {
      return this.weeks.filter((week) => {
        return week.name.toLowerCase().includes(this.searchInput.toLowerCase());
      });
    },

    ownedFilteredDays: function () {
      console.log("1");
      return this.filteredDays.filter((day) => {
        return day.owner._id.toString() == this.currentUser.userID.toString();
      });
    },

    ownedFilteredWeeks: function () {
      console.log("2");
      return this.filteredWeeks.filter((week) => {
        return week.owner._id.toString() == this.currentUser.userID.toString();
      });
    },
  },

  created: function () {
    console.log("app loaded");

    this.getWorkouts();
    this.getDays();
    this.getWeeks();
    this.getSession();
    this.random();
  },
})
  .use(vuetify)
  .mount("#app");

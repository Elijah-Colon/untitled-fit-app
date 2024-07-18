const URL = "http://localhost:8080";
Vue.createApp({
  data() {
    return {
      workouts: [],
      days: [],
      weeks: [],
      currentPage: "Browse",
      user: {
        name: "",
        email: "",
        password: "",
        _id: "",
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
      modalOpen: true,
      modal: {
        name: "",
        workout: [],
        id: "",
        show: false,
      },
      lastPage: "",
    };
  },
  methods: {
    // Workouts
    getWorkouts: async function () {
      let response = await fetch(`${URL}/workouts`);

      let data = await response.json();
      this.workouts = data;
      console.log(data);
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

    makeWorkout: function (index) {
      console.log(this.newWeekDay);
      console.log(index);
      this.newWeekDay[index].workout.push({
        work: "",
        searchInput: "",
        filterWorkout: [],
      });
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
    },
    removeWorkout: function (index) {
      this.newWorkout.splice(index, 1);
    },
    removeWorkoutWeek: function (day, index) {
      console.log(day);
      day.workout.splice(index, 1);
      console.log(day.workout);
      console.log(this.newWeekDay);
    },
    removeDayWeek: function (index) {
      this.newWeekDay.splice(index, 1);
    },
    createDay: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      this.newWorkout.forEach((element) => {
        this.newDay.workouts.push(element.work);
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
        console.log("Succesfully created");
      } else {
        console.log("Failed");
      }
    },
    createWeekdays: async function () {
      let days = [];
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      for (let element of this.newWeekDay) {
        console.log(element.id);
        console.log(element);
        console.log(element.id === "");
        if (element.id === "") {
          this.newDay.name = element.name;
          // this.newDay.name.push(element.name);
          for (let id of element.workout) {
            this.newDay.workouts.push(id.work);
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
        this.loginUser();
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
    },
    deleteSession: async function () {
      let requestOptions = {
        method: "DELETE",
      };
      let response = await fetch(`${URL}/session`, requestOptions);
      if (response.status === 204) {
        this.currentPage = "login";
        this.currentUser = null;
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
    },

    openDay: async function (dayID) {
      let response = await fetch(`${URL}/days/${dayID}`);
      let data = await response.json();
      this.currentDay = data;
      this.currentPage = "singleDay";
      console.log(data);
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
    editDay: async function (dayID) {},
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
      return this.filteredDays.filter((day) => {
        return day.owner._id.toString() == this.currentUser.userID.toString();
      });
    },

    ownedFilteredWeeks: function () {
      return this.filteredWeeks.filter((week) => {
        return week.owner._id.toString() == this.currentUser.userID.toString();
      });
    },
  },

  // register and session

  created: function () {
    console.log("app loaded");
    this.getWorkouts();
    this.getDays();
    this.getWeeks();
    this.getSession();
  },
}).mount("#app");

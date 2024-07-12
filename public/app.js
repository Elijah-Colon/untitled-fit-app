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
      },
      searchInput: "",
      newDay: {
        title: "",
        workouts: [],
      },
      newWorkout: [
        {
          work: "",
        },
      ],
      sort: "",
// -----------------
      newWeek:{
        name:"",
        days:[]
      },

      Wdays:[
        {
          name: "",
          workouts: [],
        }
      ],

    };
  },
  methods: {
    // Workouts
    getWorkouts: async function () {
      let response = await fetch(`${URL}/workouts`);

      let data = await response.json();
      this.workouts = data;
      console.log(data);
      console.log("hello");
    },
    // Days
    getDays: async function () {
      let response = await fetch(`${URL}/days`);

      let data = await response.json();
      this.days = data;
      console.log(data);
      console.log("hello");
    },
    // Weeks
    getWeeks: async function () {
      let response = await fetch(`${URL}/weeks`);

      let data = await response.json();
      this.weeks = data;
      console.log(data);
      console.log("hello");
    },
    addDay: function() {
      this.Wdays.push({
        name: "",
        workouts: [],
      });
    },
    makeWorkout: function (index){
      this.Wdays[index].workouts.push({
        work:""
      })
    },
    // Page switch
    setPage: function (page) {
      this.currentPage = page;
    },
    addworkout: function () {
      this.newWorkout.push({
        work: {},
      });
    },
    removeWorkout: function (index) {
      this.newWorkout.splice(index);
      console.log(this.newWorkout);
    },
    createDay: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      this.newDay.workouts = this.newWorkout;
      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.newDay),
      };
      let response = await fetch(`${URL}/days`, requestOptions);
      if (response.status === 201) {
        this.getDays();
        this.clearday();
        this.currentPage = "Browse";
        console.log("Succesfully created");
      } else {
        console.log("Failed");
      }
    },
    clearday: function () {
      this.newDay = {
        title: "",
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
      } else {
        console.log("Failed to log in");
      }
    },
    getSession: async function () {
      let response = await fetch(`${URL}/session`);

      if (response.status === 200) {
        let data = await response.json();
        this.currentUser = data;
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
      if (resposne.status === 204) {
        this.currentPage = "login";
        this.currentUser = null;
      }
    },
    sortWorkouts: function (sort) {
      this.sort = sort;
    },
  },
  computed: {
    filteredDays: function () {
      return this.days.filter((day) => {
        return day.name.toLowerCase().includes(this.searchInput.toLowerCase());
        console.log(this.days);
      });
    },

    filteredWeeks: function () {
      return this.weeks.filter((week) => {
        return week.name.toLowerCase().includes(this.searchInput.toLowerCase());
      });
    },
    filteredWorkouts: function () {
      return this.workouts.filter((workout) => {
        return workout.name
          .toLowerCase()
          .includes(this.searchInput.toLowerCase());
      });
    },
  },

  // register and session

  created: function () {
    console.log("app loaded");
    this.getWorkouts();
    this.getDays();
    this.getWeeks();
  },
}).mount("#app");

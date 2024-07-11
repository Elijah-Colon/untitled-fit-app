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
      currentUser: null,
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
    // Page switch
    setPage: function (page) {
      this.currentPage = page;
    },
    // register and session
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
  },
  created: function () {
    console.log("app loaded");
    this.getWorkouts();
    this.getDays();
    this.getWeeks();
  },
}).mount("#app");

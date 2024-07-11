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
    };
  },
  methods: {
    getWorkouts: async function () {
      let response = await fetch(`${URL}/workouts`);

      let data = await response.json();
      this.workouts = data;
      console.log(data);
      console.log("hello");
    },

    getDays: async function () {
      let response = await fetch(`${URL}/days`);

      let data = await response.json();
      this.days = data;
      console.log(data);
      console.log("hello");
    },

    getWeeks: async function () {
      let response = await fetch(`${URL}/weeks`);

      let data = await response.json();
      this.weeks = data;
      console.log(data);
      console.log("hello");
    },
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

  created: function () {
    console.log("app loaded");
    this.getWorkouts();
    this.getDays();
    this.getWeeks();
  },
}).mount("#app");
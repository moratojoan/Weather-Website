//var var cityListTest = cityListTest;

var app = new Vue({
    el: "#app",
    data: {
        cityList: [],
        search: "",
        idSearch: 3128760,
        urlIni: "https://api.openweathermap.org/data/2.5/weather?id=3128760&units=metric&APPID=6d8a6e9c3f81f17a2f426b6a1511c54a",
        dataNow: null,
        data5Days: null,
        loading: true,
        error1: false,
        error2: false,
        error1Message: null,
        error2Message: null,
        searchButNoClick: false,
        showNotFound: false,
        showNotFound2: false,
        showSearchedCityList: false,
        showSearchedCityList2: false,
        isFirstUpdated: true
    },
    methods: {
        startFetchNow: function (url) {
            this.loading = true;
            fetch(url, {
                    method: "GET"
                })
                .then(response => {
                    if (response.ok) {
                        // add a new promise to the chain
                        return response.json();
                    }
                    // signal a server error to the chain
                    throw new Error(response.statusText);
                })
                .then(myData => {
                    this.dataNow = myData;
                    this.error1 = false;
                    this.startFetch5("https://api.openweathermap.org/data/2.5/forecast?id=" + this.idSearch + "&units=metric&APPID=6d8a6e9c3f81f17a2f426b6a1511c54a");
                }).catch(error => {
                    // called when an error occurs anywhere in the chain
                    console.log("Request Now failed: " + error.message);
                    this.error1Message = error.message;
                    this.error1 = true;
                    this.loading = false;
                });
        },
        startFetch5: function (url) {
            fetch(url, {
                    method: "GET"
                })
                .then(response => {
                    if (response.ok) {
                        // add a new promise to the chain
                        return response.json();
                    }
                    // signal a server error to the chain
                    throw new Error(response.statusText);
                })
                .then(myData => {
                    this.data5Days = myData;
                    this.loading = false;
                    this.error2 = false;
                }).catch(error => {
                    // called when an error occurs anywhere in the chain
                    console.log("Request 5 failed: " + error.message);
                    this.error2Message = error.message;
                    this.error2 = true;
                    this.loading = false;
                });
        },
        getWeatherIcon: function (data) {
            return "images/weatherIcons/" + data.weather[0].icon + ".png"
        },
        searchNewCity: function () {
            this.searchButNoClick = true;
        },
        searchFinished: function (city) {
            this.searchButNoClick = false;
            this.search = "";
            this.idSearch = city.id;
            this.startFetchNow("https://api.openweathermap.org/data/2.5/weather?id=" + city.id + "&units=metric&APPID=6d8a6e9c3f81f17a2f426b6a1511c54a");
        },
        showSearchCityList: function () {
            if ((this.search !== "") && !this.searchButNoClick) {
                return (document.getElementsByClassName("searchCityList")[0].children.length !== 0);
            } else {
                return false;
            }
        },
        showSearchCityList2: function () {
            if ((this.search !== "") && this.searchButNoClick) {
                return (document.getElementsByClassName("searchCityList2")[0].children.length !== 0);
            } else {
                return false;
            }
        },
        showSearchNotFound: function () {
            if ((this.search !== "") && !this.searchButNoClick) {
                return (document.getElementsByClassName("searchCityList")[0].style.display === "none");
            } else {
                return false;
            }
        },
        showSearchNotFound2: function () {
            if ((this.search !== "") && this.searchButNoClick) {
                return (document.getElementsByClassName("searchCityList2")[0].style.display === "none");
            } else {
                return false;
            }
        }
    },
    created: function () {
        console.time("data")

        console.timeEnd("data")
    },
    beforeMount: function () {
        this.startFetchNow(this.urlIni);
    },
    mounted: function () {
        console.log("mounted");
    },
    updated: function () {
        this.showSearchedCityList = this.showSearchCityList();
        this.showNotFound = this.showSearchNotFound();
        this.showSearchedCityList2 = this.showSearchCityList2();
        this.showNotFound2 = this.showSearchNotFound2();
        if (this.search == "") {
            this.searchButNoClick = false;
        }
        console.log("updated");
        if (this.isFirstUpdated) {
            this.isFirstUpdated = false;
            setTimeout(() => {
                cityList.forEach(city => this.cityList.push(city));
                this.cityList.sort(function (a, b) {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) {
                        return -1;
                    }
                    if (a.name.toLowerCase() > b.name.toLowerCase()) {
                        return 1;
                    }
                    return 0;
                });
                console.log("run")
            }, 1000);
        }
    },
    computed: {
        filterCities() {
            var searchCity = this.search.trim().toLowerCase();
            var control = 0;
            if (this.search !== "") {
                this.searchButNoClick = false;
                return this.cityList.filter(city => {
                    if (city.name.toLowerCase().startsWith(searchCity) && (control < 11)) {
                        control++;
                        return true;
                    }
                });
            } else {
                return [];
            }
        },
        filterCitiesNoLimit() {
            var searchCity = this.search.trim().toLowerCase();
            var control = 0;
            if (this.search !== "") {
                return this.cityList.filter(city => city.name.toLowerCase().startsWith(searchCity));
            } else {
                return [];
            }
        }
    }
});

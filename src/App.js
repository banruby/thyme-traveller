import React, { Component } from 'react';
import './App.css';
import './setup.css';
import firebase from './firebase.js';
import axios from 'axios';
import Header from "./Header/Header.js";
import SearchBar from "./SearchBar/SearchBar.js";
import SearchResults from "./SearchResults/SearchResults.js";
import PassportList from "./PassportList/PassportList.js";
import Passport from "./Passport/Passport.js";
import Nav from "./Nav/Nav.js";
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      cityName: '',
      cityNumber: '',
      countryNumber: '',
      tripDetails: [],
      userLocation: '',
      cityRestaurants: [],
      addRestaurant: [],
      itinerary: [],
      isShowing: false,
      checked: [false, false, false],
      myOriginalList: [],
      apiUrl: 'https://developers.zomato.com/api/v2.1/'
    }
  }

  getCities = (query) => {
    let params = {};
     params.apikey = process.env.REACT_APP_ZKEY;
    params.query = query;
    return axios.get(`${this.state.apiUrl}locations`, {
      params: params
    })
  }

  getLocationDetails = (entities) => {
    if (entities.data.location_suggestions.length === 0) {
      alert('No restaurants in this city.')
    } else {    
      let params = {};
      params.apikey = process.env.REACT_APP_ZKEY;
      params.entity_id = entities.data.location_suggestions[0].entity_id;
      params.entity_type = entities.data.location_suggestions[0].entity_type;

      const cityName = entities.data.location_suggestions[0].title;
      const cityNumber = entities.data.location_suggestions[0].city_id;
      const countryNumber = entities.data.location_suggestions[0].country_id;

      if (countryNumber === 37 || countryNumber === 216) {
        this.setState({
          cityName: cityName,
          cityNumber: cityNumber
        })

        const dbRef = firebase.database().ref(this.state.cityNumber).child("name");
        dbRef.update({
          listName: cityName
        })

        return axios.get(`${this.state.apiUrl}location_details`, {
          params: params
        })
      } else {
        return alert('Invalid location. Please enter a city name from Canada or the US.');
      }
    }
  }

  getRestaurant = async (value) => {
    const entities = await this.getCities(value);
    let locations = await this.getLocationDetails(entities);
    if (locations !== undefined) {
       locations = locations.data.best_rated_restaurant;
       this.setState({
         cityRestaurants: locations
       })
    }
  };

  getItinerary = () => {
    const dbRef = firebase.database().ref();
    dbRef.on('value', (response) => {
      const newState = [];
      const data = response.val();

      for (let key in data) {
        let cityName = data[key].name.listName;
        // cityName = cityName[Object.keys(listName)[0]];
        newState.push({
          cityNumber: key,
          name: cityName,
          restaurants: data[key]['restaurants']
        })
      }

      this.setState({
        itinerary: newState
      })
    })
  };

  handleConfirm = (passedCity) => {
    const dbRef = firebase.database().ref(`/${passedCity}`);
    if (window.confirm('Are you sure you want to delete this trip?')) {
      dbRef.remove();
    }
  }

  handleDelete = (cityId, resId) => {
    const dbRef = firebase.database().ref(`/${cityId}`).child(`restaurants/${resId}`);
    dbRef.remove();
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (/^[a-zA-Z\s]+,[a-zA-Z\s]+$/.test(this.state.userLocation)) {
      this.getRestaurant(this.state.userLocation);
    } else {
      alert('Invalid input. Please enter a value in the form of "Toronto, ON".');
    }
  }

  handleSort = (myRestList, myIndex) => {
    if (myIndex === 1) {
      myRestList.sort((a, b) => parseFloat(a.restaurant.user_rating.aggregate_rating) - parseFloat(b.restaurant.user_rating.aggregate_rating));
    } else if (myIndex === 0) {
      myRestList.sort((a, b) => parseFloat(a.restaurant.user_rating.aggregate_rating) - parseFloat(b.restaurant.user_rating.aggregate_rating));
      myRestList.reverse();
    }

    if (myIndex === 3) {
      myRestList.sort((a, b) => parseFloat(a.restaurant.average_cost_for_two) - parseFloat(b.restaurant.average_cost_for_two));
    } else if (myIndex === 2) {
      myRestList.sort((a, b) => parseFloat(a.restaurant.average_cost_for_two) - parseFloat(b.restaurant.average_cost_for_two));
      myRestList.reverse();
    }

    if (myIndex === 5) {
      myRestList.sort((a, b) => parseFloat(a.restaurant.price_range) - parseFloat(b.restaurant.price_range));
    } else if (myIndex === 4) {
      myRestList.sort((a, b) => parseFloat(a.restaurant.price_range) - parseFloat(b.restaurant.price_range));
      myRestList.reverse();
    }

    this.setState({
      cityRestaurants: myRestList
    })
  }

  handleFilter = (myRestList, myIndex) => {
    const checkedCopy = this.state.checked.slice();

    let myNewList = [];

    this.setState({
      myOriginalList: myRestList
    })

    if (checkedCopy[myIndex] === false) {
      if (myIndex === 0) {
        myNewList = myRestList.filter(result => result.restaurant.user_rating.aggregate_rating > 4.5);
      } else if (myIndex === 1) {
        myNewList = myRestList.filter(result => result.restaurant.average_cost_for_two < 60);
      } else if (myIndex === 2) {
        myNewList = myRestList.filter(result => result.restaurant.price_range < 3);
      }
      checkedCopy[myIndex] = true;
    } else {
      myNewList = this.state.myOriginalList;
      checkedCopy[myIndex] = false;
    }

    this.setState({
      cityRestaurants: myNewList,
      checked: checkedCopy
    })
  }

  handleTripName = (myCityNumber) => {
    let newTripName = prompt('Please set a new name for this trip:');

    if (newTripName !== null) {
      const dbRef = firebase.database().ref(`${myCityNumber}/name`);

      dbRef.update({
        listName: newTripName
      })
    }
  }

  openModalHandler = () => {
    this.setState({
      isShowing: true
    });
  }

  closeModalHandler = () => {
    this.setState({
      isShowing: false
    });
  }

  componentDidMount(){
    const dbRef = firebase.database().ref();
    dbRef.on('value', (response) => {
      const newState = [];
      const data = response.val();

      for (let key in data) {
        newState.push({
          key: key,
          city: data[key]['userLocation']
        })
      }
      this.setState({
         tripDetails: newState
      })

      this.getItinerary();
    })
  }
  

  render() {
    return (
      <Router>
        <div className="App">
          <div className="window">
            <Header />
            <main>
              <Route path="/" exact render={ () => { return(
              <SearchBar
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange}
                userLocation={this.state.userLocation}
                />
              )}}
              />
              <Route path="/passport/" exact render={ () =>{ return ( <PassportList
                  itinerary={this.state.itinerary}
                  handleConfirm={this.handleConfirm}
                  handleTripName={this.handleTripName}
                  />
              )}} />
              <Route path="/passport/:cityID" render={
              (props) => <Passport {...props} handleDelete={this.handleDelete}
              /> } />
              <Route path="/" exact render={ () => { return (
                <SearchResults
                  results={this.state.cityRestaurants}
                  cityNumber={this.state.cityNumber}
                  handleFilter={this.handleFilter}
                  handleSort={this.handleSort}
                  cityName={this.state.cityName}
                />
              )}}
              />
                <Nav />
            </main>
          </div>
        </div> 
      </Router>
    );
  }
}

export default App;
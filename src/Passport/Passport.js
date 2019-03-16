import React, { Component } from "react";
import "./Passport.css";
import Notes from "../Notes/Notes.js";
import firebase from "../firebase.js";
import "./Book.css";
import passport from "../assets/passport.png";

class Passport extends Component {
    constructor(){
        super();
        this.state = {
            selectedPassport: '',
            selectedRestaurants: [], 
            notesArray: [],
            resId: null,
            showing: true
        }
    }
    
    // Pulls the notes from firebase
    getNotes = (cityId, resId) => {
       // sets the firebase reference to '/city/notes/restaurantId'
       const dbRef = firebase.database().ref(`/${cityId}`).child(`notes/${resId}`);
       dbRef.on('value', (response) => {
          // make a copy of what was returned from firebase
          const notesArray = response.val();
          let nArray = [];
          // make sure something was returned from the database
          if(notesArray !== null) {
            Object.keys(notesArray).forEach(key => {
               const obj = {
                  'cityId':cityId,
                  'resId':resId,
                  'key':key,
                  'date':notesArray[key].date,
                  'text':notesArray[key].note
               }
               nArray.push(obj)
            });
         }
            this.setState({
               notesArray: nArray,
               resId: resId
            })
       })
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    componentDidMount() {        
   
        const selectedPassport = this.props.match.params.cityID

        this.setState ({
            selectedPassport: selectedPassport
        })

        const dbRef = firebase.database().ref();
        dbRef.on('value', (response) => {
            let newState = [];
            let data = response.val();
            data = data[selectedPassport].restaurants;

            for(let key in data) {
                    newState.push({
                    key: key,
                    restaurants: data[key],
                }) 
            }

            this.setState({
                selectedRestaurants: newState
            })
        })
    }

   // when the component updates
    componentDidUpdate(prevProps, prevState) {
       // check to see if there are any notes that have been added or removed
       if(this.state.notesArray !== prevState.notesArray) {
          let notesArray = [];


          Object.keys(this.state.notesArray).forEach(key => {
             let value = this.state.notesArray[key];
             let obj = {
                'key': key,
                'date': value.date,
                'text': value.note
             }
            notesArray.push(obj);
          });
          this.setState([notesArray])
       } else if(this.state.notesArray === null) {
          let notesArray = [];
          this.setState([notesArray])
       }
    }


    // https://codepen.io/wwwebneko/pen/XjOZZK Book animation help!


    render(){
      const { showing } = this.state;
         return (
            <div>
               <div className="book">
                  <div className="page turn"></div>
                  <div className="page turn"></div>
                  <div className="page turn mirror">
                     <div className="flip">
                        <h2>Your Restaurants</h2>
                        {this.state.selectedRestaurants.map(result => {
                           return (
                              <div className="result" key={result.key}>
                                 <img src={result.restaurants.featured_image} alt="" />
                                 <h3>{result.restaurants.name}</h3>
                                 <p>{result.restaurants.location.address}</p>
                                 <div className="buttonContainer">
                                    <form action="submit" onSubmit={this.handleSubmit}>
                                       <button onClick={() => 
                                          this.props.handleDelete(
                                             this.state.selectedPassport,
                                             result.restaurants.id)} >
                                          Delete
                                       </button>
                                       <button
                                          onClick={() => {
                                             this.getNotes(this.state.selectedPassport, result.key);
                                             this.setState({showing: !showing});
                                          }}
                                          >
                                          Notes
                                       </button>
                                    </form>
                                 </div>
                                 <div className="bottom">
                                    <a href={result.restaurants.menu_url} target="_blank">Menu</a>
                                    <p className="rating">{result.restaurants.user_rating.aggregate_rating} / 5</p>
                                 </div>
                              </div>
                           )
                        }
                     )
                  }
                  </div>
               </div>
               <div className="page turn"></div>
               <div className="page turn"></div>
               <div className="page turn resto">
                  <div className="notes">
                     {
                        <Notes
                              notesArray={this.state.notesArray}
                              cityId={this.state.selectedPassport}
                              resId={this.state.resId}
                        />
                     }
                     <div>
                        {showing
                              ? <div className="placeholder">
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              </div>
                              : null
                        }
                     </div>  
                  </div>
               </div>
               <div className="cover"></div>
               <div className="page"></div>
               <div className="page"></div>
               <div className="cover turn">
                  <img src={passport} alt="" />
               </div>
            </div>
         </div>
      )
    }
}

export default Passport;



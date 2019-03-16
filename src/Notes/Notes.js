import React, { Component } from 'react';
import firebase from "../firebase.js";

import './Notes.css';

class Notes extends Component {
   constructor() {
      super();

      // note: the text of the note that will be saved to firebase
      this.state = {
         note: ""
      }
   }

   // Used to prevent page refresh, and reset the 'note' state to null after a submit
   handleSubmit = (e) => {
      e.preventDefault();
      this.setState({
         note: ""

      })

   }

   // Keep the 'note' state updated after each keypress
   handleNoteChange = (e) => {
      this.setState({
         [e.target.name]: e.target.value
      })
   }

   // Add a note to firebase
   // Needs a city id, restaurant id, and the text of the note. The date is automatic
   addNote = (cityId, resId, note) => {
      if(note !== "") {
         const dbRef = firebase.database().ref(`/${cityId}`).child(`notes/${resId}`);
         dbRef.push({
            note: note,
            date: new Date().toLocaleDateString("en-US")
         });
      }
   }

   // Removes a note from firebase
   // requires the id's of city, restaurant, and the note respectively
   deleteNote = (cityId, resId, noteId) => {
      const dbRef = firebase.database().ref(`/${cityId}/notes/${resId}`).child(`${noteId}`);
      dbRef.remove();
   }

   render() {
      return (
         // The entire note display area
         <div className="notepad">
            <h2>Notes</h2>
           
            {/* <p>Insert notes here</p> */}
            {
            // Make sure there is restaurant information to display
            this.props.resId !== null &&
               <form action="submit" onSubmit={this.handleSubmit} >
                  {/* The text to be saved as a note */}
                  <label htmlFor="noteText" className="visuallyHidden">Enter restaurant notes</label>
                  <textarea id="noteText" name="note" className="noteText" rows="10" 
                     value={this.state.note} onChange={this.handleNoteChange}>
                  </textarea>
                  {/* The button that saves the note to firebase */}
                  <button onClick={
                     () => {this.addNote(this.props.cityId, this.props.resId, this.state.note);}}>
                     Add a Note
                  </button>
               </form>
            }
            {/* Display a list of currently saved notes */}
            <ul>
               {
                  // iterate over the array and print out the notes, date, and a delete button for each item
                  this.props.notesArray.map((result) => {
                     return (
                        <li key={result.key}>
                           <ul className="note">
                              <li className="noteDate">{result.date}</li>
                              <li className="noteText">{result.text}</li>
                              <form action="submit" onSubmit={this.handleSubmit}>
                                 <button
                                    onClick={() => this.deleteNote(result.cityId, result.resId, result.key)}>
                                    Delete
                                 </button>
                              </form>
                           </ul>
                        </li>);
                  }) 
               }
            </ul>
         </div>
      )
   }
}


export default Notes;
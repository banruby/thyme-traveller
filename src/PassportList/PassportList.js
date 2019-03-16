import React, { Component } from "react";
import "./PassportList.css";
import { Link } from 'react-router-dom';

class PassportList extends Component { 
    handleSubmit = (e) => {
        e.preventDefault();
    }

    render(){
        return (
            <div className="passportList clearfix">
                <a href="#mainContent" className="skipLink">Skip to main content.</a>
                { this.props.itinerary.map((list) => {
                    let myCityNumber = list.cityNumber;
                    return (
                        <div className="list" key={list.cityNumber}>
                            <Link to={`/passport/${list.cityNumber}`}>
                                <h2>{list.name}</h2>
                            </Link>
                            <div className="formContainer">
                                <form action="submit" onClick={() => this.props.handleTripName(myCityNumber)} onSubmit={this.handleSubmit}>
                                    <button>Change Passport Name</button>
                                </form>
                                <form action="submit" onClick={() => this.props.handleConfirm(myCityNumber)} onSubmit={this.handleSubmit}>
                                    <button>Delete Passport</button>
                                </form>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

}

export default PassportList;
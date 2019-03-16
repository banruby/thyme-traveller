import React, { Component } from "react";
import "./SearchBar.css";
import thymeIcon from "../assets/thymeIcon.png";
import airplane from "../assets/airplane.png";
import qrCode from "../assets/qr-code.png";

class SearchBar extends Component {
    

    render(){
        return(
            
            <div className="inputs">
                <div className="airline clearfix">
                    <p className="left">flight 21</p>
                    <img src={thymeIcon} alt="" />
                    <p>tt air</p>
                </div>
                <div className="ticketTop">
                    <h2>HOME - AWAY</h2>
                </div>
                <form id="mainContent" className="ticket" action="submit" onSubmit={this.props.handleSubmit}>
                    <label htmlFor="userLocation" className="visuallyHidden">Enter user location</label>
                    <input type="text"
                        placeholder="Toronto, ON"
                        name="userLocation"
                        onChange={this.props.handleChange}
                        value={this.props.userLocation}
                        id="userLocation"
                        />
                    <button type="submit">Search Cities</button>
                    <p>Enter your destination to begin your journey to foreign cuisines! Save your favourite restaurants no matter where you are in North America.</p>
                </form>
                <div className="user clearfix">
                    <div className="plane" id="plane">
                        <img src={airplane} alt="cartoon of an airplane"/>
                    </div>
                    <div className="qrCode">
                     <img src={qrCode} alt="" className="qrImage"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchBar;
import React, { Component } from "react";
import "./Header.css";
import { Link } from 'react-router-dom';
import thymeIcon from "../assets/thymeIcon.png";

class Header extends Component {
    render(){
        return(
            <header className="clearfix">
                <div className="topFixed">
                    <a href="#mainContent" className="skipLink">Skip to main content.</a>
                    <Link to="/">
                        <img src={thymeIcon} alt="An icon of the herb thyme."/>
                        <h1>Thyme Traveller</h1>
                    </Link>
                </div>
            </header>
        )
    }
}

export default Header;
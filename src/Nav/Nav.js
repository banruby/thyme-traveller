import React, { Component } from "react";
import "./Nav.css";
import { Link } from 'react-router-dom';

class Nav extends Component {
    render(){
        return (
            <nav>
                <ul>
                    <Link to="/"><li>Home</li></Link>
                    <Link to="/"><li>Search</li></Link>
                    <Link to="/passport"><li>Passports</li></Link>
                </ul>
            </nav>
        )
    }
}

export default Nav;

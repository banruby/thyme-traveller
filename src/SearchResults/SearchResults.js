import React, { Component } from "react";
import "./SearchResults.css";
import firebase from '../firebase.js';
import thymeImage from "../assets/thymeImage.png";

class SearchResults extends Component {
    constructor() {
        super();
        this.state = {
            restaurant: [],
            restID: '',
            filterIndex: '',
            sortIndex: ''
        }
    }

    handleClick = (id) => {
        const addRest = this.props.results.filter(rest => {
            return (rest.restaurant.id === id);
        })

        const dbRef = firebase.database().ref(this.props.cityNumber).child('restaurants');
        
        this.setState({
            restID: addRest[0].restaurant.R.res_id
        })

        dbRef.update({[id]:addRest[0].restaurant})

        this.setState({
            restaurant: ''
        })
    }

    handleSubmit = (e) => {
       e.preventDefault();
    }

    render() {
        return (
            <div className="searchResults">
                <div className="wrapper">
                    <ul className="sortAndFilter">
                        <li className="dropdown">Sort Results By:
                            <ul className="sort">
                                <li>
                                    <form action="submit" onClick={() => this.props.handleSort(this.props.results, 0)} onSubmit={this.handleSubmit}>
                                        <button>User Rating (highest to lowest)</button>
                                    </form>
                                </li>
                                <li>
                                    <form action="submit" onClick={() => this.props.handleSort(this.props.results, 1)} onSubmit={this.handleSubmit}>
                                        <button>User Rating (lowest to highest)</button>
                                    </form>
                                </li>
                                <li>
                                    <form action="submit" onClick={() => this.props.handleSort(this.props.results, 2)} onSubmit={this.handleSubmit}>
                                        <button>Average Cost for Two (highest to lowest)</button>
                                    </form>
                                </li>
                                <li>
                                    <form action="submit" onClick={() => this.props.handleSort(this.props.results, 3)} onSubmit={this.handleSubmit}>
                                        <button>Average Cost for Two (lowest to highest)</button>
                                    </form>
                                </li>
                                <li>
                                    <form action="submit" onClick={() => this.props.handleSort(this.props.results, 4)} onSubmit={this.handleSubmit}>
                                        <button>Price Range (highest to lowest)</button>
                                    </form>
                                </li>
                                <li>
                                    <form action="submit" onClick={() => this.props.handleSort(this.props.results, 5)} onSubmit={this.handleSubmit}>
                                        <button>Price Range (lowest to highest)</button>
                                    </form>
                                </li>
                            </ul>
                        </li>
                        <li className="dropdown">Filter results by:
                            <ul className="filter">
                                <li>
                                    <form action="submit" onClick={() => this.props.handleFilter(this.props.results, 0)} onSubmit={this.handleSubmit}>
                                        <button>User Rating &gt; 4.5</button>
                                    </form>
                                </li>
                                <li>
                                    <form action="submit" onClick={() => this.props.handleFilter(this.props.results, 1)} onSubmit={this.handleSubmit}>
                                        <button>Average Cost for Two &lt; 60</button>
                                    </form>
                                </li>
                                <li>
                                    <form action="submit" onClick={() => this.props.handleFilter(this.props.results, 2)} onSubmit={this.handleSubmit}>
                                        <button>Price Range &lt; $$$</button>
                                    </form>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div>
                    <div className="searchTitle">
                        <h2>{this.props.cityName}</h2>
                    </div>
                    { this.props.results.map(result => {
                        return (
                            <div className="result" key={result.restaurant.id}>
                                <img src={ 
                                   result.restaurant.featured_image ||
                                    thymeImage
                                   } alt={result.restaurant.name}/>
                                <h3>{result.restaurant.name}</h3>
                                <p className="address">
                                {result.restaurant.location.address}</p>
                                <div className="extraInfo">
                                    <p className="rating">Rating: {result.restaurant.user_rating.aggregate_rating} / 5</p>
                                    <p className="avgCostForTwo">Average Cost for Two: ${result.restaurant.average_cost_for_two}</p>
                                    <p className="priceRange">Price Range: {result.restaurant.price_range} / 5</p>
                                </div>
                                <div className="buttonContainer">
                                    <form action="submit" onClick={() => this.handleClick(result.restaurant.id)} onSubmit={this.handleSubmit}>
                                        <button>Add to Passport</button>
                                    </form>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }


}

export default SearchResults;
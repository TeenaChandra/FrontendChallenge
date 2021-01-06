import React, { useState, useEffect } from 'react';
let _ = require('lodash');

let options = {
  headers:{
      "Authorization": "Api-Key q3MNxtfep8Gt"
  }
}

function App() {

  const [restaurants, setRestaurents] = useState('');
  const [uniqueStates, setUniqueStates] = useState('');
  const [uniqueGenres, setUniqueGenres] = useState('');
  const [itemsToDisplay, setItemsToDisplay] = useState('');
  const [selectedState , setSelectedState] = useState('all');
  const [selectedGenre , setSelectedGenre] = useState('all');
  const [isSortedByState, setIsSortedByState] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [page,setPage] = React.useState(0);
  const [pageData, setPageData] = React.useState('');
 

  useEffect(() => {
    fetch('https://code-challenge.spectrumtoolbox.com/api/restaurants', 
    {
      headers: options.headers
    }).then(response => response.json())
    .then(data => {
      setRestaurents(data);
      setItemsToDisplay(data);
      if(data.length > 10){
        let items = data.slice(0, 10);
        setPageData(items);
      } else{
        let items = data.slice(0, data.length);
        setPageData(items);
      }
      let states = [];
      data.map(restaurant => states.push(restaurant.state));
      let genres = [];
      setUniqueStates(_.uniq(states));
      data.forEach(restaurant => {
        let combinedGenere = restaurant.genre;
        let array = combinedGenere.split(',');
        array.map(genre => genres.push(genre));
      });
      setUniqueGenres(_.uniq(genres));
      console.log(_.uniq(genres));
    })
  },[])

  const handleChange = (event) => {
    setSelectedState(event.target.value);
    let rest;
    if(searchValue !== ''){
      let search = searchValue;
      rest = restaurants.filter(restaurant => {
      let gen = restaurant.genre;
      let gens = gen.split(',');
        if(restaurant.name === search || restaurant.city === search){
          return restaurant;
        } else if (gens.includes(search)){
          return restaurant;
        }
    });
    if(rest.length === 0){
      rest = []
    }
    } else {
      rest = restaurants;
    } 
    if(event.target.value === 'all'){
      if(selectedGenre === 'all'){
        let res;
        if(!isSortedByState){
          setItemsToDisplay(rest);
          res = rest;
        } else {
          res = _.sortBy(rest, 'state');
          setItemsToDisplay(res);
        }  
        if(res.length > (page +1) * 10){
          let items = res.slice((page)* 10 , (page +1) * 10);
          setPageData(items);
        } else{
          let items = res.slice( page * 10, res.length);
          setPageData(items);
        }
      } else{
        let res = rest.filter(restaurant => {
          let gen = restaurant.genre;
          let gens = gen.split(',');
          if(gens.includes(selectedGenre)){
            return restaurant;
          }});
          setItemsToDisplay(res);
          if(res.length > (page +1) * 10){
            let items = res.slice((page)* 10 , (page +1) * 10);
            setPageData(items);
          } else{
            let items = res.slice( page * 10, res.length);
            setPageData(items);
          }  
      }
    } else {
      let res = rest.filter(restaurant => restaurant.state === event.target.value);
      let finalRestaurants;
      if(selectedGenre === 'all'){
        finalRestaurants = res;
        setItemsToDisplay(res);
      } else {
        finalRestaurants = res.filter(restaurant => {
            let gen = restaurant.genre;
            let gens = gen.split(',');
            if(gens.includes(selectedGenre)){
              return restaurant;
            }
          }
        );
        setItemsToDisplay(finalRestaurants);
      }
      if(finalRestaurants.length > (page +1) * 10){
        let items = finalRestaurants.slice((page)* 10 , (page +1) * 10);
        setPageData(items);
      } else{
        let items = finalRestaurants.slice( page * 10, finalRestaurants.length);
        setPageData(items);
      } 
  }
  }

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    let rest;
    if(searchValue !== ''){
      let search = searchValue;
      rest = restaurants.filter(restaurant => {
      let gen = restaurant.genre;
      let gens = gen.split(',');
        if(restaurant.name === search || restaurant.city === search){
          return restaurant;
        } else if (gens.includes(search)){
          return restaurant;
        }
    });
    } else {
      rest = restaurants;
    } 
    if(event.target.value === 'all'){
        if(selectedState === 'all'){
          let res;
          if(!isSortedByState){
            setItemsToDisplay(rest);
            res = rest;
          } else {
            res = _.sortBy(rest, 'state');
            setItemsToDisplay(res);
          }  
          if(res.length > (page +1) * 10){
            let items = res.slice((page)* 10 , (page +1) * 10);
            setPageData(items);
          } else{
            let items = res.slice( page * 10, res.length);
            setPageData(items);
          }
        } else {
          let finalRestaurants = rest.filter(restaurant => restaurant.state === selectedState);
          setItemsToDisplay(finalRestaurants);
          if(finalRestaurants.length > (page +1) * 10){
            let items = finalRestaurants.slice((page)* 10 , (page +1) * 10);
            setPageData(items);
          } else{
            let items = finalRestaurants.slice( page * 10, finalRestaurants.length);
            setPageData(items);
          }  
        }
    } else{
      let res = rest.filter(restaurant => {
        let gen = restaurant.genre;
        let gens = gen.split(',');
        if(gens.includes(event.target.value)){
          return restaurant;
        }});
        let finalRestaurants; 
        if(selectedState === 'all'){
          finalRestaurants = res;
        } else {
          finalRestaurants = res.filter(restaurant => restaurant.state === selectedState);
        }
        setItemsToDisplay(finalRestaurants);
        if(finalRestaurants.length > (page +1) * 10){
          let items = finalRestaurants.slice((page)* 10 , (page +1) * 10);
          setPageData(items);
        } else{
          let items = finalRestaurants.slice( page * 10, finalRestaurants.length);
          setPageData(items);
        }  
    }
  }

  const handleCheck= (event) => {
    if(!isSortedByState){
      let res = _.sortBy(pageData, 'state');
      setPageData(res);
    }else{
        if(itemsToDisplay.length > (page +1) * 10){
           let items = itemsToDisplay.slice((page)* 10 , (page +1) * 10);
            setPageData(items);
        } else{
            let items = itemsToDisplay.slice( page * 10, itemsToDisplay.length);
            setPageData(items);
        }
    }
    setIsSortedByState(state => !state);
  }

  const handleSearch = (event) => {
    if(event.target.value === ''){
      setItemsToDisplay(restaurants);
      setSearchValue(event.target.value);
      if(restaurants.length > (page +1) * 10){
        let items = restaurants.slice((page)* 10 , (page +1) * 10);
        setPageData(items);
      } else{
        let items = restaurants.slice( page * 10, restaurants.length);
        setPageData(items);
      } 
    } else{
      setSearchValue(event.target.value);
    }
   
  }

  const handleClick = () =>{
    let search = searchValue;
    let rest = itemsToDisplay.filter(restaurant => {
      let gen = restaurant.genre;
      let gens = gen.split(',');
      if(restaurant.name === search || restaurant.city === search){
        return restaurant;
      } else if (gens.includes(search)){
        return restaurant;
      }
    });
    if(rest.length > 0){
      setItemsToDisplay(rest);
      if(rest.length > (page +1) * 10){
        let items = rest.slice((page)* 10 , (page +1) * 10);
        setPageData(items);
      } else{
        let items = rest.slice( page * 10, rest.length);
        setPageData(items);
      } 
    }
  }

  const handleNextPagination = () =>{
    let dummyPage = page +1 ;
    let initialIndex = dummyPage * 10;
    let finalIndex =  (dummyPage +1) * 10;
    let items;
    if(itemsToDisplay.length > finalIndex){
      items = itemsToDisplay.slice(initialIndex, finalIndex);
    } else{
      items = itemsToDisplay.slice(initialIndex, itemsToDisplay.length);
    }
    setPageData(items);
    setPage(page => page+1);
  }

  const handlePrevPagination = () =>{
    let dummyPage = page - 1 ;
    let initialIndex = dummyPage * 10;
    let finalIndex =  (dummyPage +1) * 10;
    let items;
    items = itemsToDisplay.slice(initialIndex, finalIndex);
    setPageData(items);
    setPage(page => page - 1 );
  }

  const isLastPage = () => {
    if(itemsToDisplay.length < 10){
      return 0;
    } else {
      console.log('itemsToDisplay',itemsToDisplay);
      console.log('data',Math.floor(itemsToDisplay.length/10));
      return (Math.floor(itemsToDisplay.length/10));
    }
  }

  return (
    <div className="App">
        <div class="form-check">
        <input type='checkbox' className="form-check-input"  checked={isSortedByState} onChange={handleCheck}></input>
        <label className="form-check-label" htmlFor='sortByState'>Sort by State</label>
        </div>
        <br></br>
        <label htmlFor='filterByState'>Filter By State :</label>
        <select onChange={handleChange}>
        <option value="all">All</option>
          {
            uniqueStates && uniqueStates.map((state, index) => {
              return(
                <option key ={index}value={state}>{state}</option>
              )
            })
          }
        </select>
        &nbsp;
        <label htmlFor='filterByGenre'>Filter By Genre :</label>
        <select  className="selectpicker" onChange={handleGenreChange}>
          <option value='all'>All</option>
          {
            uniqueGenres && uniqueGenres.map((uniqueGenre, index) => {
              return(
                <option  key={index} value={uniqueGenre}> {uniqueGenre}</option>
              )
            })
          }
        </select>
        <div>
        <input type='text' value={searchValue} onChange={handleSearch}></input>
        &nbsp;
        <button onClick={handleClick}>Search</button>
        </div>
        <hr></hr>
        {pageData.length === 0 ? (<p>Results not found</p>):
        (<div>
        <table className="table table-striped">
        <thead className="thead-dark">
        <tr>
        <th>Name</th>
        <th>City</th>
        <th>State</th>
        <th>Phone</th>
        <th>Generes</th> 
        </tr>
        </thead>
        <tbody>
        {pageData && pageData.map(restaurant => {
          return(
            <tr key={restaurant.id}> 
            <td>{restaurant.name}</td>
            <td>{restaurant.city}</td>
            <td>{restaurant.state}</td>
            <td>{restaurant.telephone}</td>
            <td>{restaurant.genre}</td> 
            </tr>
          )
        })}
        </tbody>
        </table>
        <hr></hr>
        <button className='btn btn-outline-dark' disabled = {page === 0 ? true : false} onClick={handlePrevPagination}>Prev</button>
        &nbsp;
        <button className='btn btn-outline-dark' disabled = {page === isLastPage() ? true: false} onClick={handleNextPagination}>Next</button>
        </div>)
        }
    </div>
  );
}

export default App;

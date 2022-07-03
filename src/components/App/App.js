import React from 'react';
import Header from '../elements/Header/Header';
import Home from '../Home/Home';
import NotFound from '../elements/NotFound/NotFound';
import Movie from '../Movie/Movie';
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';

const App = () => {
    return (
      <Router>
        <>
          <Header />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/:movieId" exact element={<Movie />} />
            <Route  element={<NotFound />} path="*" />

          </Routes>
        </>
      </Router>
    );
}

export default App
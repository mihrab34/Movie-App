import React from 'react';
import Header from '../elements/Header/Header';
import Home from '../Home/Home';
import NotFound from '../elements/NotFound/NotFound';
import Movie from '../Movie/Movie';
import { BrowserRouter , Switch, Route } from 'react-router-dom';

const App = () => {
    return (
      <BrowserRouter>
        <>
          <Header />
          <Switch>
            <Route path="/" exact component={Home } />
            <Route path="/:movieId" exact component={Movie} />
            <Route  component={NotFound} path="*" />

          </Switch>
        </>
      </BrowserRouter>
    );
}

export default App
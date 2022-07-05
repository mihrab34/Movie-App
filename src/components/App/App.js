import React from 'react';
import Header from '../elements/Header/Header';
import Home from '../Home/Home';
import NotFound from '../elements/NotFound/NotFound';
import Movie from '../Movie/Movie';
import { BrowserRouter as Router , Switch, Route } from 'react-router-dom';

const App = () => {
    return (
      <Router>
        <>
          <Header />
          <Switch>
            <Route path="/" exact component={Home  } />
            <Route path="/:movieId" exact component={Movie} />
            <Route  component={NotFound} path="*" />

          </Switch>
        </>
      </Router>
    );
}

export default App
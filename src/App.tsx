import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BasicD3Shape from "./components/basic/BasicD3Shape";
import ApplicationPieChart from "./components/applications/ApplicationsPieChart";
import HomePage from "./components/home/HomePage";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/pie" component={ApplicationPieChart} />
        <Route exact path="/basic" component={BasicD3Shape} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;

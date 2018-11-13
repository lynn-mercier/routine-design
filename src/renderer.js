import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from "react-router-dom";

class Renderer {
  constructor(Routes, element) {
    this.Routes_ = Routes;
    this.element_ = element;
  }

  render() {
	  ReactDOM.render(
	    <HashRouter>{React.createElement(this.Routes_)}</HashRouter>,
	    this.element_);
  }
}

export default Renderer;

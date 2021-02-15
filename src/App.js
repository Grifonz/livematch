//import logo from './logo.svg';
import React, { Component } from 'react';
import Content from '../src/components/content';
import { Container } from 'react-bootstrap';
import './App.module.scss';

class App extends Component{
  constructor(){
    super()
    this.inputRef = React.createRef();
  }

  componentDidMount(){
    this.inputRef.current.focus();
  }

  render(){
    return(
      <Container fluid ref={this.inputRef} id="main">
        <Content />
      </Container>
    )
  }
}
export default App;

  
import { Component } from 'react';
import Header from '../components/header/index';
import Footer from '../components/footer/index';

export default class MainLayout extends Component {
  render() {
    const { children } = this.props;
    console.log(children);
    return (
      <div>
        <Header />
        {
          children
        }
        <Footer />
      </div>
    );
  }
}

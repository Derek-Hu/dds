  
import { Component } from 'react';
import CommunityDrived from '../components/sections/community-drived';

export default class HomePage extends Component {
  componentDidMount() {
    console.log('mount');
  }
  render() {
    return <div>
      <CommunityDrived />
    </div>
  }
}

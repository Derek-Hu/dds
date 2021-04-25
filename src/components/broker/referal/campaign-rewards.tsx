import { Component } from 'react';
import { getBrokerCampaignRewardData } from '../../../services/broker.service';
import CoinProgress from '../../card-info/coin-progress';

export default class CampaignRewards extends Component {
  render() {
    return <CoinProgress totalMode={true} service={getBrokerCampaignRewardData} title="Campaign Rewards" />;
  }
}

import { Icon } from 'antd';
import { formatMessage } from 'util/i18n';

interface ILink {
  link: string;
  name?: string;
  icon?: any;
}

const Ecosystem: ILink[] = [
  {
    icon: <Icon type="wechat" />,
    link: '',
  },
  {
    icon: <Icon type="youtube" />,
    link: '',
  },
  {
    icon: <Icon type="gitlab" />,
    link: '',
  },
  {
    icon: <Icon type="dropbox" />,
    link: '',
  },
  {
    icon: <Icon type="codepen" />,
    link: '',
  },
  {
    icon: <Icon type="ant-cloud" />,
    link: '',
  },
  {
    icon: <Icon type="dribbble" />,
    link: '',
  },
  {
    icon: <Icon type="behance" />,
    link: '',
  },
  {
    icon: <Icon type="slack" />,
    link: '',
  },
];

// const isStage = process.env.AppEnv === 'stage';

const links: { [key: string]: ILink[] } = {
  // ...(isStage? null : { Ecosystem }),
  Security: [
    {
      name: formatMessage({ id: 'audits' }),
      link: '',
    },
    {
      name: formatMessage({ id: 'bug-bounty' }),
      link: '',
    },
  ],
  API: [
    {
      name: formatMessage({ id: 'liquidator' }),
      link: '',
    },
    {
      name: formatMessage({ id: 'trade' }),
      link: '',
    },
  ],
  About: [
    {
      name: formatMessage({ id: 'blog' }),
      link: 'https://medium.com/@shielddaoofficial',
    },
    {
      name: formatMessage({ id: 'brand-assets' }),
      link: '',
    },
    {
      name: formatMessage({ id: 'terms-of-service' }),
      link: '',
    },
    {
      name: formatMessage({ id: 'privacy-policy' }),
      link: '',
    },
  ],
};

export default links;

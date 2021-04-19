import { Icon } from 'antd';

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
      name: 'Audits(Slowmist)',
      link:
        'https://github.com/slowmist/Knowledge-Base/blob/master/open-report/Smart%20Contract%20Security%20Audit%20Report%20-%20Shield.pdf',
    },
    {
      name: 'Bug Bounty',
      link: '',
    },
  ],
  API: [
    {
      name: 'Liquidator',
      link: '',
    },
    {
      name: 'Trade',
      link: '',
    },
  ],
  About: [
    {
      name: 'Blog',
      link: 'https://shield-dao.medium.com/',
    },
    {
      name: 'Brand Assets',
      link: '',
    },
    {
      name: 'Terms of Service',
      link: '',
    },
    {
      name: 'Privacy Policy',
      link: '',
    },
  ],
};

export default links;

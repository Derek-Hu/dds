import { Row, Col, message } from 'antd';
import styles from './style.module.less';
import links from './links';
import Logo from '~/assets/imgs/logo-white.png';
import { formatMessage } from 'locale/i18n';

export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Row type="flex" justify="space-between">
          <Col xs={24} sm={24} md={24} lg={8} className={styles.left}>
            <img src={Logo} alt="" className={styles.logo} />
            <p>{formatMessage({ id: 'infrastructure-for-future-derivatives' })}</p>
          </Col>
          <Col xs={24} sm={24} md={24} lg={16} className={styles.right}>
            <div>
              {Object.keys(links).map(category => (
                <div key={category} className={styles.row}>
                  <span className={styles.category}>{category}</span>
                  <span className={styles.details}>
                    {links[category].map(({ link, name, icon }, index) => (
                      <a
                        key={index}
                        className={icon ? styles.icon : styles.link}
                        href={link || 'javascript:void(0)'}
                        onClick={() => {
                          !link && message.info(formatMessage({ id: 'coming-soon' }));
                        }}
                      >
                        {name || icon}
                      </a>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

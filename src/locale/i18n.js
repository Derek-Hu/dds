import enTranslation from './en';
import zhTranslation from './zh';

export const formatMessage = ({ id, ...params }, isHtml) => {
  const keys = Object.keys(params);
  if (!keys.length) {
    if (!isHtml) {
      return enTranslation[id];
    }
    return <span dangerouslySetInnerHTML={{ __html: enTranslation[id] }}></span>;
  }

  const html = keys.reduce((translation, key) => {
    const target = `\${${key}}`;
    return translation.replace(target, params[key]);
  }, enTranslation[id]);

  if (!isHtml) {
    return html;
  }

  return <span dangerouslySetInnerHTML={{ __html: html }}></span>;
};

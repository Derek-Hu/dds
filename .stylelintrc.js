module.exports = {
    extends: [
      "stylelint-prettier/recommended",
      "stylelint-config-standard"
    ],
    rules: {
      'color-hex-length': null,
      'selector-pseudo-class-no-unknown': null,
      'no-descending-specificity': null,
      'rule-empty-line-before': null,
      'declaration-empty-line-before': null,
      'font-family-no-missing-generic-family-keyword': null,
      'selector-type-no-unknown': [
        true,
        {
          ignoreTypes: [
            'page',
            'view',
            'cover-view',
            'cover-image',
            'scroll-view',
            'swiper',
            'movable-area',
            'movable-view',
            'text',
            'rich-text',
            'icon',
            'image',
            'radio',
            'radio-group',
            'checkbox',
            'checkbox-group',
            'switch',
            'slider',
            'picker',
            'picker-view',
            'navigator',
            'web-view',
          ],
        },
      ],
      'unit-no-unknown': [
        true,
        {
          ignoreUnits: ['rpx'],
        },
      ],
      'property-no-unknown': [
        true,
        {
          ignoreProperties: ['uc-perf-stat-ignore'],
        },
      ],
    },
  };
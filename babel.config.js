const presets = [
  [
    '@babel/preset-env',
    {
      debug: true,
      targets: {
        node: 'current',
      },
    },
  ],
  ['@babel/preset-typescript'],
];

const plugins = [];

module.exports = { presets, plugins };

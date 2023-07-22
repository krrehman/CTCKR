module.exports = {
  input: ['src/**/*.tsx'],
  locales: ['en', 'zh-CN'],
  output: './public/locales/$LOCALE/$NAMESPACE.json',
  keySeparator: false,
  namespaceSeparator: false,
  useKeysAsDefaultValue: true
};

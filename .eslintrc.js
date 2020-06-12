// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    useJSXTextNode: true,
    project: "./tsconfig.json"
  },
  env: {
    'browser': true,
    'node': true,
    'commonjs': true,
    'es6': true,
    "jest": true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/babel",
    "prettier/flowtype",
    "prettier/standard",
    "prettier/unicorn"
  ],
  plugins: [
    "@typescript-eslint",
    "prettier"
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "linebreak-style": ["off", "unix"],
    "prettier/prettier": "error"
  }
}
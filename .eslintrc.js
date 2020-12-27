module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    mocha: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react", "mocha", "@typescript-eslint", "prettier"],
  settings: {
    "import/core-modules": ["electron"],
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "prettier/prettier": ["error"],
    "react/jsx-filename-extension": [1, { extensions: [".jsx", ".tsx"] }],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "error",
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "no-underscore-dangle": "off",
  },
};

import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['wwwroot/js/init.js', 'wwwroot/js/node.js', 'wwwroot/js/node-static.js', 'wwwroot/js/globe.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        requestAnimationFrame: 'readonly',
        performance: 'readonly',
        XMLHttpRequest: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        // Libraries used in the project
        jQuery: 'readonly',
        $: 'readonly',
        THREE: 'readonly',
        createjs: 'readonly',
        M: 'readonly',
        DAT: 'readonly'
      }
    },
    rules: {
      'indent': ['error', 2],
      'semi': ['error', 'always'],
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-console': 'off',
      'quotes': 'off', // Allow mixed quotes for now since the project already has them
      'no-redeclare': 'off' // Allow redeclare for library checks
    }
  },
  {
    // Ignore third-party libraries
    ignores: [
      'wwwroot/js/jquery.min.js',
      'wwwroot/js/three.min.js',
      'wwwroot/js/materialize.js',
      'wwwroot/js/Detector.js',
      'wwwroot/js/OrbitControls.js',
      'wwwroot/js/Tween.js'
    ]
  }
];

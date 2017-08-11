module.exports = {
    "parserOptions":{
        "ecmaVersion": 2017,
        "sourceType": 'module'
    },
    "env": {
        "node": true,
        "es6":true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-console":0,
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};

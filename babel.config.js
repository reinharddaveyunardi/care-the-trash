module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module-resolver",
                {
                    root: ["./"],
                    alias: {
                        "moti/skeleton": "moti/skeleton/react-native-linear-gradient",
                    },
                },
            ],
        ],
    };
};

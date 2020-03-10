const path = require("path");
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: path.join(__dirname, "/src/index.js"),
   output: {
         filename: "build.js",
    path: path.join(__dirname, "/dist")},
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new AddAssetHtmlPlugin(
            [
                {
                    filepath: require.resolve("./src/js/backend.js"),
                },
                {
                    filepath: require.resolve("./src/css/style.css"),
                },
            ]
        )
    ]
};
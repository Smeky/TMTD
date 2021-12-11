const path = require("path")
const webpack = require("webpack")

const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    context: path.resolve(__dirname, "../src"),
    entry: "./index.js",
    target: "web",
    resolve: {
        alias: {
            game: path.resolve(__dirname, "../src"),
            media: path.resolve(__dirname, "../media")
        }
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ["Style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(png|ttf|eot)$/,
                use: ["file-loader"]
            },
            {
                test: /\.(woff|woff2)$/,
                use: ["url-loader"]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve("src", "index.html")
        }),
        new webpack.DefinePlugin({
            "process.env": "{}"
        })
    ]
}

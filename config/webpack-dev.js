const path = require("path")

const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode: "development",
    devtool: "eval-source-map",
    resolve: {
        alias: {
            game: path.resolve("src"),
            media: path.resolve("media")
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["Style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.png/,
                use: ["file-loader"]
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
        })
    ]
}

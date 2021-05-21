const path = require("path")
const webpack = require("webpack")

const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        port: 9000
    },
    resolve: {
        alias: {
            game: path.resolve("src"),
            media: path.resolve("media")
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

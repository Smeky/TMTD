const path = require("path")

const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["Style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve("src", "index.html")
        })
    ]
}
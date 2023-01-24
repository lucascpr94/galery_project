const modoDev = process.env.NODE_ENV !== 'production'
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Resolvido problema com o Open SSL
const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm == "md4" ? "sha256" : algorithm);

module.exports = {
    // starta o servidor no modo de dev ou prod
    mode: modoDev ? 'development' : 'production',
    entry: './src/index.js',
    devServer: {
        contentBase: './build',
        port: 9000,
    },
    // minificadores
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    // arquivo que vai ser gerado apartir do app.js
    // só vai rodar quando rodar npm run build
    output: {
        filename: 'app.js',
        path: __dirname + '/build'
    },
    // copiador e extrator de arquivo 
    plugins: [
        new MiniCssExtractPlugin({ filename: 'estilo.css' }), // extrai o css
        new CopyWebpackPlugin([ // copia todos os arquivos .html e da pasta imgs
            { context: 'src/', from: '**/*.html' },
            { context: 'src/', from: 'imgs/**/*' }
        ])
    ],
    // modulos referenciados em package.json
    module: {
        // aqui sao algumas regras
        rules: [{
            test: /\.s?[ac]ss$/, // regras de css, sass,scss
            use: [ // vai utilizar esse loader ↓
                MiniCssExtractPlugin.loader,
                // 'style-loader', // Adiciona CSS a DOM injetando a tag <style>
                'css-loader', // interpreta @import, url()...
                'sass-loader',
            ]
        }, {

            test: /\.(png|svg|jpg|gif)$/, // regra de imagem
            use: ['file-loader']
        }, {
            test: /.(ttf|otf|eot|svg|woff(2)?)$/, // regra de fontes
            use: ['file-loader']
        }]
    }
}
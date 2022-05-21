import path from 'path'
import webpack, { Configuration as WebpackConfiguration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

const isDevelopment = process.env.NODE_ENV !== 'production'

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration
}

const config: Configuration = {
    name: 'ingoo',
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'eval' : 'hidden-source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@css': path.resolve(__dirname, 'src/assets/css'),
        },
    },
    entry: {
        app: './src/index', // resovle에 따라 확장자 생략
    },
    module: {
        rules: [
            // {
            //     test: /\.tsx?$/, // 정규표현식 ts or tsx 확장자를 찾음.
            //     use: 'ts-loader', // ts-loader 라이브러리 사용
            //     exclude: '/node_modules/', // ts-loader 경로 설정같음.
            // },
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                // exclude: /(node_modules|bower_components)/, //
                exclude: '/node_modules/', // ts-loader 경로 설정같음.
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    browsers: ['last 2 chrome versions', '> 5% in KR'],
                                    //  useBuiltIns: 'usage', corejs: 3, shippedProposals: true, modules: false,
                                },
                                debug: isDevelopment,
                            },
                        ],
                        '@babel/preset-react',
                        '@babel/preset-typescript',
                    ],
                    plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
                },
            },
            {
                test: /\.css$/, // css 파일에 대한 정규표현식 귀찮으면 '.css' 만 해도될듯?
                use: [!isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'ingchat',
            template: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.ids.DeterministicChunkIdsPlugin({
            maxLength: 5,
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            // eslint: {
            //     files: './src/**/*',
            // },
        }),
        new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
    ],
    optimization: {
        chunkIds: isDevelopment ? 'named' : 'deterministic', // 개발모드 named , 프로덕션모드 deterministic
    },
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: { directory: path.resolve(__dirname, 'dist') },
        // devMiddleware: { publicPath: '/dist/' },
        historyApiFallback: true,
        port: 8000,
        // proxy: {
        //     '/api/': {
        //         target: 'http://localhost:3000',
        //         changeOrigin: true,
        //         ws: true,
        //     },
        // },
    },
}

if (isDevelopment && config.plugins) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config.plugins.push(
        new ReactRefreshWebpackPlugin({
            overlay: {
                useURLPolyfill: true,
            },
        }),
    )
}

export default config

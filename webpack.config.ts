import path from 'path'
import webpack from 'webpack'

const isDevelopment = process.env.NODE_ENV !== 'production'

const config: webpack.Configuration = {
    name: 'ingoo',
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'eval' : 'hidden-source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    entry: {
        app: './src/index', // resovle에 따라 확장자 생략
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, // 정규표현식 ts or tsx 확장자를 찾음.
                use: 'ts-loader', // ts-loader 라이브러리 사용
                exclude: '/node_modules/', // ts-loader 경로 설정같음.
            },
        ],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
}

export default config

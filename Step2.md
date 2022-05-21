# React 세팅 해보기

webpack 에서 react 를 실행시키기 위한 설정을 진행할예정
react, babel, css, devServer 등 설정을 할려면 아주 먼산일 예정이다..

일단 webpack.config.ts 에서
module 속성을 추가해야한다

react를 사용하기 위해서는 babel 이 항상 사용되어야 하는데,
매번 파일에 babel을 사용할수 없으니. 웹팩번들 만들기전 미리미리 가져와서 사용할수 있도록 합니다.

> babel 이 필요한 이유는 JSX 문법때문.

이후 웹팩에대한 자세한 내용은 공식홈페이지를 `많이` 참고하였습니다.

> 참고사이트
> https://webpack.js.org/concepts/#entry

```sh
babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript
```

```t
# ...
module: {
    rules:[
        {
                test:/\.tsx?$/,
                loader:'babel-loader',
                exclude:path.join(__dirname,'node_modules'),
                options:{
                    presets:[
                        [
                            '@babel/preset-env',
                            {
                                targets: { browsers: ['IE 10'] },
                                debug: isDevelopment,
                            },
                        ],
                        '@babel/preset-react',
                        '@babel/preset-typescript',
                    ],
                }
            }
    ]
}
```

이후 css 파일도 설정하겠습니다.

```t
{
    test: /\.css?$/,
    use: ['style-loader', 'css-loader'],
}
```

rules 배열안에 객체를 추가해주시고,

npm run build 를 통해 webpack 실행

`successfully` 은 출력은 되었지만.

> Using polyfills: No polyfills were added, since the `useBuiltIns` option was not set.
> 이러한 내용이 뜸..

> 참고사이트
> https://tech.kakao.com/2020/12/01/frontend-growth-02/
> 여길보면 해결할수있긴 한데. 지금은 목표치까지 너무 먼길이길에 기술부채로...

```
npm install style-loader css-loader
```

를 설치해주세요.

```typescript
{
    test:/\.css$/, // css 파일에 대한 정규표현식 귀찮으면 '.css' 만 해도될듯?
    use:['style-loader','css-loader']
}
```

rules 안에 추가해줍시다.

여기 까지 웹팩설정해서 바벨 세팅이 끝났고.

```
npm install react react-dom
```

을 사용해서 잘되는지 한번 테스트해봅시다.

import React from 'react'
를 쓰자마자 Typescript error 가 발생되었다.

> 모듈 'react'에 대한 선언 파일을 찾을 수 없습니다. '/Users/ingoo/class/React/ReactSocket/webpack_typescript/ node_modules/react/index.js'에는 암시적으로 'any' 형식이 포함됩니다.
> 해당 항목이 있는 경우 'npm i --save-dev @types/react'을(를) 시도하거나, 'declare module 'react';'을(를) 포함하는 새 선언(.d.ts) 파일 추가ts(7016)

음.. 시키는대로 해볼까
npm install -D @types/react

이러니 에디터에서 오류가 없어졌다.
Type 까지 설정한 react 인거같다.

나에게 익숙한..
ReactDOM.render() 가 사라졌다고한다.

> 참고사이트
> https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis
> 2021년 12월 17일.. 이후 바뀜..

```js
import { createRoot } from 'react-dom/client'
const container = document.getElementById('app')
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />)
```

바로 예제 코드 활용하러가자.

음 react-dom 사용할려니 이것도..

> 모듈 'react-dom/client'에 대한 선언 파일을 찾을 수 없습니다. '/Users/ingoo/class/React/ReactSocket/webpack_typescript/node_modules/react-dom/client.js'에는 암시적으로 'any' 형식이 포함됩니다.
> 해당 항목이 있는 경우 'npm i --save-dev @types/react-dom'을(를) 시도하거나, 'declare module 'react-dom/client';'을(를) 포함하는 새 선언(.d.ts) 파일 추가ts(7016)

시키는대로하자

npm install -D @types/react-dom

해결!

이번엔..
createRoot(container) 에 부분에

> const container: HTMLElement | null
> 'HTMLElement | null' 형식의 인수는 'Element | DocumentFragment' 형식의 매개 변수에 할당될 수 없습니다.
> 'null' 형식은 'Element | DocumentFragment' 형식에 할당할 수 없습니다.ts(2345)

이런 에러가 나온다..
느낌온다 container 는 딱 Element 내용이니깐..? 타입을 선언하라는건가?

> 참고사이트
> https://velog.io/@ehrbs2021/React-18-react-dom-Type-%EC%9D%B4%EC%8A%88

시키는대로 ㄱ

구라친거같다. 아닌거같다

document.querySelector('#root') 의 내용은..
Element 타입을 원하는거같으니. 타입내용을 명시해주면 되지않을까?

```
const container = document.getElementById('app') as Element
```

된다!!

이제
마지막에

root.render(<div>Hello React</div>) 를 써서 완벽하게 할려고했는데!?
JSX 문법이 오류뜨는거같다? 왜지 ?

babel 을 못읽는거같다.. ㅜㅜ

원인을 찾아보니..
웹팩 설정에서

test:/\.tsx?$/,

로 되어있었다.. 그럼 tsx 나 ts 둘중 아무거나 되도 된다는건데

왜 확장자가 ts는 바벨을 못읽는거지?

## HTML 파일 자동 생성하기

```
npm install -D html-webpack-plugin
```

```
import HtmlWebpackPlugin from 'html-webpack-plugin'

plugins: [new HtmlWebpackPlugin()],
```

이후 빌드를 해보니
파일생성은 되었지만..

`div` 영역이없더라.. 왤까..

> https://github.com/jantimon/html-webpack-plugin#plugins

## css 파일번들하기

> 참고
> https://webpack.kr/plugins/mini-css-extract-plugin/

```
npm install -D mini-css-extract-plugin
```

```typescript
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
```

실행하니깐 에러 오지게납니다.
style-loader 랑 겹치는거라고..

하... style-loader가 뭐였지 .. 일단 해결이 우선순위

isDevelopment 따라 내용을 추가할지말지를 정해야할듯.

```javascript
use: [isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
```

음.. 뭔가 있어보이긴한데 더럽다..
조건을 반대로해서 해봐야겠다 파일이안생긴다..
!isDevelopment 로 하니깐 파일생기네 ^^

css는 이걸로 마무리하자.

chunk 나누는건.. 나중에하자..

# 이미지 번들하기..

그만하고싶다.. devServer 까지 가야하잖아..
아 자고싶다 좀만더하면 되는데.

```
npm install @squoosh/lib --save-dev
```

아.. 이미지는 나중에하자..

## devServer 설정하기

```
npm install -D webpack-dev-server @types/webpack-dev-server @pmmmwh/react-refresh-webpack-plugin react-refresh
```

```typescript
import path from 'path'
import webpack, { Configuration as WebpackConfiguration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'

const isDevelopment = process.env.NODE_ENV !== 'production'

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration
}

const config: Configuration = {
```

> https://github.com/webpack/webpack-dev-server
> 공식문서 참고

위에부분이 수정되었다..
webpack.Configuration 의 타입부분에 devServer 라는 타입이 없어서 자꾸 빨간색 뜨더라,
그래서 webpackConfiguration 을 상속받고 Configuration 선언뒤, devServe를 추가해주었다.
타입스크립트하면서 드뎌 타입선언을 사용한감이있다.

**webpack.config.ts**

```
devServer: {
    static: {
        directory: path.join(__dirname, 'dist'),
    },
    port: 8000,
},
```

**package.json**

```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "dev": "webpack serve"
},
```

npm run dev 하니깐 잘됨. localhost:8000 으로 들어가니 아주잘됨 ^\_^..

하지만 핫로드가 아직안됨.. 코드를 수정할때마다 바로 반영이안됨..
설정하자..

> 참고URL
> https://github.com/pmmmwh/react-refresh-webpack-plugin

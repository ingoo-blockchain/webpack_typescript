# TypeScript 설정해보기

## TypeScript 개념 설명

_Typescript_ 는 런타임해주는 프로그램이 없기때문에
_Typescript_ 문법을 _Javascript_ 변환하여 사용해야함.

*Javascript*는 브라우저 or Nodejs 등 다른 프로그램으로 바로 실행시켜주지만.
*Typescript*는 바로 실행을 안시켜주기 때문.

그래서 Webpack을 통하여 Typescript 문법을 Javascript로 바꾸어서,
실행을 시켜야 합니다.

예시를 보자면

React의 JSX처럼 <div>hello world</div> 라는 코드를

```javascript
{
  type: "div";
  props: {
    children: "hello world";
  }
}
```

로 바꿔주는 것 처럼

Typescript의

```typescript
const name: String = "ingoo";
```

을 아래와 같은 코드로 변형시켜줍니다.

```javascript
const name = "ingoo";
```

그럼 왜 굳이 name = "ingoo"; 로 사용하면 될것을
Type을 선언을 하는가는,

개발자 들이 왜 Type있는 언어를 선호하는지 알아야합니다.

> 다음에 적을예정

## TypeScript 기본 설정

> https://webpack.js.org/guides/typescript/#root
> 참고하여 글을 작성합니다.

일단 프로젝트 구조 설정을 합니다.

[프로젝트명]

- /node_moduels
- /dist
- /src
- package.json
- package-lock.json
- tsconfig.json
- webpack.config.js

> 앞에 /붙은것들은 디렉토리이고, 없는것은 파일입니다.

**디렉토리**

`/dist` 는 Webpack을 통해 Typescript -> Javascript 변환된 파일을 넣는 공간.
`/src` 는 사용자가 직접 Typescript를 적는 공간입니다.

**파일**
`tsconfig.json` 공식문서를 사용하여 설정하였습니다.

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "moduleResolution": "node"
  }
}
```

> 참고사이트
> https://www.typescriptlang.org/docs/handbook/tsconfig-json.html

`webpack.config.js`

```javascript
const path = require("path");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  name: "ingoo",
  mode: isDevelopment ? "development" : "production",
  devtool: isDevelopment ? "eval" : "hidden-source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  entry: {
    app: "./src/index", // resovle에 따라 확장자 생략
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // 정규표현식 ts or tsx 확장자를 찾음.
        use: "ts-loader", // ts-loader 라이브러리 사용
        exclude: "/node_modules/", // ts-loader 경로 설정같음.
      },
    ],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

이후 필수 라이브러리를 설치해보도록 하자.

```
npm install -D typescript ts-loader
```

하나하나 직접 써봤다.
이후 직접 실행해봐야겠다.

여기까지 세팅은

`/src` 디렉토리를 읽어서 `/dist` 에 내보내겠다는 소리다.

그렇다면 `/src/index.ts` 파일을 작성해보도록 해보자.

```typescript
const myName: String = "ingoo";
```

이후 터미널에 `webpack` 을 입력하면 실행되고,
결과가 성공되었음을 알려준다.

그럼 `/dist/index.js` 파일이 생성됬음을 확인한다.

## ES6 모듈 사용해보기

webpack.config.js 에서
require 쓰는것이 몹시 맘에 안들었다.

한번
webpack.config.ts 로 파일변경뒤
import 문법을 사용해보도록하자.

const path = require('path')
를

import path from 'path'
로 바꾸다보니

`allowSyntheticDefaultImports`
이건.. 어디에다 쓰라는거지?

![image-20220521153721706](C:\Users\pc-007\AppData\Roaming\Typora\typora-user-images\image-20220521153721706.png)



아무래도 tsconfig 설정인거같다..

![image-20220521153747304](C:\Users\pc-007\AppData\Roaming\Typora\typora-user-images\image-20220521153747304.png)

설정하니 빨간색은 사라졌지만



다시 webpack 을 돌릴려고 보니.

> Cannot find module 'ts-node/register' from '/mnt/c/Users/pc-007/Documents/workspace/socket/typescript_webpack'

이러한 오류들이 발생했다.

![image-20220521153702456](C:\Users\pc-007\AppData\Roaming\Typora\typora-user-images\image-20220521153702456.png)


# Micro

> No dependency micro service server

### Installation

**Dependency**

```sh
npm install --save @chr33s/micro
```

```js
import { micro, json } from "@chr33s/micro";
```

**Library**

```sh
git subtree add --prefix micro https://github.com/chr33s/micro.git master --squash
```

```js
import { micro, json } from "./index.js";
```

### Usage

**Async**

```js
const server = micro(async (req, res) => {
  try {
    await json(req);
  } catch (err) {
    res.statusCode = err.statusCode;
    return res.statusMessage;
  }
  return { ok: true };
});

server.listen(process.env.PORT || 8080);
```

**Promise**

```js
const server = micro((req, res) =>
  json(req).catch(err => {
    res.statusCode = err.statusCode;
    return err.statusMessage;
  })
);

server.listen(process.env.PORT || 8080);
```


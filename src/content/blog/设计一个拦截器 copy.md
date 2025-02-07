---
title: 设计一个拦截器
pubDatetime: 2022-11-22T08:41:04Z
tags: 
- js
description: 设计一个拦截器，用于控制业务流程，复用模块功能。
---

拦截器是一个函数

```js
async (ctx, next) => {
  do sth...
}
```

它有两个参数。第一个参数是一个上下文，这个上下文在多个拦截切面中是共享的。第二个参数是一个 next 函数，调用它会进入下一个拦截切面。

```js
class Interceptor {
  constructor() {
    this.aspects = []; // 用于存储拦截切面
  }

  use(/* async */ functor) {
    // 注册拦截切面
    this.aspects.push(functor);
    return this;
  }

  async run(context) {
    // 执行注册的拦截切面
    const aspects = this.aspects;

    // 将注册的拦截切面包装成一个洋葱模型
    const proc = aspects.reduceRight(
      function (a, b) {
        return async () => {
          await b(context, a);
        };
      },
      () => Promise.resolve()
    );

    try {
      await proc(); //从外到里执行这个洋葱模型
    } catch (ex) {
      console.error(ex.message);
    }

    return context;
  }
}

module.exports = Interceptor;
```

测试代码

```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const inter = new Interceptor();

const task = function (id) {
  return async (ctx, next) => {
    console.log(`task ${id} begin`);
    ctx.count++;
    await wait(1000);
    console.log(`count: ${ctx.count}`);
    await next();
    console.log(`task ${id} end`);
  };
};

// 将多个任务以拦截切面的方式注册到拦截器中
inter.use(task(0));
inter.use(task(1));
inter.use(task(2));
inter.use(task(3));
inter.use(task(4));

// 从外到里依次执行拦截切面
inter.run({ count: 0 });
```

使用拦截器的好处：控制业务流程，复用模块功能（拦截切面可以被共用，避免代码冗余）

---
title: js语法细节
pubDatetime: 2020-11-21 10:49:30
tags: 
- js
description: js语法细节
---

## 箭头函数中的this
它们没有 this。在箭头函数内部访问到的 this 都是从外部获取的。

## 可选链
- 通常我们这样写
```js
let user = {}; // user 没有 address
alert( user && user.address && user.address.street ); // undefined（不报错）
```
依次对整条路径上的属性使用与运算进行判断，以确保所有节点是存在的（如果不存在，则停止计算），但是写起来很麻烦。
- 通过可选链可以这样
```js
let user = null;
alert( user?.address ); // undefined
alert( user?.address.street ); // undefined
```
>不要过度使用可选链

>我们应该只将 ?. 使用在一些东西可以不存在的地方。
>例如，如果根据我们的代码逻辑，user 对象必须存在，但 address 是可选的，那么 user.address?.street 会更好。
>所以，如果 user 恰巧因为失误变为 undefined，我们会看到一个编程错误并修复它。否则，代码中的错误在不恰当的地方被消除了，这会导致调试更加困难。

```?.()```检查左边是否存在，存在就执行,否则运算停止，不报错。

### 总结
可选链 ?. 语法有三种形式：

- obj?.prop —— 如果 obj 存在则返回 obj.prop，否则返回 undefined。
- obj?.[prop] —— 如果 obj 存在则返回 obj[prop]，否则返回 undefined。
- obj.method?.() —— 如果 obj.method 存在则调用 obj.method()，否则返回 undefined。
>正如我们所看到的，这些语法形式用起来都很简单直接。?. 检查左边部分是否为 null/undefined，如果不是则继续运算。
?. 链使我们能够安全地访问嵌套属性。

>但是，我们应该谨慎地使用 ?.，仅在当左边部分不存在也没问题的情况下使用为宜。以保证在代码中有编程上的错误出现时，也不会对我们隐藏。

## Symbol
如果我们要在对象字面量 {...} 中使用 Symbol，则需要使用方括号把它括起来。
就像这样：
```js
let id = Symbol("id");

let user = {
  name: "John",
  [id]: 123 // 而不是 "id"：123
};
```
这是因为我们需要变量 id 的值作为键，而不是字符串 “id”。

>Symbol 属性不参与 for..in 循环。

>Object.assign 会同时复制字符串和 symbol 属性

>参考：[symbol](https://zh.javascript.info/symbol#dui-xiang-zi-mian-liang-zhong-de-symbol)


## 对象原始值的转换
如果没有 Symbol.toPrimitive，那么 JavaScript 将尝试找到它们，并且按照下面的顺序进行尝试：

- 对于 “string” hint，toString -> valueOf。
- 其他情况，valueOf -> toString。

默认情况下，普通对象具有 toString 和 valueOf 方法：

- toString 方法返回一个字符串 "[object Object]"。
- valueOf 方法返回对象自身。
- 如果没有 Symbol.toPrimitive 和 valueOf，toString 将处理所有原始转换。

### 总结
对象到原始值的转换，是由许多期望以原始值作为值的内建函数和运算符自动调用的。

这里有三种类型（hint）：

- "string"（对于 alert 和其他需要字符串的操作）
- "number"（对于数学运算）
- "default"（少数运算符）
规范明确描述了哪个运算符使用哪个 hint。很少有运算符“不知道期望什么”并使用 "default" hint。通常对于内建对象，"default" hint 的处理方式与 "number" 相同，因此在实践中，最后两个 hint 常常合并在一起。

转换算法是：

1.调用 obj[Symbol.toPrimitive](hint) 如果这个方法存在，

2.否则，如果 hint 是 "string"
- 尝试 obj.toString() 和 obj.valueOf()，无论哪个存在。

3.否则，如果 hint 是 "number" 或者 "default"
- 尝试 obj.valueOf() 和 obj.toString()，无论哪个存在。
在实践中，为了便于进行日志记录或调试，对于所有能够返回一种“可读性好”的对象的表达形式的转换，只实现以 obj.toString() 作为全能转换的方法就够了。

>参考 [Symbol.toPrimitive](https://zh.javascript.info/object-toprimitive#symboltoprimitive)

## 关于数组的length
当我们修改数组的时候，length 属性会自动更新。准确来说，它实际上不是数组里元素的个数，而是最大的数字索引值加一。

例如，一个数组只有一个元素，但是这个元素的索引值很大，那么这个数组的 length 也会很大：
```js
let fruits = [];
fruits[123] = "Apple";

alert( fruits.length ); // 124
```
要知道的是我们通常不会这样使用数组。

length 属性的另一个有意思的点是它是可写的。

如果我们手动增加它，则不会发生任何有趣的事儿。但是如果我们减少它，数组就会被截断。该过程是不可逆的，下面是例子：
```js
let arr = [1, 2, 3, 4, 5];

arr.length = 2; // 截断到只剩 2 个元素
alert( arr ); // [1, 2]

arr.length = 5; // 又把 length 加回来
alert( arr[3] ); // undefined：被截断的那些数值并没有回来
```
>所以，清空数组最简单的方法就是：arr.length = 0;

## 关于JSON的转换
JSON 是语言无关的纯数据规范，因此一些特定于 JavaScript 的对象属性会被 JSON.stringify 跳过。

即：
- 函数属性（方法）。
- Symbol 类型的属性。
- 存储 undefined 的属性。

## js中函数就是对象
>被赋值给函数的属性，比如 sayHi.counter = 0，不会 在函数内定义一个局部变量 counter。换句话说，属性 counter 和变量 let counter 是毫不相关的两个东西。

>我们可以把函数当作对象，在它里面存储属性，但是这对它的执行没有任何影响。变量不是函数属性，反之亦然。它们之间是平行的。

## 关于this和箭头函数
箭头函数
- 没有 this
- 没有 arguments
- 不能使用 new 进行调用
- 它们也没有 super

所以箭头函数里的 ```this``` 的查找与常规变量的搜索方式完全相同：在外部词法环境中查找。

## 关于__proto__和prototype
>初学者常犯一个普遍的错误，就是不知道 ```__proto__``` 和 [[Prototype]] 的区别。
请注意，```__proto__``` 与内部的 [[Prototype]] 不一样。```__proto__``` 是 [[Prototype]] 的 getter/setter。稍后，我们将看到在什么情况下理解它们很重要，在建立对 JavaScript 语言的理解时，让我们牢记这一点。
```__proto__``` 属性有点过时了。它的存在是出于历史的原因，现代编程语言建议我们应该使用函数 Object.getPrototypeOf/Object.setPrototypeOf 来取代 ```__proto__``` 去 get/set 原型。稍后我们将介绍这些函数。
根据规范，```__proto__``` 必须仅受浏览器环境的支持。但实际上，包括服务端在内的所有环境都支持它，因此我们使用它是非常安全的。


重要：[this的值](https://zh.javascript.info/prototype-inheritance#this-de-zhi)

### 设置和直接访问原型的现代方法
设置和直接访问原型的现代方法有：

- Object.create(proto, [descriptors]) —— 利用给定的 proto 作为 [[Prototype]]（可以是 null）和可选的属性描述来创建一个空对象。
- Object.getPrototypeOf(obj) —— 返回对象 obj 的 [[Prototype]]（与 ```__proto__``` 的 getter 相同）。
- Object.setPrototypeOf(obj, proto) —— 将对象 obj 的 [[Prototype]] 设置为 proto（与 ```__proto__``` 的 setter 相同）。

如果要将一个用户生成的键放入一个对象，那么内建的 ```__proto__``` getter/setter 是不安全的。因为用户可能会输入 "```__proto__```" 作为键，这会导致一个 error，虽然我们希望这个问题不会造成什么大影响，但通常会造成不可预料的后果。

因此，我们可以使用 Object.create(null) 创建一个没有 ```__proto__``` 的 “very plain” 对象，或者对此类场景坚持使用 Map 对象就可以了。

此外，Object.create 提供了一种简单的方式来浅拷贝一个对象的所有描述符：
```js
let clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
```

此外，我们还明确了 ```__proto__``` 是 [[Prototype]] 的 getter/setter，就像其他方法一样，它位于 Object.prototype。

我们可以通过 Object.create(null) 来创建没有原型的对象。这样的对象被用作 “pure dictionaries”，对于它们而言，使用 "```__proto__```" 作为键是没有问题的。

其他方法：

- Object.keys(obj) / Object.values(obj) / Object.entries(obj) —— 返回一个可枚举的由自身的字符串属性名/值/键值对组成的数组。
- Object.getOwnPropertySymbols(obj) —— 返回一个由自身所有的 symbol 类型的键组成的数组。
- Object.getOwnPropertyNames(obj) —— 返回一个由自身所有的字符串键组成的数组。
- Reflect.ownKeys(obj) —— 返回一个由自身所有键组成的数组。
- obj.hasOwnProperty(key)：如果 obj 拥有名为 key 的自身的属性（非继承而来的），则返回 true。

所有返回对象属性的方法（如Object.keys 及其他）—— 都返回“自身”的属性。如果我们想继承它们，我们可以使用 for...in。

## 关于类继承
1.想要扩展一个类：class Child extends Parent：
- 这意味着 Child.prototype.__proto__ 将是 Parent.prototype，所以方法会被继承。

2.重写一个 constructor：
- 在使用 this 之前，我们必须在 Child 的 constructor 中将父 constructor 调用为 super()。

3.重写一个方法：
- 我们可以在一个 Child 方法中使用 super.method() 来调用 Parent 方法。

4.内部：
- 方法在内部的 [[HomeObject]] 属性中记住了它们的类/对象。这就是 super 如何解析父方法的。
- 因此，将一个带有 super 的方法从一个对象复制到另一个对象是不安全的。

补充：

箭头函数没有自己的 this 或 super，所以它们能融入到就近的上下文中，像透明似的。

## 类检查"instanceof"
|      | 用于 | 返回值 |
| ---- | ---- | ---- |
|type  | 原始数据类型 | string |
|{}.toString.call|原始数据类型，内建对象，包含Symbol.toStringTag属性的对象| string|
|instanceof|对象|true/false|

如表所示：{}.toString.call (Object.prototype.toString) 可以检查对象的类型并返回字符串，而不是像toString仅仅返回 ```[Object,Object]```
```js
let s = Object.prototype.toString;

alert( s.call(123) ); // [object Number]
alert( s.call(null) ); // [object Null]
alert( s.call(alert) ); // [object Function]
```

## 模块的导入和导出
- 在声明一个 class/function/… 之前：
  - export [default] class/function/variable ...
- 独立的导出：
  - export {x [as y], ...}.
- 重新导出：
  - export {x [as y], ...} from "module"
  - export * from "module"（不会重新导出默认的导出）。
  - export {default [as y]} from "module"（重新导出默认的导出）。

导入：

- 模块中命名的导入：
  - import {x [as y], ...} from "module"
- 默认的导入：
  - import x from "module"
  - import {default as x} from "module"
- 所有：
  - import * as obj from "module"
- 导入模块（它的代码，并运行），但不要将其赋值给变量：
  - import "module"


我们把 import/export 语句放在脚本的顶部或底部，都没关系。


## 处理程序选项 “passive”
addEventListener 的可选项 passive: true 向浏览器发出信号，表明处理程序将不会调用 preventDefault()。

为什么需要这样做？

移动设备上会发生一些事件，例如 touchmove（当用户在屏幕上移动手指时），默认情况下会导致滚动，但是可以使用处理程序的 preventDefault() 来阻止滚动。

因此，当浏览器检测到此类事件时，它必须首先处理所有处理程序，然后如果没有任何地方调用 preventDefault，则页面可以继续滚动。但这可能会导致 UI 中不必要的延迟和“抖动”。

passive: true 选项告诉浏览器，处理程序不会取消滚动。然后浏览器立即滚动页面以提供最大程度的流畅体验，并通过某种方式处理事件。

对于某些浏览器（Firefox，Chrome），默认情况下，touchstart 和 touchmove 事件的 passive 为 true。

## async和defer
|   |	顺序|	DOMContentLoaded|
|----|----|----|
|async	|加载优先顺序。脚本在文档中的顺序不重要 —— 先加载完成的先执行	|不相关。可能在文档加载完成前加载并执行完毕。如果脚本很小或者来自于缓存，同时文档足够长，就会发生这种情况。|
|defer	|文档顺序（它们在文档中的顺序）	|在文档加载和解析完成之后（如果需要，则会等待），即在 DOMContentLoaded 之前执行。|
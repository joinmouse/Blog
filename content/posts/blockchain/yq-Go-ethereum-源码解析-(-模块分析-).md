---
title: "Go-ethereum 源码解析 ( 模块分析 )"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

go ethereum 是最被⼴泛使⽤的以太坊 客户端， 所以后续的源码分析都从  
https://github.com/ethereum/go-ethereum 的这份代码进⾏分析
重要模块功能索引

75                

76zustand初探
1、⼀个简约的状态管理库，但是解决的 问题不简单，完全可⽤替代r edux和context
2、un-opinionated software
⼀个软件如果是o pinionated，那么它会 引导要求你去按照他的规则做事情，不允许超出框架，⽐如使⽤
redux就需要定义a ction、reducer等，⽽如果⼀个软件是u n-opinionated，那么他⾃身并没有太多的规
则限制，允许你去制定⾃⼰的框架规则。
3、GitHub：https://github.com/pmndrs/zustand什么是zu stand
使⽤z ustand
1、基础⽤法
// 创建store
import { create } from 'zustand'
const useBearStore  = create((set) => ({
  bears: 0,
  increasePopulation : () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears : () => set({ bears: 0 }),
}))1
3
5
7
JavaScript

77使⽤过程这⾥只需要引⼊devtools，就可以直接在控制台中利⽤r edux devtools调试到状态的每⼀帧状态
变化的过程
⾃定义中间件2、中间件// 状态消费组件
function  BearCounter () {
  const bears = useBearStore ((state) => state.bears)
  return &lt;h1&gt;{bears} around here ...&lt;/h1&gt;
}
// 事件派发组件
function  Controls () {
  const increasePopulation  = useBearStore ((state) => state.increasePopulat
ion)
  return &lt;button onClick={increasePopulation }&gt;one up&lt;/button&gt;
}1
3
5
7
9
11
JavaScript
// 集成redux devtools
import { devtools  } from "zustand/middleware" ;
const useStore  = create(
  devtools ((set, get) => ({
    bears: 0,
    increasePopulation : () => set((state) => ({ bears: state.bears + 1 
})),
    removeAllBears : () => set({ bears: 0 }), 
  })) 
);1
3
5
7
9
JavaScript

78我们使⽤过r edux知道，如果要处理异步需要引⼊re dux-thunk/redux-promise等专⻔⽤于异步处理的中
间件，是⽐较麻烦的，⽽在zustand，可以很简单异步处理
对⽐// ⾃定义 log 中间件
const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log('  applying' , args)
      set(...args)
      console.log('  new state' , get())
    },
    get,
    api
  )
// 引⼊log 中间件
const useBeeStore  = create(
  log((set) => ({
    bees: false,
    setBees: (input) => set({ bees: input }),
  }))
)1
3
5
7
9
11
13
15
17
19
JavaScript
// 异步处理⽀持
const useFishStore  = create((set) => ({
  fishies: {},
  fetch: async (pond) => {
    const response  = await fetch(pond)
    set({ fishies: await response .json() })
  },
}))1
3
5
7
JavaScript

791、简单、没有太多规则限制，可以制定 ⾃⼰的使⽤规范和标准（关于un -opinionated上⾯已经提过了）
2、直接使⽤ho oks来消费状态
3、不需要将应⽤包裹在c ontext providers(得益于2)
4、不需要触发组建渲染，就可以通知组建做⼀些事情
useEffect中订阅s tore值的变化，会同步 到组件中r ef的值，但不会去引发组件的重新渲染
1、少量的样板代码（⽆需Context. Provider、createContext、useContext）
2、精准渲染：只有状态变化，才会触发使⽤该状态组件的渲染
3、集中的、基于动作操作的状态管理与redux对⽐
与context对⽐const useScratchStore = create(set => ({ scratches: 0, ... }))
const Component = () => {
  // Fetch initial state
  const scratchRef = useRef(useScratchStore.getState().scratches)
  // Connect to the store on mount, 
  // disconnect on unmount, catch state-changes in a reference
  useEffect(() => useScratchStore.subscribe(
    state => (scratchRef.current = state.scratches)
  ), [])
  ...1
3
5
7
9
11
Plain Text

801、发布订阅部分的实现（setState、g etState、subscribe）
2、组件更新部分的实现实现⼀个简单的zu stand
let state = {};
const listeners = new Set();
const setState = (payload) => {
    Object.assign(state, payload);
    // 派发
    listeners.forEach((listener) => {
      listener(state);
    });
};
const subscribe = (fn) => {
    listeners.add(fn);
    return () => {
        listeners.delete(fn);
    };
};
const getState = () => {
    return state;
};
// 第三个参数就是 middleware
state = fn(setState, getState, {
    setState,
    getState
});1
3
5
7
9
11
13
15
17
19
21
23
25
27
Plain Text

81参考链接：
1、https://github.com/pmndrs/zustand
2、https://juejin.cn/post/717758197 3982937149
3、https://zhuanlan.zhihu.com/p/353135461
4、https://juejin.cn/post/7056568996157 456398const useStore  = (selectorFn ) => {
    const value = useRef(useMemo(() => selectorFn (state), []));
    const [, forceUpdate ] = useReducer ((s) => s + 1, 0);
    useEffect (() => {
      return subscribe ((newState ) => {
        const newValue  = selectorFn (newState );
        if (value.current !== newValue ) {
          // 触发更新 : 浅⽐较
          value.current = newValue ;
          forceUpdate ();
        }
      });
    }, []);
    return value.current;
};
return useStore ;1
3
5
7
9
11
13
15
17
19
JavaScript

82
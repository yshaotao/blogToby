# vuex

作用：解决**不同组件**（非父子组件、非兄弟组件）的数据共享，并解决**数据持久化**

vuex能实现的，H5里面的Localstrage、SessionStorage也都能实现，相较来说vuex就显得繁琐冗余了，所以vuex更适合大型项目

1. store存储：dispatch、commit
   1. dispatch:含有异步操作 `this.$store.dispatch('mutations方法名',值)`--action
   2. commit:同步操作 `this.$store.commit('mutations方法名',值)`--mutation

### 配置挂载

1. 安装vuex    npm install vuex -save
2. 在src目录下面新建一个名为vuex的文件夹
3. 在vuex文件夹下新建一个store.js
4. 在store.js 中引入vue vuex 并use （表示一个仓库）
5. 定义数据 state
6. 定义改变数据的方法 mutation
7. 定义getters方法--类似计算属性
8. 定义actions方法--类似mutation，不同：提交的是mutation里面的方法，可包含任意异步操作
9. （最后）暴露 Vuex.store 的实例

#### 使用

1. 引入store ---引入名字建议不要变，方便注册的简写
2. 在vue实例中注册
3. 获取state里面的数据 --this.$store.state.数据名
4. 改变数据 ---this.$commit('数据方法',传递数据)

#### 补充

1. 在对象上添加新属性 --mutation

   1. `Vue.set(obj, 'newProp', 123) `--obj表示state.obj
   2. `state.obj = { ...state.obj, newProp: 123 }`--以新对象替换老对象

2. 组合 action --使action实现同步

   1. ```js
      // 1. 模块A --Promise
         actions: {
         actionA ({ commit }) {
             return new Promise((resolve, reject) => {
                 setTimeout(() => {
                     commit('someMutation')
                     resolve()
                 }, 1000)
             })
         }
         }
         // 2. 模块B --Promise
         actions: {
         actionB ({ dispatch, commit }) {
             return dispatch('actionA').then(() => {
                 commit('someOtherMutation')
             })
         }
         }
         //3. 组合模块 async/await
         actions: {
         async actionA ({ commit }) {
             commit('gotData', await getData())
         },
             async actionB ({ dispatch, commit }) {
                 await dispatch('actionA') // 等待 actionA 完成
                 commit('gotOtherData', await getOtherData())
             }
         }
      ```

   2. 一个 `store.dispatch` 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。

### 实例代码

#### store.js ---仓库配置

```js
import Vue from 'vue'
import Vuex from 'vuex'
//安装Vuex
Vue.use(Vuex)
// 5. 在state中用于存储数据，类似于vue实例中的data
var state = {// 最好初始化所有所需属性
    count:1,
    List:[],
}
// 6. mutations里面放的是改变state里面数据的方法
var mutations = {
    incCount(){
        ++state.count
    }
}
// 7. getters 类似于计算属性，当state里面对应数据被改变时会触发getters里面的方法 获取新的值
var getters = {
    computedCount(state){// 可接受其他getter作为第二个参数
        return state.count*2
    },
    computedList: (state) => (id) => {//返回方法
    	return state.List.find(todo => todo.id === id)
  }
}
// 8. 类似于mutations,不同之处在于：action提交的是mutation，而不是直接变更状态；action可以包含任意异步操作

var actions = {
    incMutationsCount(context){// 可以调用context.commit 提交一个 mutation
        context.commit('incCount') //执行mutations里面的incCount方法，改变state里面的数据
    }
}

// 最后： vuex 实例化vuex.store 并暴露
const store = new Vuex.Store({
    state,
    mutations,
    getters,
    actions
})
export default store;
```

#### home.vue --实例页面

```js
//1. 将store引入
import store from './store.js'
import { mapGetters } from 'vuex'

new Vue({
    data:{},
    store,// 2. 在vue实例中注册 --与data同级
    computed:{
        //5.1mapGetters 辅助函数--仅仅是将 store 中的 getter 映射到局部计算属性：
        ...mapGetters([
          'computedCount',
          'computedList',
          // ...
        ])
        //5.2 使用时另取名字可用对象形式
        mapGetters({
          // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
          doneCount: 'computedCount'
        })
    }
    methods:{
        incCount(){
            //3. 获取state数据 --count表示要获取的数据名
            this.$store.state.count
            
            //4. 改变state数据 --commit('mutations里面的方法名',传值)
            this.$store.commit('incCount',10)
            //4.1 对象风格提交方式
            store.commit({
                type: 'incCount',
                amount: 10
            })
            
            // 5. 获取计算后的state数据 --computedCount表示被计算的数据方法
            // 通过属性访问--注意：在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。
            this.$store.getters.computedCount
            // 通过方法访问--注意，在通过方法访问时，每次都会去进行调用，而不会缓存结果。
            this.$store.getters.computedList(2)
            
            // 6. 改变state数据，可包含任意异步操作 --dispatch('actions里面的方法',传值)
            this.$store.dispatch('incMutationsCount',15)
        }
    }
})
```

#### Module --模块化

```js
// 1. 在store.js里面导入所需模块
// store.js --------------------
import Vue from 'vue';
import Vuex from 'vuex';
import feeds from './feeds'; // 被导入的模块 feeds
import movies from './movies';// 被导入的模块 movies

// feeds.js、movies.js--在每个模块内的js文件中需要配置好所有零件（state、mutation、等对象）并暴露出来
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
        namespaced: true,  //为true表示限定在当前模块的命名空间中（用于区分不同模块，module名为文件夹名/文件名）
        state,
        mutations,
        actions,
        getters
};  
// 在组件里使用 home.vue------------
import { mapState, mapMutations, mapActions } from "vuex";

export default {
computed:{
    ...mapStated('模块名（嵌套层级要写清楚）',{  //比如'movies/hotMovies
        a:state=>state.a,
        b:state=>state.b
    })
},
methods:{
    init(){
		// 模块内部的state是局部的，也就是模块私有的
    	this.$store.state.feeds.list
    	// 内部getter、mutation和action，仍然注册在全局命名空间内
    		//this.$store.state.car.carGetter //结果为undefined
    	this.$store.state.feedsGetter
    		//可设定属性namespaced:true限定为私有
    	this.$store.dispacth("changeName")-> this.$store.dispacth("feeds/changeName")
    	this.$store.getters.localJobTitle-> this.$store.getters["login/localJobTitle"]
    
    	//传参：getters====({state(局部状态),getters（全局getters对象）,roosState（根状态）})；actions====({state(局部状态),commit,roosState（根状态）})
    },
    //有了命名空间之后，mapState, mapGetters, mapActions 函数也都有了一个参数，用于限定命名空间，每二个参数对象或数组中的属性，都映射到了当前命名空间中。
    ...mapActions('模块名（嵌套层级要写清楚）',[  //比如'movies/getHotMovies
        'foo',
        'bar'
    ])
}
```




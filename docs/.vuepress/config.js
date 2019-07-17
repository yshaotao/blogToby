module.exports = {
  base:'/blogToby/',// 基础路径--用于部署到github
  title: '水中鱼_和寻觅的博客',//网站标题
  description: "我不懂什么坚持，全靠死撑",//网站描述
  head: [//额外注入的标签，这里的'/'指向 docs/.vuepress/public 文件目录 
    ['link',{rel:'icon',href:"/img/logo.ico"}],
    ['link',{rel:'mainfest',href:"/mainfast.json"}],
  ],
  host: '0.0.0.0',//指定主机名
  port: '8080',//指定端口
  dest: '.vuepress/dist',//指定输出目录
  // ga:'',// 提供Google Anakytics ID使GA生效
  // serviceWorker:'false',//离线访问
  // locales:undefined,//多语言支持
  // -----------主题配置
  themeConfig: {// 导航栏
    /**
     *  单项 text：显示文字，link：指向链接
     *  这里的'/' 指的是 docs文件夹路径
     *  [以 '/' 结尾的默认指向该路径下README.md文件]
     */
    // navbar: false,// 禁用导航栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: '博文',
        items: [
          { text: 'Android', link: '/android/' },
          { text: 'ios', link: '/ios/' },
          { text: 'Web', link: '/web/' }
        ]
      },
      { text: "markdown", link: '/skill/' },
      // { text: '关于', link: '/about/' },
      { text: '我的Github', link: 'https://www.github.com/codeteenager' },
      { text: '我的码云', link: 'https://www.github.com/codeteenager' },
    ],
    // sidebar: 'auto',//仅包含当前页面标题
    sidebar: [//配置侧边栏
      '',
      [
        '/skill/vuex',
        "vuex使用"],
      [
        '/skill/常用代码段',
        "常用代码段"],
    ],
    // sidebar: [//配置侧边栏-分组
    //   {
    //     title: '分组1',
    //     collapsable: false,
    //     children:['/']
    //   },
    //   {
    //     title: '分组2',
    //     children: [
    //       [
    //         '/skill/vuex',
    //         "vuex使用"],
    //       [
    //         '/skill/常用代码段',
    //         "常用代码段"],
    //     ]
    //   }
    // ],
    sidebar: {
      /**
       * 打开skill主页链接时生成下面这个菜单
       */
      '/skill/': [
        // 多级菜单形式
        {
          title: '技术文档1',//菜单名
          children: [//子菜单
            [
              '/skill/vuex',
              "vuex使用"],
            [
              '/skill/常用代码段',
              "常用代码段"],
          ]
        },
        {
          title: '技术文档2',//菜单名
          children: [//子菜单
            [
              '/skill/vuex',
              "vuex使用"],
            [
              '/skill/常用代码段',
              "常用代码段"],
          ]
        }
      ]
    },
    sidebarDepth: 4, // 提取到h2和h3标题，显示在侧边栏上
    lastUpdated: 'Last Updated', // 文档更新时间
    displayAllHeaders: true, // 显示所有页面标题
    activeHeaderLinks: true,//标题与滚动位置实时更新
    markdown: {
      lineNumbers:true // 代码显示行号
    }
  },
}
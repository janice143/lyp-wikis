import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'LYP Wikis',
  themeConfig: {
    outline: {
      label: '页面导航',
      level: 'deep'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: 'My Blog',
        link: 'https://www.believed-breadfruit.top/archives/'
      },
      { text: 'TypeScript Wiki', link: '/wiki-source/typescript-wiki' },
      { text: 'LeetCode Wiki', link: '/wiki-source/leetcode-wiki' }
    ],

    sidebar: [
      {
        text: 'TypeScript知识库',
        items: [
          {
            text: '知识层',
            items: [
              {
                text: '什么是 TypeScript',
                link: '/wiki-source/typescript-wiki/introduction'
              },
              {
                text: '常见的基础类型',
                link: '/wiki-source/typescript-wiki/basic'
              },
              {
                text: '进阶特性',
                link: '/wiki-source/typescript-wiki/secondary'
              },
              {
                text: '高阶特性',
                link: '/wiki-source/typescript-wiki/advanced'
              },
              {
                text: '函数的类型',
                link: '/wiki-source/typescript-wiki/function'
              },
              {
                text: 'declare 声明类型',
                link: '/wiki-source/typescript-wiki/declare'
              },
              {
                text: '注释指令',
                link: '/wiki-source/typescript-wiki/ts-comment'
              },
              {
                text: 'tsconfig.json 配置',
                link: '/wiki-source/typescript-wiki/ts-config'
              },
              {
                text: '什么是泛型',
                link: '/wiki-source/typescript-wiki/ts-general-type'
              },
              {
                text: '编译原理',
                link: '/wiki-source/typescript-wiki/under-the-hood'
              },
              {
                text: 'TypeScript 与 Babel、Webpack、VS Code 的关系',
                link: '/wiki-source/typescript-wiki/engineering'
              },
              {
                text: 'TypeScript 类型体操',
                link: '/wiki-source/typescript-wiki/gymnastics'
              }
            ]
          },
          {
            text: '意识层',
            items: [
              {
                text: 'TypeScript 类型体系的核心',
                link: '/wiki-source/typescript-wiki/bep'
              },

              {
                text: 'TS的前置知识',
                link: '/wiki-source/typescript-wiki/before-ts'
              },
              {
                text: 'Think in {Set}，从集合论的角度理解TypeScript',
                link: '/wiki-source/typescript-wiki/thinking-set'
              },

              {
                text: 'TS类型编程：类型是一等公民',
                link: '/wiki-source/typescript-wiki/type-first-people'
              },
              {
                text: 'TS实现斐波那契序列算法',
                link: '/wiki-source/typescript-wiki/fib'
              },
              {
                text: '一个ts的困惑，关于结构化类型的兼容性',
                link: '/wiki-source/typescript-wiki/a-real-ts-error'
              }
            ]
          }
          // {
          //   text: 'JavaScript 33个概念',
          //   items: [{ text: '33个概念', link: '/js-33/index.md' }]
          // }
        ]
      },
      {
        text: 'LeetCode知识库',
        items: [
          {
            text: '算法概念',
            items: [
              { text: '01 数组', link: '/wiki-source/leetcode-wiki/array' },
              { text: '02 前缀和', link: '/wiki-source/leetcode-wiki/prefix' },
              { text: '03 排序', link: '/wiki-source/leetcode-wiki/sort' },
              {
                text: '04 二分查找',
                link: '/wiki-source/leetcode-wiki/binary-search'
              },
              {
                text: '05 滑动窗口和双指针',
                link: '/wiki-source/leetcode-wiki/slide-window'
              },
              {
                text: '06 递归和分治',
                link: '/wiki-source/leetcode-wiki/recursion'
              },
              {
                text: '07 哈希',
                link: '/wiki-source/leetcode-wiki/hashing-technique'
              },
              { text: '08 链表', link: '/wiki-source/leetcode-wiki/link' },
              {
                text: '09 二叉树',
                link: '/wiki-source/leetcode-wiki/binary-tree'
              },
              {
                text: '10 队列与栈',
                link: '/wiki-source/leetcode-wiki/queue-and-stack'
              },
              {
                text: '11 贪心算法讲解',
                link: '/wiki-source/leetcode-wiki/greedy'
              },
              {
                text: '12 线性&区间问题',
                link: '/wiki-source/leetcode-wiki/range'
              },
              { text: '13 回溯', link: '/wiki-source/leetcode-wiki/traverse' },
              {
                text: '14 深度优先搜索',
                link: '/wiki-source/leetcode-wiki/deep-search'
              },
              {
                text: '15 广度优先搜索',
                link: '/wiki-source/leetcode-wiki/breadth-search'
              },
              { text: '16 图', link: '/wiki-source/leetcode-wiki/graph' },
              {
                text: '17 动态规划算法讲解',
                link: '/wiki-source/leetcode-wiki/dynamic-programming'
              },
              { text: '18 状态压缩', link: '/wiki-source/leetcode-wiki/state' },
              {
                text: '19 树图、概率&博弈问题',
                link: '/wiki-source/leetcode-wiki/possibility'
              },
              {
                text: '20 并查集',
                link: '/wiki-source/leetcode-wiki/union-find'
              },
              { text: '21 堆', link: '/wiki-source/leetcode-wiki/heap' },
              { text: '22 数学技巧', link: '/wiki-source/leetcode-wiki/math' },
              { text: '23 位运算', link: '/wiki-source/leetcode-wiki/bit' },
              {
                text: '24 N 皇后问题',
                link: '/wiki-source/leetcode-wiki/n-queen'
              }
            ]
          },
          {
            text: 'JavaScript 33个概念',
            items: [{ text: '33个概念', link: '/wiki-source/js-33/index' }]
          }
        ]
      },
      {
        text: 'React知识库',
        items: [
          {
            text: '知识层',
            items: [
              { text: '介绍', link: '/wiki-source/react-wiki/introduction' },
              { text: 'React 基础', link: '/wiki-source/react-wiki/basic' },
              { text: 'Hooks', link: '/wiki-source/react-wiki/hooks' },
              {
                text: 'React 核心特性',
                link: '/wiki-source/react-wiki/secondary'
              },
              { text: 'React 进阶', link: '/wiki-source/react-wiki/advanced' },
              { text: 'React 路由', link: '/wiki-source/react-wiki/router' },
              { text: 'React 状态管理', link: '/wiki-source/react-wiki/state' },
              {
                text: 'React 与异步操作',
                link: '/wiki-source/react-wiki/async'
              },
              { text: 'React 与样式', link: '/wiki-source/react-wiki/style' },
              {
                text: 'React 性能优化',
                link: '/wiki-source/react-wiki/performance'
              },
              {
                text: 'React 生态系统',
                link: '/wiki-source/react-wiki/geography'
              },
              {
                text: 'React 最佳实践',
                link: '/wiki-source/react-wiki/practice'
              },
              {
                text: 'React 未来展望',
                link: '/wiki-source/react-wiki/future'
              },
              {
                text: 'React 底层原理',
                link: '/wiki-source/react-wiki/under-the-hood'
              }
            ]
          }
        ]
      },
      {
        text: 'Formily知识库',
        items: [
          {
            text: '知识层',
            items: [
              { text: '介绍', link: '/wiki-source/formily-wiki/introduction' }
            ]
          },
          {
            text: '意识层',
            items: [
              { text: '介绍', link: '/wiki-source/formily-wiki/introduction' },
              {
                text: 'formily是如何产生的',
                link: '/wiki-source/formily-wiki/how-formily-emerge'
              },
              {
                text: 'formily内部的演变',
                link: '/wiki-source/formily-wiki/formily-inner-change'
              }
            ]
          }
        ]
      },
      {
        text: 'Form知识库',
        items: [
          {
            text: '知识层',
            items: [
              { text: '介绍', link: '/wiki-source/form-wiki/introduction' },
              {
                text: '表单设计与需求分析',
                link: '/wiki-source/form-wiki/form-design'
              },
              {
                text: '表单控件的选择与使用',
                link: '/wiki-source/form-wiki/form-controller'
              },
              {
                text: '表单验证与校验',
                link: '/wiki-source/form-wiki/validate'
              },
              {
                text: '表单交互与用户体验',
                link: '/wiki-source/form-wiki/experience'
              },
              {
                text: '表单提交与数据处理',
                link: '/wiki-source/form-wiki/submit'
              },
              {
                text: '表单性能与优化',
                link: '/wiki-source/form-wiki/performance'
              },
              {
                text: '表单样式与响应式设计',
                link: '/wiki-source/form-wiki/style'
              },
              {
                text: '表单的安全性与防护',
                link: '/wiki-source/form-wiki/safe'
              },
              {
                text: '常见的中后台表单模式与案例',
                link: '/wiki-source/form-wiki/pattern'
              },
              {
                text: '常见的中后台表单组件库和框架',
                link: '/wiki-source/form-wiki/safe'
              }
            ]
          }
        ]
      }
    ],
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/janice143/lyp-wikis' }
    ]
  },
  markdown: {
    math: true
  },
  head: [
    // Microsoft Clarity tracking script
    [
      'script',
      {
        type: 'text/javascript',
        src: './clarity.js'
      }
    ]
  ]
});

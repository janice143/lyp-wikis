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
      }
      // { text: 'TypeScript Wiki', link: '/wiki-source/typescript-wiki' },
      // { text: 'LeetCode Wiki', link: '/wiki-source/leetcode-wiki' },
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
      },
      {
        text: 'LangChain 的 RAG（检索增强生成）入门与实战',
        items: [
          {
            text: '知识层',
            items: [
              {
                text: 'RAG 基础概念',
                link: '/wiki-source/langchain-rag/introduction'
              },
              {
                text: 'LangChain 框架概述',
                link: '/wiki-source/langchain-rag/langchain-introduction'
              },
              {
                text: '构建 RAG 系统的核心流程',
                link: '/wiki-source/langchain-rag/rag-core'
              },
              {
                text: '搭建基础 RAG 应用',
                link: '/wiki-source/langchain-rag/rag-basic'
              },
              {
                text: 'RAG 进阶优化',
                link: '/wiki-source/langchain-rag/rag-advanced'
              },
              {
                text: 'RAG 应用场景',
                link: '/wiki-source/langchain-rag/rag-app'
              },
              {
                text: 'LangChain + RAG 案例实战',
                link: '/wiki-source/langchain-rag/langchain-rag-demo'
              },
              {
                text: 'RAG 未来发展与挑战',
                link: '/wiki-source/langchain-rag/rag-future'
              }
            ]
          }
        ]
      },
      {
        text: '浏览器知识库',
        items: [
          {
            text: '知识层',
            items: [
              {
                text: '浏览器的基本构成',
                link: '/wiki-source/browser-wiki/introduction'
              },
              {
                text: '从 URL 到页面呈现',
                link: '/wiki-source/browser-wiki/url-to-page'
              },
              {
                text: '渲染流程——从 HTML 到页面',
                link: '/wiki-source/browser-wiki/render'
              },
              {
                text: 'JavaScript 在浏览器中的执行',
                link: '/wiki-source/browser-wiki/js'
              },
              {
                text: '浏览器性能优化',
                link: '/wiki-source/browser-wiki/performance'
              },
              {
                text: '浏览器安全',
                link: '/wiki-source/browser-wiki/safety.md'
              }
            ]
          }
        ]
      },
      {
        text: 'Axios知识库',
        items: [
          {
            text: '知识层',
            items: [
              {
                text: '引言',
                link: '/wiki-source/axios-wiki/introduction'
              },
              {
                text: 'Axios 安装与配置',
                link: '/wiki-source/axios-wiki/install'
              },
              {
                text: 'Axios 请求方法',
                link: '/wiki-source/axios-wiki/get'
              },
              {
                text: 'Axios 响应处理',
                link: '/wiki-source/axios-wiki/response'
              },
              {
                text: 'Axios 与异步操作',
                link: '/wiki-source/axios-wiki/async'
              },
              {
                text: 'Axios 与请求拦截器',
                link: '/wiki-source/axios-wiki/intercept'
              },
              {
                text: 'Axios 与请求拦截器',
                link: '/wiki-source/axios-wiki/request-intercept'
              },
              {
                text: 'Axios 与响应拦截器',
                link: '/wiki-source/axios-wiki/response-intercept'
              },
              {
                text: '错误处理与重试机制',
                link: '/wiki-source/axios-wiki/error'
              },
              {
                text: 'Axios 与跨域请求',
                link: '/wiki-source/axios-wiki/cors'
              },
              {
                text: '优化与性能',
                link: '/wiki-source/axios-wiki/performance'
              },
              {
                text: 'Axios 与安全性',
                link: '/wiki-source/axios-wiki/safety'
              },
              {
                text: '最佳实践与常见问题',
                link: '/wiki-source/axios-wiki/safety'
              }
            ]
          }
        ]
      },
      {
        text: 'MobX知识库',
        items: [
          {
            text: '知识层',
            items: [
              {
                text: '简介',
                link: '/wiki-source/mobx-wiki/introduction'
              },
              {
                text: 'MobX 核心概念',
                link: '/wiki-source/mobx-wiki/core-idea'
              },
              {
                text: 'MobX 在 React 中的使用',
                link: '/wiki-source/mobx-wiki/react'
              },
              {
                text: 'MobX 进阶',
                link: '/wiki-source/mobx-wiki/advance'
              },
              {
                text: 'MobX 与其他状态管理方案对比',
                link: '/wiki-source/mobx-wiki/compare'
              },
              {
                text: '未来展望',
                link: '/wiki-source/mobx-wiki/future'
              }
            ]
          }
        ]
      },
      {
        text: 'Eslint知识库',
        items: [
          {
            text: '知识层',
            items: [
              {
                text: '简介',
                link: '/wiki-source/eslint-wiki/introduction'
              },
              {
                text: '基础配置',
                link: '/wiki-source/eslint-wiki/basic'
              },
              {
                text: 'ESLint 规则',
                link: '/wiki-source/eslint-wiki/rule'
              },
              {
                text: '插件与扩展',
                link: '/wiki-source/eslint-wiki/plugin'
              },
              {
                text: '高级 ESLint 配置',
                link: '/wiki-source/eslint-wiki/advanced'
              },
              {
                text: '集成与工作流',
                link: '/wiki-source/eslint-wiki/workflow'
              },
              {
                text: '性能优化',
                link: '/wiki-source/eslint-wiki/performance'
              },
              {
                text: 'ESLint 与代码质量',
                link: '/wiki-source/eslint-wiki/code-quality'
              },
              {
                text: 'ESLint 与团队协作',
                link: '/wiki-source/eslint-wiki/teamwork'
              },
              {
                text: 'ESLint 项目实战',
                link: '/wiki-source/eslint-wiki/project'
              },
              {
                text: 'ESLint 与代码质量',
                link: '/wiki-source/eslint-wiki/code-quality'
              },
              {
                text: '自定义规则',
                link: '/wiki-source/eslint-wiki/custom-rules'
              }
            ]
          },
          {
            text: 'Webpack知识库',
            items: [
              {
                text: '知识层',
                items: [
                  {
                    text: '简介',
                    link: '/wiki-source/webpack-wiki/introduction'
                  },
                  {
                    text: '核心概念',
                    link: '/wiki-source/webpack-wiki/core'
                  },
                  {
                    text: '配置',
                    link: '/wiki-source/webpack-wiki/config'
                  },
                  {
                    text: '模块处理与转换',
                    link: '/wiki-source/webpack-wiki/loader'
                  },
                  {
                    text: '代码分割与优化',
                    link: '/wiki-source/webpack-wiki/code-split'
                  },
                  {
                    text: 'Webpack DevServer 与开发模式',
                    link: '/wiki-source/webpack-wiki/dev-server'
                  },
                  {
                    text: '性能优化',
                    link: '/wiki-source/webpack-wiki/performance'
                  },
                  {
                    text: '与前端框架集成',
                    link: '/wiki-source/webpack-wiki/framework'
                  },
                  {
                    text: '与 TypeScript 集成',
                    link: '/wiki-source/webpack-wiki/typescript'
                  },
                  {
                    text: '与 TypeScript 集成',
                    link: '/wiki-source/webpack-wiki/typescript'
                  },
                  {
                    text: '与 TypeScript 集成',
                    link: '/wiki-source/webpack-wiki/typescript'
                  },
                  {
                    text: '与 TypeScript 集成',
                    link: '/wiki-source/webpack-wiki/typescript'
                  }
                ]
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

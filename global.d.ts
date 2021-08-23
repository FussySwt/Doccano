import VueRouter, { Route } from 'vue-router'
declare module '*.txt'
declare module '*.jsonl'
declare module '*.csv'
declare module 'vue/types/vue' {
  interface Vue {
    $api: any
    $http: any
    $router: VueRouter
    $route: Route
    $Message: any
  }
}

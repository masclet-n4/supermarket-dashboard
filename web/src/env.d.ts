// Solo para editores con TypeScript plano; vue-tsc usa los tipos reales de cada .vue.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

// typings.d.ts or router.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'default' | 'blank' | 'auth' | string
    private?: boolean
    title?: string
  }
}

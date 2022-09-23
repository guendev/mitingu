import { Directive } from '@vue/runtime-core'

export const vAuth: Directive<HTMLDivElement> = {
  created(el, binding) {
    const userStore = useUserStore()
    el.addEventListener('click', (e) => {
      if(userStore.auth) {
        e.preventDefault()
        // Toddo: 404
      } else {
        if(typeof binding.value === 'function') {
          binding.value()
        }
      }
    })
  }
}


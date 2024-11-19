export const draggable = {
  beforeMount(el, binding) {
    const { value } = binding
    if (value) {
      el.style.cursor = 'move'
      el.onmousedown = (e) => {
        const startX = e.clientX
        const startY = e.clientY
        const left = el.offsetLeft
        const top = el.offsetTop
        el.onmousemove = (event) => {
          const endX = event.clientX
          const endY = event.clientY
          el.style.left = left + (endX - startX) + 'px'
          el.style.top = top + (endY - startY) + 'px'
        }
        el.onmouseup = () => {
          el.onmousemove = null
          el.onmouseup = null
        }
      }
    }
  }
}

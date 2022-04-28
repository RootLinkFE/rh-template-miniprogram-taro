let active = false
const bus: any[] = []

export const getActive = () => {
  return active
}

export const setActive = (status) => {
  active = status
  bus.forEach((fn: (v) => void) => {
    if (typeof fn === 'function') {
      fn && fn(active)
    }
  })
}
export const listenActiveChange = (fn: () => void) => {
  bus.push(fn)
}

export default {
  getActive,
  setActive,
  listenActiveChange
}

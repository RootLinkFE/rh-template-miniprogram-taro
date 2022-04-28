export const flatTreeLastItem = (data) => {
  return data.reduce((prev, next) => {
    if (next.children && next.children.length) {
      const arr = flatTreeLastItem(next.children)
      arr.forEach((item) => prev.push(item))
    } else {
      prev.push(next)
    }
    return prev
  }, [])
}

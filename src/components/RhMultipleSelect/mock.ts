const treeData = [
  {
    name: '一级',
    id: '1',
    user: false,
    children: [
      {
        name: '二级-1',
        id: '2-1',
        user: false,
        children: [
          {
            name: '三级-1',
            id: '3-1',
            user: false,
            children: [
              {
                name: '四级-1',
                id: '4-1',
                user: false,
                children: [
                  {
                    name: '五级-1',
                    id: '5-1',
                    user: false,
                    children: [
                      {
                        name: '六级-1',
                        id: '6-1',
                        user: true
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: '二级-2',
        id: '2-2',
        user: false,
        children: [
          {
            name: '三级-2',
            id: '3-2',
            user: false
          }
        ]
      }
    ]
  }
]

function makeTreeNode(leval) {
  let treeNoneList = []
  for (let k = 0; k < 2; k++) {
    treeNoneList.push({
      name: `${leval}级-${k}`,
      id: guid(),
      user: true
    })
  }
  return treeNoneList
}

function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}

export { treeData }

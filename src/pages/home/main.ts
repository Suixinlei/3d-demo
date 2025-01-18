document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="panel">
      <div id="content"></div>
    </div>
    <div id="panelScrim"></div>
  </div>
`

const panel = document.getElementById('panel')
const content = document.getElementById('content')
const panelScrim = document.getElementById('panelScrim')

// 创建导航面板
const navigation = document.createElement('div')
content?.appendChild(navigation)

// 从配置创建导航
const list = {
  "整体效果": {
    "地球": {
      "地球展示 + 自转": "./pointGlobe.html"
    }
  },
  "测试效果": {
    "完全测试": {
      "地球故障展开 3d->2d": "/src/pages/expandGlobe/index.html?expandType=zero",
      "地球展开 3d->2d": "/src/pages/expandGlobe/index.html?expandType=normal",
      "用于画出转动轨迹的平面地图": "./planeGlobe.html",
    },
    "常用效果": {
      "飞线效果": "./drawLine.html"
    }
  }
}

// 创建导航结构
for (const section in list) {
  const categories = list[section]
  
  const sectionHead = document.createElement('h2')
  sectionHead.textContent = section
  navigation.appendChild(sectionHead)

  for (const category in categories) {
    const items = categories[category]
    
    const categoryHead = document.createElement('h3')
    categoryHead.textContent = category
    navigation.appendChild(categoryHead)

    for (const item in items) {
      const link = document.createElement('a')
      link.href = items[item]
      link.textContent = item
      link.setAttribute('target', 'viewer')
      navigation.appendChild(link)
      link.appendChild(document.createElement('br'))
    }
  }
}

// 点击遮罩关闭面板
panelScrim?.addEventListener('click', () => {
  panel?.classList.toggle('open')
})
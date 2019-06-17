/**
 * HTML label 组件
 * @example
 * const label = new Label({
 *   text: '北京',
 *   style: {
 *     position: 'absolute',
 *     color: '#00ffff',
 *   },
 * })
 *
 * */

const defaultConfig = {
  parent: document.body,
  node: null,
  id: null,// TODO
  text: '',
  style: {},
};

/**
 * @class
 * */
class Label {
  /**
   * 创建label
   * @param {Object} config
   * @param {Node} config.parent - label 插入位置，默认为body
   * @param {Node} config.node - label 节点，默认为null，表示新建一个节点
   * @param {string} config.text - 节点内容
   * */
  constructor(config) {
    this.config = Object.assign({}, defaultConfig, config);

    const node = this.config.node || document.createElement('div');
    node.id = `label-${this.config.text}`;
    node.innerHTML = this.config.text;
    Object.keys(this.config.style || {}).forEach((key) => {
      node.style[key] = this.config.style[key];
    });
    this.config.parent.appendChild(node);

    this.node = node;
  }

  /**
   * 设置内容
   * @param {Object} style
   * @param {string} style.text - 节点内容
   * */
  set(style) {
    const node = this.node;
    if (!node) {
      console.warn('node not find!', node);
      return;
    }
    Object.keys(style || {}).forEach((key) => {
      if (key === 'text') {
        node.innerHTML = style[key];
        node.id = `label-${style[key]}`;
      } else {
        node.style[key] = style[key];
      }
    });
  }
}

module.exports = Label;

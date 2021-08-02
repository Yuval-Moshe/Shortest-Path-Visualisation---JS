class Node {
  constructor(id) {
    this.neighbors = [];
    this.id = id;
  }
  addNi(nodeKey) {
    this.neighbors.push(nodeKey);
  }
  getNei() {
    return this.neighbors;
  }
  setTag(tag) {}
}

export default Node;

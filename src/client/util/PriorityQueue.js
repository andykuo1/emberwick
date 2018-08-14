const TOP = 0;
const PARENT = (i) => ((i + 1) >>> 1) - 1;
const LEFT = (i) => (i << 1) + 1;
const RIGHT = (i) => (i + 1) << 1;

class PriorityQueue
{
  constructor(comparator)
  {
    this._heap = [];
    this._comparator = comparator;
  }

  push(...values)
  {
    for(const value of values)
    {
      this._heap.push(value);
      this._shiftUp();
    }
  }

  pop()
  {
    const result = this.peek();
    const BOTTOM = this._heap.length - 1;
    if (BOTTOM > TOP)
    {
      this._swap(TOP, BOTTOM);
    }
    this._heap.pop();
    this._shiftDown();
    return result;
  }

  replace(value)
  {
    const result = this.peek();
    this._heap[TOP] = value;
    this._shiftDown();
    return result;
  }

  peek()
  {
    return this._heap[TOP];
  }

  size()
  {
    return this._heap.length;
  }

  _compare(i, j)
  {
    return this._comparator(this._heap[i], this._heap[j]);
  }

  _swap(i, j)
  {
    let result = this._heap[i];
    this._heap[i] = this._heap[j];
    this._heap[j] = result;
  }

  _shiftUp()
  {
    let node = this._heap.length - 1;
    let nodeParent;
    while(node > TOP && this._compare(node, nodeParent = PARENT(node)))
    {
      this._swap(node, nodeParent);
      node = nodeParent;
    }
  }

  _shiftDown()
  {
    const length = this._heap.length;
    let node = TOP;
    let nodeMax;

    let nodeLeft = LEFT(node);
    let flagLeft = nodeLeft < length;
    let nodeRight = RIGHT(node);
    let flagRight = nodeRight < length;

    while((flagLeft && this._compare(nodeLeft, node)) ||
      (flagRight && this._compare(nodeRight, node)))
    {
      nodeMax = (flagRight && this._compare(nodeRight, nodeLeft)) ? nodeRight : nodeLeft;
      this._swap(node, nodeMax);
      node = nodeMax;

      nodeLeft = LEFT(node);
      flagLeft = nodeLeft < length;
      nodeRight = RIGHT(node);
      flagRight = nodeRight < length;
    }
  }
}

export default PriorityQueue;

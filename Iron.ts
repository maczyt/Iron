let $el = (select: string): Node => {
  return document.querySelector(select);
};
let $els = (select: string): NodeList => {
  return document.querySelectorAll(select);
};

class Iron {
  private data = {};
  private localData = {};
  public obv = new Observe();
  public binds = $els('i-bind');
  constructor (data: Object = {}) {
    let keys = Object.keys(data);
    let that = this;
    keys.forEach((key) => {
      this.obv.on(key, () => {
        toArray(getter(key)).forEach((el) => {
          el.textContent = that.data[key];
        })
      });
      Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        set (val) {
          that.localData[key] = val;
          that.obv.emit(key);
        },
        get () {
          return that.localData[key];
        }
      });
      this.data[key] = data[key];
    });
  }
  get (name) {
    return this.data[name]
  }
  set (name, val) {
    this.data[name] = val;
    return true;
  }
}

class Observe {
  private listener = {};
  emit (name: string) {
    if (typeof this.listener[name] === 'undefined') return;
    let subs = this.listener[name];
    subs.forEach((sub) => {
      sub()
    });
  }
  on (name: string, fn: Function) {
    if (typeof this.listener[name] === 'undefined') {
      this.listener[name] = [];
    }
    this.listener[name].push(fn);
  }
  off (name: string) {
    this.listener[name] = [];
  }
}

let iron = new Iron({
  name: 'zyt',
  age: 24
});

toArray($els('[i-bind]')).forEach((el) => {
  let val = iron.get(el.getAttribute('i-bind'));
  console.log(el);
  el.textContent = val;
});
function getter (name?: string) {
  return name ? $els(`[i-bind="${name}"]`): $els('[i-bind]')
}
function toArray(array: ArrayLike<any>): Array<any> {
  return [].slice.call(array);
}

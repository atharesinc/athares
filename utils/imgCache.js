const imgCache = {
  __cache: {},
  read(src) {
    if (!src) {
      return;
    }

    if (!this.__cache[src]) {
      this.__cache[src] = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.__cache[src] = true;
          resolve(this.__cache[src]);
        };
        img.src = src;
        setTimeout(() => resolve({}), 2000);
      }).then(() => {
        this.__cache[src] = true;
      });
    }

    if (this.__cache[src] instanceof Promise) {
      throw this.__cache[src];
    }
    return this.__cache[src];
  },
  clearImg: (src) => {
    delete this.__cache[src];
  },
};
window.imgCache = imgCache;

export default imgCache;

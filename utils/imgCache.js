// React Native doesn't have Image in core-js I guess so some chap here :https://github.com/firebase/firebase-js-sdk/issues/183
// created a polyfill that was super not their job that works totally cross platform
class FakeImage {
  static ensureImageExists() {
    if (!global.Image) {
      global.Image = FakeImage;
    }
  }

  _isLoaded = false;
  _callbacks = [];

  set src(url) {
    this._isLoaded = false;
    this.load(url);
  }

  load = async (url) => {
    await fetch(url);
    this._callbacks.forEach((x) => x());
    this._isLoaded = true;
  };

  onload(callback) {
    if (this._isLoaded) {
      callback();
    }
    this._callbacks.push(callback);
  }
  onerror(error) {
    console.error("oops!", error);
  }
}

const imgCache = {
  __cache: {},
  read(src) {
    if (!src) {
      return;
    }

    if (!this.__cache[src]) {
      this.__cache[src] = new Promise((resolve) => {
        const img = new FakeImage();
        img.onload = () => {
          this.__cache[src] = true;
          resolve(this.__cache[src]);
        };
        img.src = src;
        setTimeout(() => resolve({}), 2000);
      })
        .then(() => {
          this.__cache[src] = true;
        })
        .catch((err) => {
          console.log("double oops", err);
        });
    }

    if (this.__cache[src] instanceof Promise) {
      // bafflingly, we throw an error here so that some error boundary will catch it and trigger the fallback UI while the image loads
      return this.__cache[src];
    }
    return this.__cache[src];
  },
  clearImg: (src) => {
    delete this.__cache[src];
  },
};

export default imgCache;

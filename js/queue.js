export class AsyncQueue {
  constructor(concurrencyLimit = 2) {
    this.limit = concurrencyLimit;
    this.running = 0;
    this.queue = [];
  }

  add(promiseFunction) {
    return new Promise((resolve, reject) => {
      this.queue.push({ promiseFunction, resolve, reject });
      this.processNext();
    });
  }

  processNext() {
    if (this.running >= this.limit || this.queue.length === 0) return;

    const { promiseFunction, resolve, reject } = this.queue.shift();
    this.running++;

    promiseFunction()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.running--;
        this.processNext();
      });
  }
}

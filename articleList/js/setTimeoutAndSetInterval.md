# 定义

setTimeout 和 setInterval 都是用来处理延时和定时任务的，setTimeout方法用于延迟指定多少毫秒执行任务，setInterval方法用于每指定多少毫秒执行任务。
# 细节

 HTML5标准规定：setTimeout的最短时间间隔是4毫秒，所以如果这样调用setTimeout(doSomeThing,0),js执行时会默认4毫秒后执行，所以能理解在研究某些库时能看到为啥会调用setTimeout(func,4)了；setInterval的最短时间间隔是10毫秒，设想下如果不设这些门槛，那有时候浏览器不会炸掉吗 ~~

# setInterval有时不精确问题

setInterval()的执行方式与setTimeout()有不同，比如调用setInterval(fn,10),当代码执行到这个位置时，计时器会每隔10毫秒执行方法，与setTimeout相同的是，如果没有同步代码执行，fn会被立即执行，如果有同步代码正在执行，就会将fn加入到任务队列中，等js线程空闲的时候就会执行任务队列中的任务，举个例子，在上一次定时器执行后，本次执行需要等待5ms才执行，但其实再过5ms后fn又会执行，造成两次定时器任务的执行时间间隔才有5ms，这就造成了setInterval计时不精确的问题。

# 解决方案

我们在做项目中会遇到很多需要我们用到计时的地方，比如活动，游戏等等，一般人会首先想到用setInterval，考虑到上文提到的问题，所以我们得用另一种思路。使用setTimeout代替setInterval。

**setTimeout代替setInterval原因**

setTimeout执行的方法会等到执行完成后再调用setTimeout本身，避免setInterval计时器本身按时调用，无法照顾到同步代码的执行时间，不可控。

**这里给出一个用setTimeout模拟setInterval的实现方案**

```
    let countDown = function(option) {
        let timer, timerInstance, options, cache;
        let defaultOptions = {
            time: 1000,
            totalTime: 0,
            cb: null
        };
        options = Object.assign({}, defaultOptions, option);
        if (options.totalTime % options.time) {
            options.totalTime = Math.floor(options / options.time) * options.time + options.time;
        }
        cache = {
            currentT: options.time || 0,
            totalTime: options.totalTime - options.time || 0
        };
        let run = function() {
            timer = setTimeout(function() {
                if (cache.totalTime >= 0) {
                    options.cb(cache);
                    cache.totalTime -= options.time;
                    cache.currentT += options.time;
                    run();
                } else {
                    clearTimeout(timer);
                }
            }, options.time);
        };
        timerInstance = {
            start: function() {
                if (timer) {
                    clearTimeout(timer);
                }
                run();
            },
            pause: function() {
                if (timer) {
                    clearTimeout(timer);
                }
            },
            stop: function() {
                if (timer) {
                    clearTimeout(timer);
                }
                cache.currentT = 0;
            },
            destory: function() {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = null;
                cache.currentT = 0;
            }
        };
        return timerInstance;
    };
```
**使用示例**

```
    let timer = new countDown(options);
    timer.start();
    timer.stop();
    timer.destory();
```
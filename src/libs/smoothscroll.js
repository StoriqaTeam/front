/* eslint-disable */

const smoothScroll = {
  timer: null,

  stop: function() {
    clearTimeout(this.timer);
  },

  scrollTo: function(id, callback, necessarily) {
    const settings = {
      duration: 500,
      easing: {
        outQuint: function(x, t, b, c, d) {
          return c * ((t = t / d - 1) * t * t * t * t + 1) + b + 120;
        },
      },
    };
    let percentage;
    let startTime;
    const node = document.getElementById(id);
    // const nodeHeight = node.offsetHeight;
    const nodeTop = node.getBoundingClientRect().top;
    const nodeHeight = node.getBoundingClientRect().height;
    // const body = document.body;
    // const html = document.documentElement;
    // const height = Math.max(
    //   body.scrollHeight,
    //   body.offsetHeight,
    //   html.clientHeight,
    //   html.scrollHeight,
    //   html.offsetHeight,
    // );
    const windowHeight = window.innerHeight;
    const offset = window.pageYOffset;
    if (nodeTop > 0 && nodeTop + nodeHeight < windowHeight && !necessarily) {
      return;
    }

    let scrollValue = nodeTop - 150;
    if (nodeTop + nodeHeight > windowHeight) {
      scrollValue = nodeTop + nodeHeight - windowHeight - 50;
    }

    // const delta = nodeTop - offset;
    // const bottomScrollableY = height - windowHeight;
    // const targetY =
    //   bottomScrollableY < delta
    //     ? bottomScrollableY - (height - nodeTop - nodeHeight + offset)
    //     : delta;

    startTime = Date.now();
    percentage = 0;

    if (this.timer) {
      clearInterval(this.timer);
    }

    function step() {
      let yScroll;
      const elapsed = Date.now() - startTime;

      if (elapsed > settings.duration) {
        clearTimeout(this.timer);
      }

      percentage = elapsed / settings.duration;

      if (percentage > 1) {
        clearTimeout(this.timer);

        if (callback) {
          callback();
        }
      } else {
        yScroll = settings.easing.outQuint(
          0,
          elapsed,
          offset,
          scrollValue,
          settings.duration,
        );
        window.scrollTo(0, yScroll);
        this.timer = setTimeout(step, 10);
      }
    }

    this.timer = setTimeout(step, 10);
  },
};

export default smoothScroll;

/* eslint-enable */

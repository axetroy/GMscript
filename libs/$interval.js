let $interval = (fn, delay) => {
  let interval = () => {
    fn.call(this);
    id = setTimeout(interval, delay);
  };

  let id = setTimeout(interval, delay);

  return function () {
    window.clearTimeout(id);
  }
};

$interval.cancel = (timerFunc) => {
  timerFunc();
};

export default $interval;
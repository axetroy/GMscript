/**
 * timeout wrapper
 * @param fn
 * @param delay
 * @returns {number}
 */
let $timeout = (fn = noop, delay = 0) => {
  return window.setTimeout(fn, delay);
};

/**
 * cancel timer
 * @param timerId
 * @returns {*}
 */
$timeout.cancel = function (timerId) {
  window.clearTimeout(timerId);
  return timerId;
};

export default $timeout;

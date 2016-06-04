import Q from 'q';
import main from './main';
import CONFIG from './config';

let init = ()=> {
  new main(CONFIG.rules).all()
    .then(function () {
      return Q.resolve(true);
    }, function () {
      return Q.resolve(true);
    })
    .then(function () {
      new main(CONFIG.rules).oneByOne();
    });
};

export default init;
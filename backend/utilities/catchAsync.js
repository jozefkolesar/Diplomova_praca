module.exports =
  (fn) =>
  //zachytávam chybu z catchAsync - create tour a posielam ju do Error Handleru
  //fn = function
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

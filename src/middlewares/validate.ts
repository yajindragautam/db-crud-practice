import http from "http-status-codes";
import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mappedErrors = errors.mapped();
    // if (req.headers.accept === "application/json" || req.headers['content-type'] === "application/json" || req.xhr) {
    //   return res.status(http.StatusCodes.UNPROCESSABLE_ENTITY)
    //     .json(mappedErrors);
    // }
    // req.flash('errors', mappedErrors);
    // req.flash('inputData', req.body);
    return res.redirect("back");
  }
  return next();
};

export = {validate};

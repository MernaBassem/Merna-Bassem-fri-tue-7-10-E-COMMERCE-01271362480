import { ErrorClass } from "../utils/index.js";

// find Document With name
export const getDocumentByName = (model) => {
  return async (req, res, next) => {
    const { name } = req.body;
    if (name) {
      const document = await model.findOne({ name });
      if (document) {
        return next(
          new ErrorClass(
            `${model.modelName} Name already exists ${name}`,
            404,
            `${model.modelName}  Name already exists ${name}`
          )
        );
      }
    }
    next();
  };
};

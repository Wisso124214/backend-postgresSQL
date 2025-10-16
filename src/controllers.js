import { models } from './models.js';

const errorCodes = {
  'ValidationError': 400,
  'UnauthorizedError': 401,
  'ForbiddenError': 403,
  'NoDataError': 406,
  'NotFoundError': 404,
  'InternalServerError': 500
};

export const createControllers = async (app) => {

  Object.values(models).forEach((model) => {
    if (!model) {
      throw new Error('Controller not found');
    }

    const controllers = {
      get: [`/${model.modelName.toLowerCase()}s`, `/${model.modelName.toLowerCase()}/:id`],
      post: [`/${model.modelName.toLowerCase()}`],
      put: [`/${model.modelName.toLowerCase()}/:id`],
      delete: [`/${model.modelName.toLowerCase()}s`, `/${model.modelName.toLowerCase()}/:id`]
    };

    const getId = (req) => req.params.id;

    const getData = async (method, req) => {
      switch (method) {
        case 'get':
          if (!req.params.id) {
            return await model.find();
          } else {
            return await model.findById(getId(req));
          }
        case 'post':
          const data = new model(req.body);
          await data.save();
          return data;
        case 'put':
          return await model.findByIdAndUpdate(getId(req), req.body, { new: true });
        case 'delete':
          if (!req.params.id) {
            const items = await model.find();
            await Promise.all(items.map(item => model.findByIdAndDelete(item._id)));
            return { deletedCount: items.length };
          } else {
            return await model.findByIdAndDelete(getId(req));
          }
        default:
          throw new Error('Method not supported');
      }
    }

    const handleError = (error, res) => {
      const status = errorCodes[error.name] || 500;
      res.status(status).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    };

    for (const method of Object.keys(controllers)) {
      for (const route of controllers[method]) {
        if (!route) {
          throw new Error(`Route for ${method} not found`);
        }

        app[method](route, async (req, res) => {
          try {
            const data = await getData(method, req);
            if (!data) {
              handleError(new Error(`No data found for ${model.modelName} and route ${route}`), res);
              return;
            }
            res.json(data);
          } catch (error) {
            handleError(error, res);
          }
        });
      }
    }
  });
};
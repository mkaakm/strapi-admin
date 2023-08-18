'use strict';

/**
 * item router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::item.item');

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: 'POST',
    path: '/items/containsLocation',
    handler: 'api::item.item.containsLocation',
  },
  {
    method: 'GET',
    path: '/items/:id/presentation',
    handler: 'api::item.item.getPresentation',
  }
];

// module.exports = createCoreRouter('api::item.item');

module.exports = customRouter(defaultRouter, myExtraRoutes);

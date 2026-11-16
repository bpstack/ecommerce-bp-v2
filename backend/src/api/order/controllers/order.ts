/**
 * order controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    const response = await super.create(ctx);
    // The purchase is done: the buyer's cart must not come back on reload.
    if (ctx.state.user) {
      await strapi.service('api::cart.cart').clearForUser(ctx.state.user.id);
    }
    return response;
  },
}));

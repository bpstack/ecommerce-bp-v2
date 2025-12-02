import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cart.cart', ({ strapi }) => ({
  async migrate(ctx) {
    const { sessionId, userId } = ctx.request.body;

    if (!sessionId || !userId) {
      return ctx.badRequest('sessionId and userId are required');
    }

    try {
      // Find anonymous cart by sessionId
      const anonymousCarts = await strapi.documents('api::cart.cart').findMany({
        filters: { sessionId },
        populate: ['cart_items', 'cart_items.product'],
      });

      const anonymousCart = anonymousCarts[0];

      if (!anonymousCart) {
        return { message: 'No anonymous cart found', migrated: false };
      }

      // Find user's existing cart
      const userCarts = await strapi.documents('api::cart.cart').findMany({
        filters: { user: userId },
        populate: ['cart_items', 'cart_items.product'],
      });

      const userCart = userCarts[0];

      if (userCart) {
        // Merge: move items from anonymous cart to user cart
        for (const item of anonymousCart.cart_items || []) {
          // Check if product already in user cart
          const existingItem = (userCart.cart_items || []).find(
            (ui: any) => ui.product?.id === item.product?.id
          );

          if (existingItem) {
            // Update quantity
            await strapi.documents('api::cart-item.cart-item').update({
              documentId: existingItem.documentId,
              data: {
                quantity: existingItem.quantity + item.quantity,
              },
            });
          } else {
            // Move item to user cart
            await strapi.documents('api::cart-item.cart-item').update({
              documentId: item.documentId,
              data: {
                cart: userCart.id,
              },
            });
          }
        }

        // Delete anonymous cart
        await strapi.documents('api::cart.cart').delete({
          documentId: anonymousCart.documentId,
        });

        return { message: 'Cart merged successfully', migrated: true, cartId: userCart.id };
      } else {
        // Assign anonymous cart to user
        await strapi.documents('api::cart.cart').update({
          documentId: anonymousCart.documentId,
          data: {
            user: userId,
            sessionId: null,
          },
        });

        return { message: 'Cart assigned to user', migrated: true, cartId: anonymousCart.id };
      }
    } catch (error) {
      console.error('Cart migration error:', error);
      return ctx.internalServerError('Failed to migrate cart');
    }
  },
}));
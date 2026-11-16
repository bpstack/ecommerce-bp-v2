import crypto from 'crypto';
import { factories } from '@strapi/strapi';

const CART = 'api::cart.cart';
const ITEM = 'api::cart-item.cart-item';
const GUEST_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days, same as the cookie
export const MAX_QUANTITY = 99;

export default factories.createCoreService(CART, ({ strapi }) => {
  const findCart = (filters: Record<string, unknown>) =>
    strapi.documents(CART).findFirst({
      filters,
      populate: { cart_items: { populate: ['product'] } },
      status: 'published',
    });

  // Authenticated user id from the Bearer token; null for guests.
  const getUserId = async (ctx): Promise<number | null> => {
    if (!ctx.request.header.authorization) return null;
    try {
      const payload = await strapi.plugin('users-permissions').service('jwt').getToken(ctx);
      if (payload?.id) return payload.id;
    } catch {
      // falls through
    }
    return ctx.throw(401, 'Invalid token');
  };

  const newSessionId = (ctx): string => {
    const sessionId = crypto.randomUUID();
    const secure = ctx.request.headers['x-forwarded-proto'] === 'https' || ctx.secure;
    ctx.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure,
      sameSite: secure ? 'none' : 'lax',
      maxAge: GUEST_TTL_MS,
    });
    return sessionId;
  };

  const destroy = async (cart) => {
    for (const item of cart.cart_items ?? []) {
      await strapi.documents(ITEM).delete({ documentId: item.documentId });
    }
    await strapi.documents(CART).delete({ documentId: cart.documentId });
  };

  // Move guest items into the user's cart, adding quantities for repeated products.
  const merge = async (guest, cart) => {
    for (const item of guest.cart_items ?? []) {
      const existing = (cart.cart_items ?? []).find(
        (i) => i.product?.documentId === item.product?.documentId
      );
      await strapi.documents(ITEM).update(
        existing
          ? {
              documentId: existing.documentId,
              data: { quantity: Math.min(existing.quantity + item.quantity, MAX_QUANTITY) },
            }
          : { documentId: item.documentId, data: { cart: cart.documentId } }
      );
      if (existing) await strapi.documents(ITEM).delete({ documentId: item.documentId });
    }
    await strapi.documents(CART).delete({ documentId: guest.documentId });
  };

  return {
    findByDocumentId: (documentId: string) => findCart({ documentId }),

    /**
     * The cart of whoever makes the request: the logged-in user, else the
     * `sessionId` cookie. The owner never comes from the request body.
     * A guest cart is folded into the user's cart the first time both show up.
     */
    async resolve(ctx, { create = false } = {}) {
      const userId = await getUserId(ctx);
      const sessionId = ctx.cookies.get('sessionId');
      const guest = sessionId ? await findCart({ sessionId }) : null;

      if (!userId) {
        if (guest || !create) return guest;
        const { documentId } = await strapi
          .documents(CART)
          .create({ data: { sessionId: sessionId ?? newSessionId(ctx) } });
        return findCart({ documentId });
      }

      const byUser = { user: { id: userId } };
      const cart = await findCart(byUser);

      if (guest && cart) {
        await merge(guest, cart);
      } else if (guest) {
        await strapi
          .documents(CART)
          .update({ documentId: guest.documentId, data: { user: userId, sessionId: null } });
      } else if (!cart && create) {
        await strapi.documents(CART).create({ data: { user: userId } });
      } else {
        return cart;
      }
      return findCart(byUser);
    },

    async clearForUser(userId: number) {
      const cart = await findCart({ user: { id: userId } });
      if (cart) await destroy(cart);
    },

    // Guest carts whose cookie has already expired can never be reached again.
    async purgeExpiredGuests() {
      const carts = await strapi.documents(CART).findMany({
        filters: {
          sessionId: { $notNull: true },
          createdAt: { $lt: new Date(Date.now() - GUEST_TTL_MS).toISOString() },
        },
        populate: ['cart_items'],
      });
      for (const cart of carts) await destroy(cart);
    },
  };
});

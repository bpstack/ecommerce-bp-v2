import { MAX_QUANTITY } from '../services/cart';

const ITEM = 'api::cart-item.cart-item';
const PRODUCT = 'api::product.product';

const cartService = () => strapi.service('api::cart.cart');

const isQuantity = (value: unknown, min: number): value is number =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= MAX_QUANTITY;

// Only what the storefront needs: no owner, no sessionId. Items whose product
// is no longer published come back without it and are left out.
const view = (cart) => ({
  items: (cart?.cart_items ?? [])
    .filter(({ product }) => product)
    .map(({ id, documentId, quantity, product }) => ({ id, documentId, quantity, product })),
});

// The cart as it is after a change.
const reload = async (cart) => view(await cartService().findByDocumentId(cart.documentId));

// Set the quantity of an item of the caller's own cart; 0 removes it.
const setQuantity = async (ctx, quantity: number) => {
  const cart = await cartService().resolve(ctx);
  const item = cart?.cart_items?.find((i) => i.documentId === ctx.params.id);
  if (!item) return ctx.notFound('Cart item not found');

  if (quantity === 0) {
    await strapi.documents(ITEM).delete({ documentId: item.documentId });
  } else {
    await strapi.documents(ITEM).update({ documentId: item.documentId, data: { quantity } });
  }
  return reload(cart);
};

export default {
  async find(ctx) {
    return view(await cartService().resolve(ctx));
  },

  async addItem(ctx) {
    const { productId, quantity = 1 } = ctx.request.body ?? {};
    if (typeof productId !== 'string' || !isQuantity(quantity, 1)) {
      return ctx.badRequest('productId and a quantity between 1 and 99 are required');
    }

    const product = await strapi
      .documents(PRODUCT)
      .findOne({ documentId: productId, status: 'published' });
    if (!product) return ctx.notFound('Product not found');

    const cart = await cartService().resolve(ctx, { create: true });
    const existing = cart.cart_items?.find((i) => i.product?.documentId === productId);

    if (existing) {
      await strapi.documents(ITEM).update({
        documentId: existing.documentId,
        data: { quantity: Math.min(existing.quantity + quantity, MAX_QUANTITY) },
      });
    } else {
      await strapi
        .documents(ITEM)
        .create({ data: { quantity, cart: cart.documentId, product: productId } });
    }
    return reload(cart);
  },

  async updateItem(ctx) {
    const { quantity } = ctx.request.body ?? {};
    if (!isQuantity(quantity, 0)) {
      return ctx.badRequest('A quantity between 0 and 99 is required');
    }
    return setQuantity(ctx, quantity);
  },

  async removeItem(ctx) {
    return setQuantity(ctx, 0);
  },
};

// The only cart routes. They are open to guests (`auth: false`) because the
// controller resolves the owner itself, from the JWT or the session cookie.
const route = (method: string, path: string, action: string) => ({
  method,
  path,
  handler: `cart.${action}`,
  config: { auth: false },
});

export default {
  routes: [
    route('GET', '/cart', 'find'),
    route('POST', '/cart/items', 'addItem'),
    route('PUT', '/cart/items/:id', 'updateItem'),
    route('DELETE', '/cart/items/:id', 'removeItem'),
  ],
};

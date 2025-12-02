import crypto from 'crypto';

export default {
  async getSession(ctx) {
    let sessionId = ctx.cookies.get('sessionId');

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      
      // Detectar si estamos detrás de un proxy HTTPS
      const isSecure = ctx.request.headers['x-forwarded-proto'] === 'https' || ctx.secure;
      
      ctx.cookies.set('sessionId', sessionId, {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
      });
    }

    return { sessionId };
  },
};
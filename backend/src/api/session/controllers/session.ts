import crypto from 'crypto';

export default {
  async getSession(ctx) {
    let sessionId = ctx.cookies.get('sessionId');

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      ctx.cookies.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
      });
    }

    return { sessionId };
  },
};
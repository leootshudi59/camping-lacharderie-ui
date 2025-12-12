import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Applique le middleware à toutes les routes sauf api, static, images...
  matcher: ['/', '/(fr|en|es|pt)/:path*']
};
import { Request } from 'express';
import * as UrlPattern from 'url-pattern';

export const getRoute = (req: Request): string => {
  const pattern = new UrlPattern(`*(${req.route.path})`);
  const route = pattern.match(req.path);
  return route._;
};

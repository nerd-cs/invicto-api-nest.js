import { HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function httpsRedirect(req: Request, res: Response, next: NextFunction) {
  console.log(
    `secure: ${req.secure}, hostname: ${req.hostname}, originalUrl: ${
      req.originalUrl
    }, url: ${req.url}, origin: ${req.header('origin')}`,
  );

  console.log(
    `Heroku headers => proto: ${req.header(
      'X-Forwarded-Proto',
    )}, for: ${req.header('X-Forwarded-For')}, port: ${req.header(
      'X-Forwarded-Port',
    )}`,
  );

  if (!req.secure) {
    const httpsUrl = `https://localhost:8443${req.originalUrl}`;

    console.log(httpsUrl);

    res.redirect(HttpStatus.PERMANENT_REDIRECT, httpsUrl);
  } else {
    next();
  }
}

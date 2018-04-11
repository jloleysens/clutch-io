import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { boomify, notFound } from 'boom';
import { UpdateService } from './UpdateService';

import { InvalidArgsError, InvalidDocumentError } from './errors/common';

const PORT = 3003;
const ENV = process.env.NODE_ENV || 'development';

const app = new Koa();
const router = new KoaRouter();

let updateService: UpdateService;

/* -- Router functions -- */

async function ping(ctx: Koa.Context, next) {
  ctx.body = 'PONG';
  next();
}

async function publish (ctx: Koa.Context, next) {
  const result = await updateService.publish(ctx.request.body);
  ctx.body = result;
  next();
}

async function checkForAppUpdate (ctx: Koa.Context, next) {
  const result = await updateService.checkForAppUpdate(ctx.request.body);
  ctx.body = result;
  next();
}

/* ---- Custom middleware functions ---- */

async function logger(ctx: Koa.Context, next) {
  const startMS = Date.now();
  await next();
  console.log(`${ctx.method} ${ctx.status} - ${ctx.url} (${(Date.now() - startMS) / 1000}s)`);
}

async function errorHandler(ctx: Koa.Context, next) {
  try {
    await next();
  } catch (e) {
    let status, message;
    if (e instanceof InvalidArgsError || e instanceof InvalidDocumentError) {
      status = 400;
      message = e.message;
    } else {
      const be = boomify(e);
      status = be.output.statusCode;
      message = be.message;
    }

    ctx.status = status;
    ctx.body = message;
    app.emit('error', e, ctx);
    return;
  }

  if (ctx.status == 404) {
    const nf = notFound();
    ctx.status = nf.output.statusCode;
    ctx.body = nf.message;
  }
}

/* ---- Middleware setup ---- */

router
  .get('/ping', ping)
  .post('/check', checkForAppUpdate)
  .post('/publish', publish);

app.use(logger);
app.use(errorHandler);
app.use(bodyParser(
  {
    enableTypes: ['json'],
    onerror: function (err, ctx) {
      ctx.throw(422, 'Invalid request body');
    }
  }
));
app.use(router.routes());

app.on('error', (error, ctx) => {
  console.log('Server Error:', error.message, ctx);
});

process.on('unhandledRejection', err => {
  console.log(err);
});

(async function main() {
  updateService = await UpdateService.create();
  app.listen(PORT, async () => {
    console.log(`Listening at http://localhost:${PORT}`)
  });
})();

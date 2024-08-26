// https://stackoverflow.com/questions/33751203/how-to-parse-multipart-form-data-body-with-koa

const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body').default;
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const port = 3003;

router.post('/form-data', async ctx => {
  const body = ctx.request.body;
  // some code...

  // multipart: true
  [
    'app', 'req',
    'res', 'ctx',
    'response', 'originalUrl',
    'body', 'files',
    'params'
  ]

  // multipart: false
  ['app', 'req', 'res', 'ctx', 'response', 'originalUrl', 'params']

  console.log('[==== /form-data ====]');
  console.log('[files]', ctx.request.files);

  for (const [key, file] of Object.entries(ctx.request.files)) {
    const filename = path.join(__dirname, 'uploads', file.originalFilename);
    fs.mkdirSync(path.dirname(filename), { recursive: true });

    // Object.keys(file)
    [
      '_events',
      '_eventsCount',
      '_maxListeners',
      'lastModifiedDate',
      'filepath',
      'newFilename',
      'originalFilename',
      'mimetype',
      'hashAlgorithm',
      'size',
      '_writeStream',
      'hash'
    ]

    await new Promise((resolve) => {
      fs.createReadStream(file.filepath).
        pipe(fs.createWriteStream(filename))
        .on('close', resolve);
    });
  }

  ctx.body = 'OK';
});

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  await next();
});

app.use(koaBody({ multipart: true }));

app.use(router.routes());

app.listen(port, () => {
  console.log(`app run at http://localhost:${port}`);
});

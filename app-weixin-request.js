// https://stackoverflow.com/questions/33751203/how-to-parse-multipart-form-data-body-with-koa
// https://www.xiaoxiaoguo.cn/node/koa-wechat-img-check.html

const fs = require('fs');
const Koa = require('koa');
const koaBody = require('koa-body').default;
const Router = require('koa-router');
const request = require('request');

const app = new Koa();
const router = new Router();
const port = 3003;

router.post('/form-data', async ctx => {
  const body = ctx.request.body;

  console.log('[==== /form-data ====]');
  // console.log('[files]', ctx.request.files);

  const file = Object.values(ctx.request.files)[0];
  const ACCESS_TOKEN = '83_6KuPD3JDRtVeX5qTCGi1V90hYTrjO06bNt7bJna2eJXsQ5br5lDlPZ12SfhOkXtjudmHBroo9ahWsBV6XIzI0hbo7hi3u3XOCMWoTlngz-Lzm5VmXZLVugaCKWx2yESfQ9Kt8gmljLUpdi-HQSRbAGDACB';
  const result = await new Promise((resolve) => {
    request({
      url: `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${ACCESS_TOKEN}&type=image`,
      method: 'POST',
      formData: {
        buffer: {
          value: fs.readFileSync(file.filepath || /* 兼容老版本 formidable */file.path),
          options: {
            // 添加一些额外的属性给 file (微信小程序临时素材) - 实测 filename 必传，否则报错 {errcode: 41005, errmsg: 'media data missing hint: [MBuA4a08739031] rid: 66cc9e30-0157894b-1b8dab4d'
            // https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/New_temporary_materials.html#%E8%BF%94%E5%9B%9E%E8%AF%B4%E6%98%8E
            filename: file.originalFilename || /* 兼容老版本 formidable */file.name,
          },
        },
      },
    }, (err, res, body) => {
      resolve(body);
    });
  });

  // {type: 'image', media_id: 'bTTSHoUMJmKeY3sAdMyARjmDsdkQctYcxkKbPtq_-WIcqt1b_OgPDO8q4A8KQ6hY', created_at: 1724686641, item: Array(0)}
  ctx.body = result;
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

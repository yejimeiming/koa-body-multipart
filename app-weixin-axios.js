// https://stackoverflow.com/questions/33751203/how-to-parse-multipart-form-data-body-with-koa

const fs = require('fs');
const Koa = require('koa');
const koaBody = require('koa-body').default;
const Router = require('koa-router');
const FormData = require('form-data');
const axios = require('axios').default;

const app = new Koa();
const router = new Router();
const port = 3003;

router.post('/form-data', async ctx => {
  const body = ctx.request.body;

  console.log('[==== /form-data ====]', Object.keys(ctx.request.files || {}));

  const formData = new FormData();
  for (const [
    // 前端传过来的 key, 在 web.js 中为 media
    key,
    // 这个 file 是 import('formidable').File
    // 最重要的是里面有个属性 filepath 是 koa-body 接收前端传递的 FormData 中文件的保存路径
    // 这里使用 fs.readFileSync(filepath) 读取成 Buffer 即可重新组装到 `const FormData = require('form-data');` 中
    file,
  ] of Object.entries(ctx.request.files)) {
    formData.append(key, fs.readFileSync(file.filepath || /* 兼容老版本 formidable */file.path), {
      // 添加一些额外的属性给 file (微信小程序临时素材) - 实测 filename 必传，否则报错 {errcode: 41005, errmsg: 'media data missing hint: [MBuA4a08739031] rid: 66cc9e30-0157894b-1b8dab4d'
      // https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/New_temporary_materials.html#%E8%BF%94%E5%9B%9E%E8%AF%B4%E6%98%8E
      filename: file.originalFilename || /* 兼容老版本 formidable */file.name,
    });
  }

  // ******* 这里换成你的 authorizer_access_token *******
  const ACCESS_TOKEN = '83_AY4UiAfBT39DWdhYyd7a4jcpX-QCwC2tUrOUGZq-G1n0drD2c28ycxbb8K6qMjli5zGKt4QoxJZdqb9tjJK9SetQM94-vPopei1sPWIqcKlon8MQOxp0JnUNCd44VzUGjSRM5zxHaIvm21OKVATgAMDBGZ';
  const res = await axios.post(
    `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${ACCESS_TOKEN}&type=image`,
    // 直接将 FormData 怼给 axios.post 第二个参数，它可以自动识别
    formData,
  );

  // {type: 'image', media_id: '0U3ycy7H81tcAVofbliQQOgmwm9qqsyeoAihi3WQyCMXajs9GJ4CGyidgXS5tLxL', created_at: 1724720050, item: Array(0)}
  ctx.body = res.data;
});

app.use(async (ctx, next) => {
  // 允许 web.js 请求跨域
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

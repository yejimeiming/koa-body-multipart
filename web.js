/** @type {import('axios').Axios} */
const axios = window.axios;

function readFile(options = {}) {
  return new Promise((resolve) => {
    const oInput = document.createElement('input');
    oInput.type = 'file';
    oInput.accept = options.accept;
    oInput.onchange = (ev) => {
      resolve((ev.target).files);
    };
    oInput.click();
  });
}

const oBtn = document.getElementById('btn-upload');
oBtn.onclick = clickUpload;

async function clickUpload() {
  const files = await readFile();
  const [file] = files;
  const formData = new FormData();

  // 添加一些额外的属性给 file (微信小程序临时素材)
  // https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/New_temporary_materials.html#%E8%BF%94%E5%9B%9E%E8%AF%B4%E6%98%8E
  Object.assign(file.__proto__, {
    filename: file.name,
    filelength: file.size,
    'content-type': file.type,
  });

  formData.append('media', file);

  console.log('---- meida ----:', formData.get('media'));
  const res = await axios.post('http://localhost:3003/form-data', formData);
  console.log('==== res ====:', res);
}

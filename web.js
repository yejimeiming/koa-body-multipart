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
const oInput = document.getElementById('input-token');
const oTextBox = document.getElementById('text-box');
oBtn.onclick = clickUpload;
oInput.value = localStorage.getItem('authorizer_access_token') || '';

async function clickUpload() {
  if (!oInput.value) {
    alert('请输入 authorizer_access_token');
    return;
  }
  localStorage.setItem('authorizer_access_token', oInput.value);

  const files = await readFile();
  const [file] = files;
  const formData = new FormData();

  // 这里 key 不一定非得用 media 随便写个字符串就行，比如：asdf
  formData.append('media', file);
  formData.append('access_token', oInput.value);

  console.log('---- meida ----:', formData.get('media'));
  const res = await axios.post('http://localhost:3003/form-data', formData);
  console.log('==== res.data ====:', res.data);

  oTextBox.innerHTML = JSON.stringify(res.data, null, 2);
}

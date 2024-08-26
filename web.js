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

  formData.append('media', file);

  console.log('---- meida ----:', formData.get('media'));
  const res = await axios.post('http://localhost:3003/form-data', formData);
  console.log('==== res.data ====:', res.data);
}

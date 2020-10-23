import { loadCamera, snapShot, snapshotResize } from './modules/camera.js';
import alert from './modules/alert.js';
import removeNode from './modules/removeNode.js';

const buttonLoad = document.getElementById('button-load');
const buttonSnapShot = document.getElementById('button-snap');
const elementVideo = document.getElementById('video');
const resultSnapShot = document.getElementById('preview');
const resultSnapShotAlt = document.getElementById('preview-alt');

buttonLoad.addEventListener('click', () => {
  loadCamera(elementVideo, null, (error) => {
    const options = { id: 'alert', timeout: 5000 };

    switch (error) {
      case 'NotSupportMediaDevicesError':
        alert('Nao tem suporte', options);
        break;
      case 'NotAllowedError':
        alert('camera bloqueada ', options);
        break;
      default:
        alert('algo deu errado ', options);
        break;
    }
  });
});

buttonSnapShot.addEventListener('click', () => {
  const image = document.createElement('img');
  const imageAlt = document.createElement('img');
  image.src = snapshotResize(elementVideo, 1920, 1080);
  imageAlt.src = snapShot(elementVideo, 480, 400);

  while (resultSnapShot.firstChild) {
    removeNode(resultSnapShot.firstChild);
  }
  while (resultSnapShotAlt.firstChild) {
    removeNode(resultSnapShotAlt.firstChild);
  }

  resultSnapShot.append(image);
  resultSnapShotAlt.appendChild(imageAlt);
});

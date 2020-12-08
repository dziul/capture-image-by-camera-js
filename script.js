import { loadCamera, snapShot, snapshotResize } from './modules/camera.js';
import alert from './modules/alert.js';

const buttonLoad = document.querySelector('.button-load');
const buttonLoadBack = document.querySelector('.button-load-back');
const buttonSnapShot = document.querySelector('.button-snap');
const elementVideo = document.querySelector('.snapshot-video');
const elementSnapshotContainer = document.querySelector('.snapshot');

const loadError = (error) => {
  const options = { id: 'alert', timeout: 5000 };
  switch (error) {
    case 'NotSupportMediaDevicesError':
      alert(`[${error}]Nao tem suporte`, options);
      break;
    case 'NotAllowedError':
      alert(`[${error}]camera bloqueada`, options);
      break;
    default:
      alert(`[${error}]algo deu errado`, options);
      break;
  }
};

buttonLoad.addEventListener('click', () => {
  loadCamera(elementVideo, null, (error) => {
    loadError(error);
  });
});
buttonLoadBack.addEventListener('click', () => {
  loadCamera(elementVideo, { video: { facingMode: 'environment' } }, (error) => {
    loadError(error);
  });
});

const onClick = () => {
  const image = document.createElement('img');
  const imageAlt = document.createElement('img');
  image.src = snapshotResize(elementVideo, 1920, 1080);
  imageAlt.src = snapShot(elementVideo, 480, 400);
};

buttonSnapShot.addEventListener('click', onClick);

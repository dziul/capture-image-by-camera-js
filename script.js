import { loadCamera, snapShot, closeCamera } from './modules/camera.js';
import alert from './modules/alert.js';

const buttonLoad = document.querySelector('.button-load');
const buttonLoadBack = document.querySelector('.button-load-back');
const buttonCloseCamera = document.querySelector('.button-close');
const buttonSnapShot = document.querySelector('.button-snap');
const elementVideo = document.querySelector('.snapshot-video');
const elementSnapshotPreview = document.querySelector('.snapshot-preview');

let hasSnaped = false;

const optionsLoadError = { id: 'alert', timeout: 5000 };
const loadError = (error) => {
  switch (error) {
    case 'NotSupportMediaDevicesError':
      alert(`[${error}]Nao tem suporte`, optionsLoadError);
      break;
    case 'NotAllowedError':
      alert(`[${error}]camera bloqueada`, optionsLoadError);
      break;
    default:
      alert(`[${error}]algo deu errado`, optionsLoadError);
      break;
  }
};

const changeElementSnapshotPreviewAriaHidden = (hidden) => {
  elementSnapshotPreview.setAttribute('aria-hidden', hidden);
};

const changeButtonSnapShot = () => {
  const attrTextNext = 'data-next-text';
  const previousText = buttonSnapShot.textContent;
  buttonSnapShot.textContent = buttonSnapShot.getAttribute(attrTextNext);
  buttonSnapShot.setAttribute(attrTextNext, previousText);
  hasSnaped = !hasSnaped;

  buttonLoad.disabled = hasSnaped;
  buttonCloseCamera.disabled = hasSnaped;
  buttonLoadBack.disabled = hasSnaped;
};

const onClick = () => {
  if (hasSnaped) {
    changeElementSnapshotPreviewAriaHidden(true);
    return changeButtonSnapShot();
  }

  snapShot(elementVideo).then((data) => {
    console.log('snapShot', data);
    changeButtonSnapShot();

    data.forEach((item) => {
      if (typeof item === 'object' && 'orientation' in item) {
        alert(`<a href="${item.blobUrl}" target="_blank">image ${item.orientation}</a>`, optionsLoadError);
      }
    });

    elementSnapshotPreview.style.backgroundImage = `url(${data[0].blobUrl})`;
    changeElementSnapshotPreviewAriaHidden(false);
  });
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
buttonSnapShot.addEventListener('click', onClick);
buttonCloseCamera.addEventListener('click', () => {
  closeCamera();
});

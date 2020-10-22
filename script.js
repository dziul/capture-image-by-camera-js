import { loadCamera } from './modules/camera.js';
import alert from './modules/alert.js';

const buttonLoad = document.getElementById('button-load');
const buttonSnap = document.getElementById('button-snap');
const elementVideo = document.getElementById('video');

buttonLoad.addEventListener('click', (event) => {
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

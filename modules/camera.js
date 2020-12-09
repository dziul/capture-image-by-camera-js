import alert from './alert.js';
import uuid from './uniqueId.js';

//ref https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
const constraintsDefault = {
  audio: false,
  video: {
    facingMode: 'user', //ou a traseira 'environment'
    width: { min: 1024, ideal: 1920, max: 3840 },
    height: { min: 576, ideal: 1080, max: 2160 },
    angleRotation: 90,
  },
};

const alertOptions = {
  id: 'alert',
};

const isHTMLVideoElement = (element) => element instanceof HTMLVideoElement;

const mimeType = 'image/jpeg';
const getId = () => uuid(12);

let streamed = {};
let videoElementClass = '';
let cameraWidth, cameraHeight;

//fechar camera, caso esteja ativa
export const closeCamera = () => {
  if ('getTracks' in streamed) {
    streamed.getTracks().forEach((track) => {
      track.stop();
    });
  }
};

/**
 *
 * @param {HTMLVideoElement} videoElement
 * @param {MediaStreamConstraints} constraints
 * @param {(error:string)=>void} reject   error: NotIsHTMLVideoElement, NotSupportMediaDevicesError, and https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Exceptions
 * @return {void}
 */
export const loadCamera = (videoElement, constraints, reject) => {
  if (!isHTMLVideoElement(videoElement)) {
    reject('NotIsHTMLVideoElement');
    return;
  }

  closeCamera();

  if (constraints) {
    constraints = {
      ...constraintsDefault,
      ...constraints,
      video: { ...constraintsDefault.video, ...constraints.video },
    };
  } else {
    constraints = constraintsDefault;
  }

  console.log('constraints', constraints);

  //permission, support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    reject('NotSupportMediaDevicesError');
  }

  alert('carregando câmera...', alertOptions);

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const attrDataId = 'data-id';
      console.log('stream', stream);
      streamed = stream;
      if (!videoElement.getAttribute(attrDataId)) {
        videoElement.setAttribute(attrDataId, getId());
        videoElement.setAttribute('autoplay', '');
        videoElement.setAttribute('muted', '');
        videoElement.setAttribute('playsinline', '');
        // possibilidade de usar events
        videoElement.addEventListener('loadeddata', (event) => {
          alert('loadeddata', alertOptions);
          cameraWidth = event.target.clientWidth;
          cameraHeight = event.target.clientHeight;
          alert(`width: ${cameraWidth}, height: ${cameraHeight}`, alertOptions);
          event.target.setAttribute('class', videoElementClass);
        });
        videoElement.addEventListener('loadedmetadata', () => {
          alert('loadedmetadata', alertOptions);
        });
        videoElement.addEventListener('loadstart', () => {
          alert('loadstart', alertOptions);
        });
      }

      videoElement.srcObject = stream;
      videoElementClass = videoElement.getAttribute('class');
      videoElement.removeAttribute('class');
    })
    .catch((error) => {
      // ref https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Exceptions
      console.error({ error });
      reject(error.name);
    });
};

//dispara apenas quando a camera está ativa
//cameraHeight e cameraWidth é setado apenas quando a camera é carregada
export const snapShot = (videoElement) => {
  if (!isHTMLVideoElement(videoElement)) {
    return null;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.height = cameraHeight;
  canvas.width = cameraWidth;
  context.drawImage(videoElement, 0, 0);

  const landscape = canvasToBlob(canvas);
  const portrait = canvasToBlob(canvasRotate(canvas, videoElement));
  const orientation = cameraHeight > cameraWidth ? 'portrait' : 'landscape';
  return Promise.all([landscape, portrait, orientation]);
};

export const blobToFile = (blob, filename) => {
  return new File([blob], filename, { type: blob.type, lastModified: +new Date() });
};

//solução que não dependa do .toBlob (no qual ainda não tem um suporte OK)
export const canvasToBlob = (canvasElement) => {
  return new Promise((resolve) => {
    const { width, height } = canvasElement;
    const dataUrl = canvasElement.toDataURL(mimeType);
    const dataString = dataUrl.split(',').pop();
    const bytesArraySource = atob(dataString)
      .split('')
      .map((char) => char.charCodeAt(0));
    const sizeBytes = bytesArraySource.length;
    const blob = new Blob([Uint8Array.from(bytesArraySource)], { type: mimeType });
    const extension = mimeType.split('/').pop();
    const filename = `${getId()}.${extension}`;
    const file = blobToFile(blob, filename);
    const orientation = height > width ? 'portrait' : 'landscape';
    resolve({
      orientation,
      width,
      height,
      dataUrl,
      sizeBytes,
      file,
      filename,
      mimeType,
      sizeMegaBytes: sizeBytes / Math.pow(1024, 2),
      blobUrl: window.URL.createObjectURL(blob),
    });
  });
};

export const canvasRotate = (canvasElement, videoElement) => {
  const context = canvasElement.getContext('2d');
  canvasElement.height = cameraWidth;
  canvasElement.width = cameraHeight;

  context.save();
  context.translate(cameraHeight, cameraWidth / cameraHeight);
  context.rotate(Math.PI / 2);
  context.drawImage(videoElement, 0, 0);
  context.restore();
  return canvasElement;
};

//[ref] https://gist.github.com/VMBindraban/1be9cd5eceb347bef860
// export const snapshotResize = (video, width, height) => {
//   let canvas = document.createElement('canvas'),
//     ctx = canvas.getContext('2d'),
//     xStart = 0,
//     yStart = 0,
//     aspectRadio,
//     newWidth,
//     newHeight;

//   canvas.width = width;
//   canvas.height = height;

//   aspectRadio = video.clientHeight / video.clientWidth;

//   if (video.clientHeight < video.clientWidth) {
//     //horizontal
//     aspectRadio = video.clientWidth / video.clientHeight;
//     (newHeight = height), (newWidth = aspectRadio * height);
//     xStart = -(newWidth - width) / 2;
//   } else {
//     //vertical
//     (newWidth = width), (newHeight = aspectRadio * width);
//     yStart = -(newHeight - height) / 2;
//   }

//   ctx.drawImage(video, xStart, yStart, newWidth, newHeight);

//   return canvas.toDataURL('image/jpeg');
// };

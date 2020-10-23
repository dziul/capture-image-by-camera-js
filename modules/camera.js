import removeNode from './removeNode.js';

//ref https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

const constraintsDefault = {
  audio: false,
  video: {
    facingMode: 'user', //ou a traseira 'environment'
    width: { min: 1024, ideal: 1920, max: 3840 },
    height: { min: 576, ideal: 1080, max: 2160 },
  },
};

const isHTMLVideoElement = (element) => element instanceof HTMLVideoElement;

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

  if (constraints) {
    constraints = {
      ...constraintsDefault,
      ...constraints,
      video: { ...constraintsDefault.video, ...constraints.video },
    };
  } else {
    constraints = constraintsDefault;
  }

  //permission, support
  if (!navigator.mediaDevices.getUserMedia) {
    reject('NotSupportMediaDevicesError');
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      videoElement.style.width = '1024px';
      videoElement.setAttribute('autoplay', '');
      videoElement.setAttribute('muted', '');
      videoElement.setAttribute('playsinline', '');
      // possibilidade de usar events
      videoElement.addEventListener('loadeddata', console.log);
      videoElement.srcObject = stream;
    })
    .catch((error) => {
      // ref https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Exceptions
      console.error({ error });
      reject(error.name);
    });
};

//[ref] https://gist.github.com/VMBindraban/1be9cd5eceb347bef860
export const snapshotResize = (video, width, height) => {
  let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    xStart = 0,
    yStart = 0,
    aspectRadio,
    newWidth,
    newHeight;

  canvas.width = width;
  canvas.height = height;

  aspectRadio = video.clientHeight / video.clientWidth;

  if (video.clientHeight < video.clientWidth) {
    //horizontal
    aspectRadio = video.clientWidth / video.clientHeight;
    (newHeight = height), (newWidth = aspectRadio * height);
    xStart = -(newWidth - width) / 2;
  } else {
    //vertical
    (newWidth = width), (newHeight = aspectRadio * width);
    yStart = -(newHeight - height) / 2;
  }

  ctx.drawImage(video, xStart, yStart, newWidth, newHeight);

  return canvas.toDataURL('image/jpeg');
};

export const snapShot = (videoElement, width, height) => {
  if (!isHTMLVideoElement(videoElement)) {
    return null;
  }

  const videoWidth = videoElement.clientWidth;
  const videoHeight = videoElement.clientHeight;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (height < width) {
    canvas.height = height;
    canvas.width = height * (videoWidth / videoHeight);
  } else {
    canvas.width = width;
    canvas.height = width * (videoHeight / videoWidth);
  }

  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // modo ideal para promise/observable, e poder usar o URL.createObjectURL
  // canvas.toBlob((blob) => {
  //   console.log(blob);
  // }, 'image/jpeg');
  return canvas.toDataURL('image/jpeg');
};
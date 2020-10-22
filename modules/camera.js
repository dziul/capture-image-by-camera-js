import removeNode from './removeNode.js';

//ref https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

const UNIQUE = (+new Date()).toString(32);
const DATA_UNIQUE = 'data-video-created-' + UNIQUE;

const constraintsDefault = {
  audio: false,
  video: {
    facingMode: 'user', //ou a traseira 'environment'
    width: { min: 1024, max: 1920 },
    height: { min: 576, max: 1080 },
  },
};

export const loadCamera = (target = document.body, constraints, reject) => {
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
      let video = document.querySelector(`[${DATA_UNIQUE}]`);
      if (!video) {
        video = document.createElement('video');
        video.style.width = '1024px';
        video.setAttribute(DATA_UNIQUE, '');
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.addEventListener('loadeddata', (event) => {
          console.log(event);
        });
        target.appendChild(video);
      }

      video.srcObject = stream;
    })
    .catch((error) => {
      // ref https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Exceptions
      console.error({ error });
      reject(error.name);
    });
};

export const removeCamera = () => {
  const video = document.querySelector(`[${DATA_UNIQUE}]`);
  removeNode(video);
};

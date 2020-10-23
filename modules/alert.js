import removeNode from './removeNode.js';

const optionsDefault = {
  timeout: 5000,
  id: 'alert-' + new Date().getTime().toString(36),
};

export default function (message, options = optionsDefault) {
  options = { ...optionsDefault, ...options };

  let parentElement = document.querySelector('#' + options.id);
  if (!parentElement) {
    parentElement = document.createElement('div');
    parentElement.id = options.id;
    parentElement.setAttribute('role', 'list');
    document.body.insertBefore(parentElement, document.body.lastChild);
  }

  const child = document.createElement('div');
  child.setAttribute('role', 'listitem');
  child.innerHTML = message;
  parentElement.appendChild(child);

  setTimeout(() => {
    removeNode(child);
    if (!parentElement.firstChild) {
      removeNode(parentElement);
    }
  }, options.timeout);
}

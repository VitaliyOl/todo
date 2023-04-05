// 19.03.2023

//1. Отримати посилання на всі елементи (інпут, кнопки, список)
//2. Створити ф-ію, яка створює обєкт однієї задачі
//3. створити розмітку однієї задачі та вставити її в ДОМ
//4. реалізувати запис задачі у localstorage
//5. реалізувати, щоб при оновленні сторінки задачі із localstorage
// відображалися на сторінці
//6. ств.ф-ію, яка буде переводити задачу у статус 'виконано'
//7. ств.ф-ію, яка буде видаляти задачу по кліку на кнопку

function markupStartProject() {
  const markup = `
    <div class="container">
      <div class="input-container">
        <input type="text" class="input-js" />
        <button type="button" class="btn-green">Add</button>
        <button type="button" class="btn-red">Delete</button>
      </div>
      <ul class="todo-list"></ul>
    </div>
    `;

  document.body.innerHTML = markup;
}

markupStartProject();

const refs = {
  input: document.querySelector('.input-js'),
  bttGreen: document.querySelector('.btn-green'),
  btnRed: document.querySelector('.btn-red'),
  list: document.querySelector('.todo-list'),
  inputContainer: document.querySelector('.input-container'),
};

refs.bttGreen.addEventListener('click', createObj);
refs.list.addEventListener('click', completedObj);
refs.btnRed.addEventListener('click', deletedObg);

const STORAGE_KEY = 'todo';

const dataStorage = loadStorageObj(STORAGE_KEY);

if (dataStorage) {
  markupStorageObj(dataStorage);
}

function createObj() {
  const { value } = refs.input;

  if (value === '') {
    return;
  }

  const todoObj = {
    id: Date.now(),
    cls: 'list-item',
    text: value,
  };

  markupObj(todoObj);

  const data = loadStorageObj(STORAGE_KEY) || [];

  data.push(todoObj);

  saveStorageObj(STORAGE_KEY, data);

  refs.input.value = '';
}

function completedObj(e) {
  if (e.target.nodeName !== 'LI') {
    return;
  }

  if (e.target.classList.contains('list-item')) {
    e.target.classList.remove('list-item');
    e.target.classList.add('list-item-complete');
  } else {
    e.target.classList.add('list-item');
    e.target.classList.remove('list-item-complete');
  }

  const data = loadStorageObj(STORAGE_KEY);

  const dataStorage = data.map((el) => {
    if (el.id === Number(e.target.id)) {
      if (el.cls === 'list-item') {
        el.cls = 'list-item-complete';
      } else {
        el.cls = 'list-item';
      }
    }
    return el;
  });

  saveStorageObj(STORAGE_KEY, dataStorage);
}

function deletedObg() {
  const data = loadStorageObj(STORAGE_KEY);

  const dataStorageFilter = data.filter((el) => el.cls !== 'list-item-complete');

  saveStorageObj(STORAGE_KEY, dataStorageFilter);
  refs.list.innerHTML = '';
  markupStorageObj(dataStorageFilter);
}

function saveStorageObj(key, value) {
  try {
    const string = JSON.stringify(value);
    localStorage.setItem(key, string);
  } catch (error) {
    console.error();
    'something wrong Set:', error.message;
  }
}

function loadStorageObj(key) {
  try {
    const loadObj = localStorage.getItem(key);
    return loadObj === null ? undefined : JSON.parse(loadObj);
  } catch (error) {
    console.error('something wrong load: ', error.message);
  }
}

function markupObj({ id, cls, text }) {
  const markup = `<li class='${cls}' id='${id}'>${text}</li>`;

  return refs.list.insertAdjacentHTML('beforeend', markup);
}

function markupStorageObj(obj) {
  const markup = obj
    .map(({ id, cls, text }) => {
      return `<li class='${cls}' id='${id}'>${text}</li>`;
    })
    .join('');
  return refs.list.insertAdjacentHTML('beforeend', markup);
}

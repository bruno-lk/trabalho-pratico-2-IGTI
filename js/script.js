let stat = null;
let inputUser = null;
let totalUsers = null;
let tabUsers = null;
let button = null;
let allUsers = [];
let countUsers = 0;

window.addEventListener('load', () => {
  stat = document.querySelector('#stat');
  button = document.querySelector('#searchBtn');
  inputUser = document.querySelector('#inputUser');
  tabUsers = document.querySelector('#tabUsers');
  countUsers = document.querySelector('#countUsers');

  fetchUsers();
  preventFormSubmit();
  activateButton();
});

// funções do input
function preventFormSubmit() {
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => event.preventDefault());
  button.disabled = true;
}

function activateButton() {
  inputUser.addEventListener('keyup', (event) => {
    const hasText = !!event.target.value && event.target.value.trim() !== '';

    if (!hasText) {
      button.disabled = true;
      return;
    }

    button.disabled = false;
    button.addEventListener('click', searchUsers);
  });
  inputUser.focus();
}

// fetch
async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  //   const res = await fetch('users.json');
  const json = await res.json();

  // name (first + last), picture, dob.age e gender.
  allUsers = json.results.map((user) => {
    const { name, picture, dob, gender } = user;

    return {
      name: name.first + ' ' + name.last,
      picture: picture.thumbnail,
      age: dob.age,
      gender,
    };
  });
}

function searchUsers() {
  searchUser = allUsers.filter((user) => {
    if (user.name.toLowerCase().includes(inputUser.value.toLowerCase())) {
      console.log(inputUser.value);
      return user;
    }
  });

  renderList();
}

function renderList() {
  let usersHTML = '<div>';

  searchUser.forEach((user) => {
    const { name, picture, age, gender } = user;

    const userHTML = `
        <div class='user'>
          <div>
            <img src="${picture}" alt="${name}">
          </div>
          <div>
            <span>${name}, ${age}, ${gender}</span>
          </div>
        </div>  
      `;

    usersHTML += userHTML;
  });

  usersHTML += '</div>';

  tabUsers.innerHTML = usersHTML;
  countUsers.textContent = searchUser.length + ' usuario(s) encontrado(s)';

  renderStats();
}

function renderStats() {
  const countM = searchUser.filter((user) => user.gender === 'male').length;
  const countF = searchUser.filter((user) => user.gender === 'female').length;

  const totlaAge = searchUser.reduce((acc, res) => {
    return acc + res.age;
  }, 0);

  const media = totlaAge / searchUser.length;

  const statsHTML = `
  <div class='stats'>
    <p>Sexo Masculino: ${countM}</p>
    <p>Sexo Feminino: ${countF}</p>
    <p>Somas das idades: ${totlaAge}</p>
    <p>Media das idade: ${media}</p>
  </div>
  `;

  stat.innerHTML = statsHTML;
}

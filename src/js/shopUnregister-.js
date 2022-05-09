import {user} from '../firebase/user.js';
const creat_shop_btn = document.getElementById('create_shop_btn');
creat_shop_btn.addEventListener('click', () => {
  if (user.store) {
    user.store = true;
    location.replace('register_shop.html');
  }
});

// importing named exports we use brackets
import { createPostTile, uploadImage } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();


// login
api.makeAPIRequest('users.json').then(users => {
    document.addEventListener('click', e => {
        if (e.target.id === 'signIn') {
            const username = signIn(users);
            if (username) {
                feed(users);
            }
        } else if (e.target.id === 'signUp') {
            console.log(e.target.id);
        } else {
            ;
        }
    })
})


function signIn(users) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username) {
        api.signInfo("Please enter username");
    } else if (!password) {
        api.signInfo("Please enter password");
    } else {
        for (const item of users) {
            if (username === item.username 
                    && password === '1') {
                api.signInfo('Welcome ' + username);
                return username;
            }
        }
        api.signInfo('Sorry, your password was incorrect. Please double-check your password.');
        }
    return false;
}


function signUp(users) {
    
}



function feed(users) {
    const banner = document.getElementsByClassName('banner')[0];
    banner.setAttribute('style', '');
    const loginForm = document.getElementsByClassName('container')[0];
    loginForm.setAttribute('style', 'display: none;');
    const feed = document.getElementById('large-feed');
    feed.innerHTML = 'Not Yet Implemented';
    const entry = {
        "username": "jack",
        "name": "Jack Jiang",
        "id"  : 4,
        "posts": [4]
    }
    users.push(entry);
    console.log(users);
}


// we can use this single api request multiple times
// const feed = api.getFeed();

// feed
// .then(posts => {
//     posts.reduce((parent, post) => {

//         parent.appendChild(createPostTile(post));
        
//         return parent;

//     }, document.getElementById('large-feed'))
// });

// Potential example to upload an image
const input = document.querySelector('input[type="file"]');

input.addEventListener('change', uploadImage);


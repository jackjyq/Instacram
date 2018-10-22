// importing named exports we use brackets
import { createPostTile, uploadImage } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

// global varibles
const api  = new API();
let userData;

// loading
// User State login: 1  
//            registration: 2 
//            feed interface:3
api.makeAPIRequest('users.json').then(json => {
    userData = json;
    document.addEventListener('click', click => {
        // console.log(click.target.id);
        if (click.target.id === 'signUpButton') {
            const username = trySignUp();
            if (username) {
                api.changeUiTo(3);
                const feedAera = document.getElementById('large-feed');
                feedAera.innerHTML = "log in as " + username;
            }
        } else if (click.target.id === 'signInButton') {
            const username = trySignIn();
            if (username) {
                api.changeUiTo(3);
                const feedAera = document.getElementById('large-feed');
                feedAera.innerHTML = "log in as " + username;
            }
        } else if (click.target.id === 'signUpLink'){
            api.changeUiTo(2);
        } else if (click.target.id === 'signInLink'){
            api.changeUiTo(1);
        } else {
            ;
        }
    })
})





function trySignIn() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username) {
        api.signInfo("Please enter username");
    } else if (!password) {
        api.signInfo("Please enter password");
    } else {
        for (const item of userData) {
            if (username === item.username && password === '1') {
                return username;
            }
        }
        api.signInfo('Sorry, your password was incorrect. Please double-check your password.');
    }
    return false;
}



function trySignUp() {
    const fullname = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username) {
        api.signInfo("Please enter username");
    } else if (!password) {
        api.signInfo("Please enter password");
    } else if (!fullname) {
        api.signInfo("Please enter full name");
    } else {
        for (const item of userData) {
            if (username === item.username) {
                api.signInfo("The username isn't available. Please try another.");
                return false;
            }
        }
        const entry = {
            "username": username,
            "name": fullname,
            "id"  : 0,
            "posts": [0]
        }
        userData.push(entry);
        return username;
    }
    return false;
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


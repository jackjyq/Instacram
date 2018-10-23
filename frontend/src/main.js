// importing named exports we use brackets
import { createPostTile, uploadImage } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

// global varibles
const api  = new API();





if (window.localStorage.getItem('AUTH_KEY') === null) {
    api.changeUiTo(1);
} else {
    getUserFeed();
}

// loading
// User State login: 1  
//            registration: 2 
//            feed interface:3
document.addEventListener('click', click => {
    // console.log(click.target.id);
    if (click.target.id === 'signUpButton') {
        trySignUp();
    } else if (click.target.id === 'signInButton') {
        trySignIn();
    } else if (click.target.id === 'signUpLink'){
        api.changeUiTo(2);
    } else if (click.target.id === 'signInLink'){
        api.changeUiTo(1);
    }  else if (click.target.id === 'logOutLink'){
        signOut();
    } else {
        ;
    }
})


function signOut() {
    localStorage.clear();
    api.changeUiTo(1);
}



function trySignIn() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const url = 'http://localhost:5000/auth/login';
    const fetchData = { 
        method: 'POST', 
        body: JSON.stringify({
            "username": username,
            "password": password
          }),
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
    }
    if (!username) {
        api.signInfo("Please enter username");
    } else if (!password) {
        api.signInfo("Please enter password");
    } else {
        fetch(url, fetchData)
        .then(res => res.json())
        .then(json => {
            if (json["token"] === undefined) {
                api.signInfo('Sorry, your password was incorrect. Please double-check your password.');
            } else {
                // console.log("SignIn " + json["token"]);
                window.localStorage.setItem('AUTH_KEY', json["token"]);
                getUserFeed();  
            }
        })
    }
}






function trySignUp() {
    const fullname = document.getElementById('name').value;
    const useremail = document.getElementById('useremail').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const url = 'http://localhost:5000/auth/signup';
    const fetchData = { 
        method: 'POST', 
        body: JSON.stringify({
            "username": username,
            "password": password,
            "email": useremail,
            "name": fullname
          }),
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
    }
    if (!username) {
        api.signInfo("Please enter username");
    } else if (!password) {
        api.signInfo("Please enter password");
    } else if (!fullname) {
        api.signInfo("Please enter full name");
    } else {
        fetch(url, fetchData)
        .then(res => res.json())
        .then(json => {
            if (json["token"] === undefined) {
                api.signInfo("The username isn't available. Please try another.");
            } else {
                window.localStorage.setItem('AUTH_KEY', json["token"]);
                getUserFeed();
            }
        })
    }
}


function getUserFeed() {
    api.changeUiTo(3);
    getUserBoard();
    // we can use this single api request multiple times
    const feed = api.getFeed();

    feed
    .then(posts => {
        // console.log(posts);
        
        posts.reduce((parent, post) => {
            parent.appendChild(createPostTile(post));
            
            return parent;

        }, document.getElementById('large-feed'))
    });
}



function getUserBoard() {
    const url = 'http://localhost:5000/user/';
    const key = window.localStorage.getItem('AUTH_KEY');
    // console.log("Get User " + key);
    const fetchData = { 
        method: 'GET', 
        headers: {
            "accept": "application/json",
            "Authorization": 'Token ' + key
        }
    };
    fetch(url, fetchData)
    .then(res => res.json())
    .then(json => {
        if (json["id"] === undefined) {
            signOut();
        } else {
            // console.log(json);
            const userboard = document.getElementById('userboard');
            userboard.children[0].children[0].innerHTML = json.name;
            userboard.children[0].children[1].children[0].innerHTML = 
                    json.posts.length + " posts | "
                    + json.followed_num + " followers | "
                    + json.following.length + " following";
        }
    })
}

// Potential example to upload an image
// const input = document.querySelector('input[type="file"]');

// input.addEventListener('change', uploadImage);


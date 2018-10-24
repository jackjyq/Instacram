// importing named exports we use brackets
import { createPostTile, uploadImage } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

// global varibles
const api  = new API();
const HOST = 'http://localhost:5000';




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
    } else if (click.target.id === 'logOutLink'){
        signOut();
    } else if (click.target.id === 'showLike'){
        const postId = click.target.parentElement.parentElement.children[6].innerHTML;
        const likeNumber = click.target.firstChild.data;
        getLikeModal(postId, likeNumber);
    } else if (click.target.id === 'toggleLike'){
        const postId = click.target.parentElement.parentElement.children[6].innerHTML;
        const section = click.target.parentElement;
        toggleLike(postId, section);
    } else if (click.target.id === 'feedLink'){
        getUserFeed();
    }  else if (click.target.id === 'meLink'){
        getUserPage();
    }  else {
        ;
    }
})


function toggleLike(postId, section) {
    const key = window.localStorage.getItem('AUTH_KEY');
    const fetchData = { 
        method: 'PUT', 
        headers: {
            "accept": "application/json",
            "Authorization": 'Token ' + key
        }
    };
    const likeNumber = section.children[0].innerText;
    if (section.children[2].className === 'far fa-thumbs-up') {
        // console.log('like');
        const url = HOST + '/post/like?id=' + postId;
        fetch(url, fetchData)
        .then(res => res.json())
        .then(json => {
            if (json['message'] === 'success') {
                section.children[0].innerText = Number(likeNumber) + 1;
                section.children[2].setAttribute('class', 'fas fa-thumbs-up');
            }
        })
    } else if (section.children[2].className === 'fas fa-thumbs-up') {
        // console.log('unlike');
        const url = HOST + '/post/unlike?id=' + postId;
        fetch(url, fetchData)
        .then(res => res.json())
        .then(json => {
            if (json['message'] === 'success') {
                section.children[0].innerText = Number(likeNumber) - 1;
                section.children[2].setAttribute('class', 'far fa-thumbs-up');
            }
        })
    } else {
        console.log('Toggle Like failed');
    }
}




function signOut() {
    localStorage.clear();
    api.changeUiTo(1);
}



function trySignIn() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const url = HOST + '/auth/login';
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
                console.log("Token " + json["token"]);
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
    const url = HOST + '/auth/signup';
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
                // console.log('I am here')
                window.localStorage.setItem('AUTH_KEY', json["token"]);
                getUserFeed();
            }
        })
    }
}


function getUserFeed() {
    api.changeUiTo(3);
    const feed = document.getElementById('large-feed');
    while (feed.children[1]) {
        feed.removeChild(feed.children[1]);
    }
    const url = HOST + '/user/feed';
    const key = window.localStorage.getItem('AUTH_KEY');
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
        if (json["posts"] === undefined) {
            signOut();
        } else {
            json["posts"].reduce((parent, post) => {
                parent.appendChild(createPostTile(post));
                return parent;
            }, feed)
        }
    })
}


function getUserPage(userId) {
    // clean the feed
    const feed = document.getElementById('large-feed');
    while (feed.children[1]) {
        feed.removeChild(feed.children[1]);
    }
    // get user
    let url;
    if (userId === undefined) {
        url = HOST + '/user/';
    } else {
        url = HOST + '/user/?id=' + userId;
    }
    const key = window.localStorage.getItem('AUTH_KEY');
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
            // const userboard = document.getElementById('userboard');
            // userboard.children[0].children[0].innerHTML = json.name;
            // userboard.children[0].children[1].children[0].innerHTML = 
            //         json.posts.length + " posts | "
            //         + json.followed_num + " followers | "
            //         + json.following.length + " following";
            userboard.removeAttribute('style');
            // for (const postId of json.posts) {
            //     getUserPosts(postId);
            ;
            // }
        }
    })
}



function getUserPosts(postId) {
    const feed = document.getElementById('large-feed');
    const url = HOST + '/post/?id=' + postId;
    const key = window.localStorage.getItem('AUTH_KEY');
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
        if (json["id"] === postId) {
            feed.appendChild(createPostTile(json));
        } else {
            console.log('something went wrong in getUserPosts');
        }
    })
}






function getLikeModal(id, likeNumber) {
    const modal = document.getElementById('likeModal').children[0].children[0];
    const overview = modal.children[0].children[0].children[0];
    const list = modal.children[1].children[0];
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    if (likeNumber === '0') {
        overview.setAttribute('class', "far fa-frown");
        overview.innerText = ' No body likes your post';
    } else {
        overview.setAttribute('class', "far fa-smile-beam");
        if (likeNumber === '1') {
            overview.innerText = ' ' + likeNumber + ' person likes your post';
        } else {
            overview.innerText = ' ' + likeNumber + ' person like your post';
        }
        const url = HOST + '/post?id=' + id;
        const key = window.localStorage.getItem('AUTH_KEY');
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
            if (json["id"] == id) {
                for (const likeId of json.meta.likes) {
                    updateLikeModal(likeId, list);
                }
            } else {
                ;
            }
        })
    }
}



function updateLikeModal(id, list) {
    const url = HOST + '/user?id=' + id;
    const key = window.localStorage.getItem('AUTH_KEY');
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
        if (json["id"] == id) {
            // <li class="list-group-item">Author likes your post</li>
            const li = document.createElement('li');
            li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
            li.innerHTML = json.name + ' likes your post';
            list.appendChild(li);
        } else {
            ;
        }
    })
}










// Potential example to upload an image
// const input = document.querySelector('input[type="file"]');

// input.addEventListener('change', uploadImage);


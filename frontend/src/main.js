// importing named exports we use brackets
import { createPostTile, imageToText } from './helpers.js';

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
    } else if (click.target.id === 'meLink'){
        getMePage();
    } else if (click.target.id === 'updateProfile'){
        updateProfile();
    } else if (click.target.id === 'postNew'){
        updatePicture();
    } else if (click.target.id === 'searchUser'){
        const username = document.getElementById('searchUserInput').value;
        getUserPage(username);
    } else if (click.target.id === 'toggleFollow'){
        toggleFollow();
    } else {
        ;
    }
})


document.addEventListener('keypress', key => {
    if (key.key === "Enter" && key.target.id === "inputSmall") {
        const comment = key.target.value;
        const id = key.target.nextElementSibling.innerText;
        updateComment(comment, id);
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


function getMePage() {
    // clean the feed
    const feed = document.getElementById('large-feed');
    while (feed.children[1]) {
        feed.removeChild(feed.children[1]);
    }
    // get user
    const url = HOST + '/user/';
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
            // update userboard
            resetUserBoard();
            const userboard = document.getElementById('userboard');
            // active the three board
            const editTag = userboard.children[0].children[1];
            editTag.children[0].setAttribute('class', 'nav-link');
            const postTag = userboard.children[0].children[2];
            postTag.children[0].setAttribute('class', 'nav-link');
            const followingTag = userboard.children[0].children[3];
            followingTag.children[0].setAttribute('class', 'nav-link');

            
            
            // update UserContent
            const userContent = userboard.children[1].children[0].children[0].children;
            // console.log(userboard);
            userContent[0].innerText = json.name;
            userContent[1].innerText = json.email;
            userContent[2].innerText = json.posts.length + " posts | "
                                       + json.followed_num + " followers | "
                                       + json.following.length + " following";
            
            // update following tab
            for (const userId of json.following) {
                updateMeFollow(userId);
            }

            // show the userboard
            userboard.removeAttribute('style');
            // update the feed
            for (const postId of json.posts) {
                getUserPosts(postId);
            }
        }
    })
}



function getUserPage(username) {
    // clean the feed
    const feed = document.getElementById('large-feed');
    while (feed.children[1]) {
        feed.removeChild(feed.children[1]);
    }
    // get user
    const url = HOST + '/user/?username=' + username;
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
        resetUserBoard();
        const userboard = document.getElementById('userboard');
        const userContent = userboard.children[1].children[0].children[0].children;
        if (json["id"] === undefined) {
            // user not found
            userContent[0].innerText = 'User Not Found';
            userContent[1].innerText = '';
            userContent[2].innerText = '';
        } else {
            // user has found
            userContent[0].innerText = json.name;
            userContent[1].innerText = json.email;
            userContent[2].innerText = json.posts.length + " posts | "
                                       + json.followed_num + " followers | "
                                       + json.following.length + " following";
            // change the follow button
            updateFollowButton(json["id"], json.username);

            // show the userboard
            userboard.removeAttribute('style');
            // update the feed
            for (const postId of json.posts) {
                getUserPosts(postId);
            }
        }
    })
}


function updateFollowButton(id, username) {
    const followButton = userboard.children[1].children[0].children[0].children[3];
    // followButton.setAttribute('style', 'display: none;');
    // get current user information
    const url = HOST + '/user/';
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
        if (json.following.includes(id)) {
            // need to unfollow
            followButton.innerHTML = '<span>Unfollow</span><span style="display: none;">' + username + '</span>';
        } else {
            // need to follow
            followButton.innerHTML = '<span>Follow</span><span style="display: none;">' + username + '</span>';
        }
        followButton.removeAttribute('style');
    });
}







function updateMeFollow(userId) {
    const follow = document.getElementById('following').children[0].children[0].children[1];
    const url = HOST + '/user?id=' + userId;
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
        if (json["id"] == userId) {
            // <li class="list-group-item">User Name</li>
            const li = document.createElement('li');
            li.setAttribute('class', 'list-group-item');
            li.innerText = json.name;
            follow.appendChild(li);
        } else {
            console.log('something wrong in updateMeFollow');
        }
    })
}




function resetUserBoard() {
    const userboard = document.getElementById('userboard');
    // set the home page
    const userTag = userboard.children[0].children[0];
    userTag.children[0].setAttribute('class', 'nav-link active show');
    
    // set home content page
    const contentDivs = userboard.children[1].children;
    for (const div of contentDivs) {
        div.setAttribute('class', 'tab-pane fade');
    } 
    contentDivs[0].setAttribute('class', 'tab-pane fade active show');

    // clean warning in edit tab
    const userboard_warning = userboard.children[1].children[1].children[0][0].children[4];
    userboard_warning.innerText = '';
    const post_warning = document.getElementById('post').children[0].children[0].children[3];
    post_warning.innerText = '';

    // disable the follow button in user page
    const followButton = userboard.children[1].children[0].children[0].children[3];
    followButton.setAttribute('style', 'display: none;');

    // refresh follow tab
    const follow = document.getElementById('following').children[0].children[0].children[1];
    while (follow.firstChild) {
    follow.removeChild(follow.firstChild);
    }

    // disable the three board
    const editTag = userboard.children[0].children[1];
    editTag.children[0].setAttribute('class', 'nav-link disabled');
    const postTag = userboard.children[0].children[2];
    postTag.children[0].setAttribute('class', 'nav-link disabled');
    const followingTag = userboard.children[0].children[3];
    followingTag.children[0].setAttribute('class', 'nav-link disabled');
}




function updateProfile() {
    const updateEmail= document.getElementById('updateEmail').value;
    const updatePassword= document.getElementById('updatePassword').value;
    const updateName= document.getElementById('updateName').value;
    const warning = userboard.children[1].children[1].children[0][0].children[4];
    if (!updateEmail || !updatePassword || !updateName) {
        warning.innerText = "Please enter all required fields"
    } else {
        const url = HOST + '/user';
        const key = window.localStorage.getItem('AUTH_KEY');
        const fetchData = { 
            method: 'PUT',
            body: JSON.stringify({
                "email": updateEmail,
                "name": updateName,
                "password": updatePassword
              }),
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "Authorization": 'Token ' + key
            }
        };
        fetch(url, fetchData)
        .then(res => res.json())
        .then(json => {
            if (json.msg === 'success') {
                getMePage();
            } else {
                warning.innerText = json.msg;
            }
        })
    }
}



function updatePicture() {
    const uploadFile= document.getElementById('uploadFile').files[0];
    const descriptionText = document.getElementById('descriptionText').value;
    const warning = document.getElementById('post').children[0].children[0].children[3];

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === uploadFile.type);
    
    // bad data, let's walk away
    if (!valid) {
        warning.innerText = 'invalid picture';
        return false;
    }
    // if we get here we have a valid image
    const reader = new FileReader();
    reader.onload = function(event) {
        // The file's text will be printed here
        const src = event.target.result;

        // post new image
        const url = HOST + '/post';
        const key = window.localStorage.getItem('AUTH_KEY');
        const fetchData = { 
            method: 'POST',
            body: JSON.stringify({
                "description_text": descriptionText,
                "src": src.slice(23),
              }),
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "Authorization": 'Token ' + key
            }
        };
        fetch(url, fetchData)
        .then(res => res.json())
        .then(json => {
            if (json['post_id'] === undefined) {
                warning.innerText = json['message'];
                return false;
            } else {
                getMePage();
            }
        })
      }
    reader.readAsDataURL(uploadFile);

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



function updateComment(comment, id) {
    const url = HOST + '/post/comment/?id=' + id;
    const key = window.localStorage.getItem('AUTH_KEY');
    const fetchData = { 
        method: 'PUT',
        body: JSON.stringify({
            "comment": comment
          }),
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            "Authorization": 'Token ' + key
        }
    };
    fetch(url, fetchData)
    .then(res => res.json())
    .then(json => {
        if (json.message === 'success') {
            getMePage();
        } else {
            console.log(json);
        }
    })
}


function toggleFollow() {
    const followButton = userboard.children[1].children[0].children[0].children[3];
    const state = followButton.children[0].innerText;
    const username = followButton.children[1].innerText;
    // generate message
    let url;
    if (state === 'Follow') {
        url = HOST + '/user/follow?username=' + username;
    } else if (state === 'Unfollow') {
        url = HOST + '/user/unfollow?username=' + username;
    } else {
        return false;
    }
    const key = window.localStorage.getItem('AUTH_KEY');
    const fetchData = { 
        method: 'PUT',
        headers: {
            "accept": "application/json",
            "Authorization": 'Token ' + key
        }
    };
    fetch(url, fetchData)
    .then(res => res.json())
    .then(json => {
        if (json.message === 'success') {
            if (state === 'Follow') {
                followButton.innerHTML = '<span>Unfollow</span><span style="display: none;">' + username + '</span>';
            } else {
                followButton.innerHTML = '<span>Follow</span><span style="display: none;">' + username+ '</span>';
            }
            getUserPage(username);
        } else {
            console.log(json);
        }
    })
}



// Potential example to upload an image
// const input = document.querySelector('input[type="file"]');

// input.addEventListener('change', uploadImage);


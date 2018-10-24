/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 * 
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
   
    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createPostTile(post) {
    // console.log(post);
    const origin = document.getElementById('large-feed').children[0];
    const section = origin.cloneNode(true);
    section.removeAttribute('style');
    section.children[0].innerHTML = post.meta.author;
    section.children[1].children[0].innerText = post.meta.description_text;
    const publishDate = new Date(post.meta.published * 1000);
    section.children[1].children[1].children[0].innerText = 'published at ' + publishDate;
    section.children[2].src = 'data:image/png;base64,' + post.src;
    section.children[3].children[0].innerText =  post.meta.likes.length;
    section.children[3].children[1].innerText = post.comments.length;
    // set like button
    const url = 'http://localhost:5000' + '/user';
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
        if (post.meta.likes.includes(json["id"])) {
            section.children[3].children[2].setAttribute('class', "fas fa-thumbs-up");
        } else {
            section.children[3].children[2].setAttribute('class', "far fa-thumbs-up");
        }
    })
    // set comment aera
    post.comments.reduce((parent, comment) => {
        parent.appendChild(createComments(comment));
        // console.log(comment)
        return parent;

    }, section.children[4])
    section.children[6].innerHTML = post.id;
    return section;
}


// <li class="list-group-item"><abbr title="published by">Author: </abbr><span>comment goes here</span></li>
function createComments(comment) {
    const section = document.createElement('li');
    section.setAttribute('class', 'list-group-item');
    // generate abbr
    const abbr = document.createElement('abbr');
    const publishDate = new Date(comment.published * 1000);
    abbr.setAttribute  ('title', 'published at ' + publishDate);
    abbr.innerText = comment.author + ': ';
    // generate span
    const span = document.createElement('span');
    span.innerText = comment.comment; 
    //append
    section.appendChild(abbr);
    section.appendChild(span);
    return section;
}



// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();
    
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        const image = createElement('img', null, { src: dataURL });
        document.body.appendChild(image);
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
}

/* 
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/
export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null

}
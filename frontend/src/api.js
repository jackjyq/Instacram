// change this when you integrate with the real API, or when u start using the dev server
const API_URL = 'http://localhost:8080/data'

const getJSON = (path, options) => 
    fetch(path, options)
        .then(res => res.json())
        .catch(err => console.warn(`API_ERROR: ${err.message}`));





/**
 * This is a sample class API which you may base your code on.
 * You don't have to do this as a class.
 */
export default class API {

    /**
     * Defaults to teh API URL
     * @param {string} url 
     */
    constructor(url = API_URL) {
        this.url = url;
    } 



    makeAPIRequest(path) {
        return getJSON(`${this.url}/${path}`);
    }

    /**
     * @returns feed array in json format
     */
    getFeed() {
        return this.makeAPIRequest('feed.json');
    }

    /**
     * @returns auth'd user in json format
     */
    getMe() {
        return this.makeAPIRequest('me.json');
    }

    // login: 1  
    // registration: 2 
    // main interface: 3
    changeUiTo(state) {
        const banner = document.getElementsByTagName('header')[0];
        const signForm = document.getElementsByClassName('container')[0];
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('useremail');
        const signUpButton = document.getElementById('signUpButton');
        const signInButton = document.getElementById('signInButton');
        const signUpBanner = document.getElementById('signUpBanner');
        const signInBanner = document.getElementById('signInBanner');
        const userboard = document.getElementById('userboard');
        const feedAera = document.getElementById('large-feed');
        const footer = document.getElementsByTagName('footer')[0];
        this.signInfo('');
        if (state === 1) {
            banner.setAttribute('style', 'display: none;');
            signForm.removeAttribute('style');
            nameInput.setAttribute('style', 'display: none;');
            emailInput.setAttribute('style', 'display: none;');
            signUpButton.setAttribute('style', 'display: none;');
            signInButton.removeAttribute('style');
            signUpBanner.removeAttribute('style');
            signInBanner.setAttribute('style', 'display: none;');
            userboard.setAttribute('style', 'display: none;');
            feedAera.setAttribute('style', 'display: none;');
            footer.removeAttribute('style');
        } else if (state === 2) {
            banner.setAttribute('style', 'display: none;');
            signForm.removeAttribute('style');
            nameInput.removeAttribute('style');
            emailInput.removeAttribute('style');
            signUpButton.removeAttribute('style');
            signInButton.setAttribute('style', 'display: none;');
            signUpBanner.setAttribute('style', 'display: none;');
            signInBanner.removeAttribute('style');
            userboard.setAttribute('style', 'display: none;');
            feedAera.setAttribute('style', 'display: none;');
            footer.removeAttribute('style');
        } else if (state === 3) {
            banner.removeAttribute('style');
            signForm.setAttribute('style', 'display: none;');
            nameInput.setAttribute('style', 'display: none;');
            emailInput.setAttribute('style', 'display: none;');
            signUpButton.setAttribute('style', 'display: none;');
            signInButton.removeAttribute('style');
            signUpBanner.removeAttribute('style');
            signInBanner.setAttribute('style', 'display: none;');
            userboard.setAttribute('style', 'display: none;');
            feedAera.removeAttribute('style');
            footer.removeAttribute('style');
        } else {
            return 0;
        }
        return state;
    }

    signInfo(info) {
        const signInfo = document.getElementById('signInfo');
        signInfo.innerHTML = info;
        return info;
    }


}

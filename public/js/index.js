/*eslint-disable*/
import '@babel/polyfill';
import {login, logout} from './login';
import {displayMap} from './mapbox';
import {updateSettings} from './updateSettings';
import {bookTour} from './stripe';
// DOM element
const mapBox = document.getElementById('map');
const loginForm =document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout')
const userDataForm =document.querySelector('.form-user-data');
const passwordDataForm =document.querySelector('.form-user-password');
const bookButton = document.getElementById('book-tour');
// DELEGATIOn
if(mapBox){
    const locations =JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if(loginForm){
    loginForm.addEventListener('submit',e=>{
        e.preventDefault();
        const email =document.getElementById('email').value;
        const password =document.getElementById('password').value;
        login(email,password);
    })
}
if(logoutBtn){
    logoutBtn.addEventListener('click',logout);
}
if(userDataForm){
    userDataForm.addEventListener('submit',e=>{
        e.preventDefault();
        // multipart form data
        const form =new FormData();
        form.append('name',document.getElementById('name').value);
        form.append('email',document.getElementById('email').value);    
        form.append('photo',document.getElementById('photo').files[0]);
        updateSettings(form,'data');
    })
}

if(passwordDataForm){
    passwordDataForm.addEventListener('submit', async e=>{
        e.preventDefault();
        document.querySelector('.btn--user-password').innerHTML ='Updating...';
        const passwordCurrent =document.getElementById('password-current').value;
        const password =document.getElementById('password').value;
        const passwordConfirm =document.getElementById('password-confirm').value;
        // console.log(passwordConfirm);
        await updateSettings({passwordCurrent,password,passwordConfirm},'password');
        document.querySelector('.btn--user-password').innerHTML ='Save Password';
    })
}
if(bookButton){
    bookButton.addEventListener('click',e=>{
        e.target.textContent = 'Processing...';
        const tourId = e.target.dataset.tourId;
        bookTour(tourId);
    })
}
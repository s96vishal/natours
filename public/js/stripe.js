/* eslint-disable*/
const stripe = Stripe('pk_test_xEb1TfvGuEflsqjxEfys3OKJ00pcH48xLE');
import axios from 'axios';
import {showAlert} from './alerts';

export const bookTour = async tourId=>{
    try{
    // 1)Get the session from the server
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // 2)Create checkout form +charge credit card
    await stripe.redirectToCheckout({
        sessionId:session.data.session.id
    })
    }catch(err){
        showAlert('error',err);
    }
}
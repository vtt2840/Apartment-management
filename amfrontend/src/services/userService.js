import axios from '../setup/axios';

const loginUser = (data) => {
    return axios.post("/login/", data);
}
const logoutUser = () => {
    return axios.post('/logout/');
}

const fetchAllApartments = () => {
    return axios.get('/apartments/');
}

const createNewAccount = (data)=> {
    return axios.post('/addnewaccount/', data);
}

const accountByApartment = (data) => {
    return axios.post('/accounts/by-apartment/', {apartment_code: data});
}

const lockAccount = (accountId) => {
    return axios.post(`/lockaccount/${accountId}/`);
}

const resetpassword = (email) => {
    return axios.post('/resetpassword/', {email: email});
}

const resetconfirm = (uid, token, password) => {
    return axios.post('/password-reset-confirm/', { uid: uid, token: token, new_password: password});
}
export {
    loginUser, logoutUser, fetchAllApartments, createNewAccount, accountByApartment, lockAccount, resetpassword, resetconfirm
}
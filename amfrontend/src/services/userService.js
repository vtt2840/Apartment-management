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
    return axios.get('/accounts/by-apartment/', {params: {apartment_code: data}});
}

const lockAccount = (accountId) => {
    return axios.post(`/lockaccount/${accountId}/`);
}

export {
    loginUser, logoutUser, fetchAllApartments, createNewAccount, accountByApartment, lockAccount
}
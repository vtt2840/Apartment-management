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

export {
    loginUser, logoutUser, fetchAllApartments, createNewAccount
}
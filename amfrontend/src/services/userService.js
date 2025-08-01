import axios from '../setup/axios';

//login, logout
const loginUser = (data) => {
    return axios.post("/login/", data);
}
const logoutUser = () => {
    return axios.post('/logout/');
}

//apartment and account
const fetchAllApartments = (page = 1) => {
    return axios.get(`/apartments/?page=${page}`);
};

const updateApartment = (data) => {
    return axios.put('/updateapartment/', data);
}

const createNewAccount = (data)=> {
    return axios.post('/addnewaccount/', data);
}

const searchApartments = (keyword) => {
  return axios.get(`/search-apartments/?q=${encodeURIComponent(keyword)}/`);
  
};

const accountByApartment = (data) => {
    return axios.post('/accounts/by-apartment/', {apartment_code: data});
}

const addAccountExist = (data) => {
    return axios.put('/addaccountapartment/', data);
}

const checkAccountExists = (data) => {
    return axios.post('/account/checkaccountexists/', data);
}

const lockAccount = (data) => {
    return axios.post(`/lockaccount/`, data);
}

const resetpassword = (email) => {
    return axios.post('/resetpassword/', {email: email});
}

const resetconfirm = (uid, token, password) => {
    return axios.post('/password-reset-confirm/', { uid: uid, token: token, new_password: password});
}

//resident

const fetchAllResidents = (page = 1) => {
    return axios.get(`/residents/?page=${page}`);
}

const createNewResident = (data) => {
    return axios.post('/addnewresident/', data);
}

const deleteResident = (data) => {
    return axios.post('/deleteresident/', data);
}
const updateResident = (data) => {
    return axios.put('/updateresident/', data);
}
const searchResidents = (keyword) => {
  return axios.get(`/search-residents/?q=${encodeURIComponent(keyword)}/`);
  
};

//temporaryregister
const temporaryResidence = (data) => {
    return axios.post('/registertempresidence/', data);
}
const temporaryAbsence = (data) => {
    return axios.post('/registertempabsence/', data);
}
const cancelTemporaryStatus = (data) => {
    return axios.post('/canceltempstatus/', data);
}
const getTemporaryAbsenceDetail = (absenceId) => {
    return axios.get(`/temporary-absence/${absenceId}/`);
}

const getTemporaryResidenceDetail = (absenceId) => {
    return axios.get(`/temporary-residence/${absenceId}/`);
}

//vehicle
const fetchAllVehicles = (page = 1) => {
    return axios.get(`/vehicles/?page=${page}`);
}

export {
    loginUser, logoutUser, fetchAllApartments, createNewAccount, accountByApartment, lockAccount, resetpassword, resetconfirm, checkAccountExists,
    fetchAllResidents, addAccountExist, createNewResident, deleteResident, temporaryResidence, temporaryAbsence, cancelTemporaryStatus, updateResident,
    updateApartment, searchResidents, searchApartments, getTemporaryAbsenceDetail, getTemporaryResidenceDetail, fetchAllVehicles
}
import axios from '../setup/axios';

//login, logout
const loginUser = (data) => {
    return axios.post("/login/", data);
}
const logoutUser = () => {
    return axios.post('/logout/');
}

//apartment and account
const fetchAllApartments = ({apartmentCode, page}) => {
    return axios.get(`/apartments/?apartmentCode=${apartmentCode}&page=${page}`);
};

const updateApartment = ({apartmentCode, data}) => {
    return axios.put(`/apartments/updateinfo/${apartmentCode}`, data);
}

const createNewAccount = (data) => {
    return axios.post('/apartments/addnewaccount/', data);
}

const searchApartments = (keyword) => {
  return axios.get(`/apartments/search/?q=${encodeURIComponent(keyword)}/`);
  
};

const accountByApartment = (data) => {
    return axios.post('/accounts/accounts-by-apartment/', {apartment_code: data});
}

const addAccountExist = (data) => {
    return axios.put('/apartments/addaccount/', data);
}

const checkAccountExists = (data) => {
    return axios.post('/accounts/check-account-exists/', data);
}

const lockAccount = (data) => {
    return axios.post(`/apartments/lockaccount/`, data);
}

const resetpassword = (email) => {
    return axios.post('/accounts/resetpassword/', {email: email});
}

const resetconfirm = (uid, token, password) => {
    return axios.post('/accounts/password-reset-confirm/', { uid: uid, token: token, new_password: password});
}

//resident

const fetchAllResidents = ({apartmentCode, showLeftResidents, page}) => {
    return axios.get(`/residents/?apartmentCode=${apartmentCode}&showLeftResidents=${showLeftResidents}&page=${page}`);
}

const createNewResident = (data) => {
    return axios.post('residents/addnewresident/', data);
}

const deleteResident = (residentId) => {
    return axios.delete(`/residents/delete/${residentId}/`);
}
const updateResident = ({residentId, data}) => {
    return axios.put(`/residents/update/${residentId}/`, data);
}
const searchResidents = (keyword) => {
  return axios.get(`/residents/search/?q=${encodeURIComponent(keyword)}/`);
  
};

//temporaryregister
const temporaryResidence = (data) => {
    return axios.post('/temporary-residence/register/', data);
}

const temporaryAbsence = (data) => {
    return axios.post('/temporary-absence/register/', data);
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
const fetchAllVehicles = ({apartmentCode, showDeletedVehicles, page}) => {
    return axios.get(`/vehicles/?apartmentCode=${apartmentCode}&showDeletedVehicles=${showDeletedVehicles}&page=${page}`);
}

export {
    loginUser, logoutUser, fetchAllApartments, createNewAccount, accountByApartment, lockAccount, resetpassword, resetconfirm, checkAccountExists,
    fetchAllResidents, addAccountExist, createNewResident, deleteResident, temporaryResidence, temporaryAbsence, cancelTemporaryStatus, updateResident,
    updateApartment, searchResidents, searchApartments, getTemporaryAbsenceDetail, getTemporaryResidenceDetail, fetchAllVehicles
}
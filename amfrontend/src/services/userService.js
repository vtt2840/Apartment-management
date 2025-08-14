import axios from '../setup/axios';

//login, logout
const loginUser = (data) => {
    return axios.post("/login/", data);
}
const logoutUser = () => {
    return axios.post('/logout/');
}

//apartment and account
const fetchAllApartments = ({apartmentCode, page, floor, status}) => {
    return axios.get(`/apartments/?apartmentCode=${apartmentCode}&page=${page}&floor=${floor}&status=${status}`);
};

const updateApartment = ({apartmentCode, data}) => {
    return axios.put(`/apartments/updateinfo/${apartmentCode}`, data);
}

const createNewAccount = (data) => {
    return axios.post('/apartments/addnewaccount/', data);
}

const searchApartments = ({keyword, page}) => {
  return axios.get(`/apartments/search/?q=${encodeURIComponent(keyword)}&page=${page}`);
  
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

const changePassword = (data) => {
    return axios.post('/change-password/', data);
}
const updateAccountAdmin = (data) => {
    return axios.put('/update-account-admin/', data);
}
//resident
const fetchAllResidents = ({apartmentCode, status, page, gender, showDecreaseApartmentCode, dateOfBirth, orderBirth}) => {
    return axios.get(`/residents/?apartmentCode=${apartmentCode}&page=${page}&status=${status}&gender=${gender}&showDecreaseApartmentCode=${showDecreaseApartmentCode}&dateOfBirth=${dateOfBirth}&orderBirth=${orderBirth}`);
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
const searchResidents = ({keyword, page}) => {
    return axios.get(`/residents/search/?q=${encodeURIComponent(keyword)}&page=${page}`);
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
const fetchAllVehicles = ({apartmentCode, status, page, showDecreaseApartmentCode, showType, dateRegister}) => {
    return axios.get(`/vehicles/?apartmentCode=${apartmentCode}&status=${status}&page=${page}&showDecreaseApartmentCode=${showDecreaseApartmentCode}&showType=${showType}&dateRegister=${dateRegister}`);
}
const createNewVehicle = (data) => {
    return axios.post('/vehicles/', data);
}
const updateVehicle = ({vehicleId, data}) => {
    return axios.put(`vehicles/${vehicleId}/`, data);
}
const deleteVehicle = (vehicleId) => {
    return axios.delete(`/vehicles/${vehicleId}/`);
}
const searchVehicles = ({keyword, page}) => {
    return axios.get(`/vehicles/search/?q=${keyword}&page=${page}`);
}

//fee
const fetchNewFeeCollection = ({page, apartment_code, month, year, isRequired, status, dueDate, feeName}) => {
    return axios.get(`/apartmentfee/?page=${page}&apartment_code=${apartment_code}&month=${month}&year=${year}&isRequired=${isRequired}&status=${status}&dueDate=${dueDate}&feeName=${feeName}`);
}

const updateApartmentFee = ({apartmentFeeId, data}) => {
    return axios.patch(`/apartmentfee/${apartmentFeeId}/`, data);
}

const checkFeeNameExists = (feeName) => {
    return axios.post('/feetype/check-feename-exists/', feeName);
}

const createNewFeeType = (data) => {
    return axios.post('/feetype/', data);
}

const fetchAllFeeTypes = ({month, year, statistic}) => {
    return axios.get(`/feetype/?month=${month}&year=${year}&statistic=${statistic}`);
}

const updateFeeType = ({typeId, data}) => {
    return axios.put(`/feetype/${typeId}/`, data);
}
const deleteFeeType = (typeId) => {
    return axios.delete(`/feetype/${typeId}/`);
}
const createNewFeeCollection = (data) => {
    return axios.post('/feecollection/create/', data);
}

const searchFee = ({keyword, page}) => {
    return axios.get(`/apartmentfee/search/?q=${keyword}&page=${page}`);
}

//payment
const fetchPaymentTransaction = (id) => {
    return axios.get(`/payment/?apartmentFee=${id}`);
}
export {
    loginUser, logoutUser, fetchAllApartments, createNewAccount, accountByApartment, lockAccount, resetpassword, resetconfirm, checkAccountExists,
    fetchAllResidents, addAccountExist, createNewResident, deleteResident, temporaryResidence, temporaryAbsence, cancelTemporaryStatus, updateResident,
    updateApartment, searchResidents, searchApartments, getTemporaryAbsenceDetail, getTemporaryResidenceDetail, fetchAllVehicles, createNewVehicle,
    updateVehicle, deleteVehicle, searchVehicles, changePassword, updateAccountAdmin, fetchNewFeeCollection, updateApartmentFee, checkFeeNameExists,
    createNewFeeType, fetchAllFeeTypes, updateFeeType, deleteFeeType, createNewFeeCollection, searchFee, fetchPaymentTransaction
}
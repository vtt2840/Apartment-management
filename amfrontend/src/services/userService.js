import axios from '../setup/axios';

//login, logout
const loginUser = (data) => {
    return axios.post("/login/", data);
}
const logoutUser = () => {
    return axios.post('/logout/');
}

//apartment and account
const fetchAllApartments = ({apartmentCode, page, floor, status, query}) => {
    return axios.get(`/apartments/?apartmentCode=${apartmentCode}&page=${page}&floor=${floor}&status=${status}&query=${query}`);
};

const updateApartment = ({apartmentCode, data}) => {
    return axios.put(`/apartments/updateinfo/${apartmentCode}/`, data);
}

const createNewAccount = (data) => {
    return axios.post('/apartments/addnewaccount/', data);
}

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
const fetchAllResidents = ({apartmentCode, status, page, gender, showDecreaseApartmentCode, dateOfBirth, orderBirth, query}) => {
    return axios.get(`/residents/?apartmentCode=${apartmentCode}&page=${page}&status=${status}&gender=${gender}&showDecreaseApartmentCode=${showDecreaseApartmentCode}&dateOfBirth=${dateOfBirth}&orderBirth=${orderBirth}&query=${query}`);
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
const fetchAllVehicles = ({apartmentCode, status, page, showDecreaseApartmentCode, showType, dateRegister, query}) => {
    return axios.get(`/vehicles/?apartmentCode=${apartmentCode}&status=${status}&page=${page}&showDecreaseApartmentCode=${showDecreaseApartmentCode}&showType=${showType}&dateRegister=${dateRegister}&query=${query}`);
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

//fee
const fetchNewFeeCollection = ({page, apartment_code, month, year, isRequired, status, dueDate, feeName, query}) => {
    return axios.get(`/apartmentfee/?page=${page}&apartment_code=${apartment_code}&month=${month}&year=${year}&isRequired=${isRequired}&status=${status}&dueDate=${dueDate}&feeName=${feeName}&query=${query}`);
}

const updateApartmentFee = ({apartmentFeeId, data}) => {
    return axios.patch(`/apartmentfee/${apartmentFeeId}/`, data);
}

const checkFeeNameExists = (feeName) => {
    return axios.post('/feetype/check-feename-exists/', {feeName});
}

const createNewFeeType = (data) => {
    return axios.post('/feetype/', data);
}

const fetchAllFeeTypes = ({month, year, statistic, page}) => {
    return axios.get(`/feetype/?page=${page}&month=${month}&year=${year}&statistic=${statistic}`);
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

const getLatestDate = () => {
    return axios.get('/get-latest-date/');
}

const getChart = ({month, year, feeName}) => {
    return axios.get(`/get-chartfee/?month=${month}&year=${year}&feeName=${feeName}`);
}

const getBarFee = (year) => {
    return axios.get(`/get-bar-fee/?year=${year}`);
}
//payment
const fetchPaymentTransaction = (id) => {
    return axios.get(`/payment/?apartmentFee=${id}`);
}
export {
    loginUser, logoutUser, fetchAllApartments, createNewAccount, accountByApartment, lockAccount, resetpassword, resetconfirm, checkAccountExists,
    fetchAllResidents, addAccountExist, createNewResident, deleteResident, temporaryResidence, temporaryAbsence, cancelTemporaryStatus, updateResident,
    updateApartment, getTemporaryAbsenceDetail, getTemporaryResidenceDetail, fetchAllVehicles, createNewVehicle,
    updateVehicle, deleteVehicle, changePassword, updateAccountAdmin, fetchNewFeeCollection, updateApartmentFee, checkFeeNameExists,
    createNewFeeType, fetchAllFeeTypes, updateFeeType, deleteFeeType, createNewFeeCollection, fetchPaymentTransaction, getLatestDate,
    getChart, getBarFee
}
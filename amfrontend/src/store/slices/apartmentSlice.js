import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllApartments, createNewAccount , lockAccount, addAccountExist, updateApartment} from '../../services/userService';

export const getAllApartments = createAsyncThunk(
    'apartment/getAllApartments',
    async (data, {rejectWithValue}) => {
        try{
            const res = await fetchAllApartments(data);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const editApartment = createAsyncThunk(
    'apartment/editApartments',
    async (data, {rejectWithValue}) => {
        try{
            const res = await updateApartment(data);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const addNewAccount = createAsyncThunk(
    'apartment/addNewAccount',
    async (data, {rejectWithValue}) => {
        try{
            const res = await createNewAccount(data);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const assignAccount = createAsyncThunk(
    'apartment/assignAccount',
    async(data, {rejectWithValue}) => {
        try{
            const res = await addAccountExist(data);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
)

export const deactiveAccount = createAsyncThunk(
    'apartment/deactiveAccount',
    async(data, {rejectWithValue}) => {
        try {
            const res = await lockAccount(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
)

const apartmentSlice = createSlice({
    name: 'apartment',
    initialState: {
        apartmentList: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get apartment list
            .addCase(getAllApartments.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(getAllApartments.fulfilled, (state, action) => {
              state.loading = false;
              state.apartmentList = action.payload.results;
              state.totalCount = action.payload.count;
            })
            .addCase(getAllApartments.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })

            // edit apartment 
            .addCase(editApartment.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(editApartment.fulfilled, (state, action) => {
              state.loading = false;
            })
            .addCase(editApartment.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })

            // add new account
            .addCase(addNewAccount.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(addNewAccount.fulfilled, (state, action) => {
              state.loading = false;
            })
            .addCase(addNewAccount.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })

            // assign account
            .addCase(assignAccount.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(assignAccount.fulfilled, (state, action) => {
              state.loading = false;
            })
            .addCase(assignAccount.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })

            //lock account
            .addCase(deactiveAccount.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(deactiveAccount.fulfilled, (state, action) => {
              state.loading = false;
            })
            .addCase(deactiveAccount.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            });
    },
});

export default apartmentSlice.reducer;

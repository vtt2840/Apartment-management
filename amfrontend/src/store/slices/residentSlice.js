import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createNewResident, fetchAllResidents, deleteResident, temporaryResidence, temporaryAbsence, cancelTemporaryStatus, updateResident } from '../../services/userService';

export const getAllResidents = createAsyncThunk(
    'resident/getAllResidents',
    async (data, {rejectWithValue}) => {
        try{
            const res = await fetchAllResidents(data);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const addNewResident = createAsyncThunk(
    'resident/addNewResident',
    async (data, {rejectWithValue}) => {
        try{
            const res = await createNewResident(data);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteOneResident = createAsyncThunk(
    'resident/deleteResident',
    async(residentId, {rejectWithValue}) => {
        try{
            const res = await deleteResident(residentId);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
)

export const editResident = createAsyncThunk(
    'resident/editResident',
    async({ residentId, data }, {rejectWithValue}) => {
        try {
            const res = await updateResident({ residentId, data });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
)

export const registerTemporaryResidence = createAsyncThunk(
    'resident/registerTemporaryResidence',
    async(data, {rejectWithValue}) => {
        try{
            const res = await temporaryResidence(data);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
)
export const registerTemporaryAbsence = createAsyncThunk(
    'resident/registerTemporaryAbsence',
    async(data, {rejectWithValue}) => {
        try{
            const res = await temporaryAbsence(data);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
)

export const cancelTempStatus = createAsyncThunk(
    'resident/cancelTempStatus',
    async(data, {rejectWithValue}) => {
        try{
            const res = await cancelTemporaryStatus(data);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
)

const residentSlice = createSlice({
    name: 'resident',
    initialState: {
      residentList: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        // get resident list
        .addCase(getAllResidents.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAllResidents.fulfilled, (state, action) => {
          state.loading = false;
          state.residentList = action.payload.results;
          state.totalCount = action.payload.count;
        })
        .addCase(getAllResidents.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // add new resident
        .addCase(addNewResident.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addNewResident.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(addNewResident.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        //delete resident
        .addCase(deleteOneResident.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteOneResident.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(deleteOneResident.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        //edit resident
        .addCase(editResident.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(editResident.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(editResident.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        //register temp residence
        .addCase(registerTemporaryResidence.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(registerTemporaryResidence.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(registerTemporaryResidence.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        //register temp absence
        .addCase(registerTemporaryAbsence.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(registerTemporaryAbsence.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(registerTemporaryAbsence.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        //cancel temporary status
        .addCase(cancelTempStatus.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(cancelTempStatus.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(cancelTempStatus.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
});

export default residentSlice.reducer;

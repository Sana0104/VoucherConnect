import { createSlice } from "@reduxjs/toolkit";
 
const initialUser = {
  userId: 0,
  username: "",
  userEmail: "",
  role: "",
  mentorEmail: "",
 
};
 
export const userSlice = createSlice({
  name: "users",
  initialState: { value: initialUser },
  reducers: {
    fetchUser: (state, action) => {
      state.value = action.payload;
    },
    logoutUser: (state) => {
      state.value = initialUser;
    },
  },
});
 
export const { fetchUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
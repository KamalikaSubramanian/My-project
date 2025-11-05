import { create } from 'zustand';

export const useUserStore = create((set) => ({
    user: null,
    token: null,
    error: null,

    registerUser: async (newUser) => {
        try {
            if (!newUser.username || !newUser.password || !newUser.role) {
                return { success: false, message: "Please provide all the fields" };
            }
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser),
            });
            const data = await res.json();
            if (!data.success){
                return { success: false, message: data.message };
            }      
            set({token:data.token})
            localStorage.setItem("role", data.role);  
            localStorage.setItem("token",data.token);   
            return { success: true, message: "User registered successfully",role:data.role };
        }
        catch (err) {
            set({ error: err.message });
            return { success: false, mesage: err.message }
        }
    },
    loginUser: async (Credentials) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Credentials)
            });
            const data =await res.json();
            if (!data.success){
                return {success:false,message:data.message};
            }
                
            set({ user: data.user, token: data.token, error: null });
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("userId", data.user._id);
            
            return { success: true, message: "Logged successfully",role :data.user.role,userId:data.user._id}
        }
        catch (err) {
            set({ error: err.message });
            return ({ success: false, message: err.message })
        }
    },
    logOutUser:async()=>{
        localStorage.removeItem("token")
        set({user:null,token:null})
    }

}))
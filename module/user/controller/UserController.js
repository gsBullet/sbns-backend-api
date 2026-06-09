module.exports={
    registerUser: async (req, res) => {
        res.status(201).json({ success: true, message: "User registered successfully" });
    },
    loginUser: async (req, res) => {
        res.status(200).json({ success: true, message: "User logged in successfully" });
    },
    
    updateMyProfile: async (req, res) => {
        res.status(200).json({ success: true, message: "Profile updated successfully" });
    },
    
};

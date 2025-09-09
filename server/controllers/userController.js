import User from "../models/User.js";

//Signup a new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    //Basic validation
    try {
        if(!fullName || !email || !password || !bio){
            return res.status(400).json({ success:false,message: "Please enter all required fields" });
        }
        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ success:false,message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        const token = generateToken(newUser);
        await newUser.save();

        res.status(201).json({ success:true,message: "User created successfully", token , userData: newUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success:false,message: error.message  });
    }
    
}

//Login a user
export const login = async (req, res) => {
   try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken(user);
        res.status(200).json({ success: true, message: "Login successful", token, userData: user });
   } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
   }
}

//Controller to update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const { profilePic, fullName, bio } = req.body;
        let updatedUser;
        if (!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, { new: true });
        } else{
            const uploadedImage = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadedImage.secure_url, bio, fullName }, { new: true });
        }

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
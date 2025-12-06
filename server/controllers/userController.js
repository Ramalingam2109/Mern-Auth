import userModel from '../models/userModel.js';

export const getUserData = async (req, res) => {
  try {
    // Get userId from auth middleware (not from req.body)
    const { userId } = req;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    // Return user data matching what frontend expects
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
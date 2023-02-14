import userService from "../services/userService";

const handleLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            errMessage: "Missing inputs parameter",
        });
    }

    const userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
};

const handleGetAllUsers = async (req, res) => {
    const id = req.body.id; // All, Single

    // Không truyền id
    if (!id) {
        return res.status(500).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            users: [],
        });
    }

    const users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        users: users ? users : [],
    });
};

module.exports = {
    handleLogin,
    handleGetAllUsers,
};

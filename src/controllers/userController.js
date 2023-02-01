import userService from "../services/userService";

const handleLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await userService.handleUserLogin(email, password);

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing inputs parameter",
        });
    }

    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
};

module.exports = {
    handleLogin,
};

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
    const id = req.query.id; // All, Single

    console.log(req.query);

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

const handleCreateNewUser = async (req, res) => {
    const data = req.body;

    const response = await userService.createNewUser(data);

    return res.status(200).json(response);
};

const handleEditUser = async (req, res) => {
    const data = req.body;
    const userId = req.body.userId;

    if (!userId) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing required parameters !",
        });
    }

    const response = await userService.editUser(data);

    return res.status(200).json(response);
};

const handleDeleteUser = async (req, res) => {
    const userId = req.body.userId;

    if (!userId) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing required parameters !",
        });
    }

    const response = await userService.deleteUser(userId);

    return res.status(200).json(response);
};

module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
};

import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            const hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};

const handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = {};

            const isExist = await checkUserEmail(email);

            if (isExist) {
                // User already exist
                const user = await db.User.findOne({
                    attributes: ["email", "roleId", "password"],
                    where: {
                        email: email,
                    },
                    raw: true,
                });

                if (user) {
                    // Compare password
                    const check = bcrypt.compareSync(password, user.password);

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = null;

                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 2;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 3;
                    userData.errMessage = `User not found`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's email don't exist in our system`;
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    email: userEmail,
                },
            });

            if (user) resolve(true);
            else resolve(false);
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUsers = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = null;

            // Lấy toàn bộ danh sách người dùng
            if (id === "ALL") {
                users = await db.User.findAll({
                    raw: true,
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }

            // Lấy một người dùng
            if (id && id !== "ALL") {
                users = await db.User.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }

            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

const createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkEmailExist = await checkUserEmail(data.email);

            if (checkEmailExist) {
                resolve({
                    errCode: 1,
                    message:
                        "Your email is already in used, please try another email !",
                });
            }

            const hashPasswordFromBcrypt = await hashUserPassword(
                data.password
            );

            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === "1" ? true : false,
                // image: DataTypes.STRING,
                roleId: data.roleId,
                // positionId: DataTypes.STRING,
            });

            resolve({
                errCode: 0,
                message: "OK",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const editUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    id: data.userId,
                },
            });

            // Kiểm tra có tồn tại người dùng hay không
            if (!user) {
                resolve({
                    errCode: 1,
                    message: `User isn't exist`,
                });
            }

            // Cập nhật thông tin người dùng khi người dùng tồn tại
            await db.User.update(
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                },
                {
                    where: {
                        id: data.userId,
                    },
                }
            );

            resolve({
                errCode: 0,
                message: "Update user info success",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    id: userId,
                },
            });

            if (!user) {
                resolve({
                    errCode: 1,
                    message: `The user isn't exist`,
                });
            }

            await db.User.destroy({
                where: {
                    id: userId,
                },
            });

            resolve({
                errCode: 0,
                message: "The user is deleted",
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    editUser,
    deleteUser,
};

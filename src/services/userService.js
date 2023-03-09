import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) =>
    new Promise((resolve, reject) => {
        try {
            const hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });

const handleUserLogin = (email, password) =>
    new Promise(async (resolve, reject) => {
        try {
            const userData = {};

            const isExist = await checkUserEmail(email);

            if (isExist) {
                // User already exist
                const user = await db.User.findOne({
                    attributes: [
                        "email",
                        "roleId",
                        "password",
                        "firstName",
                        "lastName",
                    ],
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

const checkUserEmail = (userEmail) =>
    new Promise(async (resolve, reject) => {
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

const getAllUsers = async (id) =>
    new Promise(async (resolve, reject) => {
        try {
            let users = null;

            // Lấy toàn bộ danh sách người dùng
            if (id === "ALL") {
                users = await db.User.findAll({
                    order: [["id", "DESC"]],
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

const createNewUser = async (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const checkEmailExist = await checkUserEmail(data.email);

            if (checkEmailExist) {
                resolve({
                    errCode: 1,
                    message:
                        "Your email is already in used, please try another email !",
                });
            } else {
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
                    gender: data.gender,
                    image: data.previewImage,
                    roleId: data.role,
                    positionId: data.position,
                });

                resolve({
                    errCode: 0,
                    message: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });

const editUser = async (data) =>
    new Promise(async (resolve, reject) => {
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
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    positionId: data.position,
                    roleId: data.role,
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

const deleteUser = (userId) =>
    new Promise(async (resolve, reject) => {
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
            } else {
                await db.User.destroy({
                    where: {
                        id: userId,
                    },
                });

                resolve({
                    errCode: 0,
                    message: "The user is deleted",
                });
            }
        } catch (e) {
            reject(e);
        }
    });

const getAllCodes = (type) =>
    new Promise(async (resolve, reject) => {
        try {
            if (!type) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                const data = await db.Allcode.findAll({
                    where: {
                        type: type,
                    },
                });

                resolve({
                    errCode: 0,
                    errMessage: null,
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });

module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    editUser,
    deleteUser,
    getAllCodes,
};

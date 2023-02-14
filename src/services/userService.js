import bcrypt from "bcryptjs";
import db from "../models/index";

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

const compareUserPassword = () => {
    return new Promise((resolve, reject) => {
        try {
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

module.exports = {
    handleUserLogin,
    getAllUsers,
};

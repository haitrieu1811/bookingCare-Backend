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
                    const check = await bcrypt.compareSync(
                        password,
                        user.password
                    );

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";

                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 0;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
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

module.exports = {
    handleUserLogin,
};

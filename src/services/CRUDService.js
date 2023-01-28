import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

const createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPasswordFromBcrypt = await hashUserPassword(
                data.password
            );

            console.log(">>> Data from service: ", data);
            console.log(">>> Hash password: ", hashPasswordFromBcrypt);

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

            const allUsers = db.User.findAll();
            resolve(allUsers);
        } catch (e) {
            reject(e);
        }
    });
};

const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({ raw: true });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

const getUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findByPk(userId, { raw: true });

            if (user) resolve(user);
            else resolve({});
        } catch (e) {
            reject(e);
        }
    });
};

const UpdateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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

            let allUsers = await db.User.findAll();
            resolve(allUsers);
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.destroy({
                where: {
                    id: userId,
                },
            });

            const allUsers = db.User.findAll();
            resolve(allUsers);
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createNewUser,
    getAllUsers,
    getUser,
    UpdateUser,
    deleteUser,
};

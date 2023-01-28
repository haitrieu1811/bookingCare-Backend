import db from "../models/index";
import CRUDService from "../services/CRUDService";

const getHomePage = async (req, res) => {
    try {
        const data = await db.User.findAll();
        return res.render("homepage.ejs", { data: JSON.stringify(data) });
    } catch (e) {
        console.log(e);
    }
};

const getAboutPage = (req, res) => {
    return res.render("test/about.ejs");
};

const getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

const postCRUD = async (req, res) => {
    const users = await CRUDService.createNewUser(req.body);
    return res.render("readCrud.ejs", { users });
};

const displayGetCRUD = async (req, res) => {
    const users = await CRUDService.getAllUsers();
    return res.render("readCrud.ejs", { users });
};

const updateCRUD = async (req, res) => {
    const userId = req.query.userId;

    if (userId) {
        const user = await CRUDService.getUser(userId);

        return res.render("updateCrud.ejs", { user });
    } else {
        return res.send("Not found user !!!");
    }
};

const postUpdateCRUD = async (req, res) => {
    const users = await CRUDService.UpdateUser(req.body);
    return res.render("readCrud.ejs", { users });
};

const deleteCRUD = async (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        const users = await CRUDService.deleteUser(userId);
        return res.render("readCrud.ejs", { users });
    }
};

module.exports = {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    updateCRUD,
    postUpdateCRUD,
    deleteCRUD,
};

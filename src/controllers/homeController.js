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
    const message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("Post CRUD from server");
};

module.exports = {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCRUD,
};

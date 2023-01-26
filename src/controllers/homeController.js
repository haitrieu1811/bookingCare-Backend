import db from "../models/index";

let getHomePage = async (req, res) => {
    try {
        const data = await db.User.findAll();
        return res.render("homepage.ejs", { data: JSON.stringify(data) });
    } catch (e) {
        console.log(e);
    }
};

let getAboutPage = (req, res) => {
    return res.render("test/about.ejs");
};

module.exports = {
    getHomePage,
    getAboutPage,
};

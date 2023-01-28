import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);
    router.get("/read-crud", homeController.displayGetCRUD);
    router.get("/update-crud", homeController.updateCRUD);
    router.get("/delete-crud", homeController.deleteCRUD);

    router.post("/post-crud", homeController.postCRUD);
    router.post("/update-crud", homeController.postUpdateCRUD);

    router.get("/hoidanit", (req, res) => {
        return res.send("Hello world with HoiDanIT");
    });

    return app.use("/", router);
};

module.exports = initWebRoutes;

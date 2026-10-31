const express = require("express");
const { authenticate } = require("../middleware/keycloak-auth");
const router = express.Router();

const controller = require("../controllers/villageController");
const upload = require("../middleware/multer");


router.post("/keyValue", controller.getKeyValue);
router.get("/analytics", controller.analytics);
router.post("/villageapps", controller.createVillageApp);
router.post("/villageapps/list", controller.getVillageApps);
router.get("/villageapps/getapp", controller.getApp);
router.post("/villageapps/update", controller.updateVillageApp);
router.post("/villageapps/delete", controller.deleteVillageApp);

router.post("/carousel", upload.single("carousel_image"), controller.createCarousel);//array of multiple object
router.post("/carousel/list", controller.getCarousel);
router.post("/carousel/getVillageCarousel", controller.getVillageCarousel);
router.post("/carousel/getVillageMobCarousel", controller.getVillageMobCarousel);
router.post("/carousel/update", upload.single("carousel_image"), controller.updateCarousel);
router.post("/carousel/delete", controller.deleteCarousel);


router.post("/organisations", controller.createOrganisation);
router.post("/organisations/list", controller.getOrganisations);
router.post("/organisations/update", controller.updateOrganisation);
router.post("/organisations/delete", controller.deleteOrganisation);
router.get("/organisations/getEmergencyOrganisation", controller.getEmergencyOrganisation);
router.post("/organisations/getOrganisationByCategory", controller.getOrganisationByCategory);
router.get("/organisations/getCategories", controller.getCategories);



router.post("/advertisements", upload.single("advertisement_image"), controller.createAdvertisement);
router.post("/advertisements/list", controller.getAdvertisements);
router.post("/advertisements/update", upload.single("advertisement_image"), controller.updateAdvertisement);
router.post("/advertisements/delete", controller.deleteAdvertisement);
router.post("/advertisements/getMyAdvertisement", controller.getMyAdvertisement);
router.get("/advertisements/getAdvertisementByOrganisation/:organisation_id", controller.getAdvertisementByOrganisation);
router.post("/advertisements/getHomeAdvertisement", controller.getHomeAdvertisement);

router.post("/users", controller.createUser);
router.post("/users/list", authenticate, controller.getUsers);
router.post("/users/alllist", controller.getAllUsers);
router.post("/users/delete", controller.deleteUser);
router.post("/users/update", controller.updateUser);
router.get("/users/getImportantPersons", controller.getImportantPersons);

router.post("/market/add", upload.array("product_images", 5), controller.addProduct);
router.post("/market/list", controller.listProducts);
router.post("/market/update", upload.array("product_images", 5), controller.updateProduct);
router.post("/market/delete", controller.deleteProduct);

router.post("/market/get_product_images", controller.get_product_images);

module.exports = router;
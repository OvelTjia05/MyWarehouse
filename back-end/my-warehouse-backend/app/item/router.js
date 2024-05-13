const express = require("express");
const router = express.Router();
const itemController = require("./controller");
const { decodeToken } = require("../../middleware/authentication");

router.post("/:id_user", decodeToken, itemController.createItemByIdUser);
router.get("/:id_user", decodeToken, itemController.getItemByIdUser);
router.put("/:id_item", decodeToken, itemController.updateItemByIdItem);
router.delete("/", decodeToken, itemController.deleteItemByIdItem);

module.exports = router;

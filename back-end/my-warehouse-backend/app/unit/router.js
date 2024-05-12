const express = require('express');
const router = express.Router();
const unitController = require('./controller');
const { decodeToken } = require('../../middleware/authentication');

router.get('/:id_user', decodeToken, unitController.getUnitByIdUser);
router.post('/:id_user', decodeToken, unitController.createUnitByIdUser);
router.delete('/:id_unit', decodeToken, unitController.deleteUnitByIdUnit);

module.exports = router;

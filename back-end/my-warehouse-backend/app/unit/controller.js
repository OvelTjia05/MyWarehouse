const prisma = require('../../database');
const NotFoundError = require('../../exceptions/NotFoundError');
const { unitSchema } = require('./validator');

const getUnitByIdUser = async (req, res) => {
  try {
    // ambil id_user dari req params
    const { id_user } = req.params;

    // validasi apakah ada user
    const isUser = await prisma.user.findFirst({
      where: {
        id: id_user,
      },
    });
    if (!isUser) {
      throw new NotFoundError('User is not found');
    }

    // get unit berdasarkan id user
    const units = await prisma.unit.findMany({
      where: {
        id_user,
      },
    });

    // kembalikan respon kepada user
    return res.json({
      status: 'success',
      message: `Berhasil dapat unit untuk id user ${isUser.id}`,
      data: {
        units,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: 'fail',
        message: 'Error pada server',
      });
    }
  }
};

const createUnitByIdUser = async (req, res) => {
  try {
    // validasi req.body
    const validationResult = unitSchema.validate(req.body);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    // ambil id_user dari req.params
    const { id_user } = req.params;

    // validasi apakah user benar2 ada
    const isUser = await prisma.user.findFirst({
      where: {
        id: id_user,
      },
    });
    if (!isUser) {
      throw new NotFoundError('User is not found');
    }

    // insert buku ke database
    const unit = await prisma.unit.create({
      data: {
        id_user,
        name: req.body.name,
      },
    });

    // kembalikan respon kepada user
    return res.status(201).json({
      status: 'success',
      message: `${unit.name} added to database successfuly`,
      data: {
        unit,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.log(error);
      return res.status(500).json({
        status: 'fail',
        message: 'Error pada server',
      });
    }
  }
};

const deleteUnitByIdUnit = async (req, res) => {
  try {
    // ambil id unit dari req.params
    const { id_unit } = req.params;

    // cek apakah id_unit benar-benar ada
    const isUnit = await prisma.unit.findFirst({
      where: {
        id: id_unit,
      },
    });
    if (!isUnit) {
      throw new NotFoundError('Unit Not Found');
    }

    // hapus unit pada database
    await prisma.unit.delete({
      where: {
        id: id_unit,
      },
    });

    // kembalikan response kepada penjaga bahwa buku sudah dihapus
    return res.json({
      status: 'success',
      message: `${isUnit.name} has been deleted successfuly`,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.log(error);
      return res.status(500).json({
        status: 'fail',
        message: 'Error pada server',
      });
    }
  }
};

module.exports = {
  getUnitByIdUser,
  createUnitByIdUser,
  deleteUnitByIdUnit,
};

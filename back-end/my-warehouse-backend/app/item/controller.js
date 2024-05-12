const { url } = require("inspector");
const prisma = require("../../database");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { itemSchema, updateItemSchema } = require("./validator");
const fs = require("fs");
const path = require("path");

const createItemByIdUser = async (req, res) => {
  try {
    // validasi jika ada error dari multer
    if (req.fileValidationError) {
      throw new InvariantError(req.fileValidationError);
    }

    // validasi req.body
    const validationResult = itemSchema.validate(req.body);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    // ambil id_user dari req.params
    const { id_user } = req.params;

    // ambil id_unit dari req body
    const { id_unit } = req.body;

    //validasi apakah id_unit ada di tabel unit
    const isUnit = await prisma.unit.findFirst({
      where: {
        id: id_unit,
      },
    });
    if (!isUnit) {
      throw new NotFoundError("unit not found");
    }

    // validasi apakah user benar2 ada
    const isUser = await prisma.user.findFirst({
      where: {
        id: id_user,
      },
    });
    if (!isUser) {
      throw new NotFoundError("User is not found");
    }

    // console.log('ini req file loh: ', req.file);
    let url;
    if (req.file) {
      const file = req.file;

      // simpan gambaer ke folder
      const imageData = req.file.buffer;

      // Menentukan folder tempat untuk menyimpan gambar
      const folderPath = path.join(__dirname, "..", "..", "public", "images");

      // Membuat nama file untuk gambar
      const arrayNewFileName = file.originalname.split(".");
      const fileName =
        arrayNewFileName[0] + "-" + Date.now() + "." + arrayNewFileName[1];

      fs.writeFileSync(path.join(folderPath, fileName), imageData);

      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    }

    // insert item ke database
    const item = await prisma.item.create({
      data: {
        id_user: id_user,
        id_unit,
        unit: isUnit.name,
        name: req.body.name,
        qty: parseFloat(req.body.qty),
        description: req.body.description,
        location: req.body.location,
        picture: url ? url : null,
      },
    });

    // kembalikan respon kepada user
    return res.status(201).json({
      status: "success",
      message: `${item.name} added to database successfuly`,
      data: {
        item,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: "fail",
        message: error.message,
      });
    } else {
      console.log(error);
      return res.status(500).json({
        status: "fail",
        message: "Error pada server",
      });
    }
  }
};

const getItemByIdUser = async (req, res) => {
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
      throw new NotFoundError("User is not found");
    }

    // get item berdasarkan id user
    const itemsRaw = await prisma.item.findMany({
      where: {
        id_user,
      },
      include: {
        item_unit: true,
      },
    });

    const items = itemsRaw.map((item) => {
      return {
        id: item.id,
        name: item.name,
        qty: item.qty,
        description: item.description,
        location: item.location,
        picture: item.picture,
        unit: item.unit,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });

    // kembalikan respon kepada user
    return res.json({
      status: "success",
      message: `Berhasil dapat unit untuk id user ${isUser.id}`,
      data: {
        items,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: "fail",
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Error pada server",
      });
    }
  }
};

const updateItemByIdItem = async (req, res) => {
  try {
    console.log("masuk sini");
    // ambil id_item dari req.params
    const { id_item } = req.params;

    // cek apakah item ada
    const isItem = await prisma.item.findFirst({
      where: {
        id: id_item,
      },
    });
    if (!isItem) {
      throw new NotFoundError("item not found");
    }

    // validasi req.body
    const validationResult = updateItemSchema.validate(req.body);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    // validasi jika ada id unit
    let unit;
    if (req.body.id_unit) {
      const isUnit = await prisma.unit.findFirst({
        where: {
          id: req.body.id_unit,
        },
      });
      if (!isUnit) {
        throw new NotFoundError("unit tidak ditemukan");
      }
      unit = isUnit.name;
    }

    // jika ada gambar
    let url;
    console.log(req.file);
    if (req.file) {
      const file = req.file;

      // cek jika di tabel ada gambar
      if (isItem.picture) {
        // hapus gambar sebelumnya
        const parts = isItem.picture.split("/");
        const fileName = parts[parts.length - 1];
        const filePath = path.join("public", "images", fileName);
        fs.unlinkSync(filePath);
      }

      // simpan gambaer ke folder
      const imageData = req.file.buffer;

      // Menentukan folder tempat untuk menyimpan gambar
      const folderPath = path.join(__dirname, "..", "..", "public", "images");

      // Membuat nama file untuk gambar
      const arrayNewFileName = file.originalname.split(".");
      const fileName =
        arrayNewFileName[0] + "-" + Date.now() + "." + arrayNewFileName[1];

      fs.writeFileSync(path.join(folderPath, fileName), imageData);

      // assign url gambar baru
      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    }

    // update to database
    await prisma.item.update({
      where: {
        id: id_item,
      },
      data: {
        name: req.body.name,
        id_unit: req.body.id_unit,
        unit,
        qty: req.body.qty ? parseFloat(req.body.qty) : undefined,
        description: req.body.description,
        location: req.body.location,
        picture: url ? url : isItem.picture,
      },
    });

    return res.json({
      status: "success",
      message: `Berhasil update item ${isItem.name}`,
    });
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: "fail",
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Error pada server",
      });
    }
  }
};

const deleteItemByIdItem = async (req, res) => {
  try {
    // ambil id_items dari req.body
    const { id_items } = req.body;

    // cek id_items di database
    const isItems = await prisma.item.findMany({
      where: {
        id: {
          in: id_items,
        },
      },
    });
    if (isItems.length !== id_items.length) {
      throw new NotFoundError("Beberapa id items tidak ditemukan");
    }

    // hapus gambar
    isItems.forEach((item) => {
      if (item.picture) {
        const parts = item.picture.split("/");
        const fileName = parts[parts.length - 1];
        const filePath = path.join("public", "images", fileName);
        fs.unlinkSync(filePath);
      }
    });

    // hapus item tersebut di database
    await prisma.item.deleteMany({
      where: {
        id: {
          in: id_items,
        },
      },
    });

    return res.json({
      status: "success",
      message: `Berhasil delete ${isItems.length} item`,
    });
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: "fail",
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Error pada server",
      });
    }
  }
};

module.exports = {
  createItemByIdUser,
  getItemByIdUser,
  getItemByIdUser,
  updateItemByIdItem,
  deleteItemByIdItem,
};

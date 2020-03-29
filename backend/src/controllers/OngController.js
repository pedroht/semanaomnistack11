const connection = require("../database/connection");
const generateUniqueId = require("../utils/generateUniqueId");

module.exports = {
  async index(req, res) {
    try {
      const ongs = await connection("ongs").select("*");
      return res.status(200).json({
        success: true,
        ongs
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error
      });
    }
  },
  async create(req, res) {
    try {
      const { name, email, whatsapp, city, uf } = req.body;
      const id = generateUniqueId();

      await connection("ongs").insert({
        id,
        name,
        email,
        whatsapp,
        city,
        uf
      });

      return res.status(201).json({
        success: true,
        id
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error
      });
    }
  }
};

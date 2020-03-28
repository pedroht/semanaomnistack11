const connection = require("../database/connection");

module.exports = {
  async create(req, res) {
    try {
      const { id } = req.body;

      const ong = await connection("ongs")
        .where("id", id)
        .select("name")
        .first();

      if (!ong) {
        return res.status(400).json({
          success: false,
          error: "No ONG found with this ID"
        });
      }

      return res.status(200).json({
        success: true,
        ong
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error
      });
    }
  }
};

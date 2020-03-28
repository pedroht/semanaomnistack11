const connection = require("../database/connection");
module.exports = {
  async index(req, res) {
    try {
      const ong_id = req.headers.authorization;

      if (!ong_id) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      const incidents = await connection("incidents")
        .where("ong_id", ong_id)
        .select("*");

      return res.status(200).json({
        success: true,
        incidents
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error
      });
    }
  }
};

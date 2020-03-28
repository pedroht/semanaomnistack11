const connection = require("../database/connection");

module.exports = {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;

      const [count] = await connection("incidents").count();

      const incidents = await connection("incidents")
        .join("ongs", "ongs.id", "=", "incidents.ong_id")
        .limit(5)
        .offset((page - 1) * 5)
        .select([
          "incidents.*",
          "ongs.name",
          "ongs.email",
          "ongs.whatsapp",
          "ongs.city",
          "ongs.uf"
        ]);

      res.header("X-Total-Count", count["count(*)"]);

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
  },
  async create(req, res) {
    try {
      const { title, description, value } = req.body;
      const ong_id = req.headers.authorization;
      if (!ong_id) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      const [id] = await connection("incidents").insert({
        title,
        description,
        value,
        ong_id
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
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      const ong_id = req.headers.authorization;

      if (!ong_id) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      const incident = await connection("incidents")
        .where("id", id)
        .select("ong_id")
        .first();

      if (!incident) {
        return res.status(400).json({
          success: false,
          error: "Bad request"
        });
      }

      if (incident.ong_id !== ong_id) {
        return res.status(401).json({
          success: false,
          error: "Operation not permitted"
        });
      }

      await connection("incidents")
        .where("id", id)
        .delete();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error
      });
    }
  }
};

const pool = require("../database/")

async function createAppointment(account_id, inv_id, appointment_date, message) {
  const sql = `
    INSERT INTO appointment (account_id, inv_id, appointment_date, message)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `
  const result = await pool.query(sql, [account_id, inv_id, appointment_date, message])
  return result.rows[0]
}

async function getAppointmentsByAccount(account_id) {
  const sql = `
    SELECT tda.*, i.inv_make, i.inv_model, i.inv_year
    FROM appointment tda
    JOIN inventory i ON tda.inv_id = i.inv_id
    WHERE tda.account_id = $1
    ORDER BY tda.appointment_date;
  `
  const result = await pool.query(sql, [account_id])
  return result.rows
}

async function getAllAppointments() {
  const sql = `
    SELECT tda.*, a.account_firstname, a.account_lastname, i.inv_make, i.inv_model, i.inv_year
    FROM appointment tda
    JOIN inventory i ON tda.inv_id = i.inv_id
    JOIN account a ON tda.account_id = a.account_id
    ORDER BY tda.appointment_date;
  `
  const result = await pool.query(sql)
  return result.rows
}

module.exports = {
  createAppointment,
  getAppointmentsByAccount,
  getAllAppointments
}

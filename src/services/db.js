import pg from 'pg';
delete pg.native;

const pool = new pg.Pool();

/**
 * Query
 * @param {string} text
 * @param  {...any} values
 * @return {Promise} query result
 */
export async function query(text, ...values) {
  const {rows} = await pool.query(text, values);
  return rows;
}

import pg from 'pg';

const pool = new pg.Pool();

let client;

/**
 * Connect to database
 * @return {Promise} connected
 */
export async function connect() {
  client = await pool.connect();
}

/**
 * Query
 * @param {string} text
 * @param  {...any} values
 * @return {Promise} query result
 */
export async function query(text, ...values) {
  const {rows} = await client.query(text, values);
  return rows;
}

/**
 * Query transaction
 * @param {function} queries
 */
export async function transaction(queries) {
  try {
    await client.query('BEGIN');
    await queries(client);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

const properties = require("./json/properties.json");
const users = require("./json/users.json");

const {Pool} = require('pg');
const pool = new Pool({
  user:'labber',
  host:'localhost',
  database:'lightbnb',
  password:'labber'
})

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  // let resolvedUser = null;
  // for (const userId in users) {
  //   const user = users[userId];
  //   if (user?.email.toLowerCase() === email?.toLowerCase()) {
  //     resolvedUser = user;
  //   }
  // }
  // return Promise.resolve(resolvedUser);

  const queryString = `SELECT name, email, password, id FROM users
  WHERE users.email = $1
  `
  const values = [email];
  return pool
  .query(queryString,values)
  .then((result)=>{
     return result.rows[0]
  })
  .catch((err)=>{
    console.log(err.message);
  })
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `SELECT name, email, password, id FROM users
  WHERE users.id = $1
  `
  const values = [id];
  return pool
  .query(queryString,values)
  .then((result)=>{
     return result.rows[0]
  })
  .catch((err)=>{
    console.log(err.message);
  })
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
   const queryString = `INSERT INTO users(name,email,password) VALUES($1,$2,$3)
   RETURNING *;`
   const values = [user.name,user.email,user.password];

   return pool
   .query(queryString,values)
   .then((result)=>{
    return result.rows[0].id
   })
   .catch((err)=>{
    console.log(err.message);
   })
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
 const queryString = `SELECT reservations.id, properties.title, reservations.start_date, properties.cost_per_night, AVG(property_reviews.rating) as average_rating
 FROM reservations 
 JOIN properties ON reservations.property_id = properties.id
 JOIN property_reviews ON properties.id = property_reviews.property_id
 WHERE reservations.guest_id = $1
 GROUP BY properties.id, reservations.id
 ORDER BY reservations.start_date
 LIMIT $2`
 const values = [guest_id,limit];
 return pool
        .query(queryString,values)
        .then((result)=>{
          return result.rows
        })
        .catch((err)=>{
          console.log(err.message);
        })
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  // Define the base SQL query
  let queryString = `
    SELECT properties.*,
      AVG(property_reviews.rating) AS average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id
  `;

  // Initialize an array to store query parameters
  const values = [];

  // Check if the options object is provided and has properties
  if (options && Object.keys(options).length > 0) {
    queryString += 'WHERE ';
    const filters = [];

    // Check each possible filter and add it to the query if it exists in options
    if (options.city) {
      filters.push(`city ILIKE $${values.push(`%${options.city}%`)}`);
    }
    if (options.owner_id){
      filters.push(`owner_id = $${values.push(`${options.owner_id}`)}`)
    }
    if (options.minimum_price_per_night){
      filters.push(`cost_per_night >= $${values.push(`${options.minimum_price_per_night * 100}`)}`)
    }
    if (options.maximum_price_per_night){
      filters.push(`cost_per_night <= $${values.push(`${options.maximum_price_per_night * 100}`)}`)
    }

    // Add other filters here if you have additional options

    // Combine the filters with 'AND' and add them to the query
    queryString += filters.join(' AND ');
  }

  // Continue building the SQL query
  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night ASC
    LIMIT $${values.push(limit)};
  `;

  // Execute the SQL query using the pool
  return pool
    .query(queryString, values)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
const queryString = `INSERT INTO properties(
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  street,
  city,
  province,
  post_code,
  country,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
  RETURNING *;`
  const values = [property.owner_id,property.title,property.description,property.thumbnail_photo_url,property.cover_photo_url,property.cost_per_night,property.street,property.city,property.province,property.post_code,property.country,property.parking_space,property.number_of_bathrooms,property.number_of_bedrooms];
  return pool
         .query(queryString,values)
         .then((result)=>{
            return result.rows[0]
         })
         .catch((err)=>{
          console.log(err.message)
         })
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};

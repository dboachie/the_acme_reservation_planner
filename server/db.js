const pg = require('pg');
const db_url = process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_planner'
const client = new pg.Client(db_url);
const uuid = require('uuid');

const createTables = async () => {
    console.log(db_url)
    const SQL = `
        
        DROP TABLE IF EXISTS Reservations;
        DROP TABLE IF EXISTS Restaurants;
        DROP TABLE IF EXISTS Customers;

        CREATE TABLE Customers(
            id UUID PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
        CREATE TABLE Restaurants(
            id UUID PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
        CREATE TABLE Reservations(
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count INTEGER NOT NULL,
            restaurant_id UUID REFERENCES Restaurants(id) NOT NULL,
            customer_id UUID REFERENCES Customers(id) NOT NULL,
            customer_name VARCHAR(50) REFERENCES Customers(name)
        );
    `;

    await client.query(SQL);
};

const createCustomers = async ({ name }) => {
    const SQL = `
        INSERT INTO Customers(id, name)
        VALUES ($1, $2)
        RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
}

const createRestaurants = async ({ name }) => {
    const SQL = `
        INSERT INTO Restaurants(id, name)
        VALUES ($1, $2)
        RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
}


const fetchCustomers = async () => {
    const SQL = `
  SELECT *
  FROM Customers
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchRestaurants = async () => {
    const SQL = `
  SELECT *
  FROM Restaurants
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchReservations = async () => {
    const SQL = `
  SELECT *
  FROM Reservations
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const createReservations = async ({ date, party_count, restaurant_id, customer_id }) => {
    const SQL = `
        INSERT INTO Reservations(id, date, party_count, restaurant_id, customer_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), date, party_count, restaurant_id, customer_id]);
    return response.rows[0];
}


const destroyReservations = async ({ reservation_id }) => {

    const SQL = `
        DELETE FROM Reservations
        WHERE id = $1 
        RETURNING *;
    `;
    await client.query(SQL, [reservation_id]);
};

module.exports = {
    client,
    createTables,
    createCustomers,
    createRestaurants,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    createReservations,
    destroyReservations

};
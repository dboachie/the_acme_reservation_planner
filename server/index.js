const {
    client,
    createTables,
    createCustomers,
    createRestaurants,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    createReservations,
    destroyReservations

} = require('./db');

const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/customers', async (req, res, next) => {
    try {
        res.send(await fetchCustomers());
    }
    catch (err) {
        next(err);
    }
});

app.get('/api/restaurants', async (req, res, next) => {
    try {
        res.send(await fetchRestaurants());
    }
    catch (err) {
        next(err);
    }
});

app.get('/api/Reservations', async (req, res, next) => {
    try {
        res.send(await fetchReservations());
    }
    catch (err) {
        next(err);
    }
});

app.delete('/api/reservations/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await destroyReservations({ reservation_id: id });
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
});

app.post('/api/customers/:customer_id/reservations', async (req, res, next) => {
    const { customer_id } = req.params;
    const { date, party_count, restaurant_id } = req.body;

    try {
        res.status(201).send(await createReservations({ date, party_count, restaurant_id, customer_id }));
    }
    catch (err) {
        next(err);
    }
});



const init = async () => {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('created tables');
    const [ben, john, tim, jim, subway, fiveGuys, pizzaHut] = await Promise.all([
        createCustomers({ name: 'Ben' }),
        createCustomers({ name: 'John' }),
        createCustomers({ name: 'Tim' }),
        createCustomers({ name: 'Jim' }),
        createRestaurants({ name: 'Subway' }),
        createRestaurants({ name: 'Five Guys' }),
        createRestaurants({ name: 'Pizza Hut' }),

    ]);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
    const reservation = await createReservations({
        date: "2024-12-10",
        party_count: 7,
        restaurant_id: subway.id,
        customer_id: tim.id,
    });
    console.log(reservation)
    const reservation2 = await createReservations({
        date: "2024-4-23",
        party_count: 6,
        restaurant_id: pizzaHut.id,
        customer_id: jim.id,
    });
    console.log(reservation2)
    await destroyReservations({ reservation_id: reservation2.id });


    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    })
};


init();

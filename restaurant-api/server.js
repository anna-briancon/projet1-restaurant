const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const restaurateurRoutes = require('./src/routes/restaurateurRoutes');
const dishRoutes = require('./src/routes/dishRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const User = require('./src/models/user');
const Restaurant = require('./src/models/restaurant');
const Dish = require('./src/models/dish');
const Order = require('./src/models/order');

User.associate({ Restaurant, Order });
Restaurant.associate({ User, Dish, Order });
Dish.associate({ Restaurant });
Order.associate({ User, Restaurant });

app.use('/api/auth', authRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/restaurateurs', restaurateurRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8081;

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
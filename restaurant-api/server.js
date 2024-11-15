const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const restaurateurRoutes = require('./src/routes/restaurateurRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Importez tous vos modèles
const User = require('./src/models/user');
const Restaurant = require('./src/models/restaurant');
const Dish = require('./src/models/dish');

// Initialisez les associations
User.associate({ Restaurant });
Restaurant.associate({ User, Dish });
Dish.associate({ Restaurant });

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurateurs', restaurateurRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
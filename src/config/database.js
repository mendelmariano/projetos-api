require('dotenv').config();

module.exports = {
    dialect: 'postgres',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialectOptions: {
        // Defina ssl apenas se DB_SSL for true
        ...(process.env.DB_SSL === 'true'
            ? {
                  ssl: {
                      ssl: true,
                      require: true,
                      rejectUnauthorized: false,
                  },
              }
            : {}),
    },
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};

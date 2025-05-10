'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.belongsTo(models.Hotel, { foreignKey: 'hotelId' });
      Room.belongsToMany(models.Amenities, {
        through: models.RoomAmenities,
        foreignKey: 'roomId',
        otherKey: 'amenitiesId',
        as: 'Amenities'
      });
      
      // Thêm alias cho mối quan hệ hasMany
      Room.hasMany(models.RoomAmenities, { 
        foreignKey: 'roomId',
        as: 'RoomToAmenities'  // Thêm alias riêng
      });
      Room.hasMany(models.FactBookingDetail, { foreignKey: 'roomId' });
      Room.hasMany(models.RoomAvailability, { foreignKey: 'roomId' });
    }
  }
  Room.init({
    roomId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hotelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Hotel',
        key: 'hotelId'
      }
    },
    roomName: DataTypes.STRING,
    roomType: DataTypes.STRING,
    roomStatus: DataTypes.STRING,
    maxCustomer: DataTypes.INTEGER,
    maxRoom: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2),
    roomImage: DataTypes.STRING,
    roomStar: DataTypes.INTEGER,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'Room',
    freezeTableName: true
  });
  return Room;
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.belongsTo(models.Hotel, { foreignKey: 'hotelId' });
      Room.hasMany(models.RoomAmenities, { foreignKey: 'roomID' });
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
    equipmentAndMinibar: DataTypes.STRING,
    maxCustomer: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2),
    roomImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'Room',
    freezeTableName: true
  });
  return Room;
};
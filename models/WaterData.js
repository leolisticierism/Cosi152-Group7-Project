
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var waterDataSchema = Schema( {
  ownerId: ObjectId,
  name: String,
  water: Number,
  createdAt: Date,
} );

module.exports = mongoose.model( 'WaterData', waterDataSchema );

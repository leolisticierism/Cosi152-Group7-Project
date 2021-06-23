
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var waterDataMemberSchema = Schema( {
  ownerId: ObjectId,
  memberId: ObjectId,
  amount: Number,
  createdAt: Date,
} );

module.exports = mongoose.model( 'WaterDataMember', waterDataMemberSchema );

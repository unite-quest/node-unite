import * as mongoose from 'mongoose';

export const BasicDataSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  sex: String,
  age: String,
  region: String,
  dialect: String,
});

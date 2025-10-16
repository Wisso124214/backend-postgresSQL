import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  register_date: { type: Date, required: true },
  status: { type: String, required: true },
});

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

const userProfileSchema = new mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  id_profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
});

const subsystemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

const classSchema = new mongoose.Schema({
  id_subsystem: { type: mongoose.Schema.Types.ObjectId, ref: 'Subsystem' },
  name: { type: String, required: true, unique: true },
  description: String,
});

const methodSchema = new mongoose.Schema({
  id_class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  name: { type: String, required: true, unique: true },
  description: String,
});

const menuSchema = new mongoose.Schema({
  id_subsystem: { type: mongoose.Schema.Types.ObjectId, ref: 'Subsystem' },
  name: { type: String, required: true, unique: true },
  description: String,
});

const menuProfileSchema = new mongoose.Schema({
  id_menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  id_profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
});

const profileMethodSchema = new mongoose.Schema({
  id_profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  id_method: { type: mongoose.Schema.Types.ObjectId, ref: 'Method' },
});

const transactionSchema = new mongoose.Schema({
  id_subsystem: { type: mongoose.Schema.Types.ObjectId, ref: 'Subsystem' },
  id_class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  id_method: { type: mongoose.Schema.Types.ObjectId, ref: 'Method' },
  code: { type: String, required: true },
  description: String,
});

const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);
const UserProfile = mongoose.model('UserProfile', userProfileSchema);
const Subsystem = mongoose.model('Subsystem', subsystemSchema);
const Class = mongoose.model('Class', classSchema);
const Method = mongoose.model('Method', methodSchema);
const Menu = mongoose.model('Menu', menuSchema);
const MenuProfile = mongoose.model('MenuProfile', menuProfileSchema);
const ProfileMethod = mongoose.model('ProfileMethod', profileMethodSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

export const models = { User, Profile, UserProfile, Subsystem, Class, Method, Menu, MenuProfile, ProfileMethod, Transaction };

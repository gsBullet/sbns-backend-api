const mongoose = require('mongoose');
const User = require("./module/user/model/UserModel");
const bcrypt = require('bcrypt');
require('dotenv').config();

const user = {
    username: "testuser",
    email: "h8TtA@example.com",
    password: "testpassword",
    phone: "1234567890",
    userRole : "admin"
}

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected for seeding");

        // Hash the password before saving
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);

        const newUser = new User(user);
        await newUser.save();
        console.log("User seeded successfully");
    } catch (error) {
        console.error("Error seeding user:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedUser();
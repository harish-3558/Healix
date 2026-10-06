const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const adminName = 'Harish';
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD before running the admin reset.');
    process.exitCode = 1;
} else {
    (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI);

            const password = await bcrypt.hash(adminPassword, 10);
            const admin = await User.findOneAndUpdate(
                { email: adminEmail },
                {
                    name: adminName,
                    email: adminEmail,
                    password,
                    role: 'admin',
                    isApproved: true
                },
                { new: true, upsert: true, runValidators: true }
            );

            const result = await User.deleteMany({
                role: 'admin',
                _id: { $ne: admin._id }
            });

            console.log(`Admin reset complete: ${admin.name} (${admin.email})`);
            console.log(`Removed ${result.deletedCount} other admin account(s).`);
        } catch (error) {
            console.error('Admin reset failed:', error.message);
            process.exitCode = 1;
        } finally {
            await mongoose.disconnect();
        }
    })();
}

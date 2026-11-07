import User from '../models/User.js';

/**
 * Ensures a default system administrator exists in MongoDB for evaluation and testing.
 */
export const seedDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@campuspass.edu';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: 'Dr. Sarah Mitchell',
        email: adminEmail,
        password: 'AdminPassword123!',
        role: 'admin',
        isActive: true,
      });
      console.log(`[Seed] Default administrator account seeded: ${adminEmail} / AdminPassword123!`);
    }
  } catch (error) {
    // If MongoDB isn't connected yet or unique index hit, don't crash the server
    console.warn(`[Seed Note] Admin seed skipped: ${error.message}`);
  }
};


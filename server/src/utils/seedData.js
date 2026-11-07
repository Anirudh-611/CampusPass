import User from '../models/User.js';
import Student from '../models/Student.js';
import IDCard from '../models/IDCard.js';

/**
 * Ensures default administrator and demo student accounts exist in MongoDB.
 */
export const seedDefaultData = async () => {
  try {
    // 1. Seed Administrator
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
      console.log(`[Seed] Administrator account seeded: ${adminEmail} / AdminPassword123!`);
    }

    // 2. Seed Demo Student (Alex Rivera)
    const studentEmail = 'alex.rivera@campuspass.edu';
    let studentUser = await User.findOne({ email: studentEmail });

    if (!studentUser) {
      studentUser = await User.create({
        name: 'Alex Rivera',
        email: studentEmail,
        password: 'StudentPass123!',
        role: 'student',
        isActive: true,
      });

      const studentProfile = await Student.create({
        user: studentUser._id,
        fullName: 'Alex Rivera',
        rollNumber: 'ENG-2024-8921',
        collegeName: 'Apex State Institute of Technology',
        department: 'Computer Science & Engineering',
        course: 'B.Tech in Artificial Intelligence',
        currentSemester: 4,
        yearOfStudy: '2nd Year',
        academicBatch: '2023 - 2027',
        phone: '+1 (555) 234-5678',
        bloodGroup: 'O+',
        dateOfBirth: new Date('2004-05-18'),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      });

      await IDCard.create({
        student: studentProfile._id,
        user: studentUser._id,
        cardNumber: 'CP-8921-2024',
        verificationId: 'CAMPUSPASS-DEMO',
        status: 'APPROVED',
        template: 'minimal',
        validUntil: 'July 2027',
        issueDate: new Date('2024-08-15'),
      });

      console.log(`[Seed] Demo student account seeded: ${studentEmail} / StudentPass123!`);
    }
  } catch (error) {
    console.warn(`[Seed Note] Seeding skipped: ${error.message}`);
  }
};

import User from '../models/User.js';
import Student from '../models/Student.js';
import IDCard from '../models/IDCard.js';
import { signToken } from '../utils/generateToken.js';
import { AppError } from '../utils/customError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Register a new student account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, rollNumber, department, course, batch } = req.body;

  if (!fullName || !email || !password || !rollNumber) {
    return next(new AppError('Please provide full name, email, password, and student roll number.', 400));
  }

  // Check if email already registered
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return next(new AppError('An account with this email address already exists.', 409));
  }

  // Check if roll number already assigned
  const existingStudent = await Student.findOne({ rollNumber: rollNumber.toUpperCase() });
  if (existingStudent) {
    return next(new AppError('A student profile with this Roll Number already exists.', 409));
  }

  // 1. Create User account
  const newUser = await User.create({
    name: fullName,
    email: email.toLowerCase(),
    password,
    role: 'student',
  });

  // 2. Create associated Student profile
  const newStudent = await Student.create({
    user: newUser._id,
    fullName,
    rollNumber: rollNumber.toUpperCase(),
    department: department || 'General Academics',
    course: course || 'Undergraduate Degree',
    academicBatch: batch || '2023 - 2027',
  });

  // 3. Create initial pending ID card record
  const newCard = await IDCard.create({
    student: newStudent._id,
    user: newUser._id,
    status: 'PENDING',
    template: 'minimal',
  });

  // 4. Sign JWT
  const token = signToken(newUser);

  res.status(201).json({
    success: true,
    message: 'Student account registered successfully',
    data: {
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      student: newStudent,
      card: newCard,
    },
  });
});

/**
 * @desc    Authenticate user & return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide both email and password.', 400));
  }

  // Find user and explicitly select password hash
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email credentials or password.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('This account has been deactivated. Please contact campus admin.', 403));
  }

  // Sign JWT
  const token = signToken(user);

  // If student, pull linked student record
  let student = null;
  let card = null;
  if (user.role === 'student') {
    student = await Student.findOne({ user: user._id });
    if (student) {
      card = await IDCard.findOne({ student: student._id });
    }
  }

  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      student,
      card,
    },
  });
});

/**
 * @desc    Get currently authenticated user details
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res, next) => {
  let student = null;
  let card = null;

  if (req.user.role === 'student') {
    student = await Student.findOne({ user: req.user._id });
    if (student) {
      card = await IDCard.findOne({ student: student._id });
    }
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
      student,
      card,
    },
  });
});


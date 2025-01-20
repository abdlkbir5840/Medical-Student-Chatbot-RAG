const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prismaClient");

const generateToken = async (id, role) => {
  const token = jwt.sign({ userId: id, role: role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

const register = async (req, res, next) => {
    try {
    const { firstName, lastName, age, email, password, university, speciality } = req.body;
      if (!firstName ||!lastName ||!age ||!email ||!password ||!university ||!speciality) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const role = await prisma.role.findUnique({ where: {name: 'USER'}})
      const savedUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          age: parseInt(age),
          email,
          password: hashedPassword,
          university,
          speciality,
          roleId: role.id
        },
      });

      res.status(200).json({ message: 'User created successfully', savedUser });
    } catch (error) {
      next(error);
    }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { role: true },
    }
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await generateToken(user.id, user.role.name);

    res.status(200).json({ message: "Login successful", accessToken: token, userId: user.id, email: user.email});
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
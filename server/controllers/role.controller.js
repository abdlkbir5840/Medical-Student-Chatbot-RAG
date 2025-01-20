const prisma = require("../models/prismaClient");


// api for init Role model by USER role and ADMIN role
const initRoleModel = async (req, res, next) => {
  try {
    const userRole = await prisma.role.upsert({
      where: { name: "USER" },
      create: { name: "USER" },
      update: {},
    });

    const adminRole = await prisma.role.upsert({
      where: { name: "ADMIN" },
      create: { name: "ADMIN" },
      update: {},
    });

    console.log(`Roles initialized successfully: USER - ${userRole.id}, ADMIN - ${adminRole.id}`);
    res.status(201).json({ message: "Roles initialized successfully" });
  } catch (error) {
    console.error("Failed to initialize roles", error);
    res.status(400).json({ message: "Failed to initialize roles" });
  }
};

module.exports = {initRoleModel};
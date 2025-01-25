const prisma = require("./prismaClient");

const models = [
  "Qwen/Qwen2.5-0.5B-Instruct",
  "Qwen/Qwen2.5-1.5B-Instruct",
  "Qwen/Qwen2.5-3B-Instruct",
];

const roles = ["ADMIN", "USER"];

const initLLMAndRoles = async () => {
  try {
    for (let model of models) {
      const name = model;
      const version = model.split("/")[1];
      const llmModel = await prisma.lLM.upsert({
        where: { name },
        create: { name, version, status: "active" },
        update: { status: "active" },
      });
    }

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

    console.log("LLM and roles initialized successfully");
  } catch (error) {
    console.error("Failed to initialize LLM and roles", error);
  }
};

initLLMAndRoles();

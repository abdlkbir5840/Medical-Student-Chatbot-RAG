const prisma = require("../models/prismaClient");

const models = [
  "Qwen/Qwen2.5-0.5B-Instruct",
  "Qwen/Qwen2.5-1B-Instruct",
  "Qwen/Qwen2.5-2B-Instruct",
];

const initLLMModel = async (req, res, next) => {
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
    res.status(200).json({ message: "LLM models created successfully"});
  } catch (error) {
    // next(error);
    console.error("Failed to create LLM models", error);
    res.status(400).json({ message: "Failed to create LLM models" });
  }
};

const getAllLLMModels = async (req, res, next) => {
  try {
    const llmModels = await prisma.lLM.findMany();
    res.status(200).json(llmModels);
  } catch (error) {
    // next(error);
    console.error("Failed to retrieve LLM models", error);
    res.status(500).json({ message: "Failed to retrieve LLM models" });
  }
};

const updateLLMStats = async (req, res, next) => {
  try {
    const { llm_name, userId, inputTokensIncrement, outputTokensIncrement } = req.body;
    const llmRecord = await prisma.lLM.findUnique({ where: { name: llm_name } });
    if (!llmRecord) {
      return res.status(400).json({ message: "LLM not found" });
    }
    const llmStats = await prisma.lLMStats.upsert({
        where: {
          llmId_userId: {
            llmId: llmRecord.id,
            userId: userId,
          },
        },
        update: {
          inputTokens: {
            increment: inputTokensIncrement,
          },
          outputTokens: {
            increment: outputTokensIncrement,
          },
          nbrQuestions: {
            increment: 1,
          },
        },
        create: {
          userId: userId,
          llmId: llmRecord.id,
          inputTokens: inputTokensIncrement,
          outputTokens: outputTokensIncrement,
          nbrQuestions: 1,
        },
      });
    res.status(200).json({ message: "LLM stats updated successfully", llmStats: llmStats });
  } catch (error) {
    // next(error);
    console.error("Failed to update LLM stats", error);
    res.status(400).json({ message: "Failed to update LLM stats" });
  }
};
const getUserLLMStats = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Fetch LLMs with user-specific stats
      const llms = await prisma.lLM.findMany({
        where: {status:"active"},
        include: {
          userStats: {
            where: { userId },
          },
        },
      });
  
      if (llms.length === 0) {
        return res.status(404).json({ message: "No stats found for the user." });
      }
  
      // Aggregate stats
      let consumedTokens = 0;
      let inputTokens = 0;
      let outputTokens = 0;
      let questionsAsked = 0;
  
      const analytics = llms.map((llm) => {
        const modelStats = llm.userStats.reduce(
          (acc, stat) => {
            acc.nbrQuestion += stat.nbrQuestions;
            acc.inputTokens += stat.inputTokens;
            acc.outputTokens += stat.outputTokens;
            return acc;
          },
          { nbrQuestion: 0, inputTokens: 0, outputTokens: 0 }
        );
  
        // Update global aggregates
        consumedTokens += modelStats.inputTokens + modelStats.outputTokens;
        inputTokens += modelStats.inputTokens;
        outputTokens += modelStats.outputTokens;
        questionsAsked += modelStats.nbrQuestion;
  
        return {
          model: llm.name,
          nbrQuestion: modelStats.nbrQuestion,
          inputTokens: modelStats.inputTokens,
          outputTokens: modelStats.outputTokens,
        };
      });
  
      const response = {
        stats: {
          consumedTokens,
          inputTokens,
          outputTokens,
          questionsAsked,
          filesUploaded: 10, // Static value for now
        },
        analytics,
      };
  
      res.json(response);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "An error occurred while fetching stats." });
    }
  };
  

module.exports = { initLLMModel, getAllLLMModels, updateLLMStats, getUserLLMStats };

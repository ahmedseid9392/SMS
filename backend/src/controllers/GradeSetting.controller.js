import GradingSetting from "../models/GradingSetting.model.js";

export const updateGradingSetting = async (req, res) => {
  try {
    const { midWeight, quizWeight, assignmentWeight, finalWeight } = req.body;

    const total = midWeight + quizWeight + assignmentWeight + finalWeight;

    if (total !== 1) {
      return res.status(400).json({
        message: "Weights must add up to 1 (100%)"
      });
    }

    const setting = await GradingSetting.findOneAndUpdate(
      {},
      { midWeight, quizWeight, assignmentWeight, finalWeight },
      { new: true, upsert: true }
    );

    res.json({ message: "Grading settings updated", setting });
  } catch (error) {
    console.error("Update Grading Setting Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGradingSetting = async (req, res) => {
  try {
    let setting = await GradingSetting.findOne();
    if (!setting) setting = await GradingSetting.create({});

    res.json({ setting });
  } catch (error) {
    console.error("Get Grading Setting Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

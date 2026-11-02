import express from "express";
import mongoose from "mongoose";
import Car from "./models/Car.js";

const app = express();
const PORT = process.env.PORT || 5000;
const DB = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/cars";

app.use(express.json());

app.get("/api/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Не удалось получить машины" });
  }
});

app.get("/api/cars/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Машина не найдена" });
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: "Неверный ID машины" });
  }
});

app.post("/api/cars", async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch("/api/cars/:id", async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!car) return res.status(404).json({ message: "Машина не найдена" });
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/cars/:id", async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Машина не найдена" });
    res.json({ message: "Машина удалена" });
  } catch (error) {
    res.status(400).json({ message: "Неверный ID машины" });
  }
});

mongoose.connect(DB)
  .then(() => app.listen(PORT, () => console.log(`Сервер: http://localhost:${PORT}/api/cars`)))
  .catch((error) => console.error("Ошибка подключения к MongoDB:", error.message));

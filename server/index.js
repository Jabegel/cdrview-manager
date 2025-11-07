import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import processesRouter from "./api/processes.js";

dotenv.config();

const app = express();
app.use(cors());           // como vamos usar proxy do Vite, isso fica tranquilo
app.use(express.json());   // para JSON no body
app.use("/api/processes", processesRouter);


// rota de saúde
app.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// exemplo de API
app.get("/api/todos", (_req, res) => {
  res.json([
    { id: 1, title: "Aprender Express", done: true },
    { id: 2, title: "Integrar com React + Vite", done: false },
  ]);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend ouvindo em http://localhost:${port}`);
});

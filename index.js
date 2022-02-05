const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// Cria um usuário
app.post("/users", async (req, res) => {
  const { nome, email, telefone } = req.body;
  const user = {
    nome,
    email,
    telefone,
  };

  try {
    await User.create(user);
    res.status(201).json({ message: "Pessoa inserida no sistema" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// Retorna usuários da API
app.get("/", async (req, res) => {
  try {
    const user = await User.find();

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// Retorna um usuário específico pelo ID
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// Atualiza dados do usuário
app.patch("/users/:id", async (req, res) => {
  const id = req.params.id;
  const { nome, email, telefone } = req.body;
  const user = {
    nome,
    email,
    telefone,
  };
  try {
    const updatedUser = await User.updateOne({ _id: id }, user);

    if (updatedUser.matchedCount === 0) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// Deleta um usuário
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });
  if (!user) {
    res.status(422).json({ message: "Usuário não encontrado!" });
    return;
  }
  try {
    await User.deleteOne({ _id: id });
    res.status(200).json({ message: "Usuário removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// Conecta ao banco do MongoDB
mongoose
  .connect(
    "mongodb+srv://rafaarneves:finfo2009@apirestful.qgmx1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Conectou ao banco!");
    app.listen(PORT, () => {
      console.log("Servidor iniciado na porta: " + PORT);
    });
  })
  .catch((err) => console.log(err));

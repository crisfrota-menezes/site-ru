const express = require("express");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "client"))); // Servindo arquivos do front-end
app.use("/data", express.static(path.join(__dirname, "data"))); // Servindo arquivos JSON
app.use(express.json());

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Rota para login (mantida como está)
app.post("/login", (req, res) => {
  const { ra, senha } = req.body;
  try {
    const users = JSON.parse(
      fs.readFileSync(path.join(__dirname, "data", "users.json"))
    );
    const user = users.find((u) => u.ra === ra && u.senha === senha);

    if (user) {
      res.json({ success: true, tipo: user.tipo, ra: user.ra });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Credenciais inválidas." });
    }
  } catch (error) {
    console.error("Erro ao processar o login:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Erro ao processar o login." });
  }
});

app.post("/sucesso", (req, res) => {
  const filePath = path.join(__dirname, "data", "execucao.json");

  // Lê o arquivo antes de modificar
  fs.readFile(filePath, "utf8", (err, data) => {
    let execucaoArray = [];

    if (!err && data) {
      try {
        execucaoArray = JSON.parse(data); // Converte JSON para array
      } catch (error) {
        console.error("Erro ao interpretar JSON:", error);
        return res.status(500).json({ success: false, message: "Erro no JSON do servidor." });
      }
    }

    // Adiciona o novo registro
    execucaoArray.push({
      status: "finalizado",
      data: moment().format("DD/MM/YYYY HH:mm:ss"),
    });

    // Salva o JSON atualizado
    fs.writeFile(filePath, JSON.stringify(execucaoArray, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Erro ao escrever no arquivo:", writeErr);
        return res.status(500).json({ success: false, message: "Erro ao salvar execução." });
      }

      res.json({ success: true, message: "Estado de execução atualizado com sucesso." });
    });
  });
});

// Rota para registrar uma nova compra
app.post("/registrar-compra", (req, res) => {
  console.log(req.body);
  const { usuario, itens, total, codigo } = req.body; // Dados da compra
  try {
    const comprasPath = path.join(__dirname, "data", "compras.json");
    let compras = [];

    // Lê o arquivo compras.json, se existir
    if (fs.existsSync(comprasPath)) {
      compras = JSON.parse(fs.readFileSync(comprasPath));
    }

    // Adiciona a nova compra ao array
    compras.push({
      usuario,
      itens,
      total,
      codigo,
      data: moment().format(" Do MM YYYY, h:mm:ss a"), // Registra a data da compra
    });

    // Salva o array atualizado no arquivo compras.json
    fs.writeFileSync(comprasPath, JSON.stringify(compras, null, 2));

    res.json({ success: true, message: "Compra registrada com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar a compra:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Erro ao registrar a compra." });
  }
});

// Rota para atualizar o estado de execução
app.post("/atualizar-execucao", (req, res) => {
  const { estado } = req.body; // Novo estado de execução
  try {
    const execucaoPath = path.join(__dirname, "data", "execucao.json");

    // Atualiza o estado de execução no arquivo execucao.json
    fs.writeFileSync(execucaoPath, JSON.stringify({ estado }, null, 2));

    res.json({
      success: true,
      message: "Estado de execução atualizado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao atualizar o estado de execução:", error.message);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar o estado de execução.",
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

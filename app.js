const express = require("express");
const app = express();
const cors = require("cors");
const admin = require("firebase-admin");

// Initialisation de firebase-admin
const serviceAccount = require("./firebase-service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware pour analyser les requêtes JSON
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

const nom = "Amadou Niangaly";
app.get("/", (req, res) => {
  res.send("<h1>Salut " + nom + "<h1>");
});

app.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  console.log("Token envoyé :", token); // Log pour le token

  const message = {
    notification: {
      title: title || "Nouvelle Demande de Sang",
      body: body || "Une nouvelle demande de sang a été faite.",
    },
    data: {
      click_action: "FLUTTER_NOTIFICATION_CLICK", // Action pour Android
    },
    android: {
      priority: "high", // Assure que la notification est envoyée avec haute priorité
      notification: {
        click_action: "FLUTTER_NOTIFICATION_CLICK", // Obligatoire pour gérer le clic sur Android
      },
    },
    token: token, // Le token de l'appareil
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ message: `Notification envoyée avec succès : ${response}` });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification:", error.code, error.message); // Log détaillé
    res.status(500).json({ error: "Erreur lors de l'envoi de la notification." });
  }
});


// Démarrer le serveur
app.listen(3000, () => {
  console.log("Serveur Node.js démarré sur le port 3000");
});

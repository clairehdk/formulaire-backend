const express = require("express");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(formidableMiddleware());
app.use(cors());

const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

app.post("/form", (req, res) => {
  console.log(req.fields);

  const data = {
    from: `${req.fields.firstName} ${req.fields.lastName} <${req.fields.email}> `,
    to: "c.hartdekeating@gmail.com",
    subject: `Formulaire par ${req.fields.email}`,
    text: `${req.fields.message}`,
  };

  mailgun.messages().send(data, (error, body) => {
    console.log(body);
    console.log(error);
  });

  res.json({ message: "Données reçues, mail envoyé" });
});

app.all("*", (req, res) => {
  res.json({ message: "All routes" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});

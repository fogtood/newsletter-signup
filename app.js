import express from "express";
import bodyParser from "body-parser";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.port || 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/signup.html"));
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = `https://us9.api.mailchimp.com/3.0/lists/bd2c2c01c2`;
  const options = {
    method: "POST",
    auth: "cannabud:1276a487f388b56e56bd8b0cce9889ef-us9",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode == 200) {
      res.sendFile(path.join(__dirname, "/success.html"));
    } else {
      res.sendFile(path.join(__dirname, "/failure.html"));
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

// API Key
// 1276a487f388b56e56bd8b0cce9889ef-us9

// list id
// bd2c2c01c2

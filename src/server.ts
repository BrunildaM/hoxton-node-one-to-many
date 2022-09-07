import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });

const app = express();
app.use(cors());
app.use(express.json());

const port = 4000;

const getAllMuseums = db.prepare(`
SELECT * FROM museums
`);

const getMuseumById = db.prepare(`
SELECT * FROM museums WHERE id = ?
`);

const getWorksForMuseums = db.prepare(`
SELECT * FROM works WHERE museumId = ?
`);

const createMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (?, ?)
`);

const getAllWorks = db.prepare(`
SELECT * FROM works
`);

const getWorkById = db.prepare(`
SELECT * FROM works WHERE id = ?
`);

const createWork = db.prepare(`
INSERT INTO works (name, picture, museumId) VALUES (?, ?, ?)
`);

app.get("/museums", (req, res) => {
  const museums = getAllMuseums.all();

  for (let museum of museums) {
    const works = getWorksForMuseums.all(museum.id);
    museum.works = works;
  }

  res.send(museums);
});

app.get("/museums/:id", (req, res) => {
  const museum = getMuseumById.get(req.params);

  if (museum) {
    const works = getWorksForMuseums.all(museum.id);
    museum.works = works;

    res.send(museum);
  } else {
    res.status(404).send({ error: "Museum not found" });
  }
});

app.post("/museums", (req, res) => {
  const name = req.body.name;
  const city = req.body.city;

  let errors: string[] = [];

  if (typeof name !== "string")
    errors.push("Name not provided or not a string");

  if (typeof city !== "string")
    errors.push("City not provided or not a string");

  if (errors.length === 0) {
    const info = createMuseum.run(req.body);
    const museum = getMuseumById.get(info.lastInsertRowid);
    const works = getWorksForMuseums.all(museum.id);
    museum.works = works;
    res.send(museum);
  } else {
    res.status(400).send({ errors });
  }
});

app.get("/works", (req, res) => {
  const works = getAllWorks.all();

  for (let work of works) {
    const museum = getMuseumById.get(work.museumId);
    work.museum = museum;
  }

  res.send(works);
});

app.get("/works/:id", (req, res) => {
  const work = getWorkById.get(req.params);

  if (work) {
    const museum = getMuseumById.get(work.museumId);
    work.museum = museum;
    res.send(work);
  } else {
    res.status(404).send({ error: "Work not found" });
  }
});

app.post("/works", (req, res) => {
  const name = req.body.name;
  const picture = req.body.picture;
  const museumId = req.body.museumId;

  let errors: string[] = [];

  if (typeof name !== "string") errors.push("Name not given or not a string");

  if (typeof picture !== "string")
    errors.push("Picture not provided or not a string");

  if (typeof museumId !== "number")
    errors.push("MuseumId not provided or not a number");

  if (errors.length === 0) {
    const museum = getMuseumById.get(req.body.museumId);
    if (museum) {
      const info = createWork.run(req.body);
      const work = getWorkById.get(info.lastInsertRowid);
      work.museum = museum;
      res.send(work);
    } else {
      res
        .status(400)
        .send(
          "You are trying to create a materpiece in a museum that does not exist!"
        );
    }
  } else {
    res.status(400).send({ errors });
  }
});

app.listen(port, () => {
  console.log(`App is running in: http://localhost/${port}`);
});

import Database from "better-sqlite3";

const db = Database('./db/data.db', { verbose: console.log })

function everythingAboutMuseums () {

const museums = [
    {
        id: 1,
        name: 'The Louvre',
        city: 'Paris'
    },
    {
        id: 2,
        name: 'Prado',
        city: 'Madrid'
    },
    {
        id: 3,
        name: 'Tate Modern',
        city: 'London'
    },
    {
        id: 4,
        name: 'The Rijksmuseum',
        city: 'Amsterdam'
    }
]

const deleteAllMuseums = db.prepare(`
DROP TABLE IF EXISTS museums;
`)

deleteAllMuseums.run()

const createMuseumsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS museums (
    id INTEGER,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    PRIMARY KEY(id)
)`)

createMuseumsTable.run()

const createMuseum = db.prepare(`
 INSERT INTO museums (name, city) VALUES (?, ?)
`)
for (let museum of museums) {
    createMuseum.run(museum.name, museum.city)
}
}


function everythingAboutWorks () {
const works = [
    {
        id: 1,
        name: 'The Raft of the Medusa',
        picture: 'https://cdn.pariscityvision.com/library/image/5458.jpg',
        museumId: 1
    },
    {
        id: 2,
        name: 'The Adoration of the Shepherds',
        picture: 'https://art-facts.com/wp-content/uploads/2021/11/The-adoration-of-the-Shpherds-by-El-Greco-upper-section.jpg.webp',
        museumId: 2
    },
    {
        id: 3,
        name: 'Las Meninas',
        picture: 'https://art-facts.com/wp-content/uploads/2021/07/Las-Meninas-by-Velazquez-1.jpg.webp',
        museumId: 2
    },
    {
        id: 4,
        name: 'Carnation, Lily, Lily, Rose',
        picture: 'https://art-facts.com/wp-content/uploads/2022/04/Carnation-Lily-Lily-Rose-by-John-Singer-Sargent.jpg.webp',
        museumId: 3
    },
    {
        id: 5,
        name: 'The Lady of Shalott',
        picture: 'https://art-facts.com/wp-content/uploads/2022/04/The-Lady-of-Shalott-by-John-William-Waterhouse.jpg',
        museumId: 3,
    },
    {
        id: 6,
        name: 'Ophelia',
        picture: 'https://art-facts.com/wp-content/uploads/2022/04/Ophelia-by-John-Everett-Millais.jpg',
        museumId: 3
    },
    {
        id: 7,
        name: 'The Wedding Portrait of Isaac Massa and Beatrix van der Laen',
        picture: 'https://www.iamsterdam.com/media/agenda/exhibitions-and-art-works/wedding-portrait-isaac-abrahamsz-massa-and-beatrix-van-der-laan.jpg?w=977',
        museumId: 4
    }
]

const delteAllWorks = db.prepare(`
DROP TABLE IF EXISTS works;
`)

delteAllWorks.run()

const createWorksTable = db.prepare(`
CREATE TABLE IF NOT EXISTS works (
    id INTEGER,
    name TEXT NOT NULL,
    picture TEXT NOT NULL,
    museumId INTEGER,
    PRIMARY KEY(id),
    FOREIGN KEY (museumId) REFERENCES museums(id)
)`)

createWorksTable.run()

const createWork = db.prepare(`
INSERT INTO works (name, picture, museumId) VALUES (?, ?, ?)
`)

for (let work of works) {
    createWork.run(work.name, work.picture, work.museumId)
}
}

everythingAboutMuseums()
everythingAboutWorks()
CREATE DATABASE IF NOT EXISTS pessoa;
USE pessoa;

CREATE TABLE IF NOT EXISTS pessoa (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    idade INT NOT NULL
);

INSERT INTO pessoa (nome, idade) VALUES ('Mariana', 21);
INSERT INTO pessoa (nome, idade) VALUES ('Anna', 20);

SELECT * FROM pessoa;

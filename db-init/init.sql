CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO items (name) VALUES 
('Tâche 1 : Faire le Dockerfile'),
('Tâche 2 : Configurer Nginx'),
('Tâche 3 : Valider le TD avec succès');
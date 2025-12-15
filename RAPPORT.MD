# Rapport de Synthèse : Application Conteneurisée

Ce projet présente une architecture complète (Full Stack) conteneurisée respectant les bonnes pratiques DevOps modernes : images légères, sécurité, orchestration et automatisation.

---

## 1. Architecture du Projet

L'application est composée de trois services interconnectés, isolés dans un réseau privé Docker (`app-network`).

### Schéma de communication

```
Utilisateur (Navigateur) ➡️ Frontend (Nginx :8080) ➡️ API (Node.js :3000) ➡️ Base de Données (PostgreSQL :5432)
```

### Description des services

#### Frontend (projet-front)

- Application statique générée avec **Vite** (Vanilla JS)
- Servie par un serveur **Nginx** (Alpine) configuré en Reverse Proxy
- **Rôle** : Sert l'interface utilisateur et redirige les requêtes commençant par `/api/` vers le conteneur API. Cela permet d'éviter les problèmes de CORS et de masquer l'adresse réelle de l'API.

#### API (projet-api)

- Développée en **Node.js** avec **Express**
- Connectée à la base de données via le module `pg`
- **Sécurité** : Ce conteneur n'expose aucun port sur la machine hôte. Il est accessible uniquement par le Frontend via le réseau Docker interne, garantissant une isolation totale.

#### Base de Données (projet-db)

- **PostgreSQL 15** (version Alpine légère)
- Les données sont persistées grâce à un volume Docker nommé (`db_data`)
- Initialisée automatiquement au premier démarrage via un script SQL (`init.sql`)

---

## 2. Commandes Clés et Automatisation

Pour simplifier le déploiement , un script d'automatisation `deploy.sh` a été créé.

### Lancement rapide

L'ensemble du projet se lance avec une seule commande :

```bash
./deploy.sh
```

Ce script effectue automatiquement les actions suivantes :

1. **Configuration** : Détecte l'absence de fichier `.env` et le génère à partir de `.env.example` (gestion des secrets)
2. **Build** : Construit les images Docker en forçant la mise à jour (`docker compose build`)
3. **Déploiement** : Lance la stack en mode détaché (`docker compose up -d`)

### Autres commandes utiles

- Vérifier les logs : `docker compose logs -f`
- Arrêter la stack : `docker compose down`
- Vérifier l'utilisateur (Sécurité) : `docker exec projet-api whoami` (Doit retourner `node`)

---

## 3. Bonnes Pratiques Mises en Œuvre

Ce projet a été conçu pour maximiser la sécurité et la performance, conformément aux exigences du TD.

### 🐳 Optimisation des Images (Multistage Builds)

Nous utilisons la construction multi-étapes pour l'API et le Frontend.

- **Frontend** : Une étape `node` build le code , puis seule l'archive finale est copiée dans une image `nginx:alpine`. Le code source et les `node_modules` ne sont pas dans l'image finale.
- **API** : Une étape installe les dépendances, puis une image finale ne copie que le nécessaire de production.

**Résultat** : Des images beaucoup plus légères et une surface d'attaque réduite.

### 🔒 Sécurité (User Non-Root)

Par défaut, les conteneurs tournent en root, ce qui est une faille de sécurité.

- Nous avons configuré explicitement `USER node` dans le Dockerfile de l'API
- L'isolation réseau empêche l'accès direct à la base de données ou à l'API depuis l'extérieur

### ⚙️ Orchestration et Robustesse

- **Healthchecks** : Le service `db` possède un healthcheck (`pg_isready`). L'API attend que la base soit "saine" (`service_healthy`) avant de démarrer, évitant les crashs au lancement.
- **Environment Variables** : Aucune configuration sensible n'est écrite "en dur". Tout est injecté via le fichier `.env` géré par Docker Compose.
- **.dockerignore** : Configuration stricte pour ne pas copier les fichiers locaux (`node_modules`, `.env`, `.git`) dans les conteneurs.

---
# 🐳 Projet Full Stack Conteneurisé avec Docker

Application web complète (Frontend + API + Base de données) orchestrée avec Docker Compose, suivant les bonnes pratiques DevOps.

---

## 📋 Table des Matières

- [Aperçu](#aperçu)
- [Prérequis](#prérequis)
- [Installation et Démarrage](#installation-et-démarrage)
- [Architecture](#architecture)
- [Commandes Utiles](#commandes-utiles)
- [Structure du Projet](#structure-du-projet)
- [Technologies Utilisées](#technologies-utilisées)
- [Documentation](#documentation)

---

## 🎯 Aperçu

Ce projet démontre une architecture microservices complète avec :

- ✅ **Frontend** : Application Vite.js servie par Nginx
- ✅ **API REST** : Backend Node.js/Express
- ✅ **Base de données** : PostgreSQL avec persistance des données
- ✅ **Reverse Proxy** : Configuration Nginx pour routage intelligent
- ✅ **Multi-stage builds** : Images Docker optimisées
- ✅ **Sécurité** : Conteneurs non-root, isolation réseau
- ✅ **Healthchecks** : Démarrage orchestré et robuste

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)
- Git (pour cloner le projet)

Vérifiez les installations :

```bash
docker --version
docker compose version
```

---

## 🚀 Installation et Démarrage

### Démarrage rapide (recommandé)

Le projet inclut un script d'automatisation qui gère tout :

```bash
# Rendre le script exécutable (première fois uniquement)
chmod +x deploy.sh

# Lancer l'application complète
./deploy.sh
```

Le script va automatiquement :
1. Créer le fichier `.env` si nécessaire
2. Construire les images Docker
3. Démarrer tous les services

### Démarrage manuel

Si vous préférez contrôler chaque étape :

```bash
# 1. Copier le fichier d'environnement
cp .env.example .env

# 2. Construire les images
docker compose build

# 3. Démarrer les services
docker compose up -d
```

### Accéder à l'application

Une fois les services démarrés :

- **Frontend** : http://localhost:8080
- **API** : http://localhost:8080/api (via reverse proxy)
- **Base de données** : Accessible uniquement en interne (sécurité)

---

## 🏗️ Architecture

### Schéma de communication

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│  Navigateur │─────>│   Frontend   │─────>│     API     │─────>│  PostgreSQL  │
│             │      │  (Nginx:8080)│      │ (Node:3000) │      │   (:5432)    │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────────┘
                            │                      │                     │
                            └──────────────────────┴─────────────────────┘
                                        app-network (isolé)
```

### Services

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| `frontend` | nginx:alpine | 8080 | Interface utilisateur + Reverse Proxy |
| `api` | node:18-alpine | - | API REST (non exposé) |
| `db` | postgres:15-alpine | - | Base de données (non exposée) |

---

## 📦 Commandes Utiles

### Gestion des services

```bash
# Voir les logs en temps réel
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f api

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes (⚠️ perte de données)
docker compose down -v

# Redémarrer un service spécifique
docker compose restart api
```

### Débogage

```bash
# Vérifier l'état des conteneurs
docker compose ps

# Accéder au shell d'un conteneur
docker exec -it projet-api sh
docker exec -it projet-db psql -U postgres -d mydatabase

# Vérifier l'utilisateur d'exécution (doit retourner "node")
docker exec projet-api whoami

# Voir les réseaux Docker
docker network ls
docker network inspect td-docker_app-network
```

### Maintenance

```bash
# Rebuild sans cache
docker compose build --no-cache

# Nettoyer les images inutilisées
docker system prune -a

# Voir l'utilisation des volumes
docker volume ls
```

---

## 📁 Structure du Projet

```
td-docker/
├── projet-front/           # Application Frontend
│   ├── src/
│   ├── Dockerfile          # Multi-stage build
│   ├── nginx.conf          # Configuration Reverse Proxy
│   └── package.json
├── projet-api/             # API Backend
│   ├── src/
│   │   └── index.js
│   ├── Dockerfile          # Multi-stage build
│   └── package.json
├── projet-db/              # Base de données
│   └── init.sql            # Script d'initialisation
├── docker-compose.yml      # Orchestration des services
├── .env.example            # Template des variables d'environnement
├── .dockerignore           # Fichiers à exclure des builds
├── deploy.sh               # Script d'automatisation
├── README.md               # Ce fichier
└── RAPPORT.MD              # Rapport détaillé du projet
```

---

## 🛠️ Technologies Utilisées

### Frontend
- **Vite** - Build tool moderne
- **Vanilla JavaScript** - Sans framework
- **Nginx Alpine** - Serveur web léger

### Backend
- **Node.js 18** - Runtime JavaScript
- **Express** - Framework web
- **pg** - Client PostgreSQL
- **Alpine Linux** - Image de base légère

### Base de données
- **PostgreSQL 15** - Base de données relationnelle
- **Alpine Linux** - Image optimisée

### DevOps
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration
- **Multi-stage builds** - Optimisation des images

---

## 📚 Documentation

Pour plus de détails sur l'architecture, les bonnes pratiques et les difficultés rencontrées, consultez le [Rapport de Synthèse](./RAPPORT.MD).

---

## 🤝 Contribuer

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

---

## 📝 Licence

Ce projet est réalisé dans le cadre d'un TD EPSI sur Docker.

---

## 👨‍💻 Auteur

**Montagnon Romain** - EPSI

---

## ❓ FAQ

**Q: Les données sont-elles sauvegardées après `docker compose down` ?**  
R: Oui, grâce au volume `db_data`. Utilisez `docker compose down -v` pour supprimer les volumes.

**Q: Comment modifier les variables d'environnement ?**  
R: Éditez le fichier `.env` puis redémarrez : `docker compose down && docker compose up -d`

**Q: L'API ne répond pas**  
R: Vérifiez les logs : `docker compose logs api` et assurez-vous que la base de données est démarrée.

**Q: Comment réinitialiser complètement le projet ?**  
R: 
```bash
docker compose down -v
docker system prune -a
./deploy.sh
```

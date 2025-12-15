#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

echo "🚀 Démarrage du script d'automatisation..."

# --- 1. Gestion de la Configuration (.env) ---
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env manquant. Création automatique à partir de .env.example..."
    cp .env.example .env
    echo "✅ Fichier .env créé."
else
    echo "✅ Fichier .env déjà présent."
fi

# --- 2. Vérification de la configuration Docker Compose ---
echo "🔍 Vérification du fichier docker-compose..."
docker compose config > /dev/null
echo "✅ Configuration Docker Compose valide."

# --- 3. Construction des images ---
echo "🏗️  Construction des images (Build)..."
# On force le build pour être sûr d'avoir la dernière version
docker compose build



# --- 4. Déploiement ---
echo "🚀 Déploiement de la stack..."
docker compose up -d

echo "----------------------------------------------------"
echo "✅ Déploiement terminé avec succès !"
echo "🌐 Frontend accessible sur : http://localhost:8080"
echo "----------------------------------------------------"
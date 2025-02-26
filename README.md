# NND - Nood and Dragon

NND est une application Discord conçue pour faciliter la recherche d'informations provenant des livres de *Dungeons and Dragons* 5.5e et 5e édition.

## Fonctionnalités

- **Recherche d'items** avec la commande /item
- **Recherche de monstres du Monster Manual 2024 (MM'24)** (En cours de développement) avec la commande /monstre
- **Recherche de monstres de tous les livres** (À faire) avec la commande /monstre
- **Recherche de sorts pour 5.5e** (À faire)

## Installation

1. **Copie le fichier .env.example et renomme-le en .env**  
   Utilise la commande suivante pour créer ton fichier .env :

   ```bash
   cp .env.example .env
   ```

2. **Remplis les variables de ton fichier .env** avec les tokens et IDs nécessaires pour que l'application fonctionne correctement.

3. **Lance l'application** avec la commande suivante :

   ```bash
   node .\src\index.js
   ```

## Créateur

Ce projet a été créé par **Zachary Deschênes-Tremblay**.

## Ressources

- [5etools](https://5e.tools/), une référence pour *Dungeons and Dragons* 5e édition

## Technologies utilisées

- [Discord.js](https://discord.js.org/) pour interagir avec l'API Discord
- [CommandKit](https://commandkit.js.org/) pour la gestion des commandes
- [Fuse.js](https://www.fusejs.io/) pour effectuer des recherches rapides et efficaces
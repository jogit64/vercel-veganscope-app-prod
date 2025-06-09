# 🌿 VeganScope | ⚛️ React + Supabase + TMDb API

**VeganScope** est une Progressive Web App qui aide les spectateurs véganes ou sensibles aux questions animales à évaluer l’éthique des films et séries, en fonction de critères comme la présence d’animaux exploités, la violence ou l’image véhiculée.

---

## Fonctionnalités

- 🎬 **Recherche intelligente** (films, séries) via l’API TMDb
- ✍️ **Évaluations éthiques** personnalisées, stockées dans Supabase
- 🧠 **Filtres multi-critères** : exploitation animale, image positive, souffrance, etc.
- 📱 **Expérience mobile-first**
- 🌗 **Mode clair/sombre** + thème persistant
- 💾 **Favoris**, **avis personnels** et **système de tri**
- ⚙️ **Scroll infini**, **carrousel**, **filtrage dynamique**

---

## Technologies utilisées

- **Frontend** : React, TypeScript, Tailwind CSS, Vite
- **Backend / API** :
  - Supabase (base PostgreSQL + Edge Functions sécurisées)
  - TMDb API (données publiques des œuvres)
- **Autres** : LocalStorage, PWA (Progressive Web App), JWT anonyme

---

## Installation (développement)

```bash
# Cloner le repo
git clone https://github.com/jogit64/vercel-veganscope-app-prod.git
cd vercel-veganscope-app-prod

# Installer les dépendances
npm install

# Créer un fichier .env à la racine avec :
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_TMDB_API_KEY=...

# Lancer l'app en développement
npm run dev
Déploiement
L’application est conçue pour être déployée facilement sur des services comme Vercel.
Les variables d’environnement sont injectées au moment du build (.env ou dashboard Vercel).

Notes
VeganScope est un projet personnel visant à explorer les usages éthiques de la tech.

L’API TMDb est utilisée conformément à leurs conditions d’utilisation.
```

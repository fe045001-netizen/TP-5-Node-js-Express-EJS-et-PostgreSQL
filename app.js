import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

import auteurRoutes from './routes/auteurRoutes.js';
import livreRoutes from './routes/livreRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   CONFIG VIEW ENGINE
========================= */
app.set('view engine', 'ejs');
app.set('views', path.resolve('views'));

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('public')));

/* =========================
   ROUTE ACCUEIL
========================= */
app.get('/', async (req, res) => {
  try {
    const LivreModel = (await import('./models/livreModel.js')).LivreModel;
    const AuteurModel = (await import('./models/auteurModel.js')).AuteurModel;

    const livres = (await LivreModel.getAll()).rows;
    const auteurs = (await AuteurModel.getAll()).rows;

    res.render('pages/accueil', {
      title: 'Accueil - Bibliothèque',
      livres,
      auteurs
    });

  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', {
      title: 'Erreur serveur'
    });
  }
});

/* =========================
   ROUTES MODULES
========================= */
app.use('/auteurs', auteurRoutes);
app.use('/livres', livreRoutes);

/* =========================
   PAGE 404
========================= */
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page non trouvée'
  });
});

/* =========================
   ERREUR GLOBALE
========================= */
app.use((err, req, res, next) => {
  console.error(' Erreur serveur:', err);
  res.status(500).render('pages/error', {
    title: 'Erreur serveur'
  });
});

/* =========================
   LANCEMENT SERVEUR
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
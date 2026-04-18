import { AuteurModel } from '../models/auteurModel.js';

export const auteurController = {

  liste: async (req, res) => {
    try {
      const { rows } = await AuteurModel.getAll();
      res.render('pages/auteurs/liste', {
        title: 'Auteurs',
        auteurs: rows
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur serveur' });
    }
  },

  ajouterForm: (req, res) => {
    res.render('pages/auteurs/ajouter', {
      title: 'Ajouter auteur',
      auteur: {}
    });
  },

  ajouter: async (req, res) => {
    try {
      await AuteurModel.create(req.body);
      res.redirect('/auteurs');
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur ajout' });
    }
  },

  details: async (req, res) => {
    try {
      const { rows: au } = await AuteurModel.getById(req.params.id);

      if (!au[0]) {
        return res.status(404).render('pages/404', { title: 'Introuvable' });
      }

      const { rows: livres } = await AuteurModel.getLivres(req.params.id);

      res.render('pages/auteurs/details', {
        title: `${au[0].prenom} ${au[0].nom}`,
        auteur: au[0],
        livres
      });

    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur serveur' });
    }
  },

  modifierForm: async (req, res) => {
    try {
      const { rows } = await AuteurModel.getById(req.params.id);

      if (!rows[0]) {
        return res.status(404).render('pages/404', { title: 'Introuvable' });
      }

      res.render('pages/auteurs/modifier', {
        title: 'Modifier auteur',
        auteur: rows[0]
      });

    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur serveur' });
    }
  },

  modifier: async (req, res) => {
    try {
      await AuteurModel.update(req.params.id, req.body);
      res.redirect(`/auteurs/${req.params.id}`);
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur modification' });
    }
  },

  supprimer: async (req, res) => {
    try {
      await AuteurModel.delete(req.params.id);
      res.redirect('/auteurs');
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur suppression' });
    }
  }
};
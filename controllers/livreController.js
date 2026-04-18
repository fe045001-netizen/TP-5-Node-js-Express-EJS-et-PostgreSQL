import { LivreModel } from '../models/livreModel.js';
import { AuteurModel } from '../models/auteurModel.js';

export const livreController = {

  liste: async (req, res) => {
    try {
      const { rows } = await LivreModel.getAll();

      res.render('pages/livres/liste', {
        title: 'Livres',
        livres: rows,
        searchTerm: req.query.q || ''
      });

    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur serveur' });
    }
  },

  rechercher: async (req, res) => {
    try {
      const { rows } = await LivreModel.search(req.query.q || '');

      res.render('pages/livres/liste', {
        title: 'Recherche',
        livres: rows,
        searchTerm: req.query.q
      });

    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur recherche' });
    }
  },

  ajouterForm: async (req, res) => {
    try {
      const { rows: auteurs } = await AuteurModel.getAll();

      res.render('pages/livres/ajouter', {
        title: 'Ajouter livre',
        livre: {},
        auteurs
      });

    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur serveur' });
    }
  },

  ajouter: async (req, res) => {
    try {
      const data = {
        ...req.body,
        disponible: req.body.disponible === 'on'
      };

      await LivreModel.create(data);
      res.redirect('/livres');

    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur ajout livre' });
    }
  },

  details: async (req, res) => {
    try {
      const { rows } = await LivreModel.getById(req.params.id);

      if (!rows[0]) {
        return res.status(404).render('pages/404', { title: 'Introuvable' });
      }

      res.render('pages/livres/details', {
        title: rows[0].titre,
        livre: rows[0]
      });

    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur serveur' });
    }
  },

  modifierForm: async (req, res) => {
    try {
      const { rows: livres } = await LivreModel.getById(req.params.id);
      const { rows: auteurs } = await AuteurModel.getAll();

      if (!livres[0]) {
        return res.status(404).render('pages/404', { title: 'Introuvable' });
      }

      res.render('pages/livres/modifier', {
        title: 'Modifier livre',
        livre: livres[0],
        auteurs
      });

    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur serveur' });
    }
  },

  modifier: async (req, res) => {
    try {
      const data = {
        ...req.body,
        disponible: req.body.disponible === 'on'
      };

      await LivreModel.update(req.params.id, data);
      res.redirect(`/livres/${req.params.id}`);

    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur modification' });
    }
  },

  supprimer: async (req, res) => {
    try {
      await LivreModel.delete(req.params.id);
      res.redirect('/livres');

    } catch (err) {
      console.error(err);
      res.status(500).render('pages/error', { title: 'Erreur suppression' });
    }
  }
};
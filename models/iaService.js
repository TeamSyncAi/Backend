import pkg from 'scikit-learn';
const { LinearRegression } = pkg;

export const planifierTaches = async (projet) => {
  try {
    console.log("Début de la fonction planifierTaches");
    const taches = projet.taches;
    console.log("Tâches du projet:", taches);
    
    const complexites = taches.map(tache => {
      switch (tache.complexite) {
        case "facile":
          return 1;
        case "moyenne":
          return 2;
        case "difficile":
          return 3;
        default:
          return 0;
      }
    });
    console.log("Complexités des tâches:", complexites);

    const tailles = taches.map(tache => {
      switch (tache.taille) {
        case "petite":
          return 1;
        case "moyenne":
          return 2;
        case "grande":
          return 3;
        default:
          return 0;
      }
    });
    console.log("Tailles des tâches:", tailles);
    console.log("Entraînement du modèle de régression linéaire...");
    const model = new LinearRegression();
    model.fit([complexites, tailles], projet.duree_par_jour);
    console.log("Entraînement du modèle terminé");
    const durees_par_jour = taches.map(tache => {
      const duree_estimee = model.predict([[tache.complexite, tache.taille]])[0];
      return duree_estimee;
    });
    console.log("Durées par jour estimées des tâches:", durees_par_jour);
    console.log("Planification terminée avec succès");
    return durees_par_jour;
  } catch (error) {
    console.error("Erreur lors de la planification des tâches:", error.message);
    throw error;
  }
};

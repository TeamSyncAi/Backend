# pythonmodels/taskschedulemodel.py

from sklearn.linear_model import LinearRegression

class TaskScheduleModel:
    def __init__(self):
        # Initialiser le modèle de régression linéaire
        self.model = LinearRegression()

    def train(self, X_train, y_train):
        # Entraîner le modèle avec les données d'entraînement
        self.model.fit(X_train, y_train)

    def predict_duration(self, complexity, size):
        # Faire une prédiction de la durée de la tâche avec le modèle entraîné
        # La durée de la tâche est prédite en jours
        duration = self.model.predict([[complexity, size]])
        return duration

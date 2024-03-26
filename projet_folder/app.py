from bson import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from pymongo import MongoClient
from train_model import predict_task_duration
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017")
db = client.fakeDataDB 
print("Connexion à la base de données MongoDB établie.")

print("Chargement du modèle et du tokenizer pré-entraînés...")
model = joblib.load("saved_model.joblib")
tokenizer = joblib.load("tokenizer.joblib")

max_length = 1021 

@app.route('/predict_task_durations/<string:project_id>', methods=['GET'])
def predict_task_durations(project_id):
    try:
        print("Requête reçue pour prédire les durées des tâches pour le projet ID:", project_id)
        
        project_id = ObjectId(project_id)
      
        project = db.projects.find_one({'_id': project_id})
        if project:
            total_duration = project.get('total_duration')
            if total_duration is None:
                return jsonify({'error': 'La durée totale du projet n\'est pas définie.'}), 400
            else:
                print("Projet trouvé dans la base de données :", project)
                response = {'total_duration': total_duration, 'modules': []}
                # Récupérer les modules associés au projet
                modules = db.modules.find({'_id': {'$in': project['modules']}})
                for module in modules:
                    print("Module trouvé :", module)
                    module_info = {
                        'id': str(module['_id']),
                        'module_name': module['module_name'],
                        'total_duration': 0,  # Initialiser la durée totale du module à 0
                        'tasks': []
                    }
                    # Récupérer les tâches associées au module
                    for task_id in module.get('tasks', []):
                        task = db.tasks.find_one({'_id': task_id})
                        if task:
                            # Utiliser la description complète de la tâche
                            task_description = task.get('task_description')
                            full_task_description = f"{task_description} du projet"
                            task_id = str(task.get('_id'))  # Récupérer l'ID de la tâche
                            # Prédire la durée de la tâche
                            predicted_duration = predict_task_duration(model, tokenizer, full_task_description)
                            module_info['tasks'].append({'id': task_id, 'description': full_task_description, 'duration': int(predicted_duration)})
                            # Ajouter la durée de la tâche à la durée totale du module
                            module_info['total_duration'] += int(predicted_duration)

                    response['modules'].append(module_info)

                # Prédiction de la durée pour chaque tâche
                task_durations = []
                for module in response['modules']:
                    for task in module['tasks']:
                        predicted_duration = predict_task_duration(model, tokenizer, task['description'])
                        task['duration'] = int(predicted_duration)
                        task_durations.append(predicted_duration)

                # Calculer le facteur d'échelle
                scale_factor = total_duration / sum(task_durations)
                
                # Ajuster les durées prédites des tâches
                for module in response['modules']:
                    for task in module['tasks']:
                        task['duration'] = int(task['duration'] * scale_factor)
                    # Recalculer la durée totale du module en fonction des durées ajustées de ses tâches
                    module['total_duration'] = sum(task['duration'] for task in module['tasks'])

                # Ajuster les dates de début et de fin pour chaque module
                start_date = datetime.now()
                for module in response['modules']:
                    module_start_date = start_date.strftime("%Y-%m-%d")
                    for task in module['tasks']:
                        task_start_date = start_date.strftime("%Y-%m-%d")
                        task_end_date = (start_date + timedelta(days=task['duration'])).strftime("%Y-%m-%d")
                        task['start_date'] = task_start_date
                        task['end_date'] = task_end_date
                        start_date = start_date + timedelta(days=task['duration'])
                    module['module_start_date'] = module_start_date
                    module['module_end_date'] = start_date.strftime("%Y-%m-%d")

                # Calculer la date de fin du projet en fonction de la date de début et de la durée totale du projet
                project_start_date = datetime.now()
                project_end_date = project_start_date + timedelta(days=total_duration)

                # Ajouter les dates de début et de fin du projet au JSON de réponse
                response['project_start_date'] = project_start_date.strftime("%Y-%m-%d")
                response['project_end_date'] = project_end_date.strftime("%Y-%m-%d")
                response['project_total_duration'] = total_duration

                print("Prédictions ajustées des durées des tâches:", response['modules'])
                return jsonify(response), 200

        else:
            print("Aucun projet trouvé avec cet ID:", project_id)
            return jsonify({'error': 'Aucun projet trouvé avec cet ID.'}), 404
    except Exception as e:
        print("Erreur lors de la prédiction :", e)
        return jsonify({'error': 'Une erreur est survenue lors de la prédiction.'}), 500

if __name__ == '__main__':
    app.run(debug=True)

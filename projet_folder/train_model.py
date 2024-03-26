from transformers import BartForConditionalGeneration, BartTokenizer
import torch
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
import joblib


class CustomDataset(Dataset):
    def __init__(self, task_descriptions, total_project_duration):
        
        self.task_descriptions = task_descriptions
        self.total_project_duration = total_project_duration

    def __len__(self):
        return len(self.task_descriptions)

    def __getitem__(self, idx):
        return {
            
            'task_description': self.task_descriptions[idx],
            'total_project_duration': self.total_project_duration
        }




task_descriptions = [
    "Concevoir et modéliser la structure de la base de données en utilisant MySQL.",
    "Créer une interface utilisateur conviviale et esthétique en utilisant HTML, CSS et JavaScript.",
    "Implémenter les fonctionnalités principales de l'application, y compris l'authentification des utilisateurs et la gestion des données.",
    "Effectuer des tests exhaustifs pour garantir le bon fonctionnement de l'application et corriger les éventuels bogues.",
    "Déployer l'application sur les serveurs de production et configurer l'environnement d'exécution.",
    "Fournir un support technique continu aux utilisateurs et effectuer des mises à jour de maintenance régulières.",
    "Collecting and analyzing user requirements.",
    "Designing and implementing database architectures.",
    "Creating responsive and visually appealing user interfaces.",
    "Developing backend functionalities using Python and Django.",
    "Testing software components and fixing bugs.",
    "Deploying applications to cloud platforms like AWS or Azure.",
    "Providing ongoing technical support and maintenance.",
    "Meeting with stakeholders to discuss project requirements.",
    "Documenting project specifications and progress reports."
]  # Liste des descriptions de tâches
total_duration = 300  


dataset = CustomDataset( task_descriptions, total_duration)


train_data, test_data = train_test_split(dataset, test_size=0.1, random_state=42)

# Charger le modèle BART et le tokenizer
model = BartForConditionalGeneration.from_pretrained("facebook/bart-base")
tokenizer = BartTokenizer.from_pretrained("facebook/bart-base")

# Définition des paramètres d'entraînement
num_epochs = 5
learning_rate = 1e-4


optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)
criterion = torch.nn.MSELoss()

def predict_task_duration(model, tokenizer, task_description):
    inputs = tokenizer( task_description, return_tensors="pt", padding=True, truncation=True, max_length=64)
    outputs = model.generate(input_ids=inputs['input_ids'], attention_mask=inputs['attention_mask'])
    return torch.argmax(outputs[0], dim=0).item()

def compute_loss(predicted_duration, actual_duration):
    return criterion(torch.tensor(predicted_duration).float(), torch.tensor(actual_duration).float())

# Boucle d'entraînement
model.train()  # Set model to training mode
for epoch in range(num_epochs):
    total_loss = 0
    for batch in train_data:
        
        task_description = batch['task_description']
        total_duration = batch['total_project_duration']

        # Prédire la durée de la tâche
        predicted_duration = predict_task_duration(model, tokenizer, task_description)

        # Calculer la perte et effectuer la rétropropagation
        loss = compute_loss(predicted_duration, total_duration)
        total_loss += loss.item()

average_loss = total_loss / len(test_data)
print("Average Test Loss:", average_loss)

# Sauvegarder le modèle entraîné
joblib.dump(model, "saved_model.joblib")
joblib.dump(tokenizer, "tokenizer.joblib")

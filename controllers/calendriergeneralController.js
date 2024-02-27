import Projet from '../models/planningModel.js'; 


export async function getAllGeneralProjects(req, res) {
    try {
        const projets = await Projet.find();
        res.status(200).json(projets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Synchroniser le calendrier général avec le calendrier de l'administrateur en utilisant l'intelligence artificielle
export async function synchronizeWithAdminCalendar(req, res) {
    try {
           ////  LOGIQUE AVEC IA
        const updatedProjects = await synchronizeWithAdminCalendarService(); 

        //////////////////LOGIQUE AVEC IA

        
        res.status(200).json(updatedProjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

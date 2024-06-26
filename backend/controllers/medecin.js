const bcrypt = require("bcrypt");
const db = require("../util/database");
const Medecin = require("../model/medecin");

const signupM = async (req, res) => {
  try {
    const { email, password, nom, prenom, specialite, adresse, numero_tel } = req.body;
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // Créer un nouvel utilisateur avec le mot de passe haché
    await Medecin.signupM({ email, password: hashedPassword, nom, prenom, specialite, adresse, numero_tel });
    res.status(200).json({ email, password, nom, prenom, specialite, adresse, numero_tel });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};


const loginM = async (req, res) => {
  const {email, password} = req.body;
  try {

      const data = await Medecin.loginM({email, password});
      // Si le mot de passe est valide, renvoyer les données de l'utilisateur
      res.status(200).json(data);
  } catch(error) {
      console.log(error.message)
      res.status(400).json({message: error.message});
  }
  
}; 
const getMedecin = async (req, res, next) => {
  const { id_medecin } = req.query; // Extraire l'id_medecin des paramètres de requête

  try {
    // Call the getMed function from the Medecin model
    const [rows] = await Medecin.getMed(id_medecin);
    // Log the entire response to understand its structure
    console.log('Database response:', rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }

    // Return the medecin data
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du médecin :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
const updateMedecin = async (req, res) => {
  try {
    const { id_medecin, nom, prenom, specialite, adresse, numero_tel } = req.body;

    const updatedMedecin = await Medecin.updateMed({
      id_medecin,
      nom,
      prenom,
      specialite,
      adresse,
      numero_tel
    });

    res.status(200).json(updatedMedecin);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { signupM, loginM, updateMedecin,getMedecin };
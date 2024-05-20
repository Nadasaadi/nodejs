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
  
}; const updateMedecin = async (req, res) => {
  try {
    const { id_medecin } = req.params;
    const { nom, prenom, specialite, adresse, numero_tel, email } = req.body;

    // Vérifier si l'ID du médecin est valide
    const [[medecin]] = await db.execute(`SELECT * FROM medecin WHERE id_medecin = ?`, [id_medecin]);
    if (!medecin) {
      return res.status(404).json({ error: 'Médecin non trouvé' });
    }

    // Mettre à jour les informations du médecin
    const [result] = await db.execute(
      `UPDATE medecin SET nom = ?, prenom = ?, specialite = ?, adresse = ?, numero_tel = ?, email = ? WHERE id_medecin = ?`,
      [nom, prenom, specialite, adresse, numero_tel, email, id_medecin]
    );

    // Récupérer les nouvelles informations du médecin
    const [[updatedMedecin]] = await db.execute(`SELECT * FROM medecin WHERE id_medecin = ?`, [id_medecin]);
    res.status(200).json(updatedMedecin);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations du médecin :', error);
    res.status(500).json({ error: `Une erreur est survenue lors de la mise à jour des informations du médecin : ${error.message}` });
  }
};

module.exports = { signupM, loginM, updateMedecin };
const fs = require('fs');
const path = require('path');

// Load English translations
const enPath = path.join(__dirname, '../locales/en.json');
const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Simple translations for common UI elements
// For production, you'd want to use a proper translation service or human translators
const manualTranslations = {
  es: {
    loading: "Cargando...",
    signIn: "Iniciar sesión",
    register: "Registrarse",
    signOut: "Cerrar sesión",
    upgrade: "⭐ Actualizar",
    lister: "👑 Anfitrión",
    searcher: "✓ Buscador",
    profile: "Perfil",
    list: "Listar",
    stays: "Estancias",
    jobs: "Trabajos",
    about: "Acerca de",
    email: "Correo electrónico",
    password: "Contraseña",
    submit: "Enviar",
    back: "Atrás",
    next: "Siguiente",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    create: "Crear",
    // Add more key translations here
  },
  fr: {
    loading: "Chargement...",
    signIn: "Se connecter",
    register: "S'inscrire",
    signOut: "Se déconnecter",
    upgrade: "⭐ Améliorer",
    lister: "👑 Hôte",
    searcher: "✓ Chercheur",
    profile: "Profil",
    list: "Lister",
    stays: "Séjours",
    jobs: "Emplois",
    about: "À propos",
    email: "E-mail",
    password: "Mot de passe",
    submit: "Soumettre",
    back: "Retour",
    next: "Suivant",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    create: "Créer",
  },
  it: {
    loading: "Caricamento...",
    signIn: "Accedi",
    register: "Registrati",
    signOut: "Esci",
    upgrade: "⭐ Aggiorna",
    lister: "👑 Host",
    searcher: "✓ Cercatore",
    profile: "Profilo",
    list: "Elenca",
    stays: "Soggiorni",
    jobs: "Lavori",
    about: "Chi siamo",
    email: "Email",
    password: "Password",
    submit: "Invia",
    back: "Indietro",
    next: "Avanti",
    save: "Salva",
    cancel: "Annulla",
    delete: "Elimina",
    edit: "Modifica",
    create: "Crea",
  },
  pt: {
    loading: "Carregando...",
    signIn: "Entrar",
    register: "Registrar",
    signOut: "Sair",
    upgrade: "⭐ Atualizar",
    lister: "👑 Anfitrião",
    searcher: "✓ Buscador",
    profile: "Perfil",
    list: "Listar",
    stays: "Estadias",
    jobs: "Empregos",
    about: "Sobre",
    email: "E-mail",
    password: "Senha",
    submit: "Enviar",
    back: "Voltar",
    next: "Próximo",
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    create: "Criar",
  },
};

// For keys not manually translated, keep English as fallback
function generateTranslationFile(locale) {
  const manual = manualTranslations[locale] || {};
  const result = {};
  
  Object.keys(enTranslations).forEach(key => {
    result[key] = manual[key] || enTranslations[key]; // Fallback to English
  });
  
  return result;
}

// Generate translation files
['es', 'fr', 'it', 'pt'].forEach(locale => {
  const translations = generateTranslationFile(locale);
  const filePath = path.join(__dirname, `../locales/${locale}.json`);
  fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
  console.log(`✅ Generated ${locale}.json`);
});

console.log('\n⚠️  Note: These files use English fallbacks for most keys.');
console.log('For production, please have them professionally translated.');

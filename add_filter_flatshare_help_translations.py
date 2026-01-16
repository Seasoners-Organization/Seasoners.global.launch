#!/usr/bin/env python3
"""
Add translations for FilterSidebar, Flatshares page, and Help pages
Adds ~90+ keys across 6 languages (EN, DE, ES, FR, IT, PT)
"""
import json
from pathlib import Path

# All new translation keys with English, German, Spanish, French, Italian, Portuguese
NEW_KEYS = {
    # FilterSidebar Component (30 keys)
    "filterSidebarTitle": {
        "en": "Filters",
        "de": "Filter",
        "es": "Filtros",
        "fr": "Filtres",
        "it": "Filtri",
        "pt": "Filtros"
    },
    "filterReset": {
        "en": "Reset",
        "de": "Zurücksetzen",
        "es": "Restablecer",
        "fr": "Réinitialiser",
        "it": "Ripristina",
        "pt": "Redefinir"
    },
    "filterClearAll": {
        "en": "Clear all",
        "de": "Alle löschen",
        "es": "Borrar todo",
        "fr": "Tout effacer",
        "it": "Cancella tutto",
        "pt": "Limpar tudo"
    },
    "filterSeasonLocation": {
        "en": "Season & Location",
        "de": "Saison & Standort",
        "es": "Temporada y ubicación",
        "fr": "Saison et emplacement",
        "it": "Stagione e posizione",
        "pt": "Temporada e localização"
    },
    "filterSeason": {
        "en": "Season",
        "de": "Saison",
        "es": "Temporada",
        "fr": "Saison",
        "it": "Stagione",
        "pt": "Temporada"
    },
    "filterAll": {
        "en": "All",
        "de": "Alle",
        "es": "Todos",
        "fr": "Tous",
        "it": "Tutti",
        "pt": "Todos"
    },
    "filterCountry": {
        "en": "Country",
        "de": "Land",
        "es": "País",
        "fr": "Pays",
        "it": "Paese",
        "pt": "País"
    },
    "filterRegion": {
        "en": "Region",
        "de": "Region",
        "es": "Región",
        "fr": "Région",
        "it": "Regione",
        "pt": "Região"
    },
    "filterSelectRegion": {
        "en": "Select region",
        "de": "Region auswählen",
        "es": "Seleccionar región",
        "fr": "Sélectionner une région",
        "it": "Seleziona regione",
        "pt": "Selecione a região"
    },
    "filterEconomics": {
        "en": "Economics",
        "de": "Wirtschaft",
        "es": "Economía",
        "fr": "Économie",
        "it": "Economia",
        "pt": "Economia"
    },
    "filterPriceMin": {
        "en": "Price Min",
        "de": "Mindestpreis",
        "es": "Precio mínimo",
        "fr": "Prix minimum",
        "it": "Prezzo minimo",
        "pt": "Preço mínimo"
    },
    "filterPriceMax": {
        "en": "Price Max",
        "de": "Höchstpreis",
        "es": "Precio máximo",
        "fr": "Prix maximum",
        "it": "Prezzo massimo",
        "pt": "Preço máximo"
    },
    "filterProperty": {
        "en": "Property",
        "de": "Unterkunft",
        "es": "Propiedad",
        "fr": "Propriété",
        "it": "Proprietà",
        "pt": "Propriedade"
    },
    "filterBedrooms": {
        "en": "Bedrooms",
        "de": "Schlafzimmer",
        "es": "Dormitorios",
        "fr": "Chambres",
        "it": "Camere da letto",
        "pt": "Quartos"
    },
    "filterRoommates": {
        "en": "Roommates",
        "de": "Mitbewohner",
        "es": "Compañeros de piso",
        "fr": "Colocataires",
        "it": "Coinquilini",
        "pt": "Colegas de apartamento"
    },
    "filterJobs": {
        "en": "Jobs",
        "de": "Jobs",
        "es": "Trabajos",
        "fr": "Emplois",
        "it": "Lavori",
        "pt": "Empregos"
    },
    "filterJobType": {
        "en": "Job Type",
        "de": "Jobtyp",
        "es": "Tipo de trabajo",
        "fr": "Type d'emploi",
        "it": "Tipo di lavoro",
        "pt": "Tipo de emprego"
    },
    "filterJobFullTime": {
        "en": "Full Time",
        "de": "Vollzeit",
        "es": "Tiempo completo",
        "fr": "Temps plein",
        "it": "Tempo pieno",
        "pt": "Tempo integral"
    },
    "filterJobPartTime": {
        "en": "Part Time",
        "de": "Teilzeit",
        "es": "Medio tiempo",
        "fr": "Temps partiel",
        "it": "Part-time",
        "pt": "Meio período"
    },
    "filterJobSeasonal": {
        "en": "Seasonal",
        "de": "Saisonal",
        "es": "Estacional",
        "fr": "Saisonnier",
        "it": "Stagionale",
        "pt": "Sazonal"
    },
    "filterJobTemporary": {
        "en": "Temporary",
        "de": "Befristet",
        "es": "Temporal",
        "fr": "Temporaire",
        "it": "Temporaneo",
        "pt": "Temporário"
    },
    "filterIndustry": {
        "en": "Industry",
        "de": "Branche",
        "es": "Industria",
        "fr": "Industrie",
        "it": "Settore",
        "pt": "Indústria"
    },
    "filterIndustryHospitality": {
        "en": "Hospitality",
        "de": "Gastgewerbe",
        "es": "Hospitalidad",
        "fr": "Hôtellerie",
        "it": "Ospitalità",
        "pt": "Hotelaria"
    },
    "filterIndustryFoodService": {
        "en": "Food Service",
        "de": "Gastronomie",
        "es": "Servicio de comida",
        "fr": "Restauration",
        "it": "Ristorazione",
        "pt": "Serviços de alimentação"
    },
    "filterIndustryRetail": {
        "en": "Retail",
        "de": "Einzelhandel",
        "es": "Minorista",
        "fr": "Vente au détail",
        "it": "Vendita al dettaglio",
        "pt": "Varejo"
    },
    "filterIndustryOutdoor": {
        "en": "Outdoor",
        "de": "Outdoor",
        "es": "Actividades al aire libre",
        "fr": "Plein air",
        "it": "All'aperto",
        "pt": "Ao ar livre"
    },
    "filterIndustryTravel": {
        "en": "Travel",
        "de": "Reisen",
        "es": "Viajes",
        "fr": "Voyage",
        "it": "Viaggi",
        "pt": "Viagens"
    },
    "filterIndustryMaintenance": {
        "en": "Maintenance",
        "de": "Wartung",
        "es": "Mantenimiento",
        "fr": "Maintenance",
        "it": "Manutenzione",
        "pt": "Manutenção"
    },
    "filterIndustryOther": {
        "en": "Other",
        "de": "Sonstiges",
        "es": "Otro",
        "fr": "Autre",
        "it": "Altro",
        "pt": "Outro"
    },
    
    # Flatshares Page (5 keys)
    "flatsharesTitle": {
        "en": "Flatshares",
        "de": "Wohngemeinschaften",
        "es": "Pisos compartidos",
        "fr": "Colocations",
        "it": "Appartamenti condivisi",
        "pt": "Apartamentos partilhados"
    },
    "flatsharesSubtitle": {
        "en": "Find your next shared apartment with compatible roommates",
        "de": "Finde deine nächste Wohngemeinschaft mit passenden Mitbewohnern",
        "es": "Encuentra tu próximo apartamento compartido con compañeros compatibles",
        "fr": "Trouvez votre prochaine colocation avec des colocataires compatibles",
        "it": "Trova il tuo prossimo appartamento condiviso con coinquilini compatibili",
        "pt": "Encontre seu próximo apartamento partilhado com colegas compatíveis"
    },
    "flatsharesEmptyTitle": {
        "en": "Be the First to List a Flatshare!",
        "de": "Sei der Erste, der eine WG inseriert!",
        "es": "¡Sé el primero en publicar un piso compartido!",
        "fr": "Soyez le premier à publier une colocation !",
        "it": "Sii il primo a pubblicare un appartamento condiviso!",
        "pt": "Seja o primeiro a publicar um apartamento partilhado!"
    },
    "flatsharesEmptyDesc": {
        "en": "We're building the community for seasonal flatshares. List your place now and help other travelers find their perfect home away from home.",
        "de": "Wir bauen die Community für saisonale WGs auf. Inseriere jetzt deine Unterkunft und hilf anderen Reisenden, ihr perfektes Zuhause fernab der Heimat zu finden.",
        "es": "Estamos construyendo la comunidad de pisos compartidos estacionales. Publica tu lugar ahora y ayuda a otros viajeros a encontrar su hogar perfecto lejos de casa.",
        "fr": "Nous construisons la communauté pour les colocations saisonnières. Publiez votre logement maintenant et aidez d'autres voyageurs à trouver leur chez-soi parfait loin de chez eux.",
        "it": "Stiamo costruendo la community per gli appartamenti condivisi stagionali. Pubblica il tuo alloggio ora e aiuta altri viaggiatori a trovare la loro casa perfetta lontano da casa.",
        "pt": "Estamos a construir a comunidade de apartamentos partilhados sazonais. Publique o seu espaço agora e ajude outros viajantes a encontrar a sua casa perfeita longe de casa."
    },
    "flatsharesListYourPlace": {
        "en": "List Your Flatshare",
        "de": "WG inserieren",
        "es": "Publicar tu piso compartido",
        "fr": "Publier votre colocation",
        "it": "Pubblica il tuo appartamento",
        "pt": "Publicar o seu apartamento"
    },
    
    # Help Pages - Account (12 keys)
    "helpAccountTitle": {
        "en": "Account Help",
        "de": "Konto-Hilfe",
        "es": "Ayuda de cuenta",
        "fr": "Aide au compte",
        "it": "Aiuto account",
        "pt": "Ajuda da conta"
    },
    "helpAccountSubtitle": {
        "en": "Manage your account, security, and verification",
        "de": "Verwalten Sie Ihr Konto, Sicherheit und Verifizierung",
        "es": "Gestiona tu cuenta, seguridad y verificación",
        "fr": "Gérez votre compte, sécurité et vérification",
        "it": "Gestisci il tuo account, sicurezza e verifica",
        "pt": "Gerir a sua conta, segurança e verificação"
    },
    "helpBackToCenter": {
        "en": "Back to Help Center",
        "de": "Zurück zum Hilfecenter",
        "es": "Volver al Centro de ayuda",
        "fr": "Retour au centre d'aide",
        "it": "Torna al Centro assistenza",
        "pt": "Voltar ao Centro de ajuda"
    },
    "helpAccountQ1": {
        "en": "How do I reset my password?",
        "de": "Wie setze ich mein Passwort zurück?",
        "es": "¿Cómo restablezco mi contraseña?",
        "fr": "Comment réinitialiser mon mot de passe ?",
        "it": "Come resetto la mia password?",
        "pt": "Como redefino a minha senha?"
    },
    "helpAccountA1": {
        "en": "Click 'Forgot Password' on the sign-in page. Enter your email address and we'll send you a secure reset link. If you don't receive the email within 5 minutes, check your spam folder.",
        "de": "Klicken Sie auf 'Passwort vergessen' auf der Anmeldeseite. Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen sicheren Reset-Link. Wenn Sie die E-Mail nicht innerhalb von 5 Minuten erhalten, überprüfen Sie Ihren Spam-Ordner.",
        "es": "Haz clic en 'Olvidé mi contraseña' en la página de inicio de sesión. Ingresa tu dirección de correo electrónico y te enviaremos un enlace de restablecimiento seguro. Si no recibes el correo en 5 minutos, verifica tu carpeta de spam.",
        "fr": "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Entrez votre adresse e-mail et nous vous enverrons un lien de réinitialisation sécurisé. Si vous ne recevez pas l'e-mail dans les 5 minutes, vérifiez votre dossier spam.",
        "it": "Fai clic su 'Password dimenticata' nella pagina di accesso. Inserisci il tuo indirizzo email e ti invieremo un link di reset sicuro. Se non ricevi l'email entro 5 minuti, controlla la cartella spam.",
        "pt": "Clique em 'Esqueci a senha' na página de login. Digite o seu endereço de e-mail e enviaremos um link seguro de redefinição. Se não receber o e-mail em 5 minutos, verifique a sua pasta de spam."
    },
    "helpAccountQ2": {
        "en": "How do I update my profile information?",
        "de": "Wie aktualisiere ich meine Profilinformationen?",
        "es": "¿Cómo actualizo la información de mi perfil?",
        "fr": "Comment mettre à jour mes informations de profil ?",
        "it": "Come aggiorno le informazioni del mio profilo?",
        "pt": "Como atualizo as informações do meu perfil?"
    },
    "helpAccountA2": {
        "en": "Go to your Profile page and click 'Edit Profile'. You can update your name, bio, location, languages, and profile picture. Remember to click 'Save Changes' when you're done.",
        "de": "Gehen Sie zu Ihrer Profilseite und klicken Sie auf 'Profil bearbeiten'. Sie können Ihren Namen, Ihre Biografie, Ihren Standort, Ihre Sprachen und Ihr Profilbild aktualisieren. Denken Sie daran, auf 'Änderungen speichern' zu klicken, wenn Sie fertig sind.",
        "es": "Ve a tu página de Perfil y haz clic en 'Editar perfil'. Puedes actualizar tu nombre, biografía, ubicación, idiomas y foto de perfil. Recuerda hacer clic en 'Guardar cambios' cuando termines.",
        "fr": "Accédez à votre page de profil et cliquez sur 'Modifier le profil'. Vous pouvez mettre à jour votre nom, biographie, emplacement, langues et photo de profil. N'oubliez pas de cliquer sur 'Enregistrer les modifications' lorsque vous avez terminé.",
        "it": "Vai alla tua pagina Profilo e fai clic su 'Modifica profilo'. Puoi aggiornare il tuo nome, biografia, posizione, lingue e foto del profilo. Ricorda di fare clic su 'Salva modifiche' quando hai finito.",
        "pt": "Vá à sua página de Perfil e clique em 'Editar perfil'. Pode atualizar o seu nome, biografia, localização, idiomas e foto de perfil. Lembre-se de clicar em 'Guardar alterações' quando terminar."
    },
    "helpAccountQ3": {
        "en": "How do I verify my email address?",
        "de": "Wie verifiziere ich meine E-Mail-Adresse?",
        "es": "¿Cómo verifico mi dirección de correo electrónico?",
        "fr": "Comment vérifier mon adresse e-mail ?",
        "it": "Come verifico il mio indirizzo email?",
        "pt": "Como verifico o meu endereço de e-mail?"
    },
    "helpAccountA3": {
        "en": "After signing up, check your email for a verification link. Click the link to verify your email. If you didn't receive it, go to your profile and click 'Resend Verification Email'.",
        "de": "Nach der Anmeldung überprüfen Sie Ihre E-Mail auf einen Verifizierungslink. Klicken Sie auf den Link, um Ihre E-Mail zu verifizieren. Wenn Sie ihn nicht erhalten haben, gehen Sie zu Ihrem Profil und klicken Sie auf 'Verifizierungs-E-Mail erneut senden'.",
        "es": "Después de registrarte, verifica tu correo electrónico para encontrar un enlace de verificación. Haz clic en el enlace para verificar tu correo electrónico. Si no lo recibiste, ve a tu perfil y haz clic en 'Reenviar correo de verificación'.",
        "fr": "Après vous être inscrit, vérifiez votre e-mail pour un lien de vérification. Cliquez sur le lien pour vérifier votre e-mail. Si vous ne l'avez pas reçu, accédez à votre profil et cliquez sur 'Renvoyer l'e-mail de vérification'.",
        "it": "Dopo la registrazione, controlla la tua email per un link di verifica. Fai clic sul link per verificare la tua email. Se non l'hai ricevuta, vai al tuo profilo e fai clic su 'Invia di nuovo email di verifica'.",
        "pt": "Após se registar, verifique o seu e-mail para um link de verificação. Clique no link para verificar o seu e-mail. Se não o recebeu, vá ao seu perfil e clique em 'Reenviar e-mail de verificação'."
    },
    "helpAccountQ4": {
        "en": "How do I verify my phone number?",
        "de": "Wie verifiziere ich meine Telefonnummer?",
        "es": "¿Cómo verifico mi número de teléfono?",
        "fr": "Comment vérifier mon numéro de téléphone ?",
        "it": "Come verifico il mio numero di telefono?",
        "pt": "Como verifico o meu número de telefone?"
    },
    "helpAccountA4": {
        "en": "Go to your Profile → Settings → Phone Verification. Enter your phone number and click 'Send Code'. Enter the 6-digit code you receive via SMS to complete verification.",
        "de": "Gehen Sie zu Ihrem Profil → Einstellungen → Telefonverifizierung. Geben Sie Ihre Telefonnummer ein und klicken Sie auf 'Code senden'. Geben Sie den 6-stelligen Code ein, den Sie per SMS erhalten, um die Verifizierung abzuschließen.",
        "es": "Ve a tu Perfil → Configuración → Verificación de teléfono. Ingresa tu número de teléfono y haz clic en 'Enviar código'. Ingresa el código de 6 dígitos que recibes por SMS para completar la verificación.",
        "fr": "Accédez à votre Profil → Paramètres → Vérification téléphonique. Entrez votre numéro de téléphone et cliquez sur 'Envoyer le code'. Entrez le code à 6 chiffres que vous recevez par SMS pour terminer la vérification.",
        "it": "Vai al tuo Profilo → Impostazioni → Verifica telefono. Inserisci il tuo numero di telefono e fai clic su 'Invia codice'. Inserisci il codice a 6 cifre che ricevi via SMS per completare la verifica.",
        "pt": "Vá ao seu Perfil → Definições → Verificação de telefone. Digite o seu número de telefone e clique em 'Enviar código'. Digite o código de 6 dígitos que recebe por SMS para concluir a verificação."
    },
    "helpStillNeedHelp": {
        "en": "Still need help?",
        "de": "Benötigen Sie noch Hilfe?",
        "es": "¿Todavía necesitas ayuda?",
        "fr": "Besoin d'aide supplémentaire ?",
        "it": "Hai ancora bisogno di aiuto?",
        "pt": "Ainda precisa de ajuda?"
    },
    "helpContactSupport": {
        "en": "Contact Support",
        "de": "Support kontaktieren",
        "es": "Contactar soporte",
        "fr": "Contacter le support",
        "it": "Contatta il supporto",
        "pt": "Contactar suporte"
    },
    
    # Help Pages - Listings (10 keys)
    "helpListingsTitle": {
        "en": "Listing Issues",
        "de": "Inseratsprobleme",
        "es": "Problemas de anuncios",
        "fr": "Problèmes d'annonces",
        "it": "Problemi di annunci",
        "pt": "Problemas de anúncios"
    },
    "helpListingsSubtitle": {
        "en": "Create, manage, and optimize your listings",
        "de": "Erstellen, verwalten und optimieren Sie Ihre Inserate",
        "es": "Crea, gestiona y optimiza tus anuncios",
        "fr": "Créez, gérez et optimisez vos annonces",
        "it": "Crea, gestisci e ottimizza i tuoi annunci",
        "pt": "Criar, gerir e otimizar os seus anúncios"
    },
    "helpListingsQ1": {
        "en": "Why was my listing rejected?",
        "de": "Warum wurde mein Inserat abgelehnt?",
        "es": "¿Por qué se rechazó mi anuncio?",
        "fr": "Pourquoi mon annonce a-t-elle été rejetée ?",
        "it": "Perché il mio annuncio è stato rifiutato?",
        "pt": "Por que o meu anúncio foi rejeitado?"
    },
    "helpListingsA1": {
        "en": "Listings may be rejected for: incomplete information, inappropriate content, fake photos, discriminatory language, or violating our Terms of Service. Check your email for specific feedback from our moderation team.",
        "de": "Inserate können abgelehnt werden wegen: unvollständiger Informationen, unangemessener Inhalte, gefälschter Fotos, diskriminierender Sprache oder Verstoß gegen unsere Nutzungsbedingungen. Überprüfen Sie Ihre E-Mail auf spezifisches Feedback von unserem Moderationsteam.",
        "es": "Los anuncios pueden rechazarse por: información incompleta, contenido inapropiado, fotos falsas, lenguaje discriminatorio o violación de nuestros Términos de servicio. Revisa tu correo electrónico para comentarios específicos de nuestro equipo de moderación.",
        "fr": "Les annonces peuvent être rejetées pour : informations incomplètes, contenu inapproprié, fausses photos, langage discriminatoire ou violation de nos Conditions d'utilisation. Vérifiez votre e-mail pour des commentaires spécifiques de notre équipe de modération.",
        "it": "Gli annunci possono essere rifiutati per: informazioni incomplete, contenuti inappropriati, foto false, linguaggio discriminatorio o violazione dei nostri Termini di servizio. Controlla la tua email per feedback specifici dal nostro team di moderazione.",
        "pt": "Os anúncios podem ser rejeitados por: informações incompletas, conteúdo inadequado, fotos falsas, linguagem discriminatória ou violação dos nossos Termos de serviço. Verifique o seu e-mail para feedback específico da nossa equipa de moderação."
    },
    "helpListingsQ2": {
        "en": "How do I edit my listing?",
        "de": "Wie bearbeite ich mein Inserat?",
        "es": "¿Cómo edito mi anuncio?",
        "fr": "Comment modifier mon annonce ?",
        "it": "Come modifico il mio annuncio?",
        "pt": "Como edito o meu anúncio?"
    },
    "helpListingsA2": {
        "en": "Go to your Profile → My Listings. Click on the listing you want to edit, then click 'Edit'. Make your changes and click 'Save'. Changes are reviewed before going live.",
        "de": "Gehen Sie zu Ihrem Profil → Meine Inserate. Klicken Sie auf das Inserat, das Sie bearbeiten möchten, und dann auf 'Bearbeiten'. Nehmen Sie Ihre Änderungen vor und klicken Sie auf 'Speichern'. Änderungen werden vor der Veröffentlichung überprüft.",
        "es": "Ve a tu Perfil → Mis anuncios. Haz clic en el anuncio que deseas editar y luego en 'Editar'. Realiza tus cambios y haz clic en 'Guardar'. Los cambios se revisan antes de publicarse.",
        "fr": "Accédez à votre Profil → Mes annonces. Cliquez sur l'annonce que vous souhaitez modifier, puis sur 'Modifier'. Apportez vos modifications et cliquez sur 'Enregistrer'. Les modifications sont examinées avant d'être publiées.",
        "it": "Vai al tuo Profilo → I miei annunci. Fai clic sull'annuncio che vuoi modificare, quindi su 'Modifica'. Apporta le modifiche e fai clic su 'Salva'. Le modifiche vengono riviste prima della pubblicazione.",
        "pt": "Vá ao seu Perfil → Os meus anúncios. Clique no anúncio que deseja editar e depois em 'Editar'. Faça as suas alterações e clique em 'Guardar'. As alterações são revistas antes de serem publicadas."
    },
    "helpListingsProTips": {
        "en": "💡 Pro Tips for Great Listings",
        "de": "💡 Profi-Tipps für tolle Inserate",
        "es": "💡 Consejos profesionales para grandes anuncios",
        "fr": "💡 Conseils de pro pour de superbes annonces",
        "it": "💡 Suggerimenti per annunci eccezionali",
        "pt": "💡 Dicas profissionais para ótimos anúncios"
    },
    "helpListingsTip1": {
        "en": "Use natural lighting for photos",
        "de": "Verwenden Sie natürliches Licht für Fotos",
        "es": "Usa iluminación natural para las fotos",
        "fr": "Utilisez l'éclairage naturel pour les photos",
        "it": "Usa l'illuminazione naturale per le foto",
        "pt": "Use iluminação natural para fotos"
    },
    "helpListingsTip2": {
        "en": "Be specific about dates and requirements",
        "de": "Seien Sie spezifisch bezüglich Daten und Anforderungen",
        "es": "Sé específico sobre fechas y requisitos",
        "fr": "Soyez précis sur les dates et les exigences",
        "it": "Sii specifico su date e requisiti",
        "pt": "Seja específico sobre datas e requisitos"
    },
    "helpNeedMoreHelp": {
        "en": "Need more help with your listing?",
        "de": "Benötigen Sie weitere Hilfe mit Ihrem Inserat?",
        "es": "¿Necesitas más ayuda con tu anuncio?",
        "fr": "Besoin d'aide supplémentaire avec votre annonce ?",
        "it": "Hai bisogno di più aiuto con il tuo annuncio?",
        "pt": "Precisa de mais ajuda com o seu anúncio?"
    },
    
    # Help Pages - Payments (15 keys)
    "helpPaymentsTitle": {
        "en": "Payment Support",
        "de": "Zahlungsunterstützung",
        "es": "Soporte de pagos",
        "fr": "Support des paiements",
        "it": "Supporto pagamenti",
        "pt": "Suporte de pagamentos"
    },
    "helpPaymentsSubtitle": {
        "en": "Billing, subscriptions, and payment issues",
        "de": "Abrechnung, Abonnements und Zahlungsprobleme",
        "es": "Facturación, suscripciones y problemas de pago",
        "fr": "Facturation, abonnements et problèmes de paiement",
        "it": "Fatturazione, abbonamenti e problemi di pagamento",
        "pt": "Faturação, subscrições e problemas de pagamento"
    },
    "helpPaymentsQ1": {
        "en": "What payment methods do you accept?",
        "de": "Welche Zahlungsmethoden akzeptieren Sie?",
        "es": "¿Qué métodos de pago aceptáis?",
        "fr": "Quels modes de paiement acceptez-vous ?",
        "it": "Quali metodi di pagamento accettate?",
        "pt": "Que métodos de pagamento aceitam?"
    },
    "helpPaymentsA1": {
        "en": "We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as various local payment methods through Stripe. All payments are processed securely.",
        "de": "Wir akzeptieren alle gängigen Kredit- und Debitkarten (Visa, Mastercard, American Express) sowie verschiedene lokale Zahlungsmethoden über Stripe. Alle Zahlungen werden sicher verarbeitet.",
        "es": "Aceptamos todas las principales tarjetas de crédito y débito (Visa, Mastercard, American Express), así como varios métodos de pago locales a través de Stripe. Todos los pagos se procesan de forma segura.",
        "fr": "Nous acceptons toutes les principales cartes de crédit et de débit (Visa, Mastercard, American Express), ainsi que divers modes de paiement locaux via Stripe. Tous les paiements sont traités de manière sécurisée.",
        "it": "Accettiamo tutte le principali carte di credito e debito (Visa, Mastercard, American Express), nonché vari metodi di pagamento locali tramite Stripe. Tutti i pagamenti vengono elaborati in modo sicuro.",
        "pt": "Aceitamos todos os principais cartões de crédito e débito (Visa, Mastercard, American Express), bem como vários métodos de pagamento locais através do Stripe. Todos os pagamentos são processados de forma segura."
    },
    "helpPaymentsQ2": {
        "en": "When will I be charged for my subscription?",
        "de": "Wann wird mein Abonnement abgerechnet?",
        "es": "¿Cuándo se me cobrará mi suscripción?",
        "fr": "Quand serai-je facturé pour mon abonnement ?",
        "it": "Quando verrò addebitato per il mio abbonamento?",
        "pt": "Quando serei cobrado pela minha subscrição?"
    },
    "helpPaymentsA2": {
        "en": "A card is required to start your 90-day free trial. You won't be charged until the trial ends. If you subscribe monthly, you'll be charged on day 91 and then on the same day each month. Annual subscriptions are charged once per year.",
        "de": "Eine Karte ist erforderlich, um Ihre 90-tägige kostenlose Testversion zu starten. Sie werden erst am Ende der Testversion belastet. Bei monatlichem Abonnement erfolgt die Abrechnung am Tag 91 und dann monatlich am gleichen Tag. Jahresabonnements werden einmal pro Jahr abgerechnet.",
        "es": "Se requiere una tarjeta para iniciar tu prueba gratuita de 90 días. No se te cobrará hasta que termine la prueba. Si te suscribes mensualmente, se te cobrará el día 91 y luego el mismo día de cada mes. Las suscripciones anuales se cobran una vez al año.",
        "fr": "Une carte est requise pour commencer votre essai gratuit de 90 jours. Vous ne serez facturé qu'à la fin de l'essai. Si vous vous abonnez mensuellement, vous serez facturé le jour 91 puis le même jour chaque mois. Les abonnements annuels sont facturés une fois par an.",
        "it": "È richiesta una carta per iniziare la tua prova gratuita di 90 giorni. Non verrai addebitato fino alla fine della prova. Se ti abboni mensilmente, verrai addebitato il giorno 91 e poi lo stesso giorno ogni mese. Gli abbonamenti annuali vengono addebitati una volta all'anno.",
        "pt": "É necessário um cartão para iniciar o seu teste gratuito de 90 dias. Não será cobrado até o teste terminar. Se subscrever mensalmente, será cobrado no dia 91 e depois no mesmo dia de cada mês. As subscrições anuais são cobradas uma vez por ano."
    },
    "helpPaymentsQ3": {
        "en": "Can I get a refund?",
        "de": "Kann ich eine Rückerstattung erhalten?",
        "es": "¿Puedo obtener un reembolso?",
        "fr": "Puis-je obtenir un remboursement ?",
        "it": "Posso ottenere un rimborso?",
        "pt": "Posso obter um reembolso?"
    },
    "helpPaymentsA3": {
        "en": "You can cancel anytime during your 90-day free trial at no cost. After billing starts, subscriptions are non-refundable for the current billing period, but you can cancel to prevent future charges.",
        "de": "Sie können jederzeit während Ihrer 90-tägigen kostenlosen Testversion ohne Kosten kündigen. Nach Beginn der Abrechnung sind Abonnements für den aktuellen Abrechnungszeitraum nicht erstattungsfähig, aber Sie können kündigen, um zukünftige Belastungen zu verhindern.",
        "es": "Puedes cancelar en cualquier momento durante tu prueba gratuita de 90 días sin costo. Después de que comience la facturación, las suscripciones no son reembolsables para el período de facturación actual, pero puedes cancelar para evitar cargos futuros.",
        "fr": "Vous pouvez annuler à tout moment pendant votre essai gratuit de 90 jours sans frais. Après le début de la facturation, les abonnements ne sont pas remboursables pour la période de facturation en cours, mais vous pouvez annuler pour éviter les frais futurs.",
        "it": "Puoi annullare in qualsiasi momento durante la tua prova gratuita di 90 giorni senza costi. Dopo l'inizio della fatturazione, gli abbonamenti non sono rimborsabili per il periodo di fatturazione corrente, ma puoi annullare per evitare addebiti futuri.",
        "pt": "Pode cancelar a qualquer momento durante o seu teste gratuito de 90 dias sem custo. Após o início da faturação, as subscrições não são reembolsáveis para o período de faturação atual, mas pode cancelar para evitar cobranças futuras."
    },
    "helpPaymentsQ4": {
        "en": "How do I update my payment method?",
        "de": "Wie aktualisiere ich meine Zahlungsmethode?",
        "es": "¿Cómo actualizo mi método de pago?",
        "fr": "Comment mettre à jour mon mode de paiement ?",
        "it": "Come aggiorno il mio metodo di pagamento?",
        "pt": "Como atualizo o meu método de pagamento?"
    },
    "helpPaymentsA4": {
        "en": "Go to Profile → Settings → Subscription → Update Payment Method. Enter your new card details. Your next payment will use the updated method.",
        "de": "Gehen Sie zu Profil → Einstellungen → Abonnement → Zahlungsmethode aktualisieren. Geben Sie Ihre neuen Kartendaten ein. Ihre nächste Zahlung wird die aktualisierte Methode verwenden.",
        "es": "Ve a Perfil → Configuración → Suscripción → Actualizar método de pago. Ingresa los detalles de tu nueva tarjeta. Tu próximo pago utilizará el método actualizado.",
        "fr": "Accédez à Profil → Paramètres → Abonnement → Mettre à jour le mode de paiement. Entrez les détails de votre nouvelle carte. Votre prochain paiement utilisera la méthode mise à jour.",
        "it": "Vai a Profilo → Impostazioni → Abbonamento → Aggiorna metodo di pagamento. Inserisci i dettagli della tua nuova carta. Il tuo prossimo pagamento utilizzerà il metodo aggiornato.",
        "pt": "Vá a Perfil → Definições → Subscrição → Atualizar método de pagamento. Digite os detalhes do seu novo cartão. O seu próximo pagamento utilizará o método atualizado."
    },
    "helpPaymentsSecure": {
        "en": "Secure Payment Processing",
        "de": "Sichere Zahlungsabwicklung",
        "es": "Procesamiento de pagos seguro",
        "fr": "Traitement sécurisé des paiements",
        "it": "Elaborazione pagamenti sicura",
        "pt": "Processamento de pagamento seguro"
    },
    "helpPaymentsSecureDesc": {
        "en": "All payments are processed securely through Stripe. We never store your complete credit card information.",
        "de": "Alle Zahlungen werden sicher über Stripe verarbeitet. Wir speichern niemals Ihre vollständigen Kreditkarteninformationen.",
        "es": "Todos los pagos se procesan de forma segura a través de Stripe. Nunca almacenamos la información completa de tu tarjeta de crédito.",
        "fr": "Tous les paiements sont traités de manière sécurisée via Stripe. Nous ne stockons jamais les informations complètes de votre carte de crédit.",
        "it": "Tutti i pagamenti vengono elaborati in modo sicuro tramite Stripe. Non memorizziamo mai le informazioni complete della tua carta di credito.",
        "pt": "Todos os pagamentos são processados de forma segura através do Stripe. Nunca armazenamos as informações completas do seu cartão de crédito."
    },
    "helpPaymentsNotResolved": {
        "en": "Payment issue not resolved?",
        "de": "Zahlungsproblem nicht gelöst?",
        "es": "¿Problema de pago no resuelto?",
        "fr": "Problème de paiement non résolu ?",
        "it": "Problema di pagamento non risolto?",
        "pt": "Problema de pagamento não resolvido?"
    },
    "helpPaymentsContactBilling": {
        "en": "Contact our billing team for personalized assistance",
        "de": "Kontaktieren Sie unser Abrechnungsteam für persönliche Unterstützung",
        "es": "Contacta a nuestro equipo de facturación para asistencia personalizada",
        "fr": "Contactez notre équipe de facturation pour une assistance personnalisée",
        "it": "Contatta il nostro team di fatturazione per assistenza personalizzata",
        "pt": "Contacte a nossa equipa de faturação para assistência personalizada"
    },
    "helpContactBillingSupport": {
        "en": "Contact Billing Support",
        "de": "Abrechnungsunterstützung kontaktieren",
        "es": "Contactar soporte de facturación",
        "fr": "Contacter le support facturation",
        "it": "Contatta il supporto fatturazione",
        "pt": "Contactar suporte de faturação"
    },
    
    # Help Pages - Safety (20 keys)
    "helpSafetyTitle": {
        "en": "Safety Resources",
        "de": "Sicherheitsressourcen",
        "es": "Recursos de seguridad",
        "fr": "Ressources de sécurité",
        "it": "Risorse di sicurezza",
        "pt": "Recursos de segurança"
    },
    "helpSafetySubtitle": {
        "en": "Stay safe while using Seasoners",
        "de": "Bleiben Sie sicher bei der Nutzung von Seasoners",
        "es": "Mantente seguro mientras usas Seasoners",
        "fr": "Restez en sécurité en utilisant Seasoners",
        "it": "Rimani al sicuro mentre usi Seasoners",
        "pt": "Fique seguro ao usar o Seasoners"
    },
    "helpSafetyBeforeMeet": {
        "en": "Before You Meet",
        "de": "Vor dem Treffen",
        "es": "Antes de reunirse",
        "fr": "Avant de vous rencontrer",
        "it": "Prima di incontrare",
        "pt": "Antes de se encontrar"
    },
    "helpSafetyBeforeTip1": {
        "en": "Always communicate through Seasoners messaging until you're comfortable",
        "de": "Kommunizieren Sie immer über Seasoners-Nachrichten, bis Sie sich wohlfühlen",
        "es": "Siempre comunícate a través de la mensajería de Seasoners hasta que te sientas cómodo",
        "fr": "Communiquez toujours via la messagerie Seasoners jusqu'à ce que vous soyez à l'aise",
        "it": "Comunica sempre tramite la messaggistica Seasoners finché non ti senti a tuo agio",
        "pt": "Comunique sempre através das mensagens do Seasoners até se sentir confortável"
    },
    "helpSafetyBeforeTip2": {
        "en": "Video chat before meeting in person to verify identity",
        "de": "Videochat vor dem persönlichen Treffen zur Identitätsüberprüfung",
        "es": "Videollamada antes de reunirse en persona para verificar la identidad",
        "fr": "Discutez en vidéo avant de vous rencontrer en personne pour vérifier l'identité",
        "it": "Videochiamata prima di incontrare di persona per verificare l'identità",
        "pt": "Videochamada antes de se encontrar pessoalmente para verificar a identidade"
    },
    "helpSafetyDuringStay": {
        "en": "During Your Stay or Job",
        "de": "Während Ihres Aufenthalts oder Jobs",
        "es": "Durante tu estancia o trabajo",
        "fr": "Pendant votre séjour ou emploi",
        "it": "Durante il tuo soggiorno o lavoro",
        "pt": "Durante a sua estadia ou trabalho"
    },
    "helpSafetyDuringTip1": {
        "en": "Keep important documents and valuables secure",
        "de": "Bewahren Sie wichtige Dokumente und Wertgegenstände sicher auf",
        "es": "Mantén documentos importantes y objetos de valor seguros",
        "fr": "Gardez les documents importants et objets de valeur en sécurité",
        "it": "Tieni documenti importanti e oggetti di valore al sicuro",
        "pt": "Mantenha documentos importantes e objetos de valor seguros"
    },
    "helpSafetyDuringTip2": {
        "en": "Share your location with trusted friends or family",
        "de": "Teilen Sie Ihren Standort mit vertrauenswürdigen Freunden oder Familie",
        "es": "Comparte tu ubicación con amigos o familiares de confianza",
        "fr": "Partagez votre emplacement avec des amis ou de la famille de confiance",
        "it": "Condividi la tua posizione con amici o familiari fidati",
        "pt": "Partilhe a sua localização com amigos ou familiares de confiança"
    },
    "helpSafetyPrivacy": {
        "en": "Protecting Your Privacy",
        "de": "Schutz Ihrer Privatsphäre",
        "es": "Protegiendo tu privacidad",
        "fr": "Protéger votre vie privée",
        "it": "Proteggere la tua privacy",
        "pt": "Proteger a sua privacidade"
    },
    "helpSafetyPrivacyTip1": {
        "en": "Don't share your full address in your listing description",
        "de": "Teilen Sie Ihre vollständige Adresse nicht in Ihrer Inseratsbeschreibung",
        "es": "No compartas tu dirección completa en la descripción de tu anuncio",
        "fr": "Ne partagez pas votre adresse complète dans la description de votre annonce",
        "it": "Non condividere il tuo indirizzo completo nella descrizione dell'annuncio",
        "pt": "Não partilhe o seu endereço completo na descrição do seu anúncio"
    },
    "helpSafetyPrivacyTip2": {
        "en": "Use Seasoners messaging instead of personal email or phone initially",
        "de": "Verwenden Sie zunächst Seasoners-Nachrichten anstelle von persönlicher E-Mail oder Telefon",
        "es": "Usa la mensajería de Seasoners en lugar de correo electrónico o teléfono personal inicialmente",
        "fr": "Utilisez la messagerie Seasoners plutôt que l'e-mail ou le téléphone personnel au début",
        "it": "Usa la messaggistica Seasoners invece di email o telefono personale inizialmente",
        "pt": "Use as mensagens do Seasoners em vez de e-mail ou telefone pessoal inicialmente"
    },
    "helpSafetyScams": {
        "en": "Recognizing Scams",
        "de": "Betrug erkennen",
        "es": "Reconocer estafas",
        "fr": "Reconnaître les escroqueries",
        "it": "Riconoscere le truffe",
        "pt": "Reconhecer fraudes"
    },
    "helpSafetyScamsTip1": {
        "en": "Never send money outside of official payment channels",
        "de": "Senden Sie niemals Geld außerhalb offizieller Zahlungskanäle",
        "es": "Nunca envíes dinero fuera de los canales de pago oficiales",
        "fr": "N'envoyez jamais d'argent en dehors des canaux de paiement officiels",
        "it": "Non inviare mai denaro al di fuori dei canali di pagamento ufficiali",
        "pt": "Nunca envie dinheiro fora dos canais de pagamento oficiais"
    },
    "helpSafetyScamsTip2": {
        "en": "Be suspicious of deals that seem too good to be true",
        "de": "Seien Sie misstrauisch gegenüber Angeboten, die zu gut erscheinen, um wahr zu sein",
        "es": "Desconfía de ofertas que parezcan demasiado buenas para ser verdad",
        "fr": "Méfiez-vous des offres qui semblent trop belles pour être vraies",
        "it": "Sii sospettoso delle offerte che sembrano troppo belle per essere vere",
        "pt": "Desconfie de ofertas que parecem boas demais para ser verdade"
    },
    "helpSafetyEmergency": {
        "en": "🚨 Emergency Contacts",
        "de": "🚨 Notrufnummern",
        "es": "🚨 Contactos de emergencia",
        "fr": "🚨 Contacts d'urgence",
        "it": "🚨 Contatti di emergenza",
        "pt": "🚨 Contactos de emergência"
    },
    "helpSafetyEmergencyAustria": {
        "en": "Austria Emergency Services:",
        "de": "Österreichische Rettungsdienste:",
        "es": "Servicios de emergencia de Austria:",
        "fr": "Services d'urgence autrichiens :",
        "it": "Servizi di emergenza austriaci:",
        "pt": "Serviços de emergência da Áustria:"
    },
    "helpSafetyEmergencySeasoners": {
        "en": "Seasoners Safety Team:",
        "de": "Seasoners-Sicherheitsteam:",
        "es": "Equipo de seguridad de Seasoners:",
        "fr": "Équipe de sécurité Seasoners :",
        "it": "Team di sicurezza Seasoners:",
        "pt": "Equipa de segurança do Seasoners:"
    },
    "helpSafetyEmergencyNote": {
        "en": "For life-threatening emergencies, always contact local authorities first",
        "de": "Bei lebensbedrohlichen Notfällen immer zuerst die örtlichen Behörden kontaktieren",
        "es": "Para emergencias que amenacen la vida, siempre contacta primero a las autoridades locales",
        "fr": "Pour les urgences mettant la vie en danger, contactez toujours les autorités locales en premier",
        "it": "Per emergenze che mettono in pericolo la vita, contatta sempre prima le autorità locali",
        "pt": "Para emergências com risco de vida, contacte sempre primeiro as autoridades locais"
    },
    "helpSafetyFAQs": {
        "en": "Safety FAQs",
        "de": "Sicherheits-FAQs",
        "es": "Preguntas frecuentes de seguridad",
        "fr": "FAQ sur la sécurité",
        "it": "Domande frequenti sulla sicurezza",
        "pt": "Perguntas frequentes sobre segurança"
    },
    "helpSafetyReportConcern": {
        "en": "See something concerning?",
        "de": "Etwas Bedenkliches gesehen?",
        "es": "¿Ves algo preocupante?",
        "fr": "Vous voyez quelque chose de préoccupant ?",
        "it": "Vedi qualcosa di preoccupante?",
        "pt": "Vê algo preocupante?"
    },
    "helpSafetyReportDesc": {
        "en": "Report safety issues immediately - we take every report seriously",
        "de": "Melden Sie Sicherheitsprobleme sofort - wir nehmen jeden Bericht ernst",
        "es": "Informa problemas de seguridad inmediatamente - tomamos cada informe en serio",
        "fr": "Signalez immédiatement les problèmes de sécurité - nous prenons chaque signalement au sérieux",
        "it": "Segnala immediatamente i problemi di sicurezza - prendiamo sul serio ogni segnalazione",
        "pt": "Reporte problemas de segurança imediatamente - levamos cada relatório a sério"
    },
    "helpSafetyReportButton": {
        "en": "Report Safety Concern",
        "de": "Sicherheitsproblem melden",
        "es": "Informar problema de seguridad",
        "fr": "Signaler un problème de sécurité",
        "it": "Segnala problema di sicurezza",
        "pt": "Reportar problema de segurança"
    }
}

def add_keys_to_locale(locale_code):
    """Add new keys to a locale file, preserving existing keys"""
    locale_path = Path(f"locales/{locale_code}.json")
    
    # Load existing translations
    with open(locale_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Add new keys
    added_count = 0
    for key, translations in NEW_KEYS.items():
        if key not in data:
            data[key] = translations[locale_code]
            added_count += 1
            print(f"  Added: {key}")
    
    # Sort alphabetically and save
    sorted_data = dict(sorted(data.items()))
    with open(locale_path, 'w', encoding='utf-8') as f:
        json.dump(sorted_data, f, indent=2, ensure_ascii=False)
        f.write('\n')
    
    return added_count

def main():
    locales = ['en', 'de', 'es', 'fr', 'it', 'pt']
    
    print("Adding translation keys to locale files...")
    print(f"Total new keys: {len(NEW_KEYS)}")
    print()
    
    total_added = 0
    for locale in locales:
        print(f"Processing {locale}.json...")
        added = add_keys_to_locale(locale)
        total_added += added
        print(f"  {added} new keys added")
        print()
    
    print(f"✅ Complete! Added {total_added} total translations across {len(locales)} languages")
    print(f"   ({len(NEW_KEYS)} keys × {len(locales)} locales)")

if __name__ == "__main__":
    main()

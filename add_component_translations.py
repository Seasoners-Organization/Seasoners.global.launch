#!/usr/bin/env python3
import json

translations = {
    # ContactForm
    "contactFormTitle": {"en": "Contact Us", "de": "Kontaktieren Sie uns", "es": "Contáctenos", "fr": "Nous contacter", "it": "Contattaci", "pt": "Entre em contato"},
    "contactFormSuccess": {"en": "Thank you! Your message has been sent.", "de": "Danke! Ihre Nachricht wurde gesendet.", "es": "¡Gracias! Tu mensaje ha sido enviado.", "fr": "Merci! Votre message a été envoyé.", "it": "Grazie! Il tuo messaggio è stato inviato.", "pt": "Obrigado! Sua mensagem foi enviada."},
    "contactFormNamePlaceholder": {"en": "Your Name", "de": "Ihr Name", "es": "Tu Nombre", "fr": "Votre Nom", "it": "Il Tuo Nome", "pt": "Seu Nome"},
    "contactFormEmailPlaceholder": {"en": "Your Email", "de": "Ihre E-Mail", "es": "Tu Correo", "fr": "Votre Email", "it": "La Tua Email", "pt": "Seu Email"},
    "contactFormMessagePlaceholder": {"en": "Your Message", "de": "Ihre Nachricht", "es": "Tu Mensaje", "fr": "Votre Message", "it": "Il Tuo Messaggio", "pt": "Sua Mensagem"},
    "contactFormSendBtn": {"en": "Send Message", "de": "Nachricht senden", "es": "Enviar Mensaje", "fr": "Envoyer le Message", "it": "Invia Messaggio", "pt": "Enviar Mensagem"},
    
    # Footer
    "footerTagline": {"en": "Helping travelers and hosts connect globally.", "de": "Wir verbinden Reisende und Gastgeber weltweit.", "es": "Ayudando a viajeros y anfitriones a conectarse globalmente.", "fr": "Aider les voyageurs et les hôtes à se connecter mondialement.", "it": "Aiutare viaggiatori e host a connettersi globalmente.", "pt": "Ajudando viajantes e anfitriões a se conectarem globalmente."},
    "footerPlatform": {"en": "Platform", "de": "Plattform", "es": "Plataforma", "fr": "Plateforme", "it": "Piattaforma", "pt": "Plataforma"},
    "footerSeasonalStays": {"en": "Seasonal Stays", "de": "Saisonale Unterkünfte", "es": "Alojamientos Estacionales", "fr": "Séjours Saisonniers", "it": "Soggiorni Stagionali", "pt": "Hospedagens Sazonais"},
    "footerSeasonalJobs": {"en": "Seasonal Jobs", "de": "Saisonale Jobs", "es": "Empleos Estacionales", "fr": "Emplois Saisonniers", "it": "Lavori Stagionali", "pt": "Empregos Sazonais"},
    "footerFlatshares": {"en": "Flatshares", "de": "Wohngemeinschaften", "es": "Departamentos Compartidos", "fr": "Partage d'Appartements", "it": "Condivisione Appartamenti", "pt": "Compartilhamento de Apartamentos"},
    "footerListYourPlace": {"en": "List Your Place", "de": "Bieten Sie Ihren Platz an", "es": "Lista tu Lugar", "fr": "Listez Votre Lieu", "it": "Elenca il Tuo Luogo", "pt": "Liste Seu Lugar"},
    "footerResources": {"en": "Resources", "de": "Ressourcen", "es": "Recursos", "fr": "Ressources", "it": "Risorse", "pt": "Recursos"},
    "footerHelpCenter": {"en": "Help Center", "de": "Hilfezentrum", "es": "Centro de Ayuda", "fr": "Centre d'Aide", "it": "Centro Assistenza", "pt": "Central de Ajuda"},
    "footerDocumentation": {"en": "Documentation", "de": "Dokumentation", "es": "Documentación", "fr": "Documentation", "it": "Documentazione", "pt": "Documentação"},
    "footerCommunityForum": {"en": "Community Forum", "de": "Gemeinschaftsforum", "es": "Foro Comunitario", "fr": "Forum Communautaire", "it": "Forum Comunitario", "pt": "Fórum Comunitário"},
    "footerCompany": {"en": "Company", "de": "Unternehmen", "es": "Empresa", "fr": "Entreprise", "it": "Azienda", "pt": "Empresa"},
    "footerAboutUs": {"en": "About Us", "de": "Über uns", "es": "Acerca de Nosotros", "fr": "À Propos de Nous", "it": "Chi Siamo", "pt": "Sobre Nós"},
    "footerFoundingMembers": {"en": "Founding Members", "de": "Gründungsmitglieder", "es": "Miembros Fundadores", "fr": "Membres Fondateurs", "it": "Membri Fondatori", "pt": "Membros Fundadores"},
    "footerSupport": {"en": "Support", "de": "Unterstützung", "es": "Soporte", "fr": "Support", "it": "Supporto", "pt": "Suporte"},
    
    # CookieConsent
    "cookieTitle": {"en": "We Value Your Privacy", "de": "Wir schätzen Ihre Privatsphäre", "es": "Valoramos Tu Privacidad", "fr": "Nous Valorisons Votre Confidentialité", "it": "Apprezziamo la Tua Privacy", "pt": "Valorizamos Sua Privacidade"},
    "cookieDescription": {"en": "We use cookies to improve your experience. Learn more about how we use cookies.", "de": "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Erfahren Sie mehr darüber, wie wir Cookies verwenden.", "es": "Utilizamos cookies para mejorar tu experiencia. Aprende más sobre cómo usamos cookies.", "fr": "Nous utilisons des cookies pour améliorer votre expérience. En savoir plus sur la façon dont nous utilisons les cookies.", "it": "Utilizziamo i cookie per migliorare la tua esperienza. Scopri di più su come utilizziamo i cookie.", "pt": "Usamos cookies para melhorar sua experiência. Saiba mais sobre como usamos cookies."},
    "cookieLearnMore": {"en": "Learn more", "de": "Mehr erfahren", "es": "Aprende más", "fr": "En savoir plus", "it": "Scopri di più", "pt": "Saiba mais"},
    "cookieDecline": {"en": "Decline", "de": "Ablehnen", "es": "Rechazar", "fr": "Refuser", "it": "Rifiuta", "pt": "Recusar"},
    "cookieAcceptAll": {"en": "Accept All", "de": "Alle akzeptieren", "es": "Aceptar Todo", "fr": "Accepter Tout", "it": "Accetta Tutto", "pt": "Aceitar Tudo"},
    
    # EarlyBirdModal
    "earlyBirdBadge": {"en": "Early Supporter Offer", "de": "Angebot für frühe Unterstützer", "es": "Oferta de Apoyo Temprano", "fr": "Offre pour Supporters Précoces", "it": "Offerta per Sostenitori Precoci", "pt": "Oferta para Apoiadores Antecipados"},
    "earlyBirdTitle": {"en": "Experience Premium Free", "de": "Premium kostenlos erleben", "es": "Experimenta Premium Gratis", "fr": "Expérience Premium Gratuite", "it": "Sperimenta Premium Gratuitamente", "pt": "Experimente Premium Grátis"},
    "earlyBirdSearcherPlan": {"en": "Searcher Plan (save €21)", "de": "Searcher Plan (sparen Sie €21)", "es": "Plan de Buscador (ahorra €21)", "fr": "Plan Chercheur (économisez €21)", "it": "Piano Cercatore (risparmia €21)", "pt": "Plano do Buscador (economize €21)"},
    "earlyBirdContactHosts": {"en": "Contact unlimited hosts & employers", "de": "Kontaktieren Sie unbegrenzte Hosts und Arbeitgeber", "es": "Contacta hosts y empleadores ilimitados", "fr": "Contactez des hôtes et des employeurs illimités", "it": "Contatta host e datori di lavoro illimitati", "pt": "Contate hosts e empregadores ilimitados"},
    "earlyBirdPrioritySupport": {"en": "Priority support access", "de": "Prioritärer Supportzugriff", "es": "Acceso a soporte prioritario", "fr": "Accès au support prioritaire", "it": "Accesso al supporto prioritario", "pt": "Acesso ao suporte prioritário"},
    "earlyBirdListerPlan": {"en": "Lister Plan (save €36)", "de": "Lister Plan (sparen Sie €36)", "es": "Plan de Anfitrión (ahorra €36)", "fr": "Plan Annonceur (économisez €36)", "it": "Piano Annunciante (risparmia €36)", "pt": "Plano do Anunciante (economize €36)"},
    "earlyBirdCreateListings": {"en": "Create unlimited listings", "de": "Unbegrenzte Angebote erstellen", "es": "Crea anuncios ilimitados", "fr": "Créez des annonces illimitées", "it": "Crea annunci illimitati", "pt": "Crie anúncios ilimitados"},
    "earlyBirdFeaturedBadge": {"en": "Featured badge & analytics", "de": "Featured-Abzeichen & Analysen", "es": "Insignia destacada y análisis", "fr": "Badge en vedette et analyses", "it": "Medaglia in primo piano e analitiche", "pt": "Selo em destaque e análise"},
    "earlyBirdSignUpMessage": {"en": "Sign up now to lock in this incredible offer. Limited to early supporters.", "de": "Melden Sie sich jetzt an, um dieses unglaubliche Angebot zu sichern. Begrenzt auf frühe Unterstützer.", "es": "Regístrate ahora para asegurar esta oferta increíble. Limitado a apoyo temprano.", "fr": "Inscrivez-vous maintenant pour verrouiller cette offre incroyable. Limité aux supporters précoces.", "it": "Registrati ora per bloccare questa offerta incredibile. Limitato ai sostenitori precoci.", "pt": "Inscreva-se agora para travar esta oferta incrível. Limitado aos apoiadores antecipados."},
    "earlyBirdNoBilling": {"en": "No charge for 90 days", "de": "Kostenlos für 90 Tage", "es": "Sin cargo por 90 días", "fr": "Pas de frais pendant 90 jours", "it": "Nessun addebito per 90 giorni", "pt": "Sem cobrança por 90 dias"},
    "earlyBirdBillingNote": {"en": "Card on file; billing starts day 91", "de": "Kartendaten vorhanden; Abrechnung beginnt am Tag 91", "es": "Tarjeta registrada; la facturación comienza el día 91", "fr": "Carte enregistrée; la facturation commence le jour 91", "it": "Carta in file; fatturazione inizia il giorno 91", "pt": "Cartão em arquivo; faturamento começa no dia 91"},
    "earlyBirdCancel": {"en": "Cancel anytime", "de": "Jederzeit kündbar", "es": "Cancela en cualquier momento", "fr": "Annuler à tout moment", "it": "Cancella in qualsiasi momento", "pt": "Cancele a qualquer momento"},
    "earlyBirdFullAccess": {"en": "Full access included", "de": "Vollständiger Zugriff inbegriffen", "es": "Acceso completo incluido", "fr": "Accès complet inclus", "it": "Accesso completo incluso", "pt": "Acesso completo incluído"},
    "earlyBirdSignUpBtn": {"en": "Sign up now to unlock", "de": "Jetzt anmelden zum Entsperren", "es": "Regístrate ahora para desbloquear", "fr": "Inscrivez-vous maintenant pour déverrouiller", "it": "Registrati ora per sbloccare", "pt": "Inscreva-se agora para desbloquear"},
    "earlyBirdRemindLater": {"en": "Remind me later", "de": "Später erinnern", "es": "Recuérdame después", "fr": "Me rappeler plus tard", "it": "Ricordami più tardi", "pt": "Me lembrar depois"},
    "earlyBirdReminderNote": {"en": "You'll receive email reminders about this offer until day 91.", "de": "Sie erhalten E-Mail-Erinnerungen zu diesem Angebot bis Tag 91.", "es": "Recibirás recordatorios por correo electrónico sobre esta oferta hasta el día 91.", "fr": "Vous recevrez des rappels par e-mail concernant cette offre jusqu'au jour 91.", "it": "Riceverai promemoria via e-mail su questa offerta fino al giorno 91.", "pt": "Você receberá lembretes por e-mail sobre esta oferta até o dia 91."},
    
    # PhoneVerification
    "phoneVerificationSuccess": {"en": "Phone number verified!", "de": "Telefonnummer verifiziert!", "es": "¡Número de teléfono verificado!", "fr": "Numéro de téléphone vérifié!", "it": "Numero di telefono verificato!", "pt": "Número de telefone verificado!"},
    "phoneNumberLabel": {"en": "Phone Number", "de": "Telefonnummer", "es": "Número de Teléfono", "fr": "Numéro de Téléphone", "it": "Numero di Telefono", "pt": "Número de Telefone"},
    "phoneInvalidFormat": {"en": "Invalid phone format for selected country.", "de": "Ungültiges Telefonnummernformat für das ausgewählte Land.", "es": "Formato de teléfono inválido para el país seleccionado.", "fr": "Format de téléphone invalide pour le pays sélectionné.", "it": "Formato telefonico non valido per il paese selezionato.", "pt": "Formato de telefone inválido para o país selecionado."},
    "phoneCodeSentTo": {"en": "Code sent to:", "de": "Code gesendet an:", "es": "Código enviado a:", "fr": "Code envoyé à:", "it": "Codice inviato a:", "pt": "Código enviado para:"},
    "phoneVerificationCodeLabel": {"en": "Verification Code", "de": "Bestätigungscode", "es": "Código de Verificación", "fr": "Code de Vérification", "it": "Codice di Verifica", "pt": "Código de Verificação"},
    "phoneCheckSMS": {"en": "Check your SMS for the code. It expires in 10 minutes.", "de": "Überprüfen Sie Ihre SMS auf den Code. Er verfällt in 10 Minuten.", "es": "Revisa tu SMS para el código. Expira en 10 minutos.", "fr": "Vérifiez votre SMS pour le code. Il expire dans 10 minutes.", "it": "Controlla il tuo SMS per il codice. Scade in 10 minuti.", "pt": "Verifique seu SMS para o código. Expira em 10 minutos."},
    "phoneSendCodeBtn": {"en": "Send Code", "de": "Code senden", "es": "Enviar Código", "fr": "Envoyer le Code", "it": "Invia Codice", "pt": "Enviar Código"},
    "phoneResendIn": {"en": "Resend in", "de": "Erneut senden in", "es": "Reenviar en", "fr": "Renvoyer dans", "it": "Rinvia in", "pt": "Reenviar em"},
    "phoneSending": {"en": "Sending...", "de": "Wird gesendet...", "es": "Enviando...", "fr": "Envoi...", "it": "Invio in corso...", "pt": "Enviando..."},
    "phoneVerifyBtn": {"en": "Verify", "de": "Verifizieren", "es": "Verificar", "fr": "Vérifier", "it": "Verifica", "pt": "Verificar"},
    "phoneVerifying": {"en": "Verifying...", "de": "Wird verifiziert...", "es": "Verificando...", "fr": "Vérification...", "it": "Verifica in corso...", "pt": "Verificando..."},
    "phoneVerifyLater": {"en": "You can verify your phone later in your profile.", "de": "Sie können Ihre Telefonnummer später in Ihrem Profil verifizieren.", "es": "Puedes verificar tu teléfono más tarde en tu perfil.", "fr": "Vous pouvez vérifier votre téléphone plus tard dans votre profil.", "it": "Puoi verificare il tuo telefono più tardi nel tuo profilo.", "pt": "Você pode verificar seu telefone mais tarde em seu perfil."},
    
    # ReportModal
    "reportInappropriate": {"en": "Inappropriate content", "de": "Unangemessener Inhalt", "es": "Contenido inapropiado", "fr": "Contenu inapproprié", "it": "Contenuto inappropriato", "pt": "Conteúdo inadequado"},
    "reportScam": {"en": "Scam or fraud", "de": "Betrug oder Scam", "es": "Estafa o fraude", "fr": "Escroquerie ou fraude", "it": "Truffa o frode", "pt": "Golpe ou fraude"},
    "reportMisleading": {"en": "Misleading information", "de": "Irreführende Informationen", "es": "Información engañosa", "fr": "Information trompeuse", "it": "Informazioni fuorvianti", "pt": "Informação enganosa"},
    "reportDuplicate": {"en": "Duplicate listing", "de": "Dupliziertes Angebot", "es": "Anuncio duplicado", "fr": "Annonce dupliquée", "it": "Annuncio duplicato", "pt": "Anúncio duplicado"},
    "reportOffensive": {"en": "Offensive language", "de": "Beleidigende Sprache", "es": "Lenguaje ofensivo", "fr": "Langage offensant", "it": "Linguaggio offensivo", "pt": "Linguagem ofensiva"},
    "reportOther": {"en": "Other", "de": "Sonstiges", "es": "Otro", "fr": "Autre", "it": "Altro", "pt": "Outro"},
    "reportSubmitted": {"en": "Report Submitted", "de": "Bericht eingereicht", "es": "Informe Enviado", "fr": "Rapport Soumis", "it": "Rapporto Inviato", "pt": "Relatório Enviado"},
    "reportThanks": {"en": "Thank you. We'll review this listing shortly.", "de": "Danke. Wir werden diese Auflistung bald überprüfen.", "es": "Gracias. Revisaremos este anuncio pronto.", "fr": "Merci. Nous examinerons cette annonce bientôt.", "it": "Grazie. Esamineremo questo annuncio presto.", "pt": "Obrigado. Revisaremos este anúncio em breve."},
    "reportTitle": {"en": "Report Listing", "de": "Angebot melden", "es": "Reportar Anuncio", "fr": "Signaler l'Annonce", "it": "Segnala Annuncio", "pt": "Reportar Anúncio"},
    "reportSelectReason": {"en": "Select a reason", "de": "Wählen Sie einen Grund", "es": "Selecciona una razón", "fr": "Sélectionnez une raison", "it": "Seleziona un motivo", "pt": "Selecione um motivo"},
    "reportSubmitting": {"en": "Submitting...", "de": "Wird eingereicht...", "es": "Enviando...", "fr": "Soumission en cours...", "it": "Invio in corso...", "pt": "Enviando..."},
    "reportSubmitBtn": {"en": "Submit Report", "de": "Bericht senden", "es": "Enviar Informe", "fr": "Soumettre le Rapport", "it": "Invia Rapporto", "pt": "Enviar Relatório"},
}

locales = ["en", "de", "es", "fr", "it", "pt"]

for locale in locales:
    file_path = f"locales/{locale}.json"
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for key, trans in translations.items():
        if key not in data:
            data[key] = trans[locale]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✓ Updated {file_path}")

print("✓ All component translation keys added!")

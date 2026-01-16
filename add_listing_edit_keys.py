#!/usr/bin/env python3
import json
import os

# Define translations for listing edit page
translations = {
    "editListing": {
        "en": "Edit Listing",
        "de": "Angebot bearbeiten",
        "es": "Editar Anuncio",
        "fr": "Modifier l'Annonce",
        "it": "Modifica Annuncio",
        "pt": "Editar Anúncio"
    },
    "updateListingDetails": {
        "en": "Update your listing details",
        "de": "Aktualisieren Sie Ihre Angebotdetails",
        "es": "Actualiza los detalles de tu anuncio",
        "fr": "Mettez à jour les détails de votre annonce",
        "it": "Aggiorna i dettagli del tuo annuncio",
        "pt": "Atualize os detalhes do seu anúncio"
    },
    "titleLabel": {
        "en": "Title",
        "de": "Titel",
        "es": "Título",
        "fr": "Titre",
        "it": "Titolo",
        "pt": "Título"
    },
    "titlePlaceholder": {
        "en": "Enter listing title",
        "de": "Geben Sie den Angebottitel ein",
        "es": "Ingresa el título del anuncio",
        "fr": "Entrez le titre de l'annonce",
        "it": "Inserisci il titolo dell'annuncio",
        "pt": "Digite o título do anúncio"
    },
    "descriptionLabel": {
        "en": "Description",
        "de": "Beschreibung",
        "es": "Descripción",
        "fr": "Description",
        "it": "Descrizione",
        "pt": "Descrição"
    },
    "descriptionPlaceholder": {
        "en": "Describe your listing",
        "de": "Beschreiben Sie Ihr Angebot",
        "es": "Describe tu anuncio",
        "fr": "Décrivez votre annonce",
        "it": "Descrivi il tuo annuncio",
        "pt": "Descreva seu anúncio"
    },
    "pricePerMonth": {
        "en": "Price (€/month)",
        "de": "Preis (€/Monat)",
        "es": "Precio (€/mes)",
        "fr": "Prix (€/mois)",
        "it": "Prezzo (€/mese)",
        "pt": "Preço (€/mês)"
    },
    "cityLocation": {
        "en": "City/Location",
        "de": "Stadt/Standort",
        "es": "Ciudad/Ubicación",
        "fr": "Ville/Localisation",
        "it": "Città/Posizione",
        "pt": "Cidade/Local"
    },
    "cityLocationPlaceholder": {
        "en": "Enter city or location",
        "de": "Geben Sie Stadt oder Standort ein",
        "es": "Ingresa ciudad o ubicación",
        "fr": "Entrez la ville ou la localisation",
        "it": "Inserisci città o posizione",
        "pt": "Digite cidade ou local"
    },
    "saveChanges": {
        "en": "Save Changes",
        "de": "Änderungen speichern",
        "es": "Guardar cambios",
        "fr": "Enregistrer les modifications",
        "it": "Salva modifiche",
        "pt": "Salvar alterações"
    },
    "saving": {
        "en": "Saving...",
        "de": "Speichern...",
        "es": "Guardando...",
        "fr": "Enregistrement...",
        "it": "Salvataggio...",
        "pt": "Salvando..."
    },
    "cancel": {
        "en": "Cancel",
        "de": "Abbrechen",
        "es": "Cancelar",
        "fr": "Annuler",
        "it": "Annulla",
        "pt": "Cancelar"
    },
    "backToProfile": {
        "en": "Back to Profile",
        "de": "Zurück zum Profil",
        "es": "Volver al Perfil",
        "fr": "Retour au Profil",
        "it": "Torna al Profilo",
        "pt": "Voltar ao Perfil"
    },
    "listingUpdatedSuccess": {
        "en": "Listing updated successfully!",
        "de": "Angebot erfolgreich aktualisiert!",
        "es": "¡Anuncio actualizado correctamente!",
        "fr": "Annonce mise à jour avec succès!",
        "it": "Annuncio aggiornato con successo!",
        "pt": "Anúncio atualizado com sucesso!"
    },
    "failedToLoadListing": {
        "en": "Failed to load listing",
        "de": "Angebot konnte nicht geladen werden",
        "es": "No se pudo cargar el anuncio",
        "fr": "Impossible de charger l'annonce",
        "it": "Impossibile caricare l'annuncio",
        "pt": "Falha ao carregar o anúncio"
    },
    "failedToUpdateListing": {
        "en": "Failed to update listing",
        "de": "Angebot konnte nicht aktualisiert werden",
        "es": "No se pudo actualizar el anuncio",
        "fr": "Impossible de mettre à jour l'annonce",
        "it": "Impossibile aggiornare l'annuncio",
        "pt": "Falha ao atualizar o anúncio"
    }
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

print("✓ All listing edit translation keys added!")

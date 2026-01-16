#!/usr/bin/env python3
import json

KEYS = {
    'en': {
        'earlyBirdOffer': 'Early Supporter Offer',
        'trialSavingsText': 'Save €{{amount}} for 90 days',
        'freeTrialExplainer': 'Card required, no charge until day 91. Cancel anytime before trial ends.',
    },
    'de': {
        'earlyBirdOffer': 'Early Supporter Angebot',
        'trialSavingsText': 'Sparen Sie €{{amount}} für 90 Tage',
        'freeTrialExplainer': 'Karte erforderlich, keine Kosten bis Tag 91. Jederzeit vor Ende der Testphase kündbar.',
    },
    'es': {
        'earlyBirdOffer': 'Oferta de apoyo anticipado',
        'trialSavingsText': 'Ahorra €{{amount}} durante 90 días',
        'freeTrialExplainer': 'Tarjeta requerida, sin cargo hasta el día 91. Cancela en cualquier momento antes de que termine la prueba.',
    },
    'fr': {
        'earlyBirdOffer': 'Offre de soutien anticipé',
        'trialSavingsText': 'Économisez €{{amount}} pendant 90 jours',
        'freeTrialExplainer': 'Carte requise, aucun frais jusqu\'au jour 91. Annulez à tout moment avant la fin de l\'essai.',
    },
    'it': {
        'earlyBirdOffer': 'Offerta di supporto anticipato',
        'trialSavingsText': 'Risparmia €{{amount}} per 90 giorni',
        'freeTrialExplainer': 'Carta richiesta, nessun addebito fino al giorno 91. Annulla in qualsiasi momento prima della fine della prova.',
    },
    'pt': {
        'earlyBirdOffer': 'Oferta de apoio antecipado',
        'trialSavingsText': 'Economize €{{amount}} por 90 dias',
        'freeTrialExplainer': 'Cartão necessário, sem cobrança até o dia 91. Cancele a qualquer momento antes do término do teste.',
    },
}

def add_keys(locale_code, keys):
    file_path = f'locales/{locale_code}.json'
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for key, value in keys.items():
            data[key] = value
        
        # Sort alphabetically
        sorted_data = dict(sorted(data.items()))
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(sorted_data, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Updated {locale_code}.json")
    except Exception as e:
        print(f"✗ Error with {locale_code}.json: {e}")

for locale in ['en', 'de', 'es', 'fr', 'it', 'pt']:
    add_keys(locale, KEYS[locale])

print("\n✓ All pricing clarity keys added!")

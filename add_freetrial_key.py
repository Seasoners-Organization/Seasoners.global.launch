#!/usr/bin/env python3
import json

translations = {
    "freeTrialBanner": {
        "en": "✨ 90-day free trial on all paid plans - no credit card required!",
        "de": "✨ 90-Tage kostenlose Testversion bei allen kostenpflichtigen Plänen - keine Kreditkarte erforderlich!",
        "es": "✨ Prueba gratuita de 90 días en todos los planes pagos - ¡sin tarjeta de crédito requerida!",
        "fr": "✨ Essai gratuit de 90 jours sur tous les plans payants - aucune carte de crédit requise!",
        "it": "✨ Prova gratuita di 90 giorni su tutti i piani a pagamento - nessuna carta di credito richiesta!",
        "pt": "✨ Avaliação gratuita de 90 dias em todos os planos pagos - nenhum cartão de crédito necessário!"
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

print("✓ Free trial banner translation key added!")

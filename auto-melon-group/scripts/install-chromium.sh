#!/bin/bash
echo "🚛 Installing Chromium for AutoTrader scraping..."

# Install only Chromium (what we need for AutoTrader)
npx playwright install chromium

echo "✅ Chromium installation complete!"
echo "📱 AutoTrader scraping should now work properly."
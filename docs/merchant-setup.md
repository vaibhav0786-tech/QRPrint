# Merchant Setup Guide

The installer is intentionally blocked until production integrations exist. Install Node LTS on Windows, a supported printer driver, the merchant service, and configure `PRINT_API_URL`, device credentials, and TLS trust. Run printer discovery through a real Windows adapter, require the merchant to select a printer/profile, then register the device with the API. Generate a standee only after the API creates the merchant slug. Do not expose printer ports publicly. See the deployment guide for required infrastructure.

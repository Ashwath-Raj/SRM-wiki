# Security Rules

Protected:
- .env
- .env.*
- secrets/**
- credentials/**

Never:
- commit secrets
- print API keys
- modify provider credentials without explicit user intent
- force-push
- run destructive database operations automatically
- delete cloud infrastructure automatically

Review:
- authn/authz
- input validation
- injection
- XSS
- SSRF
- IDOR
- path traversal
- unsafe deserialization
- secrets
- dependency/supply-chain risks

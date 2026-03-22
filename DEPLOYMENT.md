# InteleSalud - Deployment Guide

## Prerequisitos

- VPS Debian/Ubuntu con nginx
- Dominio `intelesalud.medicalcore.app`
- Certificado wildcard `*.medicalcore.app` o alternativa Lets Encrypt
- Proyecto Firebase con Google Sign-In habilitado
- PostgreSQL accesible desde el VPS

## Configuracion

1. Copia el archivo ejemplo:

```powershell
copy deploy_config.env.example deploy_config.env
```

2. Completa:

- `VPS_IP`
- `VPS_KEY_PATH`
- variables Firebase
- `DATABASE_URL`
- `IP_HASH_SECRET`
- `FIREBASE_AUTH_PROXY_TARGET` si usaras proxy same-site para `/__/auth`

## Firebase Auth en dominio propio

InteleSalud corre en `https://intelesalud.medicalcore.app`. Para que el redirect auth de
Firebase funcione mejor en navegadores moviles, configura el flujo sobre el mismo
dominio de la app.

Requisitos:

1. En Firebase Authentication -> Settings -> Authorized domains agrega `intelesalud.medicalcore.app`.
2. En Google Auth Platform agrega `https://intelesalud.medicalcore.app/__/auth/handler` como redirect URI autorizado.
3. En `.env.production` usa `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=intelesalud.medicalcore.app`.
4. Mantiene `FIREBASE_AUTH_PROXY_TARGET=https://TU-PROYECTO.firebaseapp.com` para que nginx reenvie `/__/auth`.

`vps_setup.sh` agrega ese bloque de nginx automaticamente si `FIREBASE_AUTH_PROXY_TARGET` existe.

## Deploy

Desde Windows:

```powershell
.\deploy.ps1
```

El script:

1. Ejecuta `npm ci`
2. Ejecuta `npx prisma generate`
3. Construye el standalone de Next.js
4. Empaqueta el build en `intelesalud_build.tar.gz`
5. Sube artefactos al VPS
6. Ejecuta `vps_setup.sh`

## Defaults operativos

- Directorio: `/var/www/intelesalud`
- Servicio systemd: `intelesalud`
- Puerto upstream: `3004`
- Dominio: `intelesalud.medicalcore.app`

## Verificacion

- `https://intelesalud.medicalcore.app`
- `sudo systemctl status intelesalud`
- `sudo nginx -t`

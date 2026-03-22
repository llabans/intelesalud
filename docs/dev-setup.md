# InteleSalud — Guia de Desarrollo Local

## Requisitos

- Node.js 18+
- SSH key para el VPS: `C:\Users\MAGNUS\.ssh\lightsail.pem`

## 1. Conectar a la Base de Datos (SSH Tunnel)

La base de datos PostgreSQL esta en el VPS. Para acceder desde tu maquina local, abre un terminal y corre:

```bash
ssh -L 5432:127.0.0.1:5432 -i "C:\Users\MAGNUS\.ssh\lightsail.pem" admin@44.235.121.195 -N
```

El terminal se queda "colgado" — eso significa que el tunel esta activo.
**Dejalo abierto** mientras desarrollas.

### Datos de conexion

| Campo    | Valor                          |
|----------|--------------------------------|
| Host     | 127.0.0.1 (via tunel SSH)      |
| Puerto   | 5432                           |
| Usuario  | intelesalud                    |
| Password | InteleSalud2026!Secure         |
| Base     | intelesalud                    |

## 2. Levantar el Servidor de Desarrollo

En otro terminal (dentro del proyecto):

```bash
npm run dev
```

Abre http://localhost:3000

## 3. Acceder al VPS por SSH

```bash
ssh -i "C:\Users\MAGNUS\.ssh\lightsail.pem" admin@44.235.121.195
```

### Comandos utiles en el VPS

```bash
# Estado de la app
sudo systemctl status intelesalud

# Logs de la app
sudo journalctl -u intelesalud -f

# Estado de PostgreSQL
sudo systemctl status postgresql

# Acceder a la base de datos directamente
psql -U intelesalud -h 127.0.0.1 -d intelesalud

# Reiniciar la app
sudo systemctl restart intelesalud
```

## 4. Desplegar a Produccion

```bash
# En el VPS:
cd /var/www/intelesalud
git pull origin main
npm ci
set -a
source .env.production
set +a
npx prisma db push
npm run build
sudo systemctl restart intelesalud
sudo systemctl reload nginx
```

### Nota importante para login movil con Firebase

En produccion, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` no debe quedarse en `drcardio-9689e.firebaseapp.com` si la app corre en `https://intelesalud.medicalcore.app`. Para que `signInWithRedirect()` funcione bien en Safari/Chrome movil:

1. En `.env.production`, usar:
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=intelesalud.medicalcore.app`
2. Mantener un proxy nginx hacia Firebase Hosting:
   - `FIREBASE_AUTH_PROXY_TARGET=https://drcardio-9689e.firebaseapp.com`
3. En Firebase Authentication -> Settings -> Authorized domains, agregar:
   - `intelesalud.medicalcore.app`
4. En Google Auth Platform / OAuth client, agregar:
   - `https://intelesalud.medicalcore.app/__/auth/handler`

## 5. Variables de Entorno

El archivo `.env` local ya tiene todo configurado:

- **Firebase Client** — API key, auth domain, project ID, app ID, measurement ID
- **Firebase Admin** — Service account JSON (una sola linea)
- **Google Calendar/Meet** — Calendar ID, service account JSON, impersonate user
- **Database** — PostgreSQL via SSH tunnel
- **Security** — IP hash secret

### Nota sobre los JSON en .env

Los valores `FIREBASE_SERVICE_ACCOUNT_KEY` y `GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY` deben estar en **una sola linea**. Si necesitas regenerarlos:

```bash
# Convertir JSON multilinea a una sola linea
cat archivo.json | tr -d '\n'
```

## 6. Servicios Externos

| Servicio | Consola | Cuenta |
|----------|---------|--------|
| Firebase | console.firebase.google.com | luis@llabans... (admin@medicalcore.app como editor) |
| Google Cloud (Calendar) | console.cloud.google.com | admin@medicalcore.app |
| Google Workspace | admin.google.com | admin@medicalcore.app |
| VPS (Lightsail) | lightsail.aws.amazon.com | luis@llabans... |

## 7. Flujo de Meetings (Google Meet)

1. Paciente reserva cita → estado `PENDING`
2. Paciente paga por Plin y sube comprobante → `AWAITING_CONFIRMATION`
3. Admin/especialista aprueba el voucher → `CONFIRMED`
4. Automaticamente se crea evento en Google Calendar con enlace Google Meet
5. Paciente ve el enlace en su portal de confirmacion

El codigo que genera el Meet esta en `lib/payment/plinPaymentService.js` lineas 129-166.

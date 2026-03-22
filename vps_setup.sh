#!/usr/bin/env bash

set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
    echo "This script must run as root."
    exit 1
fi

APP_BASE_DIR="${APP_BASE_DIR:-/var/www/intelesalud}"
APP_DIR="${APP_DIR:-$APP_BASE_DIR/current}"
APP_USER="${APP_USER:-admin}"
APP_GROUP="${APP_GROUP:-$APP_USER}"
DOMAIN="${DOMAIN:-}"
APP_PORT="${APP_PORT:-3004}"
SERVICE_NAME="${SERVICE_NAME:-intelesalud}"
NGINX_SITE_NAME="${NGINX_SITE_NAME:-$SERVICE_NAME}"
SSL_MODE="${SSL_MODE:-cloudflare_origin}"
SSL_CERT_PATH="${SSL_CERT_PATH:-}"
SSL_KEY_PATH="${SSL_KEY_PATH:-}"
ENV_FILE_PATH="${ENV_FILE_PATH:-$APP_BASE_DIR/shared/intelesalud.env}"
FIREBASE_AUTH_PROXY_TARGET="${FIREBASE_AUTH_PROXY_TARGET:-}"

if [ -z "$DOMAIN" ]; then
    echo "DOMAIN is required."
    exit 1
fi

if [ ! -d "$APP_DIR" ]; then
    echo "APP_DIR does not exist: $APP_DIR"
    exit 1
fi

install_if_missing() {
    local missing=()
    local package

    for package in "$@"; do
        if ! dpkg -s "$package" >/dev/null 2>&1; then
            missing+=("$package")
        fi
    done

    if [ "${#missing[@]}" -gt 0 ]; then
        apt-get update -y
        DEBIAN_FRONTEND=noninteractive apt-get install -y "${missing[@]}"
    fi
}

install_node_if_missing() {
    if command -v node >/dev/null 2>&1; then
        echo "Node.js already installed: $(node --version)"
        return
    fi

    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo "Node.js installed: $(node --version)"
}

resolve_ssl_paths() {
    case "$SSL_MODE" in
        cloudflare_origin)
            if [ -z "$SSL_CERT_PATH" ] || [ -z "$SSL_KEY_PATH" ]; then
                echo "SSL_CERT_PATH and SSL_KEY_PATH are required for cloudflare_origin mode."
                exit 1
            fi
            ;;
        letsencrypt)
            SSL_CERT_PATH="${SSL_CERT_PATH:-/etc/letsencrypt/live/$DOMAIN/fullchain.pem}"
            SSL_KEY_PATH="${SSL_KEY_PATH:-/etc/letsencrypt/live/$DOMAIN/privkey.pem}"
            if [ ! -f "$SSL_CERT_PATH" ] || [ ! -f "$SSL_KEY_PATH" ]; then
                echo "Let's Encrypt certificate files were not found for $DOMAIN."
                exit 1
            fi
            ;;
        none)
            ;;
        *)
            echo "Unsupported SSL_MODE: $SSL_MODE"
            exit 1
            ;;
    esac
}

write_systemd_service() {
    cat >"/etc/systemd/system/${SERVICE_NAME}.service" <<EOF
[Unit]
Description=InteleSalud Next.js service
After=network.target

[Service]
User=$APP_USER
Group=$APP_GROUP
WorkingDirectory=$APP_DIR/.next/standalone
EnvironmentFile=$ENV_FILE_PATH
ExecStart=/usr/bin/node server.js
Environment=PORT=$APP_PORT
Environment=HOSTNAME=127.0.0.1
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
}

write_nginx_site() {
    local nginx_site_path="/etc/nginx/sites-available/${NGINX_SITE_NAME}"
    local firebase_auth_proxy_block=""

    if [ -n "$FIREBASE_AUTH_PROXY_TARGET" ]; then
        local firebase_auth_proxy_host
        firebase_auth_proxy_host="$(printf '%s' "$FIREBASE_AUTH_PROXY_TARGET" | sed -E 's#https?://([^/]+)/?.*#\1#')"

        firebase_auth_proxy_block=$(cat <<EOF
    location /__/auth {
        proxy_pass $FIREBASE_AUTH_PROXY_TARGET;
        proxy_http_version 1.1;
        proxy_set_header Host $firebase_auth_proxy_host;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_ssl_server_name on;
        proxy_buffering off;
    }

EOF
)
    fi

    case "$SSL_MODE" in
        none)
            cat >"$nginx_site_path" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    client_max_body_size 10m;

$firebase_auth_proxy_block
    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 90;
    }
}
EOF
            ;;
        cloudflare_origin | letsencrypt)
            cat >"$nginx_site_path" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate $SSL_CERT_PATH;
    ssl_certificate_key $SSL_KEY_PATH;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    client_max_body_size 10m;

$firebase_auth_proxy_block
    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port 443;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 90;
    }

    location /_next/static/ {
        alias $APP_DIR/.next/static/;
        expires 365d;
        access_log off;
    }
}
EOF
            ;;
    esac

    ln -sfn "$nginx_site_path" "/etc/nginx/sites-enabled/${NGINX_SITE_NAME}"
}

echo "Installing runtime dependencies if needed..."
install_if_missing nginx
install_node_if_missing
resolve_ssl_paths

mkdir -p "$APP_BASE_DIR/shared" "$APP_BASE_DIR/releases"

if [ -d "$APP_DIR/.next/static" ]; then
    cp -r "$APP_DIR/.next/static" "$APP_DIR/.next/standalone/.next/static"
fi

if [ -d "$APP_DIR/public" ]; then
    cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/public"
fi

mkdir -p "$APP_DIR/.next/standalone/public/uploads/vouchers"

if [ -d "$APP_DIR/prisma" ]; then
    cd "$APP_DIR"
    npx prisma migrate deploy 2>/dev/null || echo "Prisma migrations skipped (no pending migrations or first deploy)"
fi

if [ ! -f "$ENV_FILE_PATH" ]; then
    cat >"$ENV_FILE_PATH" <<EOF
NEXT_PUBLIC_APP_URL=https://$DOMAIN
DATABASE_URL=file:$APP_BASE_DIR/shared/intelesalud.db
EOF
fi

chown -R "$APP_USER:$APP_GROUP" "$APP_BASE_DIR"
chmod 640 "$ENV_FILE_PATH"
chown root:"$APP_GROUP" "$ENV_FILE_PATH"

write_systemd_service
write_nginx_site

systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

if command -v nginx >/dev/null 2>&1; then
    nginx -t
else
    /usr/sbin/nginx -t
fi

systemctl reload nginx

echo ""
echo "InteleSalud service deployed."
echo "Service: $SERVICE_NAME"
echo "Domain: $DOMAIN"
echo "Upstream: 127.0.0.1:$APP_PORT"

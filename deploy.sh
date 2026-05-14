#!/bin/bash
set -e

# ---- Cores ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ---- Configurações ----
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"
APP_DIR="$(dirname "$0")"

# ---- Validação ----
cd "$APP_DIR"

if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ Arquivo $ENV_FILE não encontrado! Abortando deploy.${NC}"
  exit 1
fi

echo -e "${YELLOW}🚀 Iniciando deploy do Frontend em $(date)${NC}"

# ---- 1. Atualizar código ----
echo -e "${YELLOW}📦 Puxando código mais recente do GitHub...${NC}"
git pull origin main

# ---- 2. Build e Deploy ----
echo -e "${YELLOW}🔨 Construindo e iniciando o container do Frontend...${NC}"
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d --build

# ---- 3. Limpeza de imagens antigas ----
echo -e "${YELLOW}🧹 Limpando imagens antigas não utilizadas...${NC}"
docker image prune -f

# ---- 4. Status final ----
echo -e "${YELLOW}📊 Status dos containers:${NC}"
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE ps

echo -e "${GREEN}✅ Deploy do Frontend finalizado com sucesso em $(date)${NC}"

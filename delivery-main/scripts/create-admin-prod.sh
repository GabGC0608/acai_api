#!/bin/bash

# Script para criar admin via API em produção
# Uso: ./create-admin-prod.sh

echo "🔐 Criar Admin em Produção"
echo "================================"
echo ""

read -p "URL da aplicação (ex: https://flour-yrs-collections-recording.trycloudflare.com): " APP_URL
read -p "Secret do admin (ADMIN_SECRET): " ADMIN_SECRET
read -p "Email do admin: " EMAIL
read -p "Nome do admin: " NAME
read -sp "Senha do admin: " PASSWORD
echo ""

RESPONSE=$(curl -s -X POST "$APP_URL/api/create-admin" \
  -H "Content-Type: application/json" \
  -d "{
    \"secret\": \"$ADMIN_SECRET\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"name\": \"$NAME\"
  }")

echo ""
echo "Resposta: $RESPONSE"
echo ""
echo "✅ Admin criado! Agora remova o endpoint /api/create-admin"

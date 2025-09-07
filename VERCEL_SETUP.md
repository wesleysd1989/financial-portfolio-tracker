# 🚀 Configuração para Deploy na Vercel

## ✅ Correções Aplicadas

### 1. **Scripts do package.json atualizados**

- ✅ `"build": "prisma generate && next build --turbopack"`
- ✅ `"postinstall": "prisma generate"`

### 2. **Variáveis de Ambiente na Vercel**

Configure estas variáveis no dashboard da Vercel:

#### **DATABASE_URL** (obrigatória)

```
postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?schema=public&pgbouncer=true&connection_limit=1&pool_timeout=20&connect_timeout=10
```

**⚠️ IMPORTANTE:** 
- Substitua `YOUR_PASSWORD` e `YOUR_PROJECT_REF` pelos valores reais do seu projeto Supabase
- Para melhor performance, use **Supavisor Transaction Mode** (porta 6543):
```
postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

#### **NODE_ENV** (recomendada)

```
production
```

## 🔧 **Parâmetros Otimizados para Vercel**

- `pgbouncer=true` - Compatibilidade com Supavisor
- `connection_limit=1` - Ideal para serverless
- `pool_timeout=20` - Timeout otimizado para Vercel

## 📝 **Passos para Deploy**

1. ✅ Commit e push das mudanças no package.json
2. ✅ Configurar DATABASE_URL na Vercel
3. ✅ Fazer novo deploy

## 🎯 **Por que estava falhando?**

- Vercel não executava `prisma generate` automaticamente
- Cache de dependências causava cliente Prisma desatualizado
- Connection string não otimizada para ambiente serverless

## 🔒 **Segurança**

### **⚠️ NUNCA faça:**

- ❌ Commit de credenciais no código
- ❌ Hardcode de senhas nos arquivos
- ❌ Compartilhamento de connection strings

### **✅ SEMPRE faça:**

- ✅ Use variáveis de ambiente na Vercel
- ✅ Configure DATABASE_URL no dashboard da Vercel
- ✅ Mantenha credenciais apenas no .env local (não commitado)

## 🔧 **Troubleshooting Error 500**

Se você receber erro 500 nas APIs, siga estes passos:

### 1. **Testar Diagnóstico**
Acesse: `https://seu-app.vercel.app/api/health`

### 2. **Verificar Logs da Vercel**
- Dashboard → Functions → View Function Logs
- Procure por erros de conexão com banco

### 3. **Verificar DATABASE_URL**
- Certifique-se que está configurada na Vercel
- Use os parâmetros otimizados acima
- Teste com Supavisor Transaction Mode se disponível

### 4. **Soluções Comuns**
- ✅ `pgbouncer=true` (obrigatório)
- ✅ `connection_limit=1` (ideal para serverless)
- ✅ `connect_timeout=10` (evita timeouts)
- ✅ Use porta 6543 (Transaction Mode) quando possível

## ✨ **Resultado Esperado**

Com essas correções, o build na Vercel deve funcionar perfeitamente!

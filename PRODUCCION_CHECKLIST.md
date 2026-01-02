# Checklist de Despliegue a Producción

Esta guía detalla los pasos para llevar AresGym a un entorno productivo (Vercel o Netlify).

## Pre-requisitos
- [ ] Repositorio (GitHub/GitLab) conectado.
- [ ] Archivos de entorno configurados (si aplica).

## 1. Verificación Local
- [ ] Ejecutar `npm install` para asegurar todas las dependencias.
- [ ] Ejecutar `npm run build` y verificar que no hay errores de TypeScript o ESLint.
- [ ] Ejecutar `npm start` y probar la generación de rutinas "smoke test".

## 2. Configuración en Vercel/Netlify
- [ ] **Framework Preset**: Next.js
- [ ] **Build Command**: `next build` (o `npm run build`)
- [ ] **Output Directory**: `.next` (Vercel lo detecta automático)
- [ ] **Variables de Entorno**: (Ninguna requerida actualmente)

## 3. Post-Despliegue
- [ ] Verificar que la carga de estilos Tailwind funciona (a veces se purgan incorrectamente si `content` en `tailwind.config.js` está mal, pero ya fue verificado).
- [ ] Probar la herramienta en móvil para confirmar la responsividad.

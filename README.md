# Huella Vet

Aplicación web para una clínica veterinaria con presencia pública y panel de administración.

La plataforma está pensada para mostrar servicios, captar citas de clientes y permitir a la administración gestionar mascotas, servicios y citas desde un dashboard interno.

## ✨ Características

- Landing page pública con presentación de la clínica
- Sección de servicios destacados y precios
- Formulario de cita para clientes
- Confirmación de cita con resumen previo a la validación
- Panel administrativo para:
  - ver citas
  - gestionar mascotas
  - administrar servicios
  - revisar dashboard de resumen
- Diseño moderno y responsive con componentes reutilizables

## 🐾 Proyecto

Este proyecto está enfocado en una veterinaria para mascotas, con una experiencia de usuario clara y un flujo de administración sencillo para gestionar el negocio desde un mismo lugar.

El repositorio incluye dos grandes áreas:

- Frontend público: presentación de la clínica, servicios y solicitud de citas
- Admin: gestión interna del negocio, citas y catálogo de servicios

## 🧩 Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- App Router de Next.js

## 📁 Estructura principal

```bash
src/
├── app/
│   ├── (public)                 # Página pública
│   ├── admin                   # Panel administrativo
│   └── layout.tsx
├── components/                 # Componentes reutilizables
├── lib/
│   ├── services/               # Servicios mock / lógica de negocio
│   ├── supabase/               # Integración de Supabase
│   ├── types/                  # Tipos TypeScript
│   └── validations/            # Validaciones
├── styles/
│   └── globals.css
└── proxy.ts
```

## 🚀 Requisitos

- Node.js 18 o superior
- npm o pnpm

## 🔧 Instalación

```bash
npm install
```

## ▶️ Ejecutar en local

```bash
npm run dev
```

Abre la aplicación en:

```bash
http://localhost:3000
```

## 🏗️ Scripts

Puedes usar estos comandos básicos:

```bash
npm run dev     # iniciar modo desarrollo
npm run build   # compilar para producción
npm run start   # servir la versión build
npm run lint    # comprobar calidad del código
```

## 🔐 Variables de entorno

Si el proyecto se conecta a Supabase o servicios externos, configura un archivo `.env.local` con variables como:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
```

> El repositorio actual incluye datos de ejemplo y servicios simulados en algunas partes del proyecto, por lo que puede requerir ajustes cuando se conecte a backend real.

## 📌 Estado del proyecto

Este proyecto está en desarrollo y tiene un enfoque de MVP para clínica veterinaria, con funcionalidades clave listas para presentación y una base sólida para expandir el sistema con autenticación real, base de datos y flujo completo de reservas.

## 👤 Autor

Proyecto desarrollado por @irojoshe.

## 📝 Nota

La información de negocio y algunos servicios están actualmente modelados como datos locales dentro de la aplicación, idealmente para ser reemplazados por una base de datos real o Supabase en fases posteriores del proyecto.

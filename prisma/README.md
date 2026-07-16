# Base de datos — ALTERNA

PostgreSQL portable vía **Prisma**. Funciona con Neon, Railway, Supabase, AWS RDS o Postgres local.

## 1. Crear base en Neon

1. [https://neon.tech](https://neon.tech) → nuevo proyecto
2. Copiar la connection string (`postgresql://...?sslmode=require`)
3. Pegar en `PAGINA WEB/.env.local`:

```env
DATABASE_URL="postgresql://USER:PASS@HOST/DB?sslmode=require"
```

## 2. Aplicar schema y datos iniciales

```bash
cd "PAGINA WEB"
npm install
npm run db:push      # crea tablas (desarrollo)
npm run db:seed      # carga roles, deportes, mapa, historias
```

Para migraciones versionadas en producción:

```bash
npm run db:migrate   # crea y aplica migración
```

## 3. Verificar conexión

- API: [http://localhost:3000/api/health/database](http://localhost:3000/api/health/database)
- UI: sección «Deportes destacados» en la home (datos desde DB)
- Prisma Studio: `npm run db:studio`

## Modelos incluidos

`Rol`, `Usuario`, `Ciudad`, `Categoria`, `Deporte`, `Historia`, `Ubicacion`, `Comentario`, `Multimedia`, `Podcast`, `Documental`, `Evento`, `Favorito`, `ContactoMensaje`, `AuditLog`

Soft delete: campo `deletedAt` en entidades principales.

## Migrar de Neon a otro proveedor

Solo cambiá `DATABASE_URL` en el entorno. El schema Prisma es PostgreSQL estándar.

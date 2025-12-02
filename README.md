# Casa Funko Manizales 🕹️👾

Una plataforma de comercio electrónico moderna con estética **Vaporwave/Retro-Futurista** para la venta de figuras Funko Pop.

![Casa Funko Banner](/public/logo.png)

## 🚀 Características

### 🛒 Tienda Pública
- **Catálogo Visual**: Diseño inmersivo con colores neón (Magenta/Cyan) y modo oscuro.
- **Carrito de Compras**: Funcionalidad completa de carrito persistente.
- **Blog**: Sección de artículos para la comunidad.
- **Diseño Responsivo**: Optimizado para móviles y escritorio.

### 🔐 Panel de Administración (`/admin`)
- **Dashboard Unificado**: Acceso centralizado a productos y blog.
- **Gestión de Productos**:
  - Crear nuevos productos con imágenes.
  - **Edición Completa**: Modificar precio, stock, nombre e imágenes.
  - **Borrado Masivo**: Eliminar múltiples productos a la vez con confirmación de seguridad.
- **Gestión de Blog**: Crear y editar artículos con editor de texto enriquecido.
- **Seguridad**: Protección de rutas y acciones mediante Supabase RLS.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) + CSS Modules
- **Base de Datos**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Almacenamiento**: Supabase Storage (para imágenes de productos)
- **Lenguaje**: TypeScript

## ⚙️ Configuración Local

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/casa-funko-manizales.git
    cd casa-funko-manizales
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Variables de Entorno**:
    Crea un archivo `.env.local` en la raíz del proyecto con las siguientes claves de tu proyecto Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
    SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
    ```

4.  **Correr el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

5.  **Abrir en el navegador**:
    - Tienda: [http://localhost:3000](http://localhost:3000)
    - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📦 Base de Datos (Supabase)

El proyecto requiere dos tablas principales: `products` y `posts`. Asegúrate de aplicar las políticas RLS (Row Level Security) incluidas en la carpeta `supabase/` para garantizar la seguridad.

- `supabase/products.sql`: Definición y políticas para productos.
- `supabase/posts.sql`: Definición y políticas para el blog.

## 🎨 Estética

El diseño sigue una línea **Vaporwave/Cyberpunk**:
- **Fondo**: Dark (`#0a0a0a`)
- **Acentos**: Magenta (`#ff006e`) y Cyan (`#00f3ff`)
- **Tipografía**: Fuentes modernas y legibles.

---
Hecho con 💜 en Manizales, Colombia.

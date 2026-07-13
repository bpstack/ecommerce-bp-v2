This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🏗️ Arquitectura del Sistema Completo

### **Backend (Strapi):**

```
Content-Types:
├── User (extendido) ✅
│   ├── email
│   ├── password (hash)
│   ├── role (admin/customer)
│   ├── phone
│   ├── addresses (relation)
│   └── orders (relation)
│
├── Address 📍
│   ├── street
│   ├── city
│   ├── state
│   ├── zipCode
│   ├── country
│   ├── isDefault (boolean)
│   └── user (relation)
│
├── Order 📦
│   ├── orderNumber (unique)
│   ├── user (relation)
│   ├── status (enum: pending/processing/shipped/delivered)
│   ├── shippingAddress (relation to Address)
│   ├── orderItems (relation)
│   ├── subtotal
│   ├── tax
│   ├── shipping
│   ├── total
│   ├── paymentMethod
│   └── createdAt
│
└── OrderItem 📋
    ├── order (relation)
    ├── product (relation)
    ├── quantity
    ├── priceAtPurchase
    └── subtotal
```

---

## 🔐 Sistema de Autenticación

### **Strapi incluye:**

- ✅ JWT tokens automático
- ✅ Register endpoint: `/api/auth/local/register`
- ✅ Login endpoint: `/api/auth/local`
- ✅ Roles & Permissions integrados

### **Frontend (Next.js):**

- Página `/register` - Formulario completo
- Página `/login` - Autenticación
- Contexto AuthContext - Manejo de sesión
- Protected routes - Solo autenticados

---

## 👥 Roles y Permisos

### **Customer (Usuario normal):**

- ✅ Ver productos
- ✅ Agregar al carrito
- ✅ Hacer checkout
- ✅ Ver sus propios pedidos
- ✅ Actualizar su perfil/direcciones
- ❌ NO ve pedidos de otros

### **Admin:**

- ✅ Todo lo que puede hacer Customer
- ✅ Ver TODOS los pedidos
- ✅ Actualizar estado de pedidos
- ✅ Ver estadísticas
- ✅ Gestionar productos (opcional)

---

## 📦 Flujo del Sistema

### **1. Usuario se registra:**

```
Frontend → POST /api/auth/local/register
{
  username: "john",
  email: "john@example.com",
  password: "***",
  phone: "+34 600 000 000"
}
← JWT token
```

### **2. Usuario agrega dirección:**

```
Frontend → POST /api/addresses
{
  street: "Calle Mayor 123",
  city: "Girona",
  state: "Cataluña",
  zipCode: "17001",
  country: "España",
  isDefault: true
}
```

### **3. Usuario hace checkout:**

```
Frontend → POST /api/orders
{
  shippingAddress: addressId,
  orderItems: [
    { product: productId, quantity: 2, priceAtPurchase: 1090 }
  ],
  subtotal: 2180,
  tax: 218,
  shipping: 500,
  total: 2898
}
← Order creada con orderNumber
```

### **4. Admin ve todos los pedidos:**

```
Admin Panel → GET /api/orders?populate=*
← Lista completa de pedidos con usuario y dirección
```

---

## 🎨 Páginas a Crear

### **Frontend:**

```
pages/
├── /register           # Formulario completo de registro
├── /login              # Login
├── /account
│   ├── /profile        # Datos personales
│   ├── /addresses      # Gestionar direcciones
│   └── /orders         # Mis pedidos
├── /checkout           # Proceso de compra
├── /order-confirmation # Pedido realizado
└── /admin
    ├── /orders         # Ver todos (solo admin)
    └── /dashboard      # Estadísticas (solo admin)
```

---

## ⚡ Ventajas de esta arquitectura

1. ✅ **Carrito persiste**: Si user cierra sesión, carrito se guarda
2. ✅ **Histórico completo**: Todos los pedidos en base de datos
3. ✅ **Multi-dirección**: Usuario puede tener varias direcciones
4. ✅ **Roles escalables**: Fácil agregar "warehouse", "delivery", etc
5. ✅ **Auditoría**: Fecha/hora de cada pedido
6. ✅ **Reportes**: Ventas por día/mes/año

---

## 📋 Plan de Implementación

### **Fase 1: Autenticación (2-3 días)**

1. Configurar Strapi Auth
2. Crear páginas login/register
3. AuthContext en Next.js
4. Protected routes

### **Fase 2: Perfil y Direcciones (2 días)**

5. Crear Content-Type Address
6. Páginas de gestión de direcciones
7. Formulario de perfil

### **Fase 3: Sistema de Pedidos (3-4 días)**

8. Crear Content-Types Order y OrderItem
9. Página de checkout
10. Integrar con Strapi API

### **Fase 4: Panel Admin (2 días)**

11. Página admin/orders
12. Filtros y búsqueda
13. Actualizar estado de pedidos

### **Total: 9-11 días de trabajo**

---

## 🤔 ¿Empezamos ahora o más adelante?

**Opción A:** Continuar con el carrito drawer ahora, dejar auth para después  
**Opción B:** Empezar con el sistema de auth AHORA (más profesional)  
**Opción C:** Dejar todo para la próxima sesión y hacer commit del progreso actual

---

**¿Qué prefieres hacer?** 🚀

Personalmente recomiendo **Opción A** (terminar carrito básico) y luego en próximas sesiones hacemos el sistema completo de auth + pedidos.

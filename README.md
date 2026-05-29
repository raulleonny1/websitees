# Escuela Sabática — Landing Page

Landing page informativa de la PWA **Escuela Sabática**, con simulador interactivo de sincronización en tiempo real vía Firebase Firestore.

**Aplicación PWA:** [https://escuelasabatica-sable.vercel.app/](https://escuelasabatica-sable.vercel.app/)

## Estructura del proyecto

```
web-site-es/
├── index.html              # Landing page principal
├── js/
│   ├── firebase-config.js  # Credenciales Firebase (no subir claves reales a repos públicos)
│   ├── firebase-config.example.js
│   ├── simulator.js        # Simulador Maestro → Alumno con Firestore
│   └── main.js             # Menú móvil, pestañas PWA, toggle privacidad
├── firebase.json           # Hosting + Firestore rules
├── firestore.rules
└── vercel.json             # Despliegue en Vercel
```

## Inicio rápido (local)

```bash
npm start
```

Abre [http://localhost:3000](http://localhost:3000).

## Configurar Firebase (simulador en tiempo real)

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com).
2. Activa **Firestore Database** (modo producción o prueba).
3. Registra una app Web y copia la configuración.
4. Edita `js/firebase-config.js`:

```javascript
window.FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

5. Despliega las reglas de Firestore:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

El simulador escribe en `landing_simulator/demo`. Si abres la landing en dos navegadores, los cambios del panel **Maestro** se reflejan al instante en el panel **Alumno**.

> Sin Firebase configurado, el simulador funciona en **modo local** (misma pestaña).

## Desplegar

### Vercel (recomendado)

1. Sube el repo a GitHub.
2. Importa el repositorio en [vercel.com](https://vercel.com).
3. Despliega — es un sitio estático, no requiere build.

### Firebase Hosting

```bash
firebase deploy --only hosting
```

### GitHub Pages

Activa Pages en el repo con origen **main** / carpeta raíz (`/`).

## Enlaces de la app

Todos los botones **Iniciar Aplicación** / **Abrir Aplicación** apuntan a:

`https://escuelasabatica-sable.vercel.app`

## Licencia

Proyecto de apoyo pedagógico independiente. El material de lecciones pertenece a la Asociación General de la Iglesia Adventista del Séptimo Día.

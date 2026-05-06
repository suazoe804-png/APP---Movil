# HelpDesk TI Móvil
Una aplicación móvil (Android) para el registro y seguimiento de solicitudes de soporte técnico.

## 📋 Resumen Ejecutivo y Objetivo
El proyecto **HelpDesk TI Móvil** tiene como objetivo dotar a una organización de una herramienta moderna y eficiente para el levantamiento de incidencias técnicas. Sustituye medios dispersos como llamadas o correos por un flujo centralizado, organizado y móvil con persistencia de datos en la nube (Firebase).

## 🛠 Stack Tecnológico
- **Frontend / Móvil**: React Native con Expo
- **Navegación**: React Navigation v7
- **Base de Datos**: Firebase Cloud Firestore
- **Autenticación**: Firebase Auth (Autenticación Anónima para validar IDs de usuario temporalmente)
- **Lenguaje**: TypeScript


## 🗂 Estructura de Carpetas
```text
/
├── App.tsx                    # Punto de entrada principal para Expo
├── app.json                   # Configuración del proyecto en Expo y EAS
├── firebase-applet-config.json# Archivo local inyectado con los datos de Firebase
├── firebase-blueprint.json    # Definición del esquema (blueprint)
├── firestore.rules            # Reglas de seguridad aplicadas a la DB
├── metro.config.js            # Extensión para compatibilidad cjs con Firestore
├── package.json               # Dependencias y scripts
├── tailwind.config.js / vite..# Archivos base de AI Studio previos (ignorar para Android)
├── src/
│   ├── App.tsx                # Rutas y configuración de navegadores
│   ├── types/                 # Definiciones de TypeScript (ej. interface Solicitud)
│   ├── services/
│   │   ├── firebase.ts          # Inicialización de Firebase
│   │   └── solicitudesService.ts# Lógica CRUD contra Firestore
│   └── screens/               # Pantallas (Home, Form, List, Detail, Help)
```

## ⚙️ Requisitos Previos
1. Node.js Instalado (v18+)
2. Git Instalado
3. Cuenta en [Google Firebase](https://console.firebase.google.com/)
4. Expo Go app instalada en tu teléfono Android O un emulador de Android configurado.
5. Herramienta EAS CLI para compilar el APK (`npm install -g eas-cli`)


## 💻 Instalación y Ejecución Local
1. `npm install` (Instala todas las dependencias del proyecto).
2. `npm run dev` (En general de React Native arranca la versión local o Expo).
3. Específicamente con Expo: Usa el comando `npx expo start` y escanea el código QR con **Expo Go** en Android.

## 📱 Cómo correr en Expo Go
1. Instala Expo Go desde la Google Play Store.
2. Corre en la terminal del proyecto `npx expo start`.
3. Abre Expo Go, asegúrate que estás en la misma red Wi-Fi y escanea el código QR en pantalla.

## 📦 Cómo compilar el Proyecto para APK y Android
Este proyecto está preparado para generar un APK standalone.

1. Instala EAS CLI:
   `npm install -g eas-cli`
2. Inicia sesión en Expo:
   `eas login`
3. Configura el build de EAS (el proyecto incluye `app.json` válido para Android):
   Escribe en terminal: `eas build:configure` (Selecciona Android).
4. Crea el perfil de compilación modificando el archivo generado `eas.json` para que genere formato APK en tu entorno `preview`:
   ```json
   {
     "build": {
       "preview": {
         "android": { "buildType": "apk" }
       }
     }
   }
   ```
5. **Comando Concreto para generar APK Android**:
   `eas build -p android --profile preview`
6. Espera a que termine en los servidores de Expo y descarga tu archivo `.apk`.

## 🗄 Explicación del CRUD
- **Create**: En `FormScreen.tsx`, al presionar "GUARDAR SOLICITUD", se llama a `createSolicitud` generando un ID único, insertando el timestamp y estado `Pendiente`.
- **Read**: En `ListScreen.tsx`, se obtiene la lista de toda la colección `solicitudes` ordenada por `fechaCreacion` descendiente y en `DetailScreen.tsx` se filtra el documento en curso.
- **Update**: En `FormScreen.tsx`, al editar un ticket, la función `updateSolicitud` altera la BD y modifica el campo `fechaActualizacion` del documento.
- **Delete**: En `DetailScreen.tsx`, el botón rojo invoca `deleteSolicitud`. Sólo el autor del ticket puede borrarlo de acuerdo a las Reglas de Firestore, pero a nivel usuario se pide confirmación primero en interfaz.

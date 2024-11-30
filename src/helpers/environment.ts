// Déterminer l'environnement de manière dynamique
const isProd = true;
  
  // Configurer l'environnement
  export const ENV = {
    mode: isProd ? 'production' : 'development',
  };
  
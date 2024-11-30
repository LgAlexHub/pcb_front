// Déterminer l'environnement de manière dynamique
const isDenoDeployEnvironment = () => {
    try {
      // Vérifier des propriétés spécifiques à Deno Deploy
      return (Deno.env.get('DENO_DEPLOYMENT_ID') !== undefined);
    } catch {
      return false;
    }
  };
  
  // Configurer l'environnement
  export const ENV = {
    mode: isDenoDeployEnvironment() ? 'production' : 'development',
  };
  
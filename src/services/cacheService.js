// Servicio de caché para almacenar peticiones por 1 día
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 día en milisegundos
const CACHE_KEY_PREFIX = "deuda_cache_";

// Generar clave única para cada petición
const generateCacheKey = (sector, referencia, emision, fecha) => {
  return `${CACHE_KEY_PREFIX}${sector}_${referencia}_${emision}_${fecha}`;
};

// Guardar en caché
export const saveToCache = (sector, referencia, emision, fecha, data) => {
  try {
    const cacheKey = generateCacheKey(sector, referencia, emision, fecha);
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION,
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`✅ Datos guardados en caché: ${cacheKey}`);
  } catch (error) {
    console.error("Error al guardar en caché:", error);
  }
};

// Obtener del caché
export const getFromCache = (sector, referencia, emision, fecha) => {
  try {
    const cacheKey = generateCacheKey(sector, referencia, emision, fecha);
    const cachedItem = localStorage.getItem(cacheKey);

    if (!cachedItem) {
      console.log(`❌ No hay datos en caché para: ${cacheKey}`);
      return null;
    }

    const cacheData = JSON.parse(cachedItem);
    const now = Date.now();

    // Verificar si el caché expiró
    if (now > cacheData.expiresAt) {
      console.log(`⏰ Caché expirado para: ${cacheKey}`);
      localStorage.removeItem(cacheKey);
      return null;
    }

    console.log(`✅ Datos recuperados del caché: ${cacheKey}`);
    return cacheData.data;
  } catch (error) {
    console.error("Error al obtener del caché:", error);
    return null;
  }
};

// Limpiar caché expirado (opcional, para mantener limpio el localStorage)
export const clearExpiredCache = () => {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    let cleared = 0;

    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        try {
          const cacheData = JSON.parse(localStorage.getItem(key));
          if (now > cacheData.expiresAt) {
            localStorage.removeItem(key);
            cleared++;
          }
        } catch  {
          localStorage.removeItem(key);
          cleared++;
        }
      }
    });

    if (cleared > 0) {
      console.log(`🧹 Se limpiaron ${cleared} entradas de caché expiradas`);
    }
  } catch (error) {
    console.error("Error al limpiar caché:", error);
  }
};

// Limpiar todo el caché de deuda
export const clearAllCache = () => {
  try {
    const keys = Object.keys(localStorage);
    let cleared = 0;

    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
        cleared++;
      }
    });

    console.log(`🧹 Se limpiaron ${cleared} entradas del caché`);
  } catch (error) {
    console.error("Error al limpiar todo el caché:", error);
  }
};

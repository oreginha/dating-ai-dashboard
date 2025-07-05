/**
 * Localización en español para el Dating AI Dashboard
 * Textos, mensajes y descripciones en español argentino
 */

export const es = {
  // Navegación principal
  nav: {
    dashboard: "Panel Principal",
    discovery: "Descubrimiento",
    conversations: "Conversaciones", 
    opportunities: "Oportunidades",
    autoResponse: "Respuestas Auto",
    analytics: "Analytics"
  },

  // Dashboard principal
  dashboard: {
    title: "Dating AI Agent - Panel de Control",
    subtitle: "Tu asistente de IA personalizado para optimizar tu vida romántica",
    
    stats: {
      profilesAnalyzed: "Perfiles Analizados",
      avgCompatibility: "Compatibilidad Promedio",
      activeConversations: "Conversaciones Activas",
      successRate: "Tasa de Éxito"
    },

    quickActions: {
      title: "Acciones Rápidas",
      analyzeProfile: "Analizar Perfil",
      viewProfiles: "Ver Perfiles",
      checkOpportunities: "Ver Oportunidades",
      generateStrategy: "Generar Estrategia"
    },

    recentActivity: {
      title: "Actividad Reciente",
      noActivity: "No hay actividad reciente",
      profileAnalyzed: "Perfil analizado",
      strategyGenerated: "Estrategia generada",
      messagesSent: "Mensajes enviados"
    }
  },

  // Análisis de perfiles
  discovery: {
    title: "Descubrimiento de Perfiles",
    subtitle: "Analiza perfiles de Instagram para encontrar matches compatibles",
    
    form: {
      urlPlaceholder: "https://instagram.com/usuario",
      analyzeButton: "Analizar Perfil",
      enhancedAnalysis: "Análisis Avanzado",
      enhancedHelp: "Incluye análisis multi-tier y predicción de éxito"
    },

    results: {
      analyzing: "Analizando perfil...",
      success: "¡Perfil analizado exitosamente!",
      error: "Error al analizar el perfil",
      
      profileInfo: "Información del Perfil",
      compatibilityScore: "Score de Compatibilidad",
      successProbability: "Probabilidad de Éxito",
      recommendations: "Recomendaciones",
      
      tierBreakdown: "Desglose por Categorías",
      coreValues: "Valores Centrales",
      socialPatterns: "Patrones Sociales", 
      interests: "Intereses",
      communication: "Comunicación"
    },

    tips: {
      title: "💡 Consejos para Mejores Resultados",
      publicProfile: "Usa perfiles públicos para mejores resultados",
      completeUrl: "Incluye la URL completa de Instagram",
      waitAnalysis: "El análisis puede tardar 30-60 segundos",
      enhancedMode: "El modo avanzado da insights más profundos"
    }
  },

  // Gestión de conversaciones
  conversations: {
    title: "Gestor de Conversaciones",
    subtitle: "Administra tus conversaciones activas y genera respuestas inteligentes",
    
    filters: {
      all: "Todas",
      active: "Activas",
      pending: "Pendientes", 
      archived: "Archivadas"
    },

    conversation: {
      lastMessage: "Último mensaje",
      responseTime: "Tiempo de respuesta",
      engagementLevel: "Nivel de engagement",
      nextAction: "Próxima acción sugerida",
      
      generateResponse: "Generar Respuesta",
      viewHistory: "Ver Historial",
      archiveConversation: "Archivar"
    },

    responseGenerator: {
      title: "Generador de Respuestas",
      context: "Contexto de la conversación",
      tone: "Tono deseado",
      tones: {
        casual: "Casual",
        flirty: "Coqueto",
        friendly: "Amistoso", 
        humorous: "Divertido"
      },
      generateButton: "Generar Respuestas",
      selectResponse: "Seleccionar esta respuesta"
    }
  },

  // Detector de oportunidades
  opportunities: {
    title: "Detector de Oportunidades",
    subtitle: "Identifica momentos perfectos para avanzar tus conversaciones",
    
    filters: {
      all: "Todas",
      urgent: "Urgentes",
      high: "Alta Prioridad",
      medium: "Media Prioridad",
      low: "Baja Prioridad"
    },

    opportunity: {
      type: "Tipo",
      confidence: "Confianza",
      timing: "Timing",
      suggestedResponse: "Respuesta Sugerida",
      
      types: {
        meetup: "Proponer Encuentro",
        escalation: "Escalar Conversación",
        reengagement: "Reactivar Chat",
        timing: "Momento Perfecto"
      },
      
      act: "Actuar",
      dismiss: "Descartar",
      snooze: "Posponer"
    },

    insights: {
      title: "Insights del Día",
      bestTiming: "Mejor horario para escribir",
      activeConversations: "Conversaciones más activas",
      recommendations: "Recomendaciones personalizadas"
    }
  },

  // Sistema de respuestas automáticas
  autoResponse: {
    title: "Sistema de Respuestas Automáticas",
    subtitle: "Configura respuestas inteligentes y automatización",
    
    settings: {
      title: "Configuración",
      enabled: "Sistema Habilitado",
      responseDelay: "Delay de Respuesta",
      autoApproval: "Auto-aprobación",
      learningMode: "Modo Aprendizaje"
    },

    templates: {
      title: "Templates de Mensajes",
      addTemplate: "Agregar Template",
      editTemplate: "Editar",
      deleteTemplate: "Eliminar",
      
      categories: {
        opener: "Aperturas",
        followUp: "Seguimiento",
        meetup: "Propuestas de Encuentro",
        casual: "Conversación Casual"
      }
    },

    performance: {
      title: "Rendimiento",
      responseRate: "Tasa de Respuesta",
      engagementRate: "Engagement",
      conversionRate: "Conversión a Citas",
      lastUpdate: "Última actualización"
    }
  },

  // Analytics
  analytics: {
    title: "Analytics y Métricas",
    subtitle: "Analiza tu rendimiento y optimiza tu estrategia",
    
    overview: {
      title: "Resumen General",
      thisWeek: "Esta semana",
      thisMonth: "Este mes",
      allTime: "Histórico"
    },

    charts: {
      compatibilityDistribution: "Distribución de Compatibilidad",
      responseRates: "Tasas de Respuesta",
      conversionFunnel: "Embudo de Conversión",
      activityHeatmap: "Mapa de Calor de Actividad"
    },

    insights: {
      title: "Insights Inteligentes",
      topPerformingMessages: "Mensajes con Mejor Rendimiento",
      optimalTiming: "Timing Óptimo",
      improvementAreas: "Áreas de Mejora",
      successPatterns: "Patrones de Éxito"
    }
  },

  // Componentes comunes
  common: {
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    cancel: "Cancelar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    view: "Ver",
    close: "Cerrar",
    
    // Estados
    online: "En línea",
    offline: "Sin conexión",
    connecting: "Conectando...",
    
    // Fechas
    now: "ahora",
    minutesAgo: "hace {0} minutos",
    hoursAgo: "hace {0} horas",
    daysAgo: "hace {0} días",
    
    // Confirmaciones
    confirmDelete: "¿Estás seguro de que querés eliminar esto?",
    confirmArchive: "¿Estás seguro de que querés archivar esta conversación?",
    unsavedChanges: "Tenés cambios sin guardar. ¿Querés salir sin guardar?"
  },

  // Tooltips y ayuda
  help: {
    compatibilityScore: "Score de compatibilidad calculado con algoritmos avanzados que analizan múltiples factores de personalidad y afinidad: valores centrales (40%), patrones sociales (30%), intereses compartidos (20%) y estilo de comunicación (10%).",
    
    successProbability: "La probabilidad de éxito predice qué tan probable es que esta persona responda positivamente a tu approach inicial.",
    
    enhancedAnalysis: "El análisis avanzado usa algoritmos de ML para evaluar compatibilidad a nivel profundo, incluyendo análisis de personalidad y predicción de éxito conversacional.",
    
    responseGenerator: "El generador de respuestas usa tu estilo personal y el contexto de la conversación para crear mensajes auténticos que mantengan tu voz única.",
    
    opportunityDetection: "El detector de oportunidades monitorea señales sutiles en las conversaciones para identificar momentos perfectos para escalar o proponer encuentros.",
    
    autoResponse: "El sistema de respuestas automáticas aprende de tus conversaciones exitosas para sugerir respuestas que coincidan con tu estilo y maximicen el engagement.",

    // Dashboard metrics help text
    profilesAnalyzed: "Cantidad total de perfiles de Instagram analizados por el sistema. Cada análisis incluye compatibilidad, predicción de éxito y estrategias personalizadas.",
    
    activeConversations: "Número de conversaciones activas que están siendo monitoreadas por el sistema. Incluye detección de oportunidades y sugerencias de respuestas en tiempo real.",
    
    successRate: "Porcentaje de conversaciones que resultaron en encuentros o conexiones exitosas. Se calcula basado en tu historial y patrones de éxito."
  },

  // Notificaciones
  notifications: {
    profileAnalyzed: "Perfil analizado exitosamente",
    strategyGenerated: "Nueva estrategia de conversación generada",
    opportunityDetected: "Nueva oportunidad detectada",
    responseGenerated: "Respuestas generadas",
    systemOnline: "Sistema conectado",
    systemOffline: "Sistema desconectado",
    
    errors: {
      networkError: "Error de conexión. Verificá tu internet.",
      serverError: "Error del servidor. Intentá de nuevo en unos minutos.",
      invalidUrl: "URL de Instagram inválida",
      rateLimited: "Demasiadas solicitudes. Esperá un momento.",
      analysisTimeout: "El análisis tardó demasiado. Intentá con otro perfil."
    }
  }
};

export type Translations = typeof es;
export default es;

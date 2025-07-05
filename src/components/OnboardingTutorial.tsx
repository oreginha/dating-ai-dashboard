import React, { useState, useEffect } from 'react';
import { 
  UserPlusIcon, 
  ChatBubbleLeftRightIcon, 
  SparklesIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  LightBulbIcon,
  PlayIcon,
  ClockIcon,
  HeartIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  autoShow?: boolean;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
  actionText?: string;
  actionUrl?: string;
  color: string;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ 
  isOpen, 
  onClose, 
  onComplete,
  autoShow = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Auto-mostrar tutorial para nuevos usuarios
  useEffect(() => {
    if (autoShow) {
      const hasSeenTutorial = localStorage.getItem('dating-ai-tutorial-completed');
      if (!hasSeenTutorial) {
        // El tutorial se abrirá automáticamente
      }
    }
  }, [autoShow]);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: '¡Bienvenido a Dating AI Agent!',
      description: 'Tu asistente personal de IA para optimizar tu vida romántica',
      icon: HeartIcon,
      color: 'from-pink-500 to-red-500',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">💕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¡Tu Dating AI Agent está listo!
            </h3>
            <p className="text-gray-600">
              Sistema completo de automatización romántica con inteligencia artificial avanzada.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 ¿Qué puede hacer por ti?</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Analiza personalidades</strong> desde WhatsApp e Instagram</li>
              <li>• <strong>Busca perfiles compatibles</strong> automáticamente</li>
              <li>• <strong>Genera estrategias</strong> de conversación personalizadas</li>
              <li>• <strong>Detecta oportunidades</strong> en tiempo real</li>
              <li>• <strong>Optimiza continuamente</strong> basado en resultados</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Sistema 100% funcional y listo para usar
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'discovery',
      title: 'Análisis de Perfiles',
      description: 'Descubre perfiles compatibles con análisis de IA avanzado',
      icon: UserPlusIcon,
      color: 'from-blue-500 to-cyan-500',
      actionText: 'Ir a Descubrimiento',
      actionUrl: '/discovery',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <UserPlusIcon className="h-6 w-6 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Motor de Descubrimiento</h4>
            </div>
            <p className="text-blue-800 text-sm mb-3">
              Analiza perfiles de Instagram automáticamente con algoritmos de compatibilidad avanzados.
            </p>
            
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Ingresá una URL de Instagram (ej: instagram.com/usuario)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>Activá "Análisis Avanzado" para mejores resultados</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>Clickeá "Analizar Perfil" y esperá el proceso completo</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">86%</div>
              <div className="text-xs text-gray-600">Score máximo obtenido</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">6</div>
              <div className="text-xs text-gray-600">Factores de compatibilidad</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <LightBulbIcon className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">
                Consejo: Comenzá con perfiles que conozcas para testear la precisión
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'conversations',
      title: 'Gestión de Conversaciones',
      description: 'Administra todas tus conversaciones desde un solo lugar',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-green-500 to-emerald-500',
      actionText: 'Ver Conversaciones',
      actionUrl: '/conversations',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />
              <h4 className="font-semibold text-green-900">Centro de Conversaciones</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-white rounded border border-green-200">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">M</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Macu López</div>
                  <div className="text-sm text-gray-600">Conexión musical ideal</div>
                </div>
                <div className="text-green-600 text-sm font-bold">86%</div>
              </div>

              <div className="flex items-center gap-3 p-2 bg-white rounded border border-green-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">C</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Cande Muñoz</div>
                  <div className="text-sm text-gray-600">Conexión intelectual</div>
                </div>
                <div className="text-blue-600 text-sm font-bold">78%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-green-600">3</div>
              <div className="text-xs text-gray-600">Activas</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-blue-600">7</div>
              <div className="text-xs text-gray-600">Mensajes hoy</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-purple-600">90%</div>
              <div className="text-xs text-gray-600">Response rate</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h5 className="font-medium text-blue-900 mb-2">🤖 Características inteligentes:</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Genera respuestas en tu estilo personal</li>
              <li>• Detecta el timing perfecto para escribir</li>
              <li>• Sugiere escalaciones hacia meetups</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'opportunities',
      title: 'Detector de Oportunidades',
      description: 'Encuentra momentos perfectos para avanzar tus conversaciones',
      icon: SparklesIcon,
      color: 'from-yellow-500 to-orange-500',
      actionText: 'Ver Oportunidades',
      actionUrl: '/opportunities',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <SparklesIcon className="h-6 w-6 text-yellow-600" />
              <h4 className="font-semibold text-yellow-900">Detección Inteligente</h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-white rounded border border-yellow-200">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Momento crítico detectado</div>
                  <div className="text-sm text-gray-600">@sofia_95 - Doble mensaje sin respuesta</div>
                </div>
                <div className="text-red-600 text-sm font-bold">¡URGENTE!</div>
              </div>

              <div className="flex items-center gap-3 p-2 bg-white rounded border border-yellow-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Perfecto para avanzar</div>
                  <div className="text-sm text-gray-600">@maria_23 - Responding actively</div>
                </div>
                <div className="text-green-600 text-sm font-bold">ÓPTIMO</div>
              </div>

              <div className="flex items-center gap-3 p-2 bg-white rounded border border-yellow-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Mantener el ritmo</div>
                  <div className="text-sm text-gray-600">@ana_travel - Conversación estable</div>
                </div>
                <div className="text-blue-600 text-sm font-bold">ESTABLE</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h5 className="font-medium text-purple-900 mb-2">⚡ Sistema 24/7 activo:</h5>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Monitoreo continuo de todas las conversaciones</li>
              <li>• Alertas en tiempo real vía Telegram</li>
              <li>• Sugerencias de acciones específicas</li>
              <li>• Predicción de ventanas de oportunidad</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'automation',
      title: 'Automatización Completa',
      description: 'Sistema funcionando 24/7 con mínima intervención',
      icon: RocketLaunchIcon,
      color: 'from-purple-500 to-indigo-500',
      actionText: 'Ver Panel Principal',
      actionUrl: '/',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <RocketLaunchIcon className="h-6 w-6 text-purple-600" />
              <h4 className="font-semibold text-purple-900">5 Workflows Automatizados</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-white rounded border border-purple-200">
                <ClockIcon className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Profile Discovery</div>
                  <div className="text-xs text-gray-600">Diario 10:00 AM</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>

              <div className="flex items-center gap-3 p-2 bg-white rounded border border-purple-200">
                <ClockIcon className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Conversation Manager</div>
                  <div className="text-xs text-gray-600">Cada 4 horas</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>

              <div className="flex items-center gap-3 p-2 bg-white rounded border border-purple-200">
                <ClockIcon className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Opportunity Detector</div>
                  <div className="text-xs text-gray-600">Tiempo real</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>

              <div className="flex items-center gap-3 p-2 bg-white rounded border border-purple-200">
                <ClockIcon className="h-4 w-4 text-purple-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Auto-Response System</div>
                  <div className="text-xs text-gray-600">On-demand</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>

              <div className="flex items-center gap-3 p-2 bg-white rounded border border-purple-200">
                <ClockIcon className="h-4 w-4 text-indigo-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Analytics Dashboard</div>
                  <div className="text-xs text-gray-600">Semanal</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">90%</div>
              <div className="text-xs text-gray-600">Menos tiempo manual</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">24/7</div>
              <div className="text-xs text-gray-600">Funcionamiento</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: '¡Listo para comenzar!',
      description: 'Tu Dating AI Agent está completamente configurado',
      icon: CheckCircleIcon,
      color: 'from-green-500 to-blue-500',
      actionText: 'Comenzar a usar',
      actionUrl: '/discovery',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🎉 ¡Sistema 100% operativo!
            </h3>
            <p className="text-gray-600">
              Tu Dating AI Agent está listo para optimizar tu vida romántica.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">🚀 Próximos pasos recomendados:</h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-gray-700">Analiza tu primer perfil en "Descubrimiento"</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-gray-700">Revisa las estrategias generadas automáticamente</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-gray-700">Configura notificaciones Telegram (opcional)</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <span className="text-gray-700">Monitorea oportunidades en tiempo real</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <LightBulbIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Consejo: Comienza analizando 2-3 perfiles para ver la magia en acción
              </span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, currentStepData.id]);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('dating-ai-tutorial-completed', 'true');
    localStorage.setItem('dating-ai-tutorial-completed-date', new Date().toISOString());
    onComplete?.();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('dating-ai-tutorial-skipped', 'true');
    onClose();
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleAction = () => {
    if (currentStepData.actionUrl) {
      window.location.href = currentStepData.actionUrl;
    }
    handleNext();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={clsx(
          'p-6 text-white bg-gradient-to-r',
          currentStepData.color
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <currentStepData.icon className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                <p className="text-white/90">{currentStepData.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Paso {currentStep + 1} de {tutorialSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}% completado</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {currentStepData.content}
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            {/* Step indicators */}
            <div className="flex items-center gap-2">
              {tutorialSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className={clsx(
                    'w-3 h-3 rounded-full transition-colors',
                    index === currentStep
                      ? 'bg-blue-600'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  )}
                  title={step.title}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Saltar tutorial
              </button>
              
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Anterior
                </button>
              )}

              {currentStepData.actionText && currentStep < tutorialSteps.length - 1 ? (
                <button
                  onClick={handleAction}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {currentStepData.actionText}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              ) : currentStep === tutorialSteps.length - 1 ? (
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <PlayIcon className="h-4 w-4" />
                  ¡Comenzar!
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Siguiente
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook para controlar el tutorial automáticamente
export const useOnboardingTutorial = () => {
  const [isOpen, setIsOpen] = useState(false);

  const checkShouldShow = () => {
    const hasCompleted = localStorage.getItem('dating-ai-tutorial-completed');
    const hasSkipped = localStorage.getItem('dating-ai-tutorial-skipped');
    const hasVisited = localStorage.getItem('dating-ai-visited');
    
    if (!hasCompleted && !hasSkipped && !hasVisited) {
      localStorage.setItem('dating-ai-visited', 'true');
      setIsOpen(true);
      return true;
    }
    return false;
  };

  const openTutorial = () => setIsOpen(true);
  const closeTutorial = () => setIsOpen(false);

  const resetTutorial = () => {
    localStorage.removeItem('dating-ai-tutorial-completed');
    localStorage.removeItem('dating-ai-tutorial-skipped');
    localStorage.removeItem('dating-ai-visited');
    setIsOpen(true);
  };

  return {
    isOpen,
    openTutorial,
    closeTutorial,
    resetTutorial,
    checkShouldShow
  };
};
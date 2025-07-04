                {/* Acción recomendada */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                  <h4 className="font-bold text-xl mb-2">🎯 Próximo Paso Recomendado</h4>
                  <p className="text-blue-100 mb-4">
                    Basado en el análisis, este es el mejor momento para contactar:
                  </p>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <p className="font-semibold mb-2">Mensaje inicial sugerido:</p>
                    <p className="italic">
                      "{analysisResult.strategy.conversation_plan.phase_1.sample_messages[0]}"
                    </p>
                  </div>
                  <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    📋 Copiar mensaje
                  </button>
                </div>
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Help Center, FAQs & Interactive User Manual
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  Compass,
  Calendar,
  Layers,
  User,
  ShieldCheck,
  Code2,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileText,
  MapPin,
  Camera,
  Share2,
  Flame,
  KeyRound,
  Send,
  ArrowLeft,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  highlight?: string;
}

const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Reservas y Pagos',
    question: '¿Cómo realizo y confirmo una reserva en Pata de Perro?',
    answer:
      'Para reservar, entra en la tarjeta de cualquier experiencia, presiona el botón "Reservar Ahora", selecciona la fecha deseada y la cantidad de viajeros. Al confirmar, el sistema generará automáticamente un código único de confirmación (ej. PDP-882A1B) y podrás contactar al anfitrión directamente por WhatsApp.',
    highlight: 'Código de confirmación único generado al instante.',
  },
  {
    id: 'faq_2',
    category: 'Reservas y Pagos',
    question: '¿Qué métodos de pago se admiten y cuál es la moneda oficial?',
    answer:
      'Los precios base están expresados en Dólares Estadounidenses (USD) con su equivalente estimado en Córdobas Nicaragüenses (NIO). El pago final se coordina de manera directa y segura con el anfitrión comunitario local mediante efectivo o transferencias bancarias locales (BAC, LAFISE, Banpro) al iniciar la actividad.',
    highlight: 'Precios transparentes en USD y Córdobas.',
  },
  {
    id: 'faq_3',
    category: 'Realidad Aumentada & 3D',
    question: '¿Cómo funciona la navegación con Realidad Aumentada (RA)?',
    answer:
      'En la sección "Navegación RA" o en el visor de cada experiencia, puedes interactuar con modelos 3D interactivos (.GLTF) de piezas de cerámica ancestral, flora y fauna autóctona, mapas topográficos y volcanes. Puedes rotar en 360°, hacer zoom con gestos táctiles y visualizar la altitud y rumbo en tiempo real.',
    highlight: 'Modelos tridimensionales con simulación AR interactiva.',
  },
  {
    id: 'faq_4',
    category: 'Perfil & Redes',
    question: '¿Cómo subo una foto desde mi galería a mi perfil?',
    answer:
      'Ve a la sección "Mi Perfil" en el menú principal. Dentro del apartado "Foto de Perfil", haz clic en "Haz clic para buscar en tu galería o archivos" o arrastra tu imagen. Se admiten formatos JPG, PNG y WEBP. Una vez cargada, haz clic en "Guardar Cambios".',
    highlight: 'Compatible con fotos tomadas con la cámara o almacenadas en tu dispositivo.',
  },
  {
    id: 'faq_5',
    category: 'Perfil & Redes',
    question: '¿Puedo vincular mis redes sociales como Instagram, TikTok y Facebook?',
    answer:
      '¡Sí! En la pantalla de perfil dispones de campos específicos para ingresar tus nombres de usuario o enlaces a Instagram, Facebook, TikTok, Twitter/X, YouTube y sitio web. Tus compañeros de viaje y anfitriones podrán ver tus redes en tu vista previa pública.',
    highlight: 'Vinculación directa de perfiles sociales para la comunidad viajera.',
  },
  {
    id: 'faq_6',
    category: 'Modo Anfitrión',
    question: '¿Cómo puedo publicar una nueva experiencia si soy anfitrión local?',
    answer:
      'Cambia al rol de "Anfitrión" desde la barra superior o ve al "Panel de Anfitrión". Presiona el botón "Publicar Nueva Experiencia", completa el título, descripción, precio, ciudad creativa, e incluye una fotografía subida directamente desde tu galería de fotos o archivos.',
    highlight: 'Herramientas completas de publicación y gestión para comunidades turísticas.',
  },
  {
    id: 'faq_7',
    category: 'Ciudades Creativas',
    question: '¿Cuáles son las Ciudades Creativas incluidas en la plataforma?',
    answer:
      'Pata de Perro cubre los principales polos creativos de Nicaragua reconocidos por la UNESCO y la Red Nacional de Ciudades Creativas: Masaya (Capital del Folklore y Barro), León (Historia y Sandboarding), Granada (Patrimonio Colonial y Lago), Matagalpa (Cacao y Montaña), Estelí (Muralismo y Puros) y la mágica Isla de Ometepe.',
    highlight: 'Enfoque en patrimonio vivo y turismo cultural comunitario.',
  },
  {
    id: 'faq_8',
    category: 'Opciones de Desarrollador',
    question: '¿Cómo se activan las Opciones de Desarrollador ocultas?',
    answer:
      'Inspirado en el sistema de Android, ve a Configuración → Acerca de la aplicación. Toca 3 veces rápidamente sobre la "Versión de la aplicación (v1.0.0)". El sistema te solicitará el PIN maestro de desarrollo (1102). Al ingresarlo, se desbloquearán las herramientas de prueba, diagramas ER y consola técnica.',
    highlight: 'Acceso seguro con triple toque y PIN 1102.',
  },
];

interface ManualStep {
  step: number;
  title: string;
  category: string;
  icon: React.ReactNode;
  summary: string;
  instructions: string[];
  tip?: string;
}

const MANUAL_STEPS: ManualStep[] = [
  {
    step: 1,
    title: 'Explorar Rutas y Filtrar por Ciudad y Moods',
    category: 'Descubrimiento',
    icon: <Compass className="w-5 h-5 text-[#FF6B35]" />,
    summary: 'Aprende a navegar el catálogo visual y encontrar experiencias a tu medida.',
    instructions: [
      'Abre la pantalla "Explorar" para ver todas las experiencias comunitarias activas.',
      'Usa las pestañas superiores de Ciudades Creativas (Todas, Masaya, Granada, León, Matagalpa, Estelí, Ometepe) para ubicar tu destino.',
      'Filtra por Moods o Estados de Ánimo: #Aventurero, #Cultural, #Creativo, #Gastronómico o #Tranquilo.',
      'Usa la barra de búsqueda para escribir palabras clave como "cerámica", "kayak", "sandboarding" o "cacao".',
    ],
    tip: 'Las experiencias con insignia dorada cuentan con certificación de guías locales INTUR.',
  },
  {
    step: 2,
    title: 'Visualizador de Realidad Aumentada & Modelos 3D',
    category: 'Tecnología Inmersiva',
    icon: <Layers className="w-5 h-5 text-indigo-600" />,
    summary: 'Interactúa con piezas patrimoniales y mapas 3D antes de viajar.',
    instructions: [
      'En la barra de navegación selecciona "Navegación RA" o pulsa "Ver en 3D / RA" en el detalle de una experiencia.',
      'Usa el ratón o tus dedos en la pantalla para rotar la pieza 360° en los ejes X, Y y Z.',
      'Realiza zoom para examinar texturas de arcilla precolombina o mapas geológicos volcánicos.',
      'Activa el "Modo Terreno" o la "Cámara Inmersiva" para simular la brújula y altitud en sitio.',
    ],
    tip: 'No requiere gafas especiales: funciona directamente en cualquier navegador moderno.',
  },
  {
    step: 3,
    title: 'Reservar y Contactar al Anfitrión Comunitario',
    category: 'Reservaciones',
    icon: <Calendar className="w-5 h-5 text-emerald-600" />,
    summary: 'Asegura tu cupo en talleres y expediciones con confirmación digital.',
    instructions: [
      'Haz clic en la tarjeta de la experiencia que deseas y pulsa "Reservar Ahora".',
      'Elige la fecha en el calendario y selecciona la cantidad de personas que asistirán.',
      'Verifica el precio total calculado en USD.',
      'Haz clic en "Confirmar Reservación". El sistema te entregará un código único (ej. PDP-882A1B).',
      'Ve a "Mis Reservas" para consultar el estado, descargar detalles o enviar mensaje por WhatsApp con un solo clic.',
    ],
    tip: 'Tu reserva queda guardada en tu dispositivo incluso si cierras el navegador.',
  },
  {
    step: 4,
    title: 'Personalizar tu Perfil y Redes Sociales',
    category: 'Tu Cuenta',
    icon: <User className="w-5 h-5 text-[#FF6B35]" />,
    summary: 'Configura tu fotografía desde la galería y conecta tus redes sociales.',
    instructions: [
      'Ingresa a la sección "Mi Perfil" desde el menú superior o de navegación.',
      'Pulsa en "Subir foto desde galería o archivos" para cargar una imagen desde tu dispositivo móvil o computadora.',
      'Edita tu nombre, número de teléfono/WhatsApp y ciudad de origen.',
      'Escribe tu biografía viajera y selecciona tus estilos de viaje favoritos.',
      'Completa tus perfiles de Instagram (@usuario), Facebook, TikTok o sitio web.',
      'Pulsa "Guardar Cambios" y revisa cómo luce tu perfil en la pestaña "Vista Previa Pública".',
    ],
    tip: 'Tus datos de contacto permiten a los anfitriones avisarte sobre condiciones climáticas antes de iniciar la ruta.',
  },
  {
    step: 5,
    title: 'Publicar Experiencias como Anfitrión',
    category: 'Anfitriones',
    icon: <ShieldCheck className="w-5 h-5 text-[#23404A]" />,
    summary: 'Promociona talleres artesanales y recorridos ecoturísticos comunitarios.',
    instructions: [
      'Cambia al rol "Anfitrión" desde el interruptor en la cabecera o el panel lateral.',
      'Ve al "Panel de Anfitrión" y pulsa en "Publicar Nueva Experiencia".',
      'Sube una fotografía de tu taller o paisaje directamente desde tu galería o selecciona uno de los presets.',
      'Ingresa el título, descripción detallada, categoría (Tierra, Agua, Aire, Fuego), precio en USD y ciudad.',
      'Gestiona las solicitudes de reserva de los turistas, confirmando o completando servicios según corresponda.',
    ],
    tip: 'Fotos claras y bien iluminadas aumentan un 60% la tasa de reservaciones de los viajeros.',
  },
  {
    step: 6,
    title: 'Desbloquear Modo Desarrollador Oculto',
    category: 'Pruebas & Sistema',
    icon: <Code2 className="w-5 h-5 text-amber-600" />,
    summary: 'Accede a la suite de pruebas unitarias, consola de eventos y diagrama ER.',
    instructions: [
      'Dirígete a la pantalla de "Configuración".',
      'Desplázate hasta la tarjeta "Acerca de la aplicación".',
      'Localiza la fila "Versión de la aplicación (v1.0.0)".',
      'Toca 3 veces rápidamente sobre la versión. Verás una cuenta regresiva y se abrirá el modal de seguridad.',
      'Ingresa el código PIN maestro: 1102.',
      'Verás la notificación «"Opciones de desarrollador activadas"» y aparecerá el nuevo botón de acceso en Configuración y en el encabezado.',
    ],
    tip: 'Desde el panel de desarrollador puedes ejecutar pruebas automatizadas y exportar copias de seguridad en JSON.',
  },
];

export const HelpManualView: React.FC = () => {
  const { setActiveScreen, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'faq' | 'manual' | 'contacto'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq_1');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const categories = ['Todas', ...Array.from(new Set(FAQS_DATA.map(f => f.category)))];

  const filteredFaqs = FAQS_DATA.filter(faq => {
    const matchesCat = selectedCategory === 'Todas' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredManual = MANUAL_STEPS.filter(
    step =>
      step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.instructions.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      showToast('Por favor completa todos los campos del formulario.');
      return;
    }
    setContactSent(true);
    showToast('¡Mensaje enviado al equipo de soporte comunitario de Pata de Perro!');
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactSent(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-help-back-explore"
          onClick={() => setActiveScreen('explore')}
          className="flex items-center gap-2 text-xs font-bold text-[#23404A] hover:text-[#FF6B35] bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs transition-all font-manrope cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#23404A] via-[#1B323A] to-[#122227] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg border border-stone-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-[#FFC83D] text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-xs border border-white/10 px-3.5 py-1 rounded-full w-fit">
            <HelpCircle className="w-3.5 h-3.5" /> Centro de Ayuda & Documentación
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-outfit tracking-tight">
            ¿Cómo podemos ayudarte hoy?
          </h1>
          <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed font-medium">
            Encuentra respuestas inmediatas a preguntas frecuentes, consulta el manual paso a paso de Pata de Perro o comunícate con nuestro equipo de asistencia.
          </p>

          {/* Search Box */}
          <div className="relative pt-2">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 mt-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar en preguntas frecuentes, reservas, fotos de perfil, anfitriones o manual..."
              className="w-full pl-12 pr-4 py-3.5 bg-white text-stone-900 placeholder-stone-400 rounded-2xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-center sm:justify-start gap-2 bg-stone-200/60 p-1.5 rounded-2xl w-fit mx-auto sm:mx-0">
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'faq'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#FF6B35]" />
          <span>Preguntas Frecuentes ({filteredFaqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Manual de Usuario ({filteredManual.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contacto')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'contacto'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Contacto & Soporte</span>
        </button>
      </div>

      {/* TAB 1: PREGUNTAS FRECUENTES (FAQ) */}
      {activeTab === 'faq' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Categories bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#23404A] text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 space-y-3">
              <HelpCircle className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">No encontramos resultados para tu búsqueda</h3>
              <p className="text-xs text-stone-500">Prueba con otros términos o revisa el manual de usuario completo.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todas');
                }}
                className="px-4 py-2 bg-[#FF6B35] text-white text-xs font-bold rounded-xl"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map(faq => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 hover:bg-stone-50/70 transition-colors cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF6B35] bg-[#FF6B35]/10 px-2.5 py-0.5 rounded-md">
                          {faq.category}
                        </span>
                        <h3 className="text-stone-900 font-bold text-sm sm:text-base font-outfit pt-1">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="p-1 text-stone-400 shrink-0">
                        {isOpen ? <ChevronUp className="w-5 h-5 text-stone-800" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/40 space-y-3">
                        <p>{faq.answer}</p>
                        {faq.highlight && (
                          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>{faq.highlight}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANUAL DE USUARIO (PASO A PASO) */}
      {activeTab === 'manual' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 sm:p-6 flex items-start gap-4 text-amber-900">
            <BookOpen className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm sm:text-base font-outfit">
                Manual Completo de la Aplicación Pata de Perro
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Esta guía te acompaña en cada función del sistema: desde el descubrimiento turístico y visualización 3D hasta la personalización de tu perfil con fotos y el manejo del panel de anfitrión comunitario.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {filteredManual.map(step => (
              <div
                key={step.step}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-stone-100 flex items-center justify-center font-black font-outfit text-stone-900 border border-stone-200">
                      {step.step}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                        {step.category}
                      </span>
                      <h2 className="text-base sm:text-lg font-extrabold font-outfit text-stone-900">
                        {step.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-2 rounded-2xl bg-stone-50 border border-stone-200 w-fit">
                    {step.icon}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-500 font-medium">{step.summary}</p>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                    Instrucciones paso a paso:
                  </span>
                  <ul className="space-y-2">
                    {step.instructions.map((inst, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {step.tip && (
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF6B35] shrink-0" />
                    <span>
                      <strong className="text-stone-900">Consejo útil:</strong> {step.tip}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTACTO & SOPORTE */}
      {activeTab === 'contacto' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {/* Direct channels */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit">
                <MessageCircle className="w-3.5 h-3.5" /> Canales Oficiales
              </div>
              <h2 className="text-xl font-extrabold font-outfit text-stone-900 pt-2">
                Asistencia Directa
              </h2>
              <p className="text-xs text-stone-500">
                Estamos disponibles para ayudarte con tus reservaciones, rutas turísticas o registro de anfitriones.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="https://wa.me/50588123456?text=Hola%20Pata%20de%20Perro,%20necesito%20asistencia%20con%20la%20aplicación."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-colors"
              >
                <div className="p-3 bg-emerald-600 text-white rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-extrabold font-outfit text-emerald-950">WhatsApp de Soporte</span>
                  <span className="text-xs text-emerald-700 font-medium">+505 8812-3456 (Atención 8am - 6pm)</span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800">
                <div className="p-3 bg-[#23404A] text-white rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-extrabold font-outfit text-stone-900">Correo Electrónico</span>
                  <span className="text-xs text-stone-600 font-medium">soporte@patadeperro.ni</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800">
                <div className="p-3 bg-[#FF6B35] text-white rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-extrabold font-outfit text-stone-900">Sede Principal</span>
                  <span className="text-xs text-stone-600 font-medium">Managua & Red de Ciudades Creativas, Nicaragua</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-xl font-extrabold font-outfit text-stone-900">
                Envíanos un Mensaje
              </h2>
              <p className="text-xs text-stone-500">
                Responderemos a tu consulta a la brevedad posible.
              </p>
            </div>

            {contactSent ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900 font-outfit">¡Mensaje Enviado con Éxito!</h4>
                <p className="text-xs text-emerald-700">Nuestro equipo se pondrá en contacto contigo muy pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="Ej. Sofía Guevara"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Consulta o Mensaje *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    placeholder="Describe tu duda sobre reservaciones, rutas o funciones de la app..."
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF6B35] hover:bg-[#ff5514] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-[#FF6B35]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Consulta</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

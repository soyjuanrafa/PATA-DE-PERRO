/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Host Dashboard & Experience Management with Photo Upload
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CategoriaExp, MoodTag, EstadoReserva, Anfitrion } from '../types';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import {
  PlusCircle,
  Calendar,
  DollarSign,
  Star,
  ShieldCheck,
  Check,
  X,
  Camera,
  MapPin,
  TrendingUp,
  Upload,
  Image as ImageIcon,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
  Sparkles,
  Share2,
  ExternalLink,
  MessageCircle,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const PRESET_EXPERIENCE_PHOTOS = [
  {
    name: 'Cerámica Ancestral (Masaya)',
    url: '341fa7530e46bdee603f28736b625f9e.jpg',
  },
  {
    name: 'Sandboarding Cerro Negro (León)',
    url: 'fadeb6cdbd7a54476669b3cf00153229.jpg',
  },
  {
    name: 'Senderismo Telica (León)',
    url: '95a84bf6b6e9fc1d9e997116be632aee.jpg',
  },
  {
    name: 'Kayak Río Istiam (Ometepe)',
    url: 'ad98149312ef68933798fcdc8f8109c9.jpg',
  },
  {
    name: 'Isletas de Granada (Granada)',
    url: '54c4c86928fa84290a11e36ee4572f92.jpg',
  },
  {
    name: 'Cañón de Somoto (Estelí / Madriz)',
    url: 'aa7d1375bf513a7f7987c3f661c41126.jpg',
  },
  {
    name: 'Ruta del Cacao (Matagalpa)',
    url: 'b7893a5bec8af14fdeb13ad0341c5bfe.jpg',
  },
];

export const HostDashboard: React.FC = () => {
  const {
    experiences,
    reservations,
    addExperience,
    updateExperience,
    deleteExperience,
    updateReservationStatus,
    user,
    updateHostProfile,
    showToast,
    setActiveScreen,
    openOrCreateChatThread,
    totalUnreadMessagesCount,
  } = useApp();

  const hostUser = user as Anfitrion;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hostAvatarInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [isEditingHostProfile, setIsEditingHostProfile] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  // Experience form states
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<CategoriaExp>(CategoriaExp.TIERRA);
  const [precio, setPrecio] = useState(25);
  const [ciudad, setCiudad] = useState('Masaya');
  const [duracion, setDuracion] = useState('3 Horas');
  const [dificultad, setDificultad] = useState<'Fácil' | 'Moderado' | 'Desafiante'>('Fácil');
  const [imagenUrl, setImagenUrl] = useState('341fa7530e46bdee603f28736b625f9e.jpg');
  const [selectedMoods, setSelectedMoods] = useState<MoodTag[]>([MoodTag.CULTURAL, MoodTag.CREATIVO]);
  const [incluyeInput, setIncluyeInput] = useState('Guía local certificado, Materiales tradicionales, Refrigerio típico');
  const [isDragging, setIsDragging] = useState(false);

  // Host Profile states
  const [hostNombre, setHostNombre] = useState(hostUser?.nombre || 'Don Carlos Mendoza');
  const [hostBio, setHostBio] = useState(
    hostUser?.bio ||
      'Guía turístico y anfitrión comunitario certificado por INTUR con más de 12 años promoviendo rutas culturales y volcánicas.'
  );
  const [hostCiudad, setHostCiudad] = useState(hostUser?.ciudad || 'León');
  const [hostTelefono, setHostTelefono] = useState(hostUser?.telefono || '+505 8812-3456');
  const [hostEmail, setHostEmail] = useState(hostUser?.correo || 'carlos.mendoza@guiasdeleon.ni');
  const [hostAvatar, setHostAvatar] = useState(
    hostUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  );
  const [hostInstagram, setHostInstagram] = useState(hostUser?.redesSociales?.instagram || '@carlos.tours.ni');
  const [hostFacebook, setHostFacebook] = useState(hostUser?.redesSociales?.facebook || 'facebook.com/carlostoursnicaragua');

  // Handle Photo upload from user gallery for Experience
  const handleExpImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagenUrl(reader.result);
        showToast('Foto de la experiencia cargada desde tu galería.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Host Avatar Upload from Gallery
  const handleHostAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setHostAvatar(reader.result);
        showToast('Foto de anfitrión actualizada.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDropExperienceImage = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImagenUrl(reader.result);
          showToast('Foto de la experiencia cargada exitosamente.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingExpId(null);
    setTitulo('');
    setDescripcion('');
    setCategoria(CategoriaExp.TIERRA);
    setPrecio(25);
    setCiudad('Masaya');
    setDuracion('3 Horas');
    setDificultad('Fácil');
    setImagenUrl('341fa7530e46bdee603f28736b625f9e.jpg');
    setSelectedMoods([MoodTag.CULTURAL, MoodTag.CREATIVO]);
    setIncluyeInput('Guía local certificado, Materiales tradicionales, Refrigerio típico');
    setIsAddingModalOpen(true);
  };

  const openEditModal = (exp: typeof experiences[0]) => {
    setEditingExpId(exp.id_exp);
    setTitulo(exp.titulo);
    setDescripcion(exp.descripcion);
    setCategoria(exp.categoria);
    setPrecio(exp.precio);
    setCiudad(exp.ciudad_creativa);
    setDuracion(exp.duracion);
    setDificultad(exp.dificultad || 'Fácil');
    setImagenUrl(exp.imagen_url);
    setSelectedMoods(exp.moods || [MoodTag.CULTURAL]);
    setIncluyeInput(exp.incluye.join(', '));
    setIsAddingModalOpen(true);
  };

  const handleSubmitExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) {
      showToast('Por favor completa el título y la descripción.');
      return;
    }

    const itemsIncluye = incluyeInput
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    if (editingExpId) {
      updateExperience(editingExpId, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria,
        precio,
        ciudad_creativa: ciudad,
        ubicacion_nombre: `Ruta Turística en ${ciudad}`,
        duracion,
        dificultad,
        imagen_url: imagenUrl,
        incluye: itemsIncluye.length > 0 ? itemsIncluye : ['Guía local', 'Materiales'],
        moods: selectedMoods,
      });
    } else {
      addExperience({
        id_anfitrion: user ? ('id_anfitrion' in user ? user.id_anfitrion : 'anf_01') : 'anf_01',
        anfitrion_nombre: hostNombre,
        anfitrion_avatar: hostAvatar,
        categoria,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        precio,
        moneda: 'USD',
        ubicacion_nombre: `Ruta Turística Comunitaria en ${ciudad}`,
        ciudad_creativa: ciudad,
        ubicacion_lat: 11.9744,
        ubicacion_lon: -86.0942,
        recurso_ra_url: 'https://patadeperro.ni/ar/custom_3d.gltf',
        imagen_url: imagenUrl,
        duracion,
        dificultad,
        incluye: itemsIncluye.length > 0 ? itemsIncluye : ['Guía local', 'Materiales'],
        moods: selectedMoods,
      });
    }

    setIsAddingModalOpen(false);
  };

  const handleSaveHostProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateHostProfile({
      nombre: hostNombre.trim(),
      bio: hostBio.trim(),
      ciudad: hostCiudad.trim(),
      telefono: hostTelefono.trim(),
      correo: hostEmail.trim(),
      avatar: hostAvatar,
      redesSociales: {
        instagram: hostInstagram.trim(),
        facebook: hostFacebook.trim(),
      },
    });
    setIsEditingHostProfile(false);
  };

  const totalEarnings = reservations.reduce((acc, r) => acc + r.monto_total, 0);

  return (
    <div className="min-h-screen bg-stone-50 pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#23404A] text-xs font-bold uppercase tracking-wider bg-[#23404A]/10 border border-[#23404A]/20 px-3 py-1 rounded-full w-fit">
            <ShieldCheck className="w-4 h-4 text-[#23404A]" /> Panel de Anfitrión Comunitario
          </div>
          <h1 className="text-stone-900 text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight pt-2">
            Gestión y Publicación de Experiencias
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            Publica tus talleres y rutas subiendo fotos desde tu galería, y gestiona tus reservas en tiempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveScreen('messages')}
            className="relative bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            title="Ver mensajes de viajeros y consultas"
          >
            <MessageSquare className="w-4 h-4 text-[#FF6B35]" />
            <span>Bandeja de Mensajes</span>
            {totalUnreadMessagesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#FF6B35] text-white text-[10px] font-black">
                {totalUnreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsEditingHostProfile(!isEditingHostProfile)}
            className="bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <User className="w-4 h-4 text-[#23404A]" />
            <span>{isEditingHostProfile ? 'Cerrar Perfil' : 'Mi Perfil Anfitrión'}</span>
          </button>

          <button
            id="btn-host-publish-exp"
            onClick={openAddModal}
            className="bg-[#FF6B35] hover:bg-[#ff5514] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-md shadow-[#FF6B35]/25 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Nueva Experiencia</span>
          </button>
        </div>
      </div>

      {/* Host Profile Drawer / Editor */}
      {isEditingHostProfile && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 font-outfit">
                Editar Perfil de Anfitrión & Contacto
              </h2>
              <p className="text-xs text-stone-500">
                Sube tu foto de perfil desde tu galería para generar confianza en los turistas.
              </p>
            </div>
            <button
              onClick={() => setIsEditingHostProfile(false)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveHostProfile} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group shrink-0">
                <img
                  src={hostAvatar}
                  alt={hostNombre}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-stone-100 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => hostAvatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-[#FF6B35] text-white rounded-xl shadow-md cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={hostAvatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHostAvatarUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <button
                  type="button"
                  onClick={() => hostAvatarInputRef.current?.click()}
                  className="text-xs font-bold text-[#FF6B35] hover:underline cursor-pointer"
                >
                  Subir foto de anfitrión desde galería
                </button>
                <p className="text-[11px] text-stone-400">Recomendado: Foto clara donde se aprecie tu rostro o taller artesanal.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nombre del Anfitrión o Cooperativa *
                </label>
                <input
                  type="text"
                  required
                  value={hostNombre}
                  onChange={e => setHostNombre(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Ciudad Creativa Principal
                </label>
                <select
                  value={hostCiudad}
                  onChange={e => setHostCiudad(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                >
                  <option value="León">León</option>
                  <option value="Granada">Granada</option>
                  <option value="Masaya">Masaya</option>
                  <option value="Matagalpa">Matagalpa</option>
                  <option value="Estelí">Estelí</option>
                  <option value="Ometepe">Ometepe</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  WhatsApp / Teléfono de Contacto *
                </label>
                <input
                  type="text"
                  required
                  value={hostTelefono}
                  onChange={e => setHostTelefono(e.target.value)}
                  placeholder="+505 8812-3456"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Instagram del Anfitrión
                </label>
                <input
                  type="text"
                  value={hostInstagram}
                  onChange={e => setHostInstagram(e.target.value)}
                  placeholder="@carlos.tours.ni"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Biografía y Experiencia Comunitaria
              </label>
              <textarea
                rows={3}
                value={hostBio}
                onChange={e => setHostBio(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditingHostProfile(false)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF6B35] text-white text-xs font-bold rounded-2xl shadow-md hover:bg-[#ff5514] cursor-pointer"
              >
                Guardar Perfil de Anfitrión
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Host Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#FF6B35]/10 text-[#FF6B35] rounded-2xl border border-[#FF6B35]/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-stone-500 text-xs font-bold block uppercase tracking-wider">Ingresos Estimados</span>
            <span className="text-stone-900 text-2xl font-black font-outfit">${totalEarnings} USD</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-stone-500 text-xs font-bold block uppercase tracking-wider">Reservas Agendadas</span>
            <span className="text-stone-900 text-2xl font-black font-outfit">{reservations.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#FFC83D]/15 text-amber-700 rounded-2xl border border-[#FFC83D]/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-stone-500 text-xs font-bold block uppercase tracking-wider">Calificación Anfitrión</span>
            <span className="text-stone-900 text-2xl font-black font-outfit flex items-center gap-1">
              4.95 <Star className="w-5 h-5 fill-amber-400 text-amber-500 inline" />
            </span>
          </div>
        </div>
      </div>

      {/* Experience Catalog Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-stone-900 text-lg sm:text-xl font-extrabold font-outfit tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF6B35]" /> Mis Experiencias Publicadas ({experiences.length})
            </h2>
            <p className="text-xs text-stone-500">
              Edita las fotos, ajusta precios o añade nuevas experiencias disponibles para turistas nacionales e internacionales.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer w-fit"
          >
            <PlusCircle className="w-4 h-4 text-[#FFC83D]" /> Añadir Experiencia
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {experiences.map(exp => (
            <div
              key={exp.id_exp}
              className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-stone-200 overflow-hidden">
                  <img
                    src={resolveImageUrl(exp.imagen_url)}
                    onError={e => handleImageFallback(e, exp.imagen_url)}
                    alt={exp.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider">
                    {exp.ciudad_creativa}
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#FF6B35] text-white text-xs font-black">
                    ${exp.precio} USD
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-stone-900 font-extrabold text-sm font-outfit line-clamp-1">
                    {exp.titulo}
                  </h3>
                  <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                    {exp.descripcion}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" /> {exp.duracion}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {exp.rating} ({exp.resenas_count})
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-stone-200/60 mt-3">
                <button
                  onClick={() => openEditModal(exp)}
                  className="flex-1 py-2 px-3 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-indigo-600" /> Modificar
                </button>
                <button
                  onClick={() => deleteExperience(exp.id_exp)}
                  className="p-2 bg-white hover:bg-red-50 border border-stone-300 hover:border-red-300 rounded-xl text-stone-500 hover:text-red-600 transition-colors cursor-pointer"
                  title="Eliminar experiencia"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reservations Agenda Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-stone-900 text-lg font-extrabold font-outfit tracking-tight flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#23404A]" /> Agenda de Reservaciones y Contacto Directo
        </h2>

        {reservations.length === 0 ? (
          <p className="text-stone-500 text-xs italic py-6 text-center">
            Aún no tienes reservaciones registradas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-600 uppercase tracking-wider font-bold text-[10px] rounded-xl">
                <tr>
                  <th className="p-3.5">Código / Turista</th>
                  <th className="p-3.5">Experiencia</th>
                  <th className="p-3.5">Fecha</th>
                  <th className="p-3.5">Personas</th>
                  <th className="p-3.5">Monto Total</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reservations.map(r => (
                  <tr key={r.id_reserva} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-stone-900">
                      <div>{r.codigo_confirmacion}</div>
                      <div className="text-[11px] font-sans text-stone-500 font-medium">{r.turista_nombre}</div>
                    </td>
                    <td className="p-3.5 font-medium text-stone-800 max-w-[200px] truncate">
                      {r.exp_titulo}
                    </td>
                    <td className="p-3.5 text-stone-600 font-medium">{r.fecha_reserva}</td>
                    <td className="p-3.5 text-stone-700 font-semibold">{r.personas} personas</td>
                    <td className="p-3.5 font-bold text-[#FF6B35] font-outfit text-sm">${r.monto_total} USD</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          r.estado_reserva === EstadoReserva.CONFIRMADA
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.estado_reserva === EstadoReserva.COMPLETADA
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {r.estado_reserva}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* In-App Chat button */}
                        <button
                          onClick={() => {
                            const relatedExp = experiences.find(e => e.id_exp === r.id_exp);
                            openOrCreateChatThread(
                              relatedExp,
                              r.id_turista || 'usr_demo_01',
                              r.turista_nombre,
                              `¡Hola ${r.turista_nombre}! Soy tu anfitrión de Pata de Perro. Respecto a tu reserva ${r.codigo_confirmacion}, ¿tienes alguna duda antes del viaje?`
                            );
                          }}
                          className="p-1.5 rounded-lg bg-orange-50 text-[#FF6B35] hover:bg-orange-100 transition-colors cursor-pointer"
                          title="Abrir chat en la app con este turista"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        {/* WhatsApp button */}
                        <a
                          href={`https://wa.me/${(r.contacto_whatsapp || '+50588123456').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `¡Hola ${r.turista_nombre}! Te escribo de Pata de Perro respecto a tu reserva #${r.codigo_confirmacion} para "${r.exp_titulo}".`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Contactar por WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        {r.estado_reserva === EstadoReserva.CONFIRMADA && (
                          <button
                            onClick={() => updateReservationStatus(r.id_reserva, EstadoReserva.COMPLETADA)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                            title="Marcar como Completada"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {r.estado_reserva !== EstadoReserva.CANCELADA && (
                          <button
                            onClick={() => updateReservationStatus(r.id_reserva, EstadoReserva.CANCELADA)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Cancelar reserva"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Publish / Edit Experience with Gallery Photo Upload */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xl font-black font-outfit text-stone-900">
                  {editingExpId ? 'Modificar Experiencia' : 'Publicar Nueva Experiencia'}
                </h3>
                <p className="text-xs text-stone-500">
                  Completa los datos y asigna una foto representativa desde tu galería o presets.
                </p>
              </div>
              <button
                onClick={() => setIsAddingModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitExperience} className="space-y-4">
              {/* Photo Upload from Gallery / Files */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Foto de la Experiencia (Galería o Archivos) *
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Current Photo Preview */}
                  <div className="relative w-full sm:w-40 h-32 rounded-2xl overflow-hidden bg-stone-100 border-2 border-stone-200 shrink-0">
                    <img
                      src={resolveImageUrl(imagenUrl)}
                      onError={e => handleImageFallback(e, imagenUrl)}
                      alt="Vista previa de foto"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white/90 text-stone-900 rounded-xl text-[11px] font-bold shadow-md cursor-pointer"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>

                  {/* Dropzone & Upload Action */}
                  <div
                    onDragOver={e => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDropExperienceImage}
                    className={`flex-1 w-full border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                      isDragging
                        ? 'border-[#FF6B35] bg-[#FF6B35]/5'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100/60'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleExpImageUpload}
                      className="hidden"
                      id="input-exp-image-file"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-[#FF6B35] hover:underline cursor-pointer"
                      >
                        Subir foto desde tus archivos o galería
                      </button>
                      <span className="text-[10px] text-stone-400">JPG, PNG o WEBP</span>
                    </div>
                  </div>
                </div>

                {/* Preset suggestions */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-stone-500">O elige fotos preestablecidas:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_EXPERIENCE_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImagenUrl(preset.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                          imagenUrl === preset.url
                            ? 'bg-[#FF6B35] text-white font-bold'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Título de la Experiencia *
                  </label>
                  <input
                    type="text"
                    required
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                    placeholder="Ej. Taller de Rosquillas Tradicionales de Somoto"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Categoría *
                  </label>
                  <select
                    value={categoria}
                    onChange={e => setCategoria(e.target.value as CategoriaExp)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                  >
                    <option value={CategoriaExp.TIERRA}>Rutas de Tierra (Volcanes & Senderos)</option>
                    <option value={CategoriaExp.AGUA}>Rutas de Agua (Lagos, Ríos & Kayak)</option>
                    <option value={CategoriaExp.AIRE}>Rutas de Aire (Miradores & Vuelo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Ciudad Creativa *
                  </label>
                  <select
                    value={ciudad}
                    onChange={e => setCiudad(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                  >
                    <option value="Masaya">Masaya</option>
                    <option value="Granada">Granada</option>
                    <option value="León">León</option>
                    <option value="Estelí">Estelí</option>
                    <option value="Matagalpa">Matagalpa</option>
                    <option value="Ometepe">Ometepe (Rivas)</option>
                    <option value="San Juan de Oriente">San Juan de Oriente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Precio por Persona (USD) *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    required
                    value={precio}
                    onChange={e => setPrecio(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Duración Estimada
                  </label>
                  <input
                    type="text"
                    value={duracion}
                    onChange={e => setDuracion(e.target.value)}
                    placeholder="Ej. 3 Horas"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Descripción Detallada *
                </label>
                <textarea
                  rows={3}
                  required
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  placeholder="Describe las actividades, paradas, historia y qué aprenderán los visitantes..."
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  ¿Qué incluye la experiencia? (Separados por coma)
                </label>
                <input
                  type="text"
                  value={incluyeInput}
                  onChange={e => setIncluyeInput(e.target.value)}
                  placeholder="Guía local, Equipo de protección, Degustación típica"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#FF6B35] focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF6B35] hover:bg-[#ff5514] text-white text-xs font-bold rounded-2xl shadow-lg shadow-[#FF6B35]/25 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingExpId ? 'Guardar Cambios' : 'Publicar Experiencia'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - User / Tourist Profile & Social Media Management Screen
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MoodTag, Turista } from '../types';
import {
  User,
  Camera,
  Upload,
  Image as ImageIcon,
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Share2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  Heart,
  Compass,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Settings,
  ShieldCheck,
  LogOut,
  Users,
  Plus,
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
];

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    showToast,
    setActiveScreen,
    reservations,
    savedExperienceIds,
    logoutAccount,
  } = useApp();

  const touristUser = user as Turista;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Form states
  const [nombre, setNombre] = useState(touristUser?.nombre || 'Sofía Guevara');
  const [correo, setCorreo] = useState(touristUser?.correo || 'sofia.guevara@patadeperro.ni');
  const [telefono, setTelefono] = useState(touristUser?.telefono || '+505 8901-2345');
  const [pais, setPais] = useState(touristUser?.pais || 'Nicaragua');
  const [departamento, setDepartamento] = useState(touristUser?.departamento || 'León');
  const [ciudadOrigen, setCiudadOrigen] = useState(touristUser?.ciudad_origen || 'León');
  const [bio, setBio] = useState(
    touristUser?.bio ||
      'Viajera apasionada por el turismo comunitario, las tradiciones artesanales en barro y los paisajes volcánicos de Nicaragua.'
  );
  const [avatar, setAvatar] = useState<string>(
    touristUser?.avatar ||
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  );

  // Social networks
  const [instagram, setInstagram] = useState(touristUser?.redesSociales?.instagram || '@sofi.pata_de_perro');
  const [facebook, setFacebook] = useState(touristUser?.redesSociales?.facebook || 'facebook.com/sofia.guevara.ni');
  const [tiktok, setTiktok] = useState(touristUser?.redesSociales?.tiktok || '@sofiaguevara_travel');
  const [twitter, setTwitter] = useState(touristUser?.redesSociales?.twitter || '@sofiaguevarani');
  const [youtube, setYoutube] = useState(touristUser?.redesSociales?.youtube || '');
  const [linkedin, setLinkedin] = useState(touristUser?.redesSociales?.linkedin || '');
  const [web, setWeb] = useState(touristUser?.redesSociales?.web || 'https://patadeperro.ni/viajeros/sofia');

  // Favorite moods
  const [selectedMoods, setSelectedMoods] = useState<MoodTag[]>(
    touristUser?.moodsFavoritos || [MoodTag.AVENTURERO, MoodTag.CULTURAL, MoodTag.CREATIVO]
  );

  const [activeTab, setActiveTab] = useState<'editar' | 'vista_previa'>('editar');
  const [isDragging, setIsDragging] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Keep form in sync when active user or session changes
  useEffect(() => {
    if (touristUser) {
      if (touristUser.nombre) setNombre(touristUser.nombre);
      if (touristUser.correo) setCorreo(touristUser.correo);
      if (touristUser.telefono !== undefined) setTelefono(touristUser.telefono);
      if (touristUser.pais) setPais(touristUser.pais);
      if (touristUser.departamento) setDepartamento(touristUser.departamento);
      if (touristUser.ciudad_origen) setCiudadOrigen(touristUser.ciudad_origen);
      if (touristUser.bio !== undefined) setBio(touristUser.bio);
      if (touristUser.avatar) setAvatar(touristUser.avatar);
      if (touristUser.redesSociales) {
        setInstagram(touristUser.redesSociales.instagram || '');
        setFacebook(touristUser.redesSociales.facebook || '');
        setTiktok(touristUser.redesSociales.tiktok || '');
        setTwitter(touristUser.redesSociales.twitter || '');
        setYoutube(touristUser.redesSociales.youtube || '');
        setLinkedin(touristUser.redesSociales.linkedin || '');
        setWeb(touristUser.redesSociales.web || '');
      }
      if (touristUser.moodsFavoritos) {
        setSelectedMoods(touristUser.moodsFavoritos);
      }
    }
  }, [touristUser]);

  // Handle local gallery/file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        showToast('Foto cargada desde tu galería.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          showToast('Foto cargada exitosamente.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMood = (mood: MoodTag) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter(m => m !== mood));
    } else {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      showToast('El nombre no puede estar vacío.');
      return;
    }

    updateUserProfile({
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      pais: pais.trim(),
      departamento: departamento.trim(),
      ciudad_origen: ciudadOrigen.trim() || departamento.trim(),
      bio: bio.trim(),
      avatar: avatar,
      redesSociales: {
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        tiktok: tiktok.trim(),
        twitter: twitter.trim(),
        youtube: youtube.trim(),
        linkedin: linkedin.trim(),
        web: web.trim(),
      },
      moodsFavoritos: selectedMoods,
    });

    setJustSaved(true);
    setActiveTab('vista_previa');
    setTimeout(() => setJustSaved(false), 6000);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Top Navigation & Return Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="btn-profile-back-explore"
          onClick={() => setActiveScreen('explore')}
          className="flex items-center gap-2 text-xs font-bold text-[#23404A] hover:text-[#FF6B35] bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs transition-all font-manrope cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <button
          id="btn-profile-logout-top"
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-1.5 rounded-full border border-rose-200 transition-all font-manrope cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF6B35] text-xs font-bold uppercase tracking-wider bg-[#FF6B35]/10 border border-[#FF6B35]/20 px-3 py-1 rounded-full w-fit">
            <User className="w-3.5 h-3.5" /> Mi Perfil de Viajero
          </div>
          <h1 className="text-stone-900 text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight pt-2">
            Perfil y Redes Sociales
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm font-medium">
            Personaliza tu foto de galería, información de contacto y enlaces a tus redes públicas.
          </p>
        </div>

        {/* Tab switch between editing, public preview & user cloud files */}
        <div className="flex items-center bg-stone-200/70 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('editar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'editar'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Editar Perfil
          </button>
          <button
            onClick={() => setActiveTab('vista_previa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vista_previa'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Vista Previa Pública
          </button>
        </div>
      </div>

      {justSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-outfit text-emerald-950">
                ¡Todos tus datos han sido guardados permanentemente!
              </h4>
              <p className="text-[11px] text-emerald-700">
                Tu foto de perfil, biografía, redes sociales vinculadas y datos de contacto están protegidos y persistidos en tu cuenta.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setJustSaved(false)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {activeTab === 'vista_previa' ? (
        /* PUBLIC PROFILE CARD PREVIEW */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="relative bg-gradient-to-r from-[#23404A] to-[#162A31] rounded-2xl p-6 sm:p-8 text-white overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative">
                <img
                  src={avatar}
                  alt={nombre}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white/20 shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 bg-[#FF6B35] text-white p-1.5 rounded-xl shadow-md">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit">{nombre}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                    Viajero Verificado
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-white/80">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FFC83D]" /> {ciudadOrigen}, Nicaragua
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#FFC83D]" /> {correo}
                  </span>
                  {telefono && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#FFC83D]" /> {telefono}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-stone-200/90 pt-2 leading-relaxed max-w-2xl">
                  {bio}
                </p>
              </div>
            </div>
          </div>

          {/* Social Links Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-stone-900 font-outfit">Redes Sociales Vinculadas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-pink-50 hover:bg-pink-100/70 border border-pink-200 text-pink-700 transition-colors"
                >
                  <Instagram className="w-5 h-5 shrink-0" />
                  <div className="truncate">
                    <span className="block text-[10px] uppercase font-bold text-pink-500">Instagram</span>
                    <span className="text-xs font-semibold text-pink-900 truncate">{instagram}</span>
                  </div>
                </a>
              )}
              {facebook && (
                <a
                  href={facebook.startsWith('http') ? facebook : `https://${facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5 shrink-0" />
                  <div className="truncate">
                    <span className="block text-[10px] uppercase font-bold text-blue-500">Facebook</span>
                    <span className="text-xs font-semibold text-blue-900 truncate">{facebook}</span>
                  </div>
                </a>
              )}
              {tiktok && (
                <a
                  href={`https://tiktok.com/${tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200/70 border border-stone-300 text-stone-800 transition-colors"
                >
                  <Share2 className="w-5 h-5 shrink-0" />
                  <div className="truncate">
                    <span className="block text-[10px] uppercase font-bold text-stone-500">TikTok</span>
                    <span className="text-xs font-semibold text-stone-900 truncate">{tiktok}</span>
                  </div>
                </a>
              )}
              {twitter && (
                <a
                  href={`https://x.com/${twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100/70 border border-sky-200 text-sky-700 transition-colors"
                >
                  <Twitter className="w-5 h-5 shrink-0" />
                  <div className="truncate">
                    <span className="block text-[10px] uppercase font-bold text-sky-500">X (Twitter)</span>
                    <span className="text-xs font-semibold text-sky-900 truncate">{twitter}</span>
                  </div>
                </a>
              )}
              {web && (
                <a
                  href={web.startsWith('http') ? web : `https://${web}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 text-emerald-700 transition-colors sm:col-span-2 md:col-span-1"
                >
                  <Globe className="w-5 h-5 shrink-0" />
                  <div className="truncate">
                    <span className="block text-[10px] uppercase font-bold text-emerald-500">Sitio Web</span>
                    <span className="text-xs font-semibold text-emerald-900 truncate">{web}</span>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Travel Stats & Moods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-600 block">Estilos de Viaje Favoritos</span>
              <div className="flex flex-wrap gap-2">
                {selectedMoods.map(mood => (
                  <span
                    key={mood}
                    className="px-3 py-1 bg-[#23404A] text-white rounded-full text-xs font-bold font-outfit"
                  >
                    #{mood}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-around text-center">
              <div>
                <span className="block text-2xl font-black text-stone-900 font-outfit">
                  {reservations.length}
                </span>
                <span className="text-[11px] font-bold text-stone-500 uppercase">Reservas Realizadas</span>
              </div>
              <div className="h-8 w-px bg-stone-300"></div>
              <div>
                <span className="block text-2xl font-black text-stone-900 font-outfit">
                  {savedExperienceIds.length}
                </span>
                <span className="text-[11px] font-bold text-stone-500 uppercase">Favoritos Guardados</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('editar')}
              className="px-5 py-2.5 bg-[#FF6B35] text-white rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-[#ff5514] transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" /> Modificar mi Información
            </button>
          </div>
        </div>
      ) : (
        /* EDIT PROFILE FORM */
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar / Photo Upload from Gallery Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 font-outfit">
                Foto de Perfil (Galería o Archivos)
              </h2>
              <p className="text-xs text-stone-500">
                Sube una foto directamente desde tu dispositivo, arrastra una imagen o elige uno de los avatares prediseñados.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Current Preview */}
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt="Avatar Preview"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-stone-100 shadow-md group-hover:opacity-90 transition-opacity"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2 bg-[#FF6B35] text-white rounded-xl shadow-lg hover:bg-[#ff5514] transition-all cursor-pointer"
                  title="Cambiar foto de perfil"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Upload Drop Zone & Actions */}
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex-1 w-full border-2 border-dashed rounded-3xl p-5 text-center transition-all ${
                  isDragging
                    ? 'border-[#FF6B35] bg-[#FF6B35]/5'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="input-avatar-file"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-[#FF6B35] hover:underline cursor-pointer"
                    >
                      Haz clic para buscar en tu galería o archivos
                    </button>
                    <p className="text-[11px] text-stone-400">Formatos soportados: JPG, PNG, WEBP (Max. 5MB)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-stone-600">O elige un avatar rápido:</span>
              <div className="flex flex-wrap items-center gap-3">
                {PRESET_AVATARS.map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(presetUrl)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      avatar === presetUrl ? 'border-[#FF6B35] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={presetUrl} alt={`Preset ${idx + 1}`} className="w-12 h-12 object-cover" />
                    {avatar === presetUrl && (
                      <div className="absolute inset-0 bg-[#FF6B35]/30 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Personal Information & Contacts */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 font-outfit">
                Información Personal y Contacto
              </h2>
              <p className="text-xs text-stone-500">
                Estos datos facilitan que los anfitriones se comuniquen contigo para confirmar tus reservas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Ej. Sofía Guevara"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={e => setCorreo(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  País de Origen *
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={pais}
                    onChange={e => setPais(e.target.value)}
                    placeholder="Nicaragua"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Departamento / Región *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={departamento}
                    onChange={e => {
                      setDepartamento(e.target.value);
                      setCiudadOrigen(e.target.value);
                    }}
                    placeholder="León"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Teléfono / WhatsApp de Contacto
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={telefono}
                    onChange={e => setTelefono(e.target.value)}
                    placeholder="+505 8901-2345"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Sobre mí (Biografía o estilo de viaje)
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Escribe brevemente sobre tus gustos de viaje, experiencias favoritas o pasatiempos..."
                className="w-full p-4 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium resize-none"
              />
            </div>
          </div>

          {/* Social Media Links Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 font-outfit">
                Redes Sociales y Enlaces Públicos
              </h2>
              <p className="text-xs text-stone-500">
                Conecta tus redes para compartir tus viajes comunitarios y conectar con otros viajeros.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" /> Instagram
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="@usuario o enlace completo"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook
                </label>
                <input
                  type="text"
                  value={facebook}
                  onChange={e => setFacebook(e.target.value)}
                  placeholder="facebook.com/tu.perfil"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-stone-800" /> TikTok
                </label>
                <input
                  type="text"
                  value={tiktok}
                  onChange={e => setTiktok(e.target.value)}
                  placeholder="@tu_usuario_tiktok"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5 text-sky-600" /> X (Twitter)
                </label>
                <input
                  type="text"
                  value={twitter}
                  onChange={e => setTwitter(e.target.value)}
                  placeholder="@tu_usuario_x"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-600" /> Canal de YouTube
                </label>
                <input
                  type="text"
                  value={youtube}
                  onChange={e => setYoutube(e.target.value)}
                  placeholder="youtube.com/@tucanal"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" /> Sitio Web / Blog Personal
                </label>
                <input
                  type="text"
                  value={web}
                  onChange={e => setWeb(e.target.value)}
                  placeholder="https://tupagina.com"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-medium"
                />
              </div>
            </div>
          </div>

          {/* Interests & Moods */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 font-outfit">
                Intereses y Moods de Viaje
              </h2>
              <p className="text-xs text-stone-500">
                Selecciona tus estilos favoritos para personalizar tus recomendaciones turísticas.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {Object.values(MoodTag).map(mood => {
                const isSelected = selectedMoods.includes(mood);
                return (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => toggleMood(mood)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/25'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{mood}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setActiveScreen('settings')}
              className="text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
            >
              ← Ir a Configuración
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="px-4 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vista_previa')}
                className="flex-1 sm:flex-none px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Vista Previa
              </button>
              <button
                id="btn-save-profile"
                type="submit"
                className="flex-1 sm:flex-none px-6 py-3.5 bg-[#FF6B35] hover:bg-[#ff5514] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-[#FF6B35]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-stone-900 text-center space-y-4 shadow-2xl border border-stone-200 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#23404A] font-outfit">¿Deseas cerrar tu sesión?</h3>
            <p className="text-xs text-stone-500 font-manrope">
              Tu cuenta quedará guardada con todos sus datos y reservas actualizadas para cuando decidas volver.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-bold font-outfit transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  logoutAccount();
                  showToast('Sesión cerrada con éxito.');
                }}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold font-outfit transition-colors shadow-md shadow-rose-600/25 cursor-pointer"
              >
                Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

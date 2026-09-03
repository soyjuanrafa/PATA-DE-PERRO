/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Google Workspace View: Gmail & Google Docs Integration
 * Built according to Workspace Integration Skill with Client-side OAuth & In-Memory Token Handling
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  getWorkspaceAccessToken,
  connectGoogleWorkspace,
  clearWorkspaceAuth,
  listGmailMessages,
  sendGmailMessage,
  getGmailProfile,
  GmailMessageSummary,
  GmailProfile,
  listGoogleDocs,
  getGoogleDoc,
  createGoogleDoc,
  appendToGoogleDoc,
  GoogleDocFile,
  GoogleDocContent,
  WORKSPACE_SCOPES,
} from '../lib/googleWorkspace';
import {
  Mail,
  FileText,
  Send,
  PlusCircle,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Search,
  BookOpen,
  User,
  Sparkles,
  ChevronRight,
  LogOut,
  X,
  FilePlus,
  Paperclip,
} from 'lucide-react';

export const GoogleWorkspaceView: React.FC = () => {
  const { user, reservations, showToast } = useApp();

  // Authentication State
  const [token, setToken] = useState<string | null>(getWorkspaceAccessToken());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Workspace Subtab
  const [activeTab, setActiveTab] = useState<'gmail' | 'docs'>('gmail');

  // Gmail State
  const [gmailProfile, setGmailProfile] = useState<GmailProfile | null>(null);
  const [emails, setEmails] = useState<GmailMessageSummary[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [emailSearchQuery, setEmailSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<GmailMessageSummary | null>(null);

  // Compose Email State
  const [composeOpen, setComposeOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Email Confirmation Dialog State (Mandatory for destructive/send actions)
  const [showEmailConfirmModal, setShowEmailConfirmModal] = useState(false);

  // Google Docs State
  const [docsList, setDocsList] = useState<GoogleDocFile[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docContent, setDocContent] = useState<GoogleDocContent | null>(null);
  const [loadingDocContent, setLoadingDocContent] = useState(false);

  // Create Doc Modal & Confirmation State
  const [createDocModalOpen, setCreateDocModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('Itinerario de Viaje Comunitario - Nicaragua');
  const [docTemplateType, setDocTemplateType] = useState<'reservas' | 'bitacora' | 'vacio'>('reservas');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [createdDocResult, setCreatedDocResult] = useState<{ title: string; webViewLink: string } | null>(null);
  const [showDocConfirmModal, setShowDocConfirmModal] = useState(false);

  // Append note to existing doc state
  const [appendNoteModalOpen, setAppendNoteModalOpen] = useState(false);
  const [noteToAppend, setNoteToAppend] = useState('');
  const [isAppending, setIsAppending] = useState(false);
  const [showAppendConfirmModal, setShowAppendConfirmModal] = useState(false);

  // Sync token state on mount
  useEffect(() => {
    const currentToken = getWorkspaceAccessToken();
    setToken(currentToken);
    if (currentToken) {
      loadInitialWorkspaceData(currentToken);
    }
  }, []);

  const loadInitialWorkspaceData = async (accessToken: string) => {
    fetchGmailData(accessToken);
    fetchDocsData(accessToken);
  };

  const handleConnectGoogle = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await connectGoogleWorkspace();
      setToken(result.accessToken);
      showToast('¡Conectado exitosamente con Google Workspace!');
      loadInitialWorkspaceData(result.accessToken);
    } catch (err: any) {
      console.error('Error connecting Google Workspace:', err);
      setAuthError(err?.message || 'Error al conectar con Google Workspace');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = () => {
    clearWorkspaceAuth();
    setToken(null);
    setGmailProfile(null);
    setEmails([]);
    setDocsList([]);
    setDocContent(null);
    showToast('Sesión de Google Workspace desconectada.');
  };

  // Gmail Data Fetchers
  const fetchGmailData = async (accessToken: string) => {
    setLoadingEmails(true);
    try {
      const [profile, messages] = await Promise.all([
        getGmailProfile(accessToken).catch(() => null),
        listGmailMessages(accessToken, emailSearchQuery, 10),
      ]);
      if (profile) setGmailProfile(profile);
      setEmails(messages);
    } catch (err: any) {
      console.error('Error fetching Gmail data:', err);
    } finally {
      setLoadingEmails(false);
    }
  };

  // Docs Data Fetchers
  const fetchDocsData = async (accessToken: string) => {
    setLoadingDocs(true);
    try {
      const docs = await listGoogleDocs(accessToken, 12);
      setDocsList(docs);
    } catch (err: any) {
      console.error('Error fetching Google Docs:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleSelectDoc = async (docFile: GoogleDocFile) => {
    if (!token) return;
    setSelectedDocId(docFile.id);
    setLoadingDocContent(true);
    try {
      const content = await getGoogleDoc(token, docFile.id);
      setDocContent(content);
    } catch (err: any) {
      console.error('Error fetching doc content:', err);
      showToast('Error al leer el contenido del documento.');
    } finally {
      setLoadingDocContent(false);
    }
  };

  // Compose Quick Templates
  const applyEmailTemplate = (type: 'booking' | 'inquiry') => {
    if (type === 'booking') {
      const activeRes = reservations[0];
      setSubject(`Comprobante de Reserva - ${activeRes ? activeRes.codigo_confirmacion : 'Pata de Perro'}`);
      setBody(
        `¡Hola!\n\nTe comparto los detalles de mi reserva de turismo comunitario con Pata de Perro en Nicaragua:\n\n` +
          `• Experiencia: ${activeRes ? activeRes.experiencia.titulo : 'Ruta Cultural y Natural'}\n` +
          `• Código de Confirmación: ${activeRes ? activeRes.codigo_confirmacion : 'PDP-774921'}\n` +
          `• Fecha: ${activeRes ? activeRes.fecha : 'Próximamente'}\n` +
          `• Personas: ${activeRes ? activeRes.personas : 2}\n` +
          `• Total: $${activeRes ? activeRes.monto_total : 60} USD\n` +
          `• Anfitrión: ${activeRes ? activeRes.experiencia.anfitrion.nombre : 'Comunidad Local'}\n\n` +
          `¡Saludos cordiales!\n${user?.nombre || 'Viajero Pata de Perro'}`
      );
    } else {
      setSubject('Consulta sobre experiencia de turismo comunitario en Nicaragua');
      setBody(
        `Estimado/a anfitrión/a,\n\nMe gustaría consultar disponibilidad e itinerario para la experiencia de turismo auténtico en Nicaragua.\n\n` +
          `¿Cuáles son las recomendaciones de vestimenta y horario sugerido para encontrarnos en la comunidad?\n\n` +
          `Muchas gracias,\n${user?.nombre || 'Viajero Pata de Perro'}`
      );
    }
  };

  // Confirmed Send Email (Destructive Action - User Explicitly Approved)
  const executeSendEmail = async () => {
    if (!token) return;
    setSendingEmail(true);
    setShowEmailConfirmModal(false);

    try {
      await sendGmailMessage(token, {
        to: recipient.trim(),
        subject: subject.trim(),
        body: body.trim(),
      });
      showToast('¡Correo enviado exitosamente vía Gmail!');
      setComposeOpen(false);
      setRecipient('');
      setSubject('');
      setBody('');
      // Refresh messages
      fetchGmailData(token);
    } catch (err: any) {
      console.error('Error sending email:', err);
      showToast(err?.message || 'Error al enviar el correo por Gmail.');
    } finally {
      setSendingEmail(false);
    }
  };

  // Confirmed Create Doc (Destructive/Mutating Action - User Explicitly Approved)
  const executeCreateDoc = async () => {
    if (!token) return;
    setIsCreatingDoc(true);
    setShowDocConfirmModal(false);

    try {
      let contentText = '';
      if (docTemplateType === 'reservas') {
        contentText =
          `🐾 PATA DE PERRO - BITÁCORA Y PLAN DE VIAJE COMUNITARIO\n` +
          `Ciudades Creativas de Nicaragua: León, Granada, Masaya, Matagalpa y Ometepe\n` +
          `Generado el: ${new Date().toLocaleDateString('es-NI')}\n\n` +
          `==================================================\n` +
          `1. DATOS DEL VIAJERO\n` +
          `• Nombre: ${user?.nombre || 'Viajero Sostenible'}\n` +
          `• Correo: ${user?.correo || 'N/A'}\n` +
          `• Rol: ${user?.role || 'Turista'}\n\n` +
          `==================================================\n` +
          `2. EXPERIENCIAS Y RESERVAS ACTIVAS\n\n`;

        reservations.forEach((r, idx) => {
          contentText +=
            `[${idx + 1}] ${r.experiencia.titulo}\n` +
            `    • Código: ${r.codigo_confirmacion}\n` +
            `    • Destino: ${r.experiencia.ciudad}, ${r.experiencia.departamento}\n` +
            `    • Fecha agendada: ${r.fecha}\n` +
            `    • Anfitrión Local: ${r.experiencia.anfitrion.nombre}\n` +
            `    • Contacto Directo: ${r.experiencia.anfitrion.telefono}\n` +
            `    • Monto: $${r.monto_total} USD (${r.personas} personas)\n\n`;
        });

        contentText +=
          `==================================================\n` +
          `3. RECOMENDACIONES DE TURISMO SOSTENIBLE\n` +
          `• Respeta las normas comunitarias y costumbres locales.\n` +
          `• Usa el Simulador de Realidad Aumentada (RA) para ubicar talleres artesanales y senderos.\n` +
          `• Apoya el comercio justo adquiriendo artesanías directamente con los artesanos.\n` +
          `• No dejes residuos plásticos en volcanes, reservas o senderos naturales.\n\n` +
          `Documento sincronizado mediante Google Workspace en Pata de Perro.`;
      } else if (docTemplateType === 'bitacora') {
        contentText =
          `🐾 DIARIO DE CAMPO Y NOTAS DE VIAJE - NICARAGUA\n` +
          `Autor: ${user?.nombre || 'Viajero'}\n` +
          `Fecha de Inicio: ${new Date().toLocaleDateString('es-NI')}\n\n` +
          `Notas de Ruta, Artesanías y Sabores Tradicionales:\n` +
          `--------------------------------------------------\n` +
          `• León: Catedral y volcán Cerro Negro\n` +
          `• Masaya: Cuna del folklore y talleres de barro tradicional\n` +
          `• Granada: Isletas y arquitectura colonial\n\n` +
          `Escribe aquí tus reflexiones y vivencias con las comunidades anfitrionas...`;
      } else {
        contentText = `Documento de Viaje creado desde la plataforma Pata de Perro.\nFecha: ${new Date().toLocaleDateString('es-NI')}`;
      }

      const created = await createGoogleDoc(token, newDocTitle, contentText);
      setCreatedDocResult({ title: created.title, webViewLink: created.webViewLink });
      showToast('¡Documento creado exitosamente en Google Docs!');
      setCreateDocModalOpen(false);
      fetchDocsData(token);
    } catch (err: any) {
      console.error('Error creating doc:', err);
      showToast(err?.message || 'Error al crear documento en Google Docs.');
    } finally {
      setIsCreatingDoc(false);
    }
  };

  // Confirmed Append Note (Mutating Action - User Explicitly Approved)
  const executeAppendNote = async () => {
    if (!token || !selectedDocId) return;
    setIsAppending(true);
    setShowAppendConfirmModal(false);

    try {
      const timeStamp = new Date().toLocaleString('es-NI');
      const text = `[Actualización ${timeStamp} - Pata de Perro]:\n${noteToAppend}`;
      await appendToGoogleDoc(token, selectedDocId, text);
      showToast('¡Nota agregada correctamente al documento!');
      setAppendNoteModalOpen(false);
      setNoteToAppend('');
      // Reload content
      const updated = await getGoogleDoc(token, selectedDocId);
      setDocContent(updated);
    } catch (err: any) {
      console.error('Error appending note:', err);
      showToast(err?.message || 'Error al actualizar documento.');
    } finally {
      setIsAppending(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Google Workspace Oficial • OAuth Integrado</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Gmail & Google Docs
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Comunícate directamente con anfitriones y comunidades de Nicaragua mediante tu cuenta de Gmail,
              y exporta tus itinerarios, reservas y bitácoras de viaje hacia Google Docs en tiempo real.
            </p>
          </div>

          {/* Connection Status Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {token ? (
              <div className="flex items-center gap-3 bg-emerald-50/80 border border-emerald-200 rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  {gmailProfile?.emailAddress?.charAt(0).toUpperCase() || user?.nombre.charAt(0) || 'G'}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Conectado</span>
                  </div>
                  <p className="text-xs text-slate-600 truncate max-w-[180px]">
                    {gmailProfile?.emailAddress || user?.correo}
                  </p>
                </div>
                <button
                  onClick={handleDisconnect}
                  title="Desconectar cuenta"
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors ml-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={isAuthenticating}
                id="btn-connect-google-workspace"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white border border-slate-300 shadow-sm text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {/* Official Google G Logo SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isAuthenticating ? 'Conectando...' : 'Conectar con Google'}</span>
              </button>
            )}
          </div>
        </div>

        {authError && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}
      </div>

      {/* Workspace Tabs Navigation */}
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('gmail')}
          id="tab-gmail-switch"
          className={`flex items-center gap-2.5 px-6 py-3.5 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'gmail'
              ? 'border-[#2E9D62] text-[#2E9D62]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Gmail</span>
          {emails.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {emails.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          id="tab-docs-switch"
          className={`flex items-center gap-2.5 px-6 py-3.5 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'docs'
              ? 'border-[#2E9D62] text-[#2E9D62]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Google Docs</span>
          {docsList.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {docsList.length}
            </span>
          )}
        </button>
      </div>

      {/* Unauthenticated / Need Permission Notice */}
      {!token && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2 font-display">
            Autorización de Google Workspace Requerida
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Para acceder a tu bandeja de entrada de Gmail y gestionar tus itinerarios en Google Docs,
            autoriza a la aplicación mediante Google Sign-In con los permisos oficiales solicitados.
          </p>
          <button
            onClick={handleConnectGoogle}
            disabled={isAuthenticating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-[#2E9D62] text-white font-semibold text-sm hover:bg-[#258251] shadow-md transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAuthenticating ? 'Abriendo diálogo de Google...' : 'Autorizar Gmail & Google Docs'}</span>
          </button>
        </div>
      )}

      {/* ======================================================================
          GMAIL VIEW CONTENT
         ====================================================================== */}
      {token && activeTab === 'gmail' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Messages Column (Left) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar correos (ej. reserva, Granada)..."
                  value={emailSearchQuery}
                  onChange={e => setEmailSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchGmailData(token)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg text-sm border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E9D62]/20 focus:border-[#2E9D62]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchGmailData(token)}
                  disabled={loadingEmails}
                  title="Actualizar correos"
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingEmails ? 'animate-spin text-[#2E9D62]' : ''}`} />
                </button>

                <button
                  onClick={() => {
                    setComposeOpen(true);
                    setSelectedEmail(null);
                  }}
                  id="btn-compose-email"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2E9D62] text-white text-sm font-semibold hover:bg-[#258251] shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Redactar</span>
                </button>
              </div>
            </div>

            {/* Email List */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
              {loadingEmails && emails.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2E9D62]" />
                  <span>Cargando correos de Gmail...</span>
                </div>
              ) : emails.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-700">No se encontraron correos</p>
                  <p className="text-xs text-slate-400 mt-1">Prueba con otra búsqueda o redacta un nuevo mensaje.</p>
                </div>
              ) : (
                emails.map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedEmail(msg)}
                    className={`p-4 cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                      selectedEmail?.id === msg.id ? 'bg-emerald-50/70 border-l-4 border-[#2E9D62]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 truncate max-w-[200px]">
                          {msg.from || 'Remitente desconocido'}
                        </span>
                        {msg.date && (
                          <span className="text-[11px] text-slate-400 flex-shrink-0">
                            {new Date(msg.date).toLocaleDateString('es-NI', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate">{msg.subject || '(Sin asunto)'}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{msg.snippet}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Compose or View Selected Email */}
          <div className="lg:col-span-5 space-y-4">
            {composeOpen ? (
              /* Compose Card */
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#2E9D62]" />
                    <h3 className="font-bold text-slate-900 text-sm">Redactar Correo vía Gmail</h3>
                  </div>
                  <button
                    onClick={() => setComposeOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Templates */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Plantillas Rápidas:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyEmailTemplate('booking')}
                      className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium transition-colors"
                    >
                      + Comprobante de Reserva
                    </button>
                    <button
                      type="button"
                      onClick={() => applyEmailTemplate('inquiry')}
                      className="px-2.5 py-1 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-medium transition-colors"
                    >
                      + Consulta a Anfitrión
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Para (Correo Destinatario)</label>
                    <input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={recipient}
                      onChange={e => setRecipient(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E9D62]/20 focus:border-[#2E9D62]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Asunto</label>
                    <input
                      type="text"
                      placeholder="Asunto del correo..."
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E9D62]/20 focus:border-[#2E9D62]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mensaje</label>
                    <textarea
                      rows={6}
                      placeholder="Escribe tu mensaje aquí..."
                      value={body}
                      onChange={e => setBody(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E9D62]/20 focus:border-[#2E9D62]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setComposeOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!recipient.trim() || !subject.trim() || !body.trim()) {
                        showToast('Por favor completa todos los campos del correo.');
                        return;
                      }
                      // Trigger Mandatory Confirmation Modal
                      setShowEmailConfirmModal(true);
                    }}
                    disabled={sendingEmail || !recipient || !subject}
                    id="btn-prepare-send-email"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#2E9D62] text-white text-xs font-bold hover:bg-[#258251] shadow-sm transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Revisar y Enviar</span>
                  </button>
                </div>
              </div>
            ) : selectedEmail ? (
              /* Email Reader Card */
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Detalle del Correo
                  </span>
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{selectedEmail.subject}</h3>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>
                      <span className="font-semibold text-slate-700">De:</span> {selectedEmail.from}
                    </p>
                    {selectedEmail.date && (
                      <p>
                        <span className="font-semibold text-slate-700">Fecha:</span> {selectedEmail.date}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {selectedEmail.snippet || '(Sin vista previa)'}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={`https://mail.google.com/mail/u/0/#inbox/${selectedEmail.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#2E9D62] hover:underline font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir en Gmail</span>
                  </a>

                  <button
                    onClick={() => {
                      setComposeOpen(true);
                      setRecipient(selectedEmail.from?.match(/<([^>]+)>/)?.[1] || selectedEmail.from || '');
                      setSubject(`Re: ${selectedEmail.subject}`);
                      setBody(`\n\n--- Mensaje original ---\n${selectedEmail.snippet}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Responder</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Placeholder Instructions */
              <div className="bg-slate-50/80 rounded-xl border border-dashed border-slate-200 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#2E9D62] flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Gestiona tus correos de turismo</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Selecciona un correo de la lista para leer su detalle o haz clic en "Redactar" para enviar un mensaje
                  con plantillas de reservas.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          GOOGLE DOCS VIEW CONTENT
         ====================================================================== */}
      {token && activeTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Docs List Column (Left) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2E9D62]" />
                <h3 className="font-bold text-slate-900 text-sm">Documentos en Google Drive</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchDocsData(token)}
                  disabled={loadingDocs}
                  title="Actualizar documentos"
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingDocs ? 'animate-spin text-[#2E9D62]' : ''}`} />
                </button>

                <button
                  onClick={() => setCreateDocModalOpen(true)}
                  id="btn-open-create-doc"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2E9D62] text-white text-xs font-bold hover:bg-[#258251] shadow-sm transition-colors"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Nuevo Doc</span>
                </button>
              </div>
            </div>

            {/* Document Cards */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
              {loadingDocs ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2E9D62]" />
                  <span>Cargando documentos desde Google Drive...</span>
                </div>
              ) : docsList.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-700">Aún no tienes documentos listados</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Crea tu primera bitácora o itinerario comunitario de Nicaragua en Google Docs.
                  </p>
                  <button
                    onClick={() => setCreateDocModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Crear Itinerario Comunitario</span>
                  </button>
                </div>
              ) : (
                docsList.map(docItem => (
                  <div
                    key={docItem.id}
                    onClick={() => handleSelectDoc(docItem)}
                    className={`p-4 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                      selectedDocId === docItem.id ? 'bg-emerald-50/70 border-l-4 border-[#2E9D62]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-800 truncate">{docItem.name}</p>
                        {docItem.modifiedTime && (
                          <p className="text-[11px] text-slate-400">
                            Modificado: {new Date(docItem.modifiedTime).toLocaleDateString('es-NI')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {docItem.webViewLink && (
                        <a
                          href={docItem.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          title="Abrir en pestaña de Google Docs"
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Doc Content Viewer & Append Actions (Right) */}
          <div className="lg:col-span-6 space-y-4">
            {selectedDocId && docContent ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Google Doc Activo
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1 truncate">{docContent.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAppendNoteModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Agregar Nota</span>
                    </button>
                    <a
                      href={`https://docs.google.com/document/d/${docContent.documentId}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Editar en Google Docs"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Content Body Preview */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 max-h-[380px] overflow-y-auto text-xs sm:text-sm text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
                  {docContent.bodyText || '(Documento vacío o sin texto legible)'}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>ID: {docContent.documentId.substring(0, 14)}...</span>
                  <a
                    href={`https://docs.google.com/document/d/${docContent.documentId}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2E9D62] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>Abrir documento completo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : loadingDocContent ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-8 shadow-sm text-center text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2E9D62]" />
                <span className="text-sm">Leyendo contenido de Google Docs...</span>
              </div>
            ) : (
              <div className="bg-slate-50/80 rounded-xl border border-dashed border-slate-200 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Visualizador de Documentos</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Selecciona un documento de la lista para ver su contenido o crea un nuevo Itinerario Comunitario
                  sincronizado.
                </p>
                <button
                  onClick={() => setCreateDocModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2E9D62] text-white text-xs font-bold hover:bg-[#258251] shadow-sm transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Crear Itinerario Comunitario</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          MANDATORY CONFIRMATION MODALS (Workspace Integration Skill Directive)
         ====================================================================== */}

      {/* 1. Gmail Send Confirmation Modal */}
      {showEmailConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">¿Confirmas el envío de este correo?</h3>
                <p className="text-xs text-slate-500">Se enviará directamente desde tu cuenta de Gmail.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2">
              <p>
                <span className="font-semibold text-slate-700">Destinatario:</span> {recipient}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Asunto:</span> {subject}
              </p>
              <div className="pt-1 border-t border-slate-200">
                <span className="font-semibold text-slate-700">Vista previa del mensaje:</span>
                <p className="text-slate-600 line-clamp-3 mt-0.5">{body}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEmailConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeSendEmail}
                id="btn-confirm-send-email"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E9D62] text-white text-xs font-bold hover:bg-[#258251] shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirmar y Enviar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Create Google Doc Modal & Confirmation */}
      {createDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-[#2E9D62]" />
                <h3 className="font-bold text-slate-900 text-base">Crear Documento en Google Docs</h3>
              </div>
              <button
                onClick={() => setCreateDocModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Documento</label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={e => setNewDocTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E9D62]/20 focus:border-[#2E9D62]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Plantilla de Contenido</label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="template"
                      checked={docTemplateType === 'reservas'}
                      onChange={() => setDocTemplateType('reservas')}
                      className="mt-0.5 text-[#2E9D62]"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Itinerario y Reservas Comunitarias</p>
                      <p className="text-[11px] text-slate-500">
                        Exporta tus reservas actuales, anfitriones, teléfonos de contacto y pautas de turismo sostenible.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="template"
                      checked={docTemplateType === 'bitacora'}
                      onChange={() => setDocTemplateType('bitacora')}
                      className="mt-0.5 text-[#2E9D62]"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Diario de Campo y Bitácora de Viaje</p>
                      <p className="text-[11px] text-slate-500">
                        Estructura para registrar notas sobre volcanes, artesanos locales y gastronomía tradicional.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCreateDocModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newDocTitle.trim()) {
                    showToast('Por favor introduce un título para el documento.');
                    return;
                  }
                  setShowDocConfirmModal(true);
                }}
                id="btn-prepare-create-doc"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E9D62] text-white text-xs font-bold hover:bg-[#258251] shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Continuar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation for Document Creation */}
      {showDocConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-blue-600">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">¿Crear este documento en Google Drive?</h3>
                <p className="text-xs text-slate-500">Se añadirá directamente a tus archivos de Google Docs.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5">
              <p>
                <span className="font-semibold text-slate-700">Título:</span> {newDocTitle}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Tipo de plantilla:</span>{' '}
                {docTemplateType === 'reservas' ? 'Itinerario de Reservas Comunitarias' : 'Diario de Campo'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDocConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeCreateDoc}
                disabled={isCreatingDoc}
                id="btn-confirm-create-doc"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E9D62] text-white text-xs font-bold hover:bg-[#258251] shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCreatingDoc ? 'Creando...' : 'Confirmar y Crear'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Append Note Modal & Confirmation */}
      {appendNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Añadir Nota al Documento</h3>
              <button
                onClick={() => setAppendNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Texto a agregar a "{docContent?.title}"
              </label>
              <textarea
                rows={4}
                placeholder="Ejemplo: Reunión con el taller de cerámica en San Juan de Oriente acordada para las 10:00 AM..."
                value={noteToAppend}
                onChange={e => setNoteToAppend(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E9D62]/20 focus:border-[#2E9D62]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAppendNoteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!noteToAppend.trim()) {
                    showToast('Por favor ingresa el texto de la nota.');
                    return;
                  }
                  setShowAppendConfirmModal(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E9D62] text-white text-xs font-bold hover:bg-[#258251] shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Revisar y Agregar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation for Appending Note */}
      {showAppendConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">¿Confirmas la actualización del documento?</h3>
                <p className="text-xs text-slate-500">Se agregará el nuevo párrafo al final de tu Google Doc.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">Contenido a agregar:</span>
              <p className="text-slate-600 mt-1">{noteToAppend}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAppendConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeAppendNote}
                disabled={isAppending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E9D62] text-white text-xs font-bold hover:bg-[#258251] shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isAppending ? 'Guardando...' : 'Confirmar y Guardar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

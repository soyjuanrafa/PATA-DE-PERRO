/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * User Files & Cloud Storage Management Component
 * Allows authenticated users to upload, view, download and delete their own files.
 * Enforces per-user security rules and stores file metadata in Firestore.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { UserFile } from '../types';
import {
  uploadUserFileBackend,
  getUserFilesBackend,
  deleteUserFileBackend,
} from '../lib/backendService';
import { isFirebaseConfigured } from '../lib/firebase';
import {
  Upload,
  File,
  FileText,
  Image,
  Trash2,
  Download,
  Eye,
  ShieldCheck,
  Lock,
  Cloud,
  FolderOpen,
  Calendar,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  FileCheck,
} from 'lucide-react';

export const UserFilesManager: React.FC = () => {
  const { user, showToast } = useApp();
  const currentUserId = user
    ? 'id_turista' in user
      ? user.id_turista
      : user.id_anfitrion
    : '';

  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFileCategory, setSelectedFileCategory] = useState<'document' | 'photo' | 'ticket' | 'story' | 'other'>('document');
  const [fileDescription, setFileDescription] = useState('');
  const [previewFile, setPreviewFile] = useState<UserFile | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user files from backend Firestore
  const loadFiles = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const userFiles = await getUserFilesBackend(currentUserId);
      setFiles(userFiles);
    } catch (e) {
      console.error('Error loading files:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [currentUserId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0 || !currentUserId) return;

    const file = fileList[0];

    // Max 10MB check
    if (file.size > 10 * 1024 * 1024) {
      showToast('El archivo supera el límite recomendado de 10 MB.');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadUserFileBackend(
        currentUserId,
        file,
        selectedFileCategory,
        fileDescription
      );

      if (result.success && result.userFile) {
        showToast('¡Archivo subido y cifrado exitosamente en la nube!');
        setFileDescription('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        await loadFiles();
      } else {
        showToast(result.message || 'Error al subir el archivo.');
      }
    } catch (e: any) {
      showToast(e?.message || 'Error al procesar el archivo.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!currentUserId) return;
    try {
      const success = await deleteUserFileBackend(currentUserId, fileId);
      if (success) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        setDeleteConfirmId(null);
        showToast('Archivo eliminado de tu almacenamiento en la nube.');
      } else {
        showToast('No se pudo eliminar el archivo.');
      }
    } catch (e) {
      showToast('Error al eliminar archivo.');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-NI', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getFileIcon = (type: string, category?: string) => {
    if (type.startsWith('image/') || category === 'photo') {
      return <Image className="w-5 h-5 text-emerald-600" />;
    }
    if (type.includes('pdf') || category === 'document' || category === 'ticket') {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }
    return <File className="w-5 h-5 text-amber-600" />;
  };

  const totalStorageUsed = files.reduce((acc, f) => acc + (f.fileSize || 0), 0);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 md:p-8">
      {/* Header with Security Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
              <Cloud className="w-6 h-6 text-emerald-600" />
              Mis Archivos y Documentos en la Nube
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Seguridad Firestore RLS Activa
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Almacena, visualiza y gestiona tus boletos de viaje, fotos de experiencias y documentos personales. Cada archivo está protegido y solo tú puedes acceder a él.
          </p>
        </div>

        {/* Cloud Status Indicator */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 flex items-center gap-2 text-xs">
            <HardDrive className="w-4 h-4 text-stone-500" />
            <span className="text-stone-600 font-medium">Espacio usado:</span>
            <span className="font-bold text-slate-800">{formatBytes(totalStorageUsed)}</span>
          </div>
          <button
            onClick={loadFiles}
            disabled={loading}
            className="p-2 text-stone-500 hover:text-emerald-600 hover:bg-stone-100 rounded-xl transition-colors"
            title="Recargar archivos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-emerald-50/40 border border-dashed border-emerald-300 rounded-2xl p-6 mb-8 text-center transition-all hover:bg-emerald-50/60">
        <input
          ref={fileInputRef}
          type="file"
          id="cloud-file-input"
          className="hidden"
          onChange={handleFileUpload}
          disabled={uploading}
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-emerald-200 mx-auto flex items-center justify-center text-emerald-600">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Subir nuevo archivo o comprobante
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Imágenes (JPG, PNG), boletos (PDF), comprobantes de reserva o documentos (hasta 10 MB)
            </p>
          </div>

          {/* Category selection */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {(['document', 'ticket', 'photo', 'story', 'other'] as const).map(cat => {
              const labels = {
                document: 'Documento',
                ticket: 'Boleto / Ticket',
                photo: 'Foto',
                story: 'Historia',
                other: 'Otro',
              };
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFileCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    selectedFileCategory === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {labels[cat]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Descripción o nota (opcional, ej: Ticket Cerro Negro)"
              value={fileDescription}
              onChange={e => setFileDescription(e.target.value)}
              className="flex-1 text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Seleccionar archivo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-stone-500" />
            Tus Archivos Almacenados ({files.length})
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Aislamiento por usuario garantizado</span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-stone-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Consultando tu almacenamiento privado en Firestore...</span>
          </div>
        ) : files.length === 0 ? (
          <div className="py-12 text-center bg-stone-50/50 rounded-2xl border border-stone-200/60 p-6">
            <FolderOpen className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-stone-600">No tienes archivos en tu almacenamiento en la nube todavía</p>
            <p className="text-[11px] text-stone-400 mt-1 max-w-sm mx-auto">
              Utiliza el área de arriba para subir comprobantes de tus reservas, fotos de la ruta o boletos de viaje.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {files.map(f => (
              <div
                key={f.id}
                className="bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-md rounded-2xl p-4 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0">
                        {getFileIcon(f.fileType, f.category)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 truncate" title={f.fileName}>
                          {f.fileName}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          {formatBytes(f.fileSize)} • {f.category || 'archivo'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {f.description && (
                    <p className="text-[11px] text-stone-600 bg-stone-50 rounded-lg p-2 mb-3 line-clamp-2">
                      {f.description}
                    </p>
                  )}
                </div>

                <div className="border-t border-stone-100 pt-3 mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(f.uploadDate)}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* View Preview */}
                    <button
                      onClick={() => setPreviewFile(f)}
                      className="p-1.5 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Ver archivo"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Download */}
                    <a
                      href={f.downloadUrl}
                      download={f.fileName}
                      className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Descargar archivo"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>

                    {/* Delete */}
                    {deleteConfirmId === f.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteFile(f.id)}
                          className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="p-1 text-stone-400 hover:text-stone-600 text-[10px]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(f.id)}
                        className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar archivo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-800 truncate">{previewFile.fileName}</h4>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center bg-stone-50 min-h-[300px]">
              {previewFile.fileType.startsWith('image/') ? (
                <img
                  src={previewFile.downloadUrl}
                  alt={previewFile.fileName}
                  className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-sm"
                />
              ) : (
                <div className="text-center p-8 bg-white rounded-2xl border border-stone-200 shadow-sm max-w-sm">
                  <FileText className="w-16 h-16 text-emerald-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800">{previewFile.fileName}</p>
                  <p className="text-xs text-stone-500 mt-1 mb-4">
                    {formatBytes(previewFile.fileSize)} • {previewFile.fileType}
                  </p>
                  <a
                    href={previewFile.downloadUrl}
                    download={previewFile.fileName}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Descargar para visualizar
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-200 bg-white flex items-center justify-between text-xs text-stone-500">
              <span>Subido el: {formatDate(previewFile.uploadDate)}</span>
              <a
                href={previewFile.downloadUrl}
                download={previewFile.fileName}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

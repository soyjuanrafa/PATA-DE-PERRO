/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Instagram-Style Multi-Place Experience Stories Viewer & Community Publisher
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { Experiencia, ExperienceStory, PublishedStoryReview, UserStory } from '../types';
import { getStoriesForExperience } from '../data/storiesData';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Camera,
  Video,
  MessageSquare,
  Star,
  Check,
  Sparkles,
  ArrowLeft,
  Home,
  Compass,
  Heart,
  User,
  Quote,
  MapPin,
  Calendar,
  Share2,
  Send,
  Trash2,
  Plus,
  Flame,
  ThumbsUp,
  Smile,
} from 'lucide-react';

interface ExperienceStoriesModalProps {
  experience: Experiencia | null;
  onClose: () => void;
  onStoryPublished?: (review: PublishedStoryReview) => void;
  initialMode?: 'viewer' | 'upload_user_story' | 'user_stories';
  customStories?: UserStory[];
}

type StoryFlowStep =
  | 'viewing'
  | 'finished_choice'
  | 'feedback_rating'
  | 'published_celebration';

export const ExperienceStoriesModal: React.FC<ExperienceStoriesModalProps> = ({
  experience,
  onClose,
  onStoryPublished,
  initialMode = 'viewer',
  customStories,
}) => {
  const {
    experiences,
    setActiveScreen,
    showToast,
    addPublishedStoryReview,
    userStories,
    addUserStory,
    deleteUserStory,
    openOrCreateChatThread,
    sendChatMessage,
    user,
  } = useApp();
  const { t } = useTranslation();

  // Stories to display: If customStories provided (viewing a community traveler story), use that;
  // otherwise strictly use the active logged-in user's own stories.
  const storiesToDisplay = customStories && customStories.length > 0 ? customStories : userStories;
  const isViewingCustomCommunityStory = !!(customStories && customStories.length > 0);

  // Playlist of all experiences with stories
  const playlist = experiences.length > 0 ? experiences : experience ? [experience] : [];
  const initialExpIndex = experience
    ? playlist.findIndex(e => e.id_exp === experience.id_exp)
    : 0;

  const [currentExpIndex, setCurrentExpIndex] = useState<number>(
    initialExpIndex >= 0 ? initialExpIndex : 0
  );
  const activeExp: Experiencia = playlist[currentExpIndex] || experience || playlist[0];

  // Stories for current experience
  const stories: ExperienceStory[] = activeExp
    ? getStoriesForExperience(
        activeExp.id_exp,
        activeExp.titulo,
        activeExp.anfitrion_nombre,
        activeExp.imagen_url
      )
    : [];

  // Viewer state
  const [isViewingUserStories, setIsViewingUserStories] = useState<boolean>(
    (initialMode === 'user_stories' || isViewingCustomCommunityStory) && storiesToDisplay.length > 0
  );
  const [currentUserStoryIndex, setCurrentUserStoryIndex] = useState<number>(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [flowStep, setFlowStep] = useState<StoryFlowStep>(
    initialMode === 'upload_user_story' || (initialMode === 'user_stories' && storiesToDisplay.length === 0) || (initialMode === 'viewer' && stories.length === 0)
      ? 'finished_choice'
      : 'viewing'
  );

  // Floating reaction particles
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [replyMessage, setReplyMessage] = useState<string>('');

  // Sharing form state (Screen 1 & 2)
  const [selectedExpIdForReview, setSelectedExpIdForReview] = useState<string>(
    activeExp?.id_exp || playlist[0]?.id_exp || ''
  );
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [opinionText, setOpinionText] = useState<string>('');
  const [adventureRating, setAdventureRating] = useState<number>(5);
  const [hostRating, setHostRating] = useState<number>(5);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStory: ExperienceStory | undefined = stories[currentSlideIndex];
  const activeUserStory: UserStory | undefined = storiesToDisplay[currentUserStoryIndex];
  const storyDuration = (isViewingUserStories ? 6 : (currentStory?.duration || 6)) * 1000; // in ms

  const isOwnerOfActiveStory = useMemo(() => {
    if (!activeUserStory) return true;
    if (isViewingCustomCommunityStory) return false;
    const currentUserId = user ? ('id_turista' in user ? user.id_turista : user.id_anfitrion) : null;
    const currentUserEmail = user?.correo?.trim().toLowerCase();
    if (activeUserStory.userId && currentUserId && activeUserStory.userId === currentUserId) return true;
    if (activeUserStory.userEmail && currentUserEmail && activeUserStory.userEmail.toLowerCase() === currentUserEmail) return true;
    if (activeUserStory.userId && currentUserEmail && activeUserStory.userId.toLowerCase() === currentUserEmail) return true;
    return !customStories;
  }, [activeUserStory, user, customStories, isViewingCustomCommunityStory]);

  // Advance to next user story
  const advanceToNextUserStory = useCallback(() => {
    if (currentUserStoryIndex < storiesToDisplay.length - 1) {
      setCurrentUserStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      setFlowStep('finished_choice');
    }
  }, [currentUserStoryIndex, storiesToDisplay.length]);

  // Go to previous user story
  const goToPreviousUserStory = useCallback(() => {
    if (currentUserStoryIndex > 0) {
      setCurrentUserStoryIndex(prev => prev - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  }, [currentUserStoryIndex]);

  // Advance to next story slide or next place in playlist
  const advanceToNextStory = useCallback(() => {
    if (isViewingUserStories) {
      advanceToNextUserStory();
      return;
    }

    if (currentSlideIndex < stories.length - 1) {
      // Advance to next slide within same place
      setCurrentSlideIndex(prev => prev + 1);
      setProgress(0);
    } else {
      // Reached the end of this place's stories -> Advance to next place!
      if (currentExpIndex < playlist.length - 1) {
        const nextIndex = currentExpIndex + 1;
        setCurrentExpIndex(nextIndex);
        setCurrentSlideIndex(0);
        setProgress(0);
        setSelectedExpIdForReview(playlist[nextIndex]?.id_exp || '');
      } else {
        // No more stories from any place -> Show End of Stories / Share Screen!
        setFlowStep('finished_choice');
      }
    }
  }, [isViewingUserStories, advanceToNextUserStory, currentSlideIndex, stories.length, currentExpIndex, playlist]);

  // Go to previous story slide or previous place
  const goToPreviousStory = useCallback(() => {
    if (isViewingUserStories) {
      goToPreviousUserStory();
      return;
    }

    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentExpIndex > 0) {
      // Go to previous place's last slide
      const prevIndex = currentExpIndex - 1;
      const prevExp = playlist[prevIndex];
      const prevStories = getStoriesForExperience(
        prevExp.id_exp,
        prevExp.titulo,
        prevExp.anfitrion_nombre,
        prevExp.imagen_url
      );
      setCurrentExpIndex(prevIndex);
      setCurrentSlideIndex(Math.max(0, prevStories.length - 1));
      setProgress(0);
      setSelectedExpIdForReview(prevExp.id_exp);
    } else {
      setProgress(0);
    }
  }, [isViewingUserStories, goToPreviousUserStory, currentSlideIndex, currentExpIndex, playlist]);

  // Timer loop for auto-advance
  useEffect(() => {
    if (flowStep !== 'viewing' || isPaused) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    progressIntervalRef.current = setInterval(() => {
      setProgress(oldProgress => {
        const next = oldProgress + (stepMs / storyDuration) * 100;
        if (next >= 100) {
          advanceToNextStory();
          return 0;
        }
        return next;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [flowStep, isPaused, isViewingUserStories, currentSlideIndex, currentUserStoryIndex, currentExpIndex, storyDuration, advanceToNextStory]);

  // Keyboard navigation & accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flowStep !== 'viewing') return;
      if (e.key === 'ArrowRight') advanceToNextStory();
      if (e.key === 'ArrowLeft') goToPreviousStory();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(p => !p);
      }
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flowStep, advanceToNextStory, goToPreviousStory, onClose]);

  // Handle Photo Upload (STRICT IMAGE ONLY)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        showToast('Solo se permiten imágenes (JPG, PNG, WEBP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedPhotos(prev => [...prev, reader.result as string]);
          showToast('¡Foto agregada a tu historia!');
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  // Handle Video Upload (STRICT VIDEO ONLY)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Solo se permiten archivos de video (MP4, WEBM, MOV)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedVideoUrl(reader.result as string);
        showToast('¡Video cargado con éxito para tu historia!');
      }
    };
    reader.readAsDataURL(file);

    if (e.target) e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setUploadedVideoUrl(null);
  };

  // Add floating reaction
  const triggerReaction = (emoji: string) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: 30 + Math.random() * 40,
    };
    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 1800);
  };

  // Send reply message to host chat
  const handleSendReply = () => {
    if (!replyMessage.trim() || !activeExp) return;
    const threadId = openOrCreateChatThread(
      activeExp,
      activeExp.id_anfitrion,
      activeExp.anfitrion_nombre,
      `Respuesta a tu historia "${currentStory?.title || activeExp.titulo}": ${replyMessage}`
    );
    sendChatMessage(threadId, replyMessage);
    showToast(`Mensaje enviado a ${activeExp.anfitrion_nombre}`);
    setReplyMessage('');
    triggerReaction('🐾');
  };

  // Publish Story Handler with durable local persistence
  const handlePublishStory = () => {
    const expForReview =
      playlist.find(e => e.id_exp === selectedExpIdForReview) || activeExp;

    const sharedTypes: ('foto' | 'video' | 'historia')[] = [];
    if (uploadedPhotos.length > 0) sharedTypes.push('foto');
    if (uploadedVideoUrl) sharedTypes.push('video');
    if (opinionText.trim()) sharedTypes.push('historia');
    if (sharedTypes.length === 0) sharedTypes.push('historia');

    const publishedData: PublishedStoryReview = {
      id: `story_rev_${Date.now()}`,
      experienceId: expForReview.id_exp,
      experienceTitle: expForReview.titulo,
      experienceImage: expForReview.imagen_url,
      authorName: user?.nombre || 'Tú (Pata de Perro)',
      authorAvatar: user?.avatar,
      sharedTypes,
      photos: uploadedPhotos,
      videoUrl: uploadedVideoUrl || undefined,
      comment: opinionText.trim() || '¡Increíble experiencia y conexión comunitaria con Pata de Perro!',
      adventureRating,
      hostRating,
      publishedAt: new Date().toISOString(),
    };

    // Save into persistent AppContext state
    addPublishedStoryReview(publishedData);

    if (onStoryPublished) {
      onStoryPublished(publishedData);
    }

    setFlowStep('published_celebration');
    showToast('¡Historia publicada y guardada con éxito!');
  };

  if (!activeExp) return null;

  return (
    <div
      id="experience-stories-modal"
      className="fixed inset-0 z-50 bg-[#162A31]/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 overflow-y-auto"
    >
      {/* Container matching mobile Instagram stories viewport */}
      <div className="relative w-full sm:max-w-md h-full sm:h-[92vh] sm:max-h-[820px] sm:rounded-3xl bg-[#FAF6F0] overflow-hidden shadow-2xl flex flex-col justify-between border border-stone-200">
        
        {/* ========================================================================= */}
        {/* STEP 1: ACTIVE STORY VIEWER SCREEN (User's Own Story OR Community Story) */}
        {/* ========================================================================= */}
        {flowStep === 'viewing' && isViewingUserStories && storiesToDisplay.length > 0 && activeUserStory && (
          <div className="relative w-full h-full flex flex-col justify-between bg-black select-none overflow-hidden">
            {/* Background Media: Photo or Video */}
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
              {activeUserStory.type === 'video' ? (
                <video
                  src={activeUserStory.mediaUrl}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={resolveImageUrl(activeUserStory.mediaUrl)}
                  onError={e => handleImageFallback(e, activeUserStory.mediaUrl)}
                  alt={activeUserStory.title || 'Tu historia'}
                  className="w-full h-full object-cover animate-fade-in"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/75 pointer-events-none" />
            </div>

            {/* Top Control Bar & Segments */}
            <div className="relative z-20 p-4 space-y-3">
              {/* Progress Segments */}
              <div className="flex items-center gap-1.5 w-full">
                {storiesToDisplay.map((s, idx) => {
                  let fillPercent = 0;
                  if (idx < currentUserStoryIndex) fillPercent = 100;
                  else if (idx === currentUserStoryIndex) fillPercent = progress;

                  return (
                    <div
                      key={s.id || idx}
                      className="flex-1 h-1.5 rounded-full bg-white/30 overflow-hidden"
                    >
                      <div
                        className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* User Info & Controls */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-full border-2 border-[#FF5722] overflow-hidden bg-white/20 shrink-0">
                    {activeUserStory.authorAvatar || user?.avatar ? (
                      <img
                        src={resolveImageUrl(activeUserStory.authorAvatar || user?.avatar || '')}
                        alt={activeUserStory.authorName || user?.nombre || 'Tú'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-orange-100 flex items-center justify-center text-[#FF5722]">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black font-outfit text-white leading-tight truncate">
                        {activeUserStory.authorName || user?.nombre || 'Tú'}
                      </span>
                      <span className="text-[10px] bg-[#FF5722] text-white px-2 py-0.2 rounded-full font-bold shrink-0">
                        {isOwnerOfActiveStory ? t('story.yourStory', 'Tu historia') : 'Comunidad'}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/80 font-manrope truncate max-w-[160px] sm:max-w-[200px]">
                      {activeUserStory.title || activeUserStory.location || 'Nicaragua'}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  

                  {/* Add another story button (only for owner) */}
                  {isOwnerOfActiveStory && (
                    <button
                      id="user-story-add-another-btn"
                      onClick={() => {
                        setIsPaused(true);
                        setUploadedPhotos([]);
                        setUploadedVideoUrl(null);
                        setOpinionText('');
                        setFlowStep('finished_choice');
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#FF5722] hover:bg-[#e04a1b] text-white text-[10px] font-black font-outfit flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      title="Subir otra historia (+)"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Subir otra</span>
                    </button>
                  )}

                  {/* Delete this user story (only for owner) */}
                  {isOwnerOfActiveStory && (
                    <button
                      id="user-story-delete-btn"
                      onClick={() => {
                        deleteUserStory(activeUserStory.id);
                        showToast('Historia eliminada');
                        if (storiesToDisplay.length <= 1) {
                          setFlowStep('finished_choice');
                        } else {
                          setCurrentUserStoryIndex(prev => Math.max(0, prev - 1));
                          setProgress(0);
                        }
                      }}
                      className="w-8 h-8 rounded-full bg-red-600/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Eliminar esta historia"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setIsPaused(p => !p)}
                    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
                    title={isPaused ? 'Reanudar' : 'Pausar'}
                  >
                    {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
                    title={t('story.close', 'Cerrar')}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Counter Indicator */}
              <div className="flex items-center justify-between text-[11px] text-white/80 font-ibm-plex">
                <span className="bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  Foto / Video {currentUserStoryIndex + 1} de {storiesToDisplay.length}
                </span>
                <span className="bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  {activeUserStory.date || 'Hoy'}
                </span>
              </div>
            </div>

            {/* Tap Navigation Zones (Left / Right) */}
            <div className="absolute inset-0 z-10 flex">
              <div
                className="w-1/3 h-full cursor-pointer"
                onClick={goToPreviousStory}
                title="Historia anterior"
              />
              <div
                className="w-2/3 h-full cursor-pointer"
                onClick={advanceToNextStory}
                title="Siguiente historia"
              />
            </div>

            {/* Bottom Content Overlay */}
            <div className="relative z-20 p-4 space-y-3 text-white">
              {activeUserStory.location && (
                <div className="inline-flex items-center gap-1.5 bg-[#FF5722] text-white px-3 py-1 rounded-full text-xs font-bold font-outfit shadow-md">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeUserStory.location}</span>
                </div>
              )}

              <div className="space-y-1">
                {activeUserStory.title && (
                  <h2 className="text-xl sm:text-2xl font-black font-outfit leading-tight text-white drop-shadow-md">
                    {activeUserStory.title}
                  </h2>
                )}
                {activeUserStory.caption && (
                  <p className="text-xs sm:text-sm font-medium text-white/90 font-manrope leading-relaxed drop-shadow-xs">
                    "{activeUserStory.caption}"
                  </p>
                )}
              </div>

              {/* Quick Switch Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <button
                  onClick={() => {
                    setIsPaused(true);
                    setUploadedPhotos([]);
                    setUploadedVideoUrl(null);
                    setOpinionText('');
                    setFlowStep('finished_choice');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#FF5722] hover:bg-[#e04a1b] text-white text-xs font-bold font-outfit flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Subir otra historia</span>
                </button>

                <button
                  onClick={() => {
                    setIsViewingUserStories(false);
                    setCurrentSlideIndex(0);
                    setCurrentExpIndex(0);
                    setProgress(0);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold font-outfit flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
                >
                  <span>Ver historias comunitarias</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: ACTIVE COMMUNITY STORY VIEWER SCREEN (Instagram Style) */}
        {/* ========================================================================= */}
        {flowStep === 'viewing' && !isViewingUserStories && currentStory && (
          <div className="relative w-full h-full flex flex-col justify-between bg-black select-none overflow-hidden">
            {/* Background Media */}
            <div className="absolute inset-0 z-0">
              <img
                src={resolveImageUrl(currentStory.mediaUrl)}
                onError={e => handleImageFallback(e, currentStory.mediaUrl)}
                alt={currentStory.title}
                className="w-full h-full object-cover animate-fade-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/70 pointer-events-none" />
            </div>

            {/* Floating reactions overlay */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              {reactions.map(r => (
                <span
                  key={r.id}
                  className="absolute bottom-20 text-3xl animate-bounce"
                  style={{
                    left: `${r.x}%`,
                    animation: 'floatUp 1.8s ease-out forwards',
                  }}
                >
                  {r.emoji}
                </span>
              ))}
            </div>

            {/* Top Control Bar & Segments */}
            <div className="relative z-20 p-4 space-y-3">
              {/* Progress Segments */}
              <div className="flex items-center gap-1.5 w-full">
                {stories.map((s, idx) => {
                  let fillPercent = 0;
                  if (idx < currentSlideIndex) fillPercent = 100;
                  else if (idx === currentSlideIndex) fillPercent = progress;

                  return (
                    <div
                      key={s.id || idx}
                      className="flex-1 h-1.5 rounded-full bg-white/30 overflow-hidden"
                    >
                      <div
                        className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Host & Controls Info */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-full border-2 border-[#FF5722] overflow-hidden bg-white/20 shrink-0">
                    <img
                      src={
                        activeExp.anfitrion_avatar ||
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={activeExp.anfitrion_nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black font-outfit text-white leading-tight truncate">
                        {activeExp.anfitrion_nombre}
                      </span>
                      <span className="text-[10px] bg-[#2E9D62] text-white px-2 py-0.2 rounded-full font-bold shrink-0">
                        {activeExp.ciudad_creativa}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/80 font-manrope truncate max-w-[160px] sm:max-w-[200px]">
                      {activeExp.titulo}
                    </p>
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  

                  <button
                    id="story-open-upload-btn"
                    onClick={() => {
                      setIsPaused(true);
                      setFlowStep('finished_choice');
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#FF5722] text-white text-[10px] font-black font-outfit flex items-center gap-1 hover:bg-[#e04a1b] transition-colors cursor-pointer shadow-xs"
                    title="Subir fotos o videos"
                  >
                    <Camera className="w-3 h-3" />
                    <span>+ Tu historia</span>
                  </button>

                  <button
                    id="story-pause-toggle-btn"
                    onClick={() => setIsPaused(p => !p)}
                    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
                    title={isPaused ? 'Reanudar' : 'Pausar'}
                  >
                    {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
                  </button>

                  <button
                    id="story-mute-toggle-btn"
                    onClick={() => setIsMuted(m => !m)}
                    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
                    title={isMuted ? 'Activar sonido' : 'Silenciar'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    id="story-close-btn"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
                    title={t('story.close', 'Cerrar')}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Multi-place Navigation Pill Indicator */}
              <div className="flex items-center justify-between text-[11px] text-white/80 font-ibm-plex">
                <span className="bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  Lugar {currentExpIndex + 1} de {playlist.length}: {activeExp.ciudad_creativa}
                </span>
                <span className="bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  Slide {currentSlideIndex + 1}/{stories.length}
                </span>
              </div>
            </div>

            {/* Tap Navigation Zones (Left / Right) */}
            <div className="absolute inset-0 z-10 flex">
              <div
                className="w-1/3 h-full cursor-pointer"
                onClick={goToPreviousStory}
                title="Historia anterior"
              />
              <div
                className="w-2/3 h-full cursor-pointer"
                onClick={advanceToNextStory}
                title="Siguiente historia"
              />
            </div>

            {/* Bottom Story Overlays & Instagram Reply / Reaction Bar */}
            <div className="relative z-20 p-4 space-y-3 text-white">
              {/* Cultural Tag Pill */}
              {currentStory.culturalElement && (
                <div className="inline-flex items-center gap-1.5 bg-[#FF5722] text-white px-3 py-1 rounded-full text-xs font-bold font-outfit shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentStory.culturalElement}</span>
                </div>
              )}

              {/* Story Title & Description */}
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black font-outfit leading-tight text-white drop-shadow-md">
                  {currentStory.title}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-white/90 font-manrope leading-relaxed drop-shadow-xs">
                  {currentStory.description}
                </p>
              </div>

              {/* Host Quote Callout */}
              {currentStory.quote && (
                <div className="p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/20 flex items-start gap-2.5">
                  <Quote className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs italic text-white/95 leading-snug">
                      "{currentStory.quote}"
                    </p>
                    <p className="text-[10px] text-[#FF5722] font-bold">
                      — {currentStory.quoteAuthor || activeExp.anfitrion_nombre}
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Navigation Buttons (Previous / Next place) */}
              <div className="flex items-center justify-between pt-1">
                {currentExpIndex > 0 ? (
                  <button
                    onClick={goToPreviousStory}
                    className="text-[11px] text-white/90 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-colors backdrop-blur-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Lugar anterior</span>
                  </button>
                ) : <div />}

                <button
                  onClick={advanceToNextStory}
                  className="text-[11px] text-white font-bold bg-[#FF5722] hover:bg-[#e04a1b] px-3.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                >
                  <span>
                    {currentExpIndex === playlist.length - 1 && currentSlideIndex === stories.length - 1
                      ? 'Compartir mi historia →'
                      : 'Siguiente lugar →'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Instagram Quick Reply & Reaction Bar */}
              <div className="pt-2 border-t border-white/20 flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                    placeholder={`Responder a ${activeExp.anfitrion_nombre}...`}
                    className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 text-xs text-white placeholder-white/70 focus:outline-hidden focus:ring-1 focus:ring-white"
                  />
                  {replyMessage.trim() && (
                    <button
                      onClick={handleSendReply}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-[#FF5722] p-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quick Emoji Reactions */}
                <button
                  onClick={() => triggerReaction('❤️')}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-transform hover:scale-110 cursor-pointer"
                  title="Me encanta"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>

                <button
                  onClick={() => triggerReaction('🐾')}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-transform hover:scale-110 cursor-pointer"
                  title="Pata de Perro"
                >
                  <span className="text-sm">🐾</span>
                </button>

                <button
                  onClick={() => triggerReaction('🔥')}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-transform hover:scale-110 cursor-pointer"
                  title="Increíble"
                >
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Enlace de la historia copiado al portapapeles');
                  }}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-transform hover:scale-110 cursor-pointer"
                  title="Compartir historia"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: ¿YA VIVISTE TU EXPERIENCIA? COMPÁRTELA CON NOSOTROS */}
        {/* ========================================================================= */}
        {flowStep === 'finished_choice' && (
          <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 overflow-y-auto bg-[#FAF6F0] text-[#1E293B]">
            <div className="space-y-4 pt-1">
              {/* Top Navigation & Close Bar */}
              <div className="flex items-center justify-between">
                <button
                  id="btn-choice-back-stories"
                  onClick={() => {
                    if (storiesToDisplay.length > 0) {
                      setIsViewingUserStories(true);
                      setFlowStep('viewing');
                    } else {
                      setIsViewingUserStories(false);
                      setFlowStep('viewing');
                      setCurrentSlideIndex(0);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-200 text-stone-700 text-xs font-bold font-outfit hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{storiesToDisplay.length > 0 ? 'Volver a historias' : 'Explorar historias'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Two Orange Paw Prints */}
              <div className="flex justify-center items-center gap-2 text-[#FF5722]">
                <span className="text-3xl filter drop-shadow-xs">🐾</span>
              </div>

              {/* Header Title: ¿Ya viviste tu experiencia? ¡Compártela con nosotros! */}
              <div className="space-y-1 text-center">
                <h1 className="text-2xl sm:text-3xl font-black text-[#FF5722] font-outfit uppercase tracking-tight bg-white">
                  {t('story.didYouLive', '¿Ya viviste tu experiencia?')}
                </h1>
                <p className="text-lg font-black text-[#23404A] font-outfit">
                  {t('story.shareWithUs', '¡Compártela con nosotros!')}
                </p>
                <p className="text-xs text-stone-600 font-medium font-manrope max-w-xs mx-auto pt-0.5">
                  {t(
                    'story.shareMoments',
                    'Sube tus fotos, videos o reseña para inspirar a toda la comunidad de viajeros.'
                  )}
                </p>
              </div>

              {/* Experience Selector Dropdown */}
              <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-xs space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 uppercase font-outfit">
                  ¿De qué lugar o experiencia es tu historia?
                </label>
                <select
                  value={selectedExpIdForReview}
                  onChange={e => setSelectedExpIdForReview(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#FF5722]"
                >
                  {playlist.map(exp => (
                    <option key={exp.id_exp} value={exp.id_exp}>
                      {exp.titulo} — {exp.ciudad_creativa} ({exp.anfitrion_nombre})
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Header Pill: ¿QUÉ QUIERES COMPARTIR? */}
              <div>
                <div className="bg-[#FF5722] text-white font-black text-xs sm:text-sm py-2 px-6 rounded-2xl text-center uppercase tracking-wider font-outfit shadow-sm">
                  {t('story.whatToShare', '¿QUÉ QUIERES COMPARTIR?')}
                </div>
              </div>

              {/* Two Functional Upload Channels: Subir fotos / Subir videos */}
              <div className="grid grid-cols-2 gap-3">
                {/* 1. Subir fotos (Strict image/* only) */}
                <div className="space-y-1">
                  <button
                    id="upload-photos-btn"
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className={`w-full p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      uploadedPhotos.length > 0
                        ? 'bg-orange-50/90 border-[#FF5722] text-[#FF5722] shadow-sm'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-orange-300'
                    }`}
                  >
                    <Camera className="w-6 h-6 text-[#FF5722]" />
                    <span className="text-xs font-black font-outfit text-stone-800">
                      {t('story.addPhotos', 'Subir fotos')}
                    </span>
                    <span className="text-[10px] text-stone-500 font-manrope text-center leading-tight">
                      Solo imágenes (JPG, PNG, WEBP)
                    </span>
                    {uploadedPhotos.length > 0 && (
                      <span className="text-[10px] bg-[#2E9D62] text-white px-2 py-0.5 rounded-full font-bold mt-1">
                        {uploadedPhotos.length} {uploadedPhotos.length === 1 ? 'foto' : 'fotos'}
                      </span>
                    )}
                  </button>

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>

                {/* 2. Subir videos (Strict video/* only) */}
                <div className="space-y-1">
                  <button
                    id="upload-videos-btn"
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className={`w-full p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      uploadedVideoUrl
                        ? 'bg-orange-50/90 border-[#FF5722] text-[#FF5722] shadow-sm'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-orange-300'
                    }`}
                  >
                    <Video className="w-6 h-6 text-[#2E9D62]" />
                    <span className="text-xs font-black font-outfit text-stone-800">
                      {t('story.addVideos', 'Subir videos')}
                    </span>
                    <span className="text-[10px] text-stone-500 font-manrope text-center leading-tight">
                      Solo videos (MP4, WEBM, MOV)
                    </span>
                    {uploadedVideoUrl && (
                      <span className="text-[10px] bg-[#2E9D62] text-white px-2 py-0.5 rounded-full font-bold mt-1">
                        Video cargado
                      </span>
                    )}
                  </button>

                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </div>
              </div>

              {/* Photo Previews Gallery */}
              {uploadedPhotos.length > 0 && (
                <div className="space-y-1.5 bg-white rounded-2xl p-3 border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Fotos seleccionadas ({uploadedPhotos.length})</span>
                    <button
                      type="button"
                      onClick={() => setUploadedPhotos([])}
                      className="text-[11px] text-red-500 hover:underline cursor-pointer"
                    >
                      Eliminar todas
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedPhotos.map((photo, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-stone-200">
                        <img src={photo} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Preview */}
              {uploadedVideoUrl && (
                <div className="space-y-1.5 bg-white rounded-2xl p-3 border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Video seleccionado</span>
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="text-[11px] text-red-500 hover:underline cursor-pointer"
                    >
                      Eliminar video
                    </button>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-black aspect-video relative">
                    <video
                      src={uploadedVideoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* 3. Cuéntanos tu experiencia text area */}
              <div className="space-y-2">
                <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <MessageSquare className="w-4 h-4 text-[#FF5722]" />
                    <span>Cuéntanos tu historia (Opcional)</span>
                  </div>
                  <textarea
                    rows={3}
                    value={opinionText}
                    onChange={e => setOpinionText(e.target.value)}
                    placeholder="¿Cómo viviste esta aventura comunitaria? Comparte tus impresiones, consejos o anécdotas..."
                    className="w-full text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden resize-none font-manrope font-medium leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Buttons: Direct Publish or Continue & Rate */}
            <div className="pt-4 pb-2 space-y-2">
              <button
                id="story-continue-rating-btn"
                type="button"
                onClick={() => setFlowStep('feedback_rating')}
                className="w-full py-3.5 px-6 rounded-full bg-[#FF5722] hover:bg-[#e04a1b] text-white font-black text-sm uppercase tracking-wider font-outfit shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t('story.continue', 'CONTINUAR Y CALIFICAR')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {(uploadedPhotos.length > 0 || uploadedVideoUrl || opinionText.trim()) && (
                <button
                  id="story-quick-publish-btn"
                  type="button"
                  onClick={handlePublishStory}
                  className="w-full py-2.5 px-4 rounded-full bg-[#2E9D62] hover:bg-[#258352] text-white font-bold text-xs uppercase tracking-wider font-outfit transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Publicar historia directamente</span>
                </button>
              )}

              
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: CALIFICACIONES Y COMPARTIR DEFINITIVO */}
        {/* ========================================================================= */}
        {flowStep === 'feedback_rating' && (
          <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 overflow-y-auto bg-[#FAF6F0] text-[#1E293B]">
            <div className="space-y-4">
              {/* Back to previous choice */}
              <div className="flex items-center justify-between">
                <button
                  id="btn-rating-back"
                  onClick={() => setFlowStep('finished_choice')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF5722] text-white text-xs font-bold font-outfit hover:bg-[#e04a1b] transition-colors cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('story.myStory', 'Mi historia')}</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Summary Card of Media Ready to Publish */}
              <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-[#FF5722] uppercase tracking-wider block">
                  Resumen de tu historia
                </span>
                <p className="text-xs font-black text-stone-900 font-outfit">
                  {playlist.find(e => e.id_exp === selectedExpIdForReview)?.titulo || activeExp.titulo}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-stone-600 font-medium">
                  {uploadedPhotos.length > 0 && (
                    <span className="bg-orange-100 text-[#FF5722] px-2 py-0.5 rounded-md font-bold">
                      📸 {uploadedPhotos.length} fotos
                    </span>
                  )}
                  {uploadedVideoUrl && (
                    <span className="bg-emerald-100 text-[#2E9D62] px-2 py-0.5 rounded-md font-bold">
                      🎬 1 video
                    </span>
                  )}
                  {opinionText.trim() && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">
                      ✍️ Reseña escrita
                    </span>
                  )}
                </div>
              </div>

              {/* 1. ¿CÓMO CALIFICARÍAS TU AVENTURA? */}
              <div className="space-y-2 text-center">
                <div className="bg-[#FF5722] text-white font-black text-xs sm:text-sm py-2 px-6 rounded-2xl text-center uppercase tracking-wider font-outfit shadow-sm">
                  {t('story.rateAdventure', '¿CÓMO CALIFICARÍAS TU AVENTURA?')}
                </div>
                <div className="flex items-center justify-center gap-2.5 py-1">
                  {[1, 2, 3, 4, 5].map(star => {
                    const isFilled = star <= adventureRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setAdventureRating(star)}
                        className="p-1 text-[#FF5722] hover:scale-115 transition-transform cursor-pointer"
                        title={`${star} estrellas`}
                      >
                        <Star
                          className={`w-8 h-8 sm:w-9 sm:h-9 ${
                            isFilled
                              ? 'fill-[#FF5722] text-[#FF5722]'
                              : 'text-[#FF5722] stroke-[1.8]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. ¿Y TU ANFITRIÓN/A? */}
              <div className="space-y-2 text-center">
                <div className="bg-[#FF5722] text-white font-black text-xs sm:text-sm py-2 px-6 rounded-2xl text-center uppercase tracking-wider font-outfit shadow-sm">
                  {t('story.rateHost', `¿Y TU ANFITRIÓN/A? (${activeExp.anfitrion_nombre})`)}
                </div>
                <div className="flex items-center justify-center gap-2.5 py-1">
                  {[1, 2, 3, 4, 5].map(star => {
                    const isFilled = star <= hostRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setHostRating(star)}
                        className="p-1 text-[#FF5722] hover:scale-115 transition-transform cursor-pointer"
                        title={`${star} estrellas`}
                      >
                        <Star
                          className={`w-8 h-8 sm:w-9 sm:h-9 ${
                            isFilled
                              ? 'fill-[#FF5722] text-[#FF5722]'
                              : 'text-[#FF5722] stroke-[1.8]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Button: COMPARTIR */}
            <div className="pt-4 pb-2 space-y-2">
              <button
                id="story-publish-submit-btn"
                type="button"
                onClick={handlePublishStory}
                className="w-full py-4 px-6 rounded-full bg-[#FF5722] hover:bg-[#e04a1b] text-white font-black text-sm uppercase tracking-wider font-outfit shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>{t('story.share', 'COMPARTIR HISTORIA')}</span>
              </button>

              
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: ¡HISTORIA PUBLICADA! CELEBRATION (Page 3 layout) */}
        {/* ========================================================================= */}
        {flowStep === 'published_celebration' && (
          <div className="relative w-full h-full flex flex-col justify-between p-6 bg-[#FAF6F0] overflow-hidden">
            {/* Curved dashed trail background (SVG Pata de Perro track line) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
              viewBox="0 0 400 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M -50 120 C 150 100, 320 20, 200 240 C 90 440, 360 480, 220 700 C 120 860, 420 900, 350 1000"
                stroke="#FF5722"
                strokeWidth="14"
                strokeDasharray="24 18"
                strokeLinecap="round"
              />
            </svg>

            {/* Center Content: Two Orange Paw Prints and ¡HISTORIA PUBLICADA! */}
            <div className="my-auto text-center relative z-10 space-y-4 animate-scale-up">
              <div className="flex justify-center items-center gap-3">
                <span className="text-4xl text-[#FF5722] filter drop-shadow-md">🐾</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#FF5722] font-outfit uppercase tracking-tight leading-tight whitespace-pre-line">
                {t('story.published', '¡HISTORIA\nPUBLICADA!')}
              </h1>

              <p className="text-xs font-bold text-stone-700 font-manrope max-w-xs mx-auto leading-relaxed">
                ¡Tu historia se guardó exitosamente y ya forma parte de la red viva de Pata de Perro!
              </p>

              {/* Direct Story Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5 max-w-xs mx-auto">
                <button
                  id="view-my-new-story-btn"
                  onClick={() => {
                    setIsViewingUserStories(true);
                    setCurrentUserStoryIndex(0);
                    setProgress(0);
                    setIsPaused(false);
                    setFlowStep('viewing');
                  }}
                  className="w-full py-3 px-5 rounded-full bg-[#FF5722] hover:bg-[#e04a1b] text-white font-black text-xs uppercase tracking-wider font-outfit shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>👁️ VER MI HISTORIA RECIÉN SUBIDA</span>
                </button>

                <button
                  id="upload-another-story-btn"
                  onClick={() => {
                    setUploadedPhotos([]);
                    setUploadedVideoUrl(null);
                    setOpinionText('');
                    setFlowStep('finished_choice');
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-800 font-bold text-xs font-outfit transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Subir otra foto o video</span>
                </button>

                
              </div>
            </div>

            {/* Bottom Navigation Dock (Matching Page 3 screenshot) */}
            <div className="relative z-10 pb-2">
              <div className="bg-[#23404A] text-[#FFF8F1] rounded-2xl p-2.5 shadow-xl border border-white/20 flex items-center justify-around">
                <button
                  onClick={onClose}
                  className="flex flex-col items-center gap-0.5 text-xs font-bold text-white hover:text-[#FF5722] transition-colors cursor-pointer"
                >
                  <Home className="w-5 h-5" />
                  <span className="text-[10px]">{t('nav.home', 'Inicio')}</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex flex-col items-center gap-0.5 text-xs font-bold text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Compass className="w-5 h-5" />
                  <span className="text-[10px]">{t('nav.explore', 'Explorar')}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    setActiveScreen('reservations');
                  }}
                  className="flex flex-col items-center gap-0.5 text-xs font-bold text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Heart className="w-5 h-5" />
                  <span className="text-[10px]">{t('nav.favorites', 'Favoritos')}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    setActiveScreen('profile');
                  }}
                  className="flex flex-col items-center gap-0.5 text-xs font-bold text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <User className="w-5 h-5" />
                  <span className="text-[10px]">{t('nav.profile', 'Perfil')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

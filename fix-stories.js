const fs = require('fs');
let content = fs.readFileSync('src/components/ExperienceStoriesModal.tsx', 'utf8');

// 1. Remove user-story-home button
content = content.replace(/\{\/\* Home \/ Inicio Button \*\/\}\s*<button\s*id="btn-user-story-home"[\s\S]*?<\/button>/, '');

// 2. Revert onClose change in btn-user-story-close
content = content.replace(/onClick=\{\(\) => \{\s*onClose\(\);\s*setActiveScreen\('explore'\);\s*\}\}/g, 'onClick={onClose}');

// 3. Remove btn-community-story-home
content = content.replace(/\{\/\* Home \/ Inicio Button \*\/\}\s*<button\s*id="btn-community-story-home"[\s\S]*?<\/button>/, '');

// 4. In finished_choice: remove btn-choice-home and the div wrapper
const finishedChoiceHomeBtn = `                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-choice-home"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#23404A] text-white text-xs font-bold font-outfit hover:bg-[#162A31] transition-colors cursor-pointer shadow-xs"
                    title="Ir al Inicio"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Inicio</span>
                  </button>

                  <button
                    id="btn-choice-close"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-300 transition-colors cursor-pointer"
                    title="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>`;
const originalChoiceCloseBtn = `                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>`;
content = content.replace(finishedChoiceHomeBtn, originalChoiceCloseBtn);

// 5. Remove btn-choice-cancel-home
content = content.replace(/<button\s*id="btn-choice-cancel-home"[\s\S]*?Cancelar y volver al Inicio\s*<\/button>/, '');

// 6. In feedback_rating: remove btn-rating-home and the div wrapper
const ratingHomeBtn = `                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-rating-home"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#23404A] text-white text-xs font-bold font-outfit hover:bg-[#162A31] transition-colors cursor-pointer shadow-xs"
                    title="Ir al Inicio"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Inicio</span>
                  </button>

                  <button
                    id="btn-rating-close"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-300 transition-colors cursor-pointer"
                    title="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>`;
content = content.replace(ratingHomeBtn, originalChoiceCloseBtn);

// 7. Remove btn-rating-cancel-home
content = content.replace(/<button\s*id="btn-rating-cancel-home"[\s\S]*?Cancelar y volver al Inicio\s*<\/button>/, '');

// 8. Remove celebration-go-home-btn
content = content.replace(/<button\s*id="celebration-go-home-btn"[\s\S]*?<span>Volver al Inicio<\/span>\s*<\/button>/, '');

// 9. Remove Celebration explore button changes
content = content.replace(/setActiveScreen/g, 'setActiveScreen'); // No-op, just to check if there are others

fs.writeFileSync('src/components/ExperienceStoriesModal.tsx', content);

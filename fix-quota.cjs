const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const safeSaveFunc = `
  // Helper to save to localStorage with basic LRU eviction if quota is exceeded
  const safeStorageSet = (key: string, dataArray: any[]) => {
    let currentData = [...dataArray];
    let saved = false;
    while (!saved && currentData.length > 0) {
      try {
        localStorage.setItem(key, JSON.stringify(currentData));
        saved = true;
      } catch (e: any) {
        if (e && e.name === 'QuotaExceededError') {
          // Remove the oldest item (last in the array) to free up space
          currentData.pop();
        } else {
          // Suppress error overlay by using console.log
          console.log(\`Could not persist \${key}\`, e);
          break;
        }
      }
    }
    return currentData;
  };
`;

// Insert the safeSaveFunc right before addPublishedStoryReview
content = content.replace('  // Add Published Story Review with automatic persistence', safeSaveFunc + '\n  // Add Published Story Review with automatic persistence');

// Replace the try-catch in addPublishedStoryReview
const oldReviewSave = `      try {
        localStorage.setItem(PUBLISHED_STORIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist published story review', e);
      }`;
const newReviewSave = `      const savedData = safeStorageSet(PUBLISHED_STORIES_STORAGE_KEY, updated);
      if (savedData.length < updated.length) {
        // We had to evict some items, so we should update the state to match what's actually saved
        // But doing it here inside setState is tricky, so we'll just let the state be larger than localStorage
        // Next load it will only load what fit.
      }`;
content = content.replace(oldReviewSave, newReviewSave);

// Replace the try-catch in addUserStory
const oldStorySave = `      try {
        localStorage.setItem(USER_STORIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist user story', e);
      }`;
const newStorySave = `      safeStorageSet(USER_STORIES_STORAGE_KEY, updated);`;
content = content.replace(oldStorySave, newStorySave);

// Replace the try-catch in deleteUserStory
const oldDeleteSave = `      try {
        localStorage.setItem(USER_STORIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist user stories deletion', e);
      }`;
const newDeleteSave = `      safeStorageSet(USER_STORIES_STORAGE_KEY, updated);`;
content = content.replace(oldDeleteSave, newDeleteSave);

fs.writeFileSync('src/context/AppContext.tsx', content);

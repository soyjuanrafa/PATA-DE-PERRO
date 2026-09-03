/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Google Workspace Integration Service: Gmail & Google Docs
 * Implements client-side OAuth with Firebase Auth & in-memory token caching
 */

import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { auth } from './firebase';

export const WORKSPACE_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.readonly',
];

// In-memory token cache (NEVER persisted to localStorage/sessionStorage)
let inMemoryAccessToken: string | null = null;
let currentGoogleUser: User | null = null;

// Configure dedicated Google Workspace OAuth Provider with required scopes
export const googleWorkspaceProvider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach(scope => {
  googleWorkspaceProvider.addScope(scope);
});
googleWorkspaceProvider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

/**
 * Retrieve the current in-memory access token
 */
export const getWorkspaceAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

/**
 * Update the in-memory access token
 */
export const setWorkspaceAccessToken = (token: string | null, user: User | null = null): void => {
  inMemoryAccessToken = token;
  currentGoogleUser = user;
};

/**
 * Clear cached credentials on sign-out
 */
export const clearWorkspaceAuth = (): void => {
  inMemoryAccessToken = null;
  currentGoogleUser = null;
};

/**
 * Connect to Google Workspace and acquire OAuth access token
 */
export async function connectGoogleWorkspace(): Promise<{
  user: User;
  accessToken: string;
}> {
  try {
    const result = await signInWithPopup(auth, googleWorkspaceProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el token de acceso de Google Workspace.');
    }

    inMemoryAccessToken = credential.accessToken;
    currentGoogleUser = result.user;

    return {
      user: result.user,
      accessToken: credential.accessToken,
    };
  } catch (error: any) {
    console.error('Error al autorizar Google Workspace:', error);
    throw error;
  }
}

/* ==========================================================================
   Gmail API Integration
   ========================================================================== */

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
}

export interface GmailSendPayload {
  to: string;
  subject: string;
  body: string;
}

/**
 * Fetch Gmail user profile
 */
export async function getGmailProfile(accessToken: string): Promise<GmailProfile> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al obtener perfil de Gmail (${response.status})`);
  }

  return await response.json();
}

/**
 * List messages from Gmail
 */
export async function listGmailMessages(
  accessToken: string,
  query: string = '',
  maxResults: number = 10
): Promise<GmailMessageSummary[]> {
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', maxResults.toString());
  if (query) {
    url.searchParams.set('q', query);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al listar correos de Gmail (${response.status})`);
  }

  const data = await response.json();
  const rawList: { id: string; threadId: string }[] = data.messages || [];

  // Fetch details for each message in parallel (up to maxResults)
  const summaries = await Promise.all(
    rawList.slice(0, 8).map(async (msg) => {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!detailRes.ok) return { id: msg.id, threadId: msg.threadId };
        const detail = await detailRes.json();
        const headers: Array<{ name: string; value: string }> = detail.payload?.headers || [];
        const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(Sin asunto)';
        const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || '';
        const to = headers.find(h => h.name.toLowerCase() === 'to')?.value || '';
        const date = headers.find(h => h.name.toLowerCase() === 'date')?.value || '';

        return {
          id: msg.id,
          threadId: msg.threadId,
          snippet: detail.snippet || '',
          subject,
          from,
          to,
          date,
        };
      } catch {
        return { id: msg.id, threadId: msg.threadId };
      }
    })
  );

  return summaries;
}

/**
 * Send an email using Gmail API
 * Note: Must always be preceded by explicit user confirmation dialog
 */
export async function sendGmailMessage(
  accessToken: string,
  payload: GmailSendPayload
): Promise<{ id: string; threadId: string }> {
  // Construct RFC 2822 email format
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(payload.subject)))}?=`;
  const messageParts = [
    `To: ${payload.to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    payload.body,
  ];
  const rawMessage = messageParts.join('\r\n');
  
  // Safe Base64URL encoding
  const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedMessage }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al enviar correo por Gmail (${response.status})`);
  }

  return await response.json();
}

/* ==========================================================================
   Google Docs API Integration
   ========================================================================== */

export interface GoogleDocFile {
  id: string;
  name: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

export interface GoogleDocContent {
  documentId: string;
  title: string;
  bodyText: string;
  revisionId?: string;
}

/**
 * List Google Docs created or accessible by the user
 */
export async function listGoogleDocs(
  accessToken: string,
  pageSize: number = 10
): Promise<GoogleDocFile[]> {
  const query = "mimeType='application/vnd.google-apps.document' and trashed=false";
  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', query);
  url.searchParams.set('pageSize', pageSize.toString());
  url.searchParams.set('fields', 'files(id, name, createdTime, modifiedTime, webViewLink, iconLink)');
  url.searchParams.set('orderBy', 'modifiedTime desc');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al listar documentos en Google Drive (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Fetch text content of a specific Google Doc
 */
export async function getGoogleDoc(
  accessToken: string,
  documentId: string
): Promise<GoogleDocContent> {
  const response = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al leer Google Doc (${response.status})`);
  }

  const data = await response.json();
  let fullText = '';

  if (data.body?.content) {
    for (const elem of data.body.content) {
      if (elem.paragraph?.elements) {
        for (const part of elem.paragraph.elements) {
          if (part.textRun?.content) {
            fullText += part.textRun.content;
          }
        }
      }
    }
  }

  return {
    documentId: data.documentId,
    title: data.title || 'Documento sin título',
    bodyText: fullText.trim(),
    revisionId: data.revisionId,
  };
}

/**
 * Create a new Google Document with formatted itinerary / notes
 * Note: Must always be preceded by explicit user confirmation dialog
 */
export async function createGoogleDoc(
  accessToken: string,
  title: string,
  initialContent: string
): Promise<{ documentId: string; title: string; webViewLink: string }> {
  // Step 1: Create empty Google Doc
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al crear Google Doc (${createRes.status})`);
  }

  const docData = await createRes.json();
  const documentId = docData.documentId;

  // Step 2: Insert initial text at index 1 if provided
  if (initialContent && initialContent.trim().length > 0) {
    const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: initialContent,
            },
          },
        ],
      }),
    });

    if (!updateRes.ok) {
      console.warn('Document created, but initial batchUpdate failed:', await updateRes.text());
    }
  }

  return {
    documentId,
    title: docData.title || title,
    webViewLink: `https://docs.google.com/document/d/${documentId}/edit`,
  };
}

/**
 * Append text to an existing Google Document
 * Note: Must always be preceded by explicit user confirmation dialog
 */
export async function appendToGoogleDoc(
  accessToken: string,
  documentId: string,
  textToAppend: string
): Promise<boolean> {
  // Fetch document to locate end index
  const docRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!docRes.ok) {
    throw new Error(`Error al verificar documento (${docRes.status})`);
  }

  const doc = await docRes.json();
  const content = doc.body?.content || [];
  const lastElement = content[content.length - 1];
  const insertIndex = Math.max(1, (lastElement?.endIndex || 2) - 1);

  const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: insertIndex },
            text: `\n\n${textToAppend}`,
          },
        },
      ],
    }),
  });

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al actualizar documento (${updateRes.status})`);
  }

  return true;
}

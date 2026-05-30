const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Fetch advisor recommendations using SSE stream
 * @param {Object} preferences - User preferences object
 * @param {String} token - JWT token for authentication
 * @param {Function} onChunk - Callback for each text chunk (content)
 * @param {Function} onError - Callback for error messages
 * @param {Function} onDone - Callback when streaming is done
 * @returns {AbortController} - Controller to abort request if needed
 */
export function streamRecommendations(preferences, token, onChunk, onError, onDone) {
  const controller = new AbortController();
  const signal = controller.signal;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  fetch(`${API_URL}/advisor/recommend`, {
    method: 'POST',
    headers,
    body: JSON.stringify(preferences),
    signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is empty or streaming not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last partial line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            try {
              const data = JSON.parse(dataStr);
              if (data.type === 'chunk') {
                onChunk(data.content);
              } else if (data.type === 'error') {
                onError(data.content);
              } else if (data.type === 'done') {
                onDone();
              }
            } catch (e) {
              console.error('Failed to parse SSE message:', dataStr, e);
            }
          }
        }
      }
    })
    .catch((err) => {
      if (err.name === 'AbortError') {
        console.log('Stream aborted by user');
      } else {
        onError(err.message || 'Failed to connect to AI advisor.');
      }
    });

  return controller;
}

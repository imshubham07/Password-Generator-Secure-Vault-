let clearClipboardTimeout: NodeJS.Timeout | null = null;

export async function copyToClipboard(
  text: string, 
  clearAfterMs: number = 15000
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    
    // Clear any existing timeout
    if (clearClipboardTimeout) {
      clearTimeout(clearClipboardTimeout);
    }
    
    // Set up auto-clear
    clearClipboardTimeout = setTimeout(async () => {
      try {
        // Check if clipboard still contains our text before clearing
        const currentClipboard = await navigator.clipboard.readText();
        if (currentClipboard === text) {
          await navigator.clipboard.writeText('');
        }
      } catch (error) {
        console.warn('Could not clear clipboard:', error);
      }
    }, clearAfterMs);
    
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        // Set up fallback auto-clear (less reliable)
        setTimeout(() => {
          try {
            document.execCommand('copy', false, '');
          } catch (fallbackError) {
            console.warn('Could not clear clipboard with fallback method');
          }
        }, clearAfterMs);
        
        return true;
      }
      
      return false;
    } catch (fallbackError) {
      console.error('Fallback clipboard copy failed:', fallbackError);
      return false;
    }
  }
}

export function clearClipboardImmediate(): void {
  if (clearClipboardTimeout) {
    clearTimeout(clearClipboardTimeout);
    clearClipboardTimeout = null;
  }
  
  navigator.clipboard?.writeText('').catch(() => {
    // Ignore errors when clearing clipboard
  });
}

// Check if clipboard API is available
export function isClipboardSupported(): boolean {
  return typeof navigator !== 'undefined' && 
         typeof navigator.clipboard !== 'undefined' &&
         typeof navigator.clipboard.writeText === 'function';
}

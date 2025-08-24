// Create a new file for auth utilities
export const getAuthHeader = () => {
  return {
    'Content-Type': 'application/json'
    // Add any other headers your backend expects
  };
}; 
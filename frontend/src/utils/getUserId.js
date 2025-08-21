// Utility function to get user ID from user object
export const getUserId = (user) => {
  if (!user) return null;
  
  // Try different possible ID fields
  return user._id || user.id || null;
};

// Utility function to check if user has valid ID
export const hasValidUserId = (user) => {
  const id = getUserId(user);
  return id && id !== 'undefined' && id !== undefined;
};
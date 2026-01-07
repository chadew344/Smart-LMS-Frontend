export const getErrorMessage = (error: any, defaultMessage: string): string => {
  return error.response?.data?.message || error.message || defaultMessage;
};

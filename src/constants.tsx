export const getAPIURL = () => {
  const apiURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!apiURL) {
    throw new Error("Missing API_URL env var");
  }
  return apiURL;
};

export const isJWT = (token) => {
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }
  //   Each parts should be base64 string. So I want to convert part into utf-8 and if not valid base64 string then it throw an error
  try {
    parts.forEach((part) => {
      Buffer.from(part, "base64").toString("utf-8");
    });
    return true;
  } catch (error) {
    return false;
  }
};

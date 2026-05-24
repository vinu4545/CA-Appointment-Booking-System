export async function signInAdmin() {
  return {
    authenticated: true,
    message: 'Mock admin authentication complete.',
  };
}

export async function signOutAdmin() {
  return {
    authenticated: false,
    message: 'Mock admin session cleared.',
  };
}

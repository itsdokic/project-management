function logout() {
    localStorage.removeItem('jwt');
    location.assign('/login');
}
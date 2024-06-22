const token = localStorage.getItem('jwt');

if (token) {
    const decodedToken = jwtDecode(token);

    if (decodedToken.role !== 'Worker') {
        localStorage.removeItem('jwt');
        location.assign('/login');
    }
}
else {
    location.assign('/login');
}

const client_scheme = process.env.SCHEME || 'http';
const client_host = process.env.HOST || 'localhost';
const client_port = process.env.PORT || '3000';

// Defines global scheme (protocol), hostname (host), and port.
const clientApi = `${client_scheme}://${client_host}:${client_port}`;

export default clientApi;

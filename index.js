const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// {
//     "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFDQUY4RTY2NzcyRDZEQzAyOEQ2NzI2RkQwMjYxNTgxNTcwRUZDMTkiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJISy1PWm5jdGJjQW8xbkp2MENZVmdWY09fQmsifQ.eyJuYmYiOjE2NzE5NzUyMTUsImV4cCI6MTY3MTk3NzAxNSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS54ZXJvLmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkueGVyby5jb20vcmVzb3VyY2VzIiwiY2xpZW50X2lkIjoiNkJCOUVBNjVFRDhBNDMzMkJBNDRGQkJDQjVEMTY1NkMiLCJzdWIiOiI5MWE1ZmNjZjY4ZmY1MmMwYTUxYTRiYzg4YzQzYWFhMyIsImF1dGhfdGltZSI6MTY3MTk3Mjk3OSwieGVyb191c2VyaWQiOiIxZTNjMGQxZi05N2ZlLTQ4NWQtOTg2Yy03MmVjYTQwNTUzN2UiLCJnbG9iYWxfc2Vzc2lvbl9pZCI6IjFhODczYTA2YjNhNzQwNjk5NDA3NmQ4MjMzYzEwYzg2IiwianRpIjoiNTkzRjRENjVFNTBCOUUzNzczM0FEOTBCNjRFMTA5NUYiLCJhdXRoZW50aWNhdGlvbl9ldmVudF9pZCI6IjU0NGEzZWJmLTgwNTktNGYwYi1hMjhjLTBmNWYxNmUyZWI5NyIsInNjb3BlIjpbImFjY291bnRpbmcudHJhbnNhY3Rpb25zIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInNzbyJdfQ.YAbOfTsd_ialtj3oy_Cb8_MruF7xc4rCs4WpkTqkZbTRNWvHoCiDMkzBJjLcDtrlR2OyCA5g9Owr7vWJXSLGCe450JCAN6qSDnmB0rOwCrSAWNnCshGEtmuqdvq9eh9p3wkWVedmj7xcHG06D7oF9jQaCYXKCMFbmL5H9kcKC6wRzot43k_CspmLl1HzNJlcvgz2zETGBM5jico12Ricx--2LlOIj8mhYV0wiTMphbEHLR__KO8relwi9Yd4jgX_dfmL6eQ4kL8DAOFjbb1HWX0X6nLRgxYXFpmhzIAETaBomu_jOyoi4ERtinJtsZJJctuEy_XHczp1H9baGasRYA",
//     "expires_in": 1800,
//     "token_type": "Bearer",
//     "refresh_token": "MxtFk0MYtvOOTxjx5E5RH7KpMFVsZ2O3STs74jUDWgs",
//     "scope": "accounting.transactions offline_access"
// }

import app from './app';



const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
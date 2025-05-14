const app = require("./app");
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });
    app.log.info(`Server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
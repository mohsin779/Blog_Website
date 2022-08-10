require("dotenv/config");
const mongoose = require("mongoose");

const app = require("./app");
const apolloServer = require("./apollo");

async function startServer() {
  const graphqlUploadExpress = (
    await import("graphql-upload/graphqlUploadExpress.mjs")
  ).default;
  app.use(graphqlUploadExpress());
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.use("/", (req, res) => {
    res.send({
      message: "Hello World",
    });
  });
}

startServer();
mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected Susscessfully"))
  .catch((err) => console.log("MongoDB Connection failed"));

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`App running on port ${port}!`);
  console.log(`GraphQL Endpoint Path: ${apolloServer.graphqlPath}`);
});

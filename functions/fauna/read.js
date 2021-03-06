/* Import faunaDB sdk */
const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

exports.handler = async (req, res) => {
  console.log(
    "process.env.FAUNADB_SERVER_SECRET: ",
    process.env.FAUNADB_SERVER_SECRET
  );
  const id = req.params.id;
  console.log(`Function 'read' invoked. Read id: ${id}`);
  return client
    .query(q.Get(q.Ref(q.Collection("slapCollections"), id)))
    .then((response) => {
      console.log("success", response);
      console.log("response: ", response);
      if (response.data.deleted) {
        res.status(404).json({
          message: "deleted",
        });
        return
      }

      res.json(response);
    })
    .catch((error) => {
      console.log("error", error);
      res.status(400).json(error);
    });
};

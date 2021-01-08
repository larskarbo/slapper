const faunadb = require('faunadb')

/* configure faunaDB Client with our secret */
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

/* export our lambda function as named "handler" export */
exports.handler = async (req, res) => {
  
  const email = req.params.email
  return client
    .query(
      q.Exists(
        q.Match(q.Index('users_by_email'), email)
      )
    )
    .then(response => {
      res.json({
        exists:response
      })
    })
}

/* Import faunaDB sdk */
const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})


exports.handler = async (req, res) => {
  // const data = JSON.parse(req.body.data)
  const id = req.params.id
  return client
    // .query(q.Delete(q.Ref(q.Collection('slapCollections'), id)))
    .query(q.Update(q.Ref(q.Collection('slapCollections'), id), { data: {
      deleted: true
    } }))
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      console.log('error', error)
      return res.json(400, error);
    })
}
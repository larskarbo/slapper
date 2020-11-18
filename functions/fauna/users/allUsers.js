const faunadb = require('faunadb')

/* configure faunaDB Client with our secret */
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

/* export our lambda function as named "handler" export */
exports.handler = async (req, res) => {
  
  return res.json(401, {
    error: {
      message: "All users is not open anymore"
    }
  });

  const id = req.params.id
  return client
    .query(
      q.Paginate(q.Match(q.Ref('indexes/users_index_normal')))
    )
    .then(response => {
      const itemRefs = response.data
      // create new query out of item refs. http://bit.ly/2LG3MLg
      const getAllItemsDataQuery = itemRefs.map(ref => {
        return q.Get(ref)
      })

      // then query the refs
      client.query(getAllItemsDataQuery).then(ret => {
        res.json(ret)
      })
    })
    .catch(error => {
      console.log('error', error)
      return res.json(400, error);
    })
}

/* Import faunaDB sdk */
const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})
exports.handler = async (req, res) => {
  client
    .query(q.Paginate(q.Match(q.Ref('indexes/slapCollections_by_name'))))
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
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      }
    })
}

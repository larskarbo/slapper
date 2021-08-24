/* Import faunaDB sdk */
const axios = require('axios')
const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

exports.handler = async (req, res) => {
  // const data = JSON.parse(req.body.data)
  const data = req.body
  const id = req.params.id

  

  return client
    .query(q.Update(q.Ref(q.Collection('slapCollections'), id), { data }))
    .then(response => {
      console.log('response: ', response);
      axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: "Some user saved " + response.data.title + ` (${id})`,
      })
      res.json(response)
    })
    .catch(error => {
      console.log('error', error)
      return res.json(400, error);
    })
}

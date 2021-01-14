

//scraper.js
require("dotenv").config()
const axios = require("axios").default;
const { q, client } = require("../functions/fauna/faunaClient")
// scrapMovie("/movie/adopt-a-highway-2019")
let after = undefined
let responses = []
const query = async () => {

  return await client
    .query(
      // q.Paginate(q.Match(q.Ref('indexes/slapCollections_by_name')), { after })
      q.Paginate(q.Match(q.Ref(q.Collection('slapCollections'), 281805796519444999)), { after })
      )
    .then(async response => {
      after = response.after
      console.log(response.after)
      const itemRefs = response.data
      // create new query out of item refs. http://bit.ly/2LG3MLg
      const getAllItemsDataQuery = itemRefs.map(ref => {
        return q.Get(ref)
      })

      // then query the refs
      return await client.query(getAllItemsDataQuery).then(ret => {
        responses = [...responses, ...ret]
        console.log(responses.length)

        if (after) {
          return query()
        }
      })
    })
    .catch(error => {
      console.log('error', error)
      // return res.json(400, error);
    })
}

(async () => {
  await query()

  console.log(responses)
  // console.log(responses)

})()
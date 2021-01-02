

//scraper.js
require("dotenv").config()
const axios = require("axios").default;
const { q, client } = require("../functions/fauna/faunaClient")
const FormData = require('form-data')
// scrapMovie("/movie/adopt-a-highway-2019")
let after = undefined
let responses = []
const query = async () => {

  return await client
    .query(
      q.Paginate(q.Match(q.Ref('indexes/users_index_normal')), { after })
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

  console.log(responses.length)
  // console.log(responses)

  const noUserName = responses.filter(u => !u.data.username)
  console.log("🚀 ~ noUserName", noUserName.length)
  const newsLetter = responses.filter(u => u.data.emailUpdates == "on")
  console.log("🚀 ~ newsLetter", newsLetter.length)


  for (const u of newsLetter){
    var bodyFormData = new FormData();
    bodyFormData.append('api_key', process.env.SENDY_API);
    bodyFormData.append('list', process.env.SENDY_LIST);
    if(u.data.name){
      bodyFormData.append('name', u.data.name );
    }
    bodyFormData.append('email', u.data.email);
    await axios({
      method: 'post',
      url: process.env.SENDY_URL,
      headers: {
        ...bodyFormData.getHeaders()
      },
      data: bodyFormData
    }).then(asdf => {
      console.log("🚀 ~ asdf", u.email)
  
    }).catch(err => {
      console.log("🚀 ~ err", err)
  
    })

  }
})()
const axios = require('axios')
const xmlParse = require('xml2json')

class plex {
  constructor () {
    this.api = {
      endpoint: process.env.PLEX_ENDPOINT,
      token: String(),
      http: Object()
    }

    this.api.http = axios.create({
      baseURL: this.api.endpoint
    })
  }

  doInvite (email) {
    return new Promise((resolve, reject) => {
      this.api.http.post('/v2/shared_servers', {
        machineIdentifier: process.env.PLEX_MACHINE_ID,
        librarySectionIds: [],
        settings: {
          allowSync: '1',
          filterMovies: '',
          filterTelevision: '',
          filterMusic: ''
        },
        invitedEmail: email
      }, {
        params: {
          'X-Plex-Token': process.env.PLEX_AUTH_TOKEN,
          'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID
        }
      }).then(data => {
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  doCheckInvite (email) {
    return new Promise((resolve, reject) => {
      this.api.http.get('/users', {
        params: {
          'X-Plex-Token': process.env.PLEX_AUTH_TOKEN,
          'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID
        }
      }).then(data => {
        const media = JSON.parse(xmlParse.toJson(data.data, {
          sanitize: true
        })).MediaContainer

        let found = false

        media.User.forEach(user => {
          if (user.email.toLowerCase() === email.toLowerCase()) {
            found = true
          }
        })

        resolve(found)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = plex

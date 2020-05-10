import _ from 'lodash'

class ErrorResponse {
  constructor (error) {
   this.error = error
  }

  hasStatus () {
    return _.has(this.error, 'response.status')
  }

  getStatus () {
    return _.get(this.error, 'response.status', null)
  }

  getMessage () {
    return _.has(this.error, ['response', 'data', 'message']) ? _.get(this.error, ['response', 'data', 'message']) : _.get(this.error, ['message'], '')
  }

  getErrors () {
    return _.has(error, 'response.data.errors') ? _.values(error.response.data.errors) : []
  }
}

export default ErrorResponse

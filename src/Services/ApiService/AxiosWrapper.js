import * as axios from 'axios'
import _ from 'lodash'
import Authorization from '../AuthorizationService'
import ErrorResponse from './ErrorResponse'

class AxiosWrapper {
  constructor ({
    baseURL = process.env.VUE_APP_BASE_API,
    timeout = 120000,
    headers = {},
    reloginOnUnauthorized = true,
    onSuccess = null,
    onError = null,
    loader = true,
    responseType = 'json',
    dataOnly = true,
    ignoreErrors = []
  } = {}) {
    this.authService = new Authorization()
    this.reloginOnUnauthorized = reloginOnUnauthorized
    this.onSuccess = onSuccess
    this.onError = onError
    this.requestData = null
    this.loader = loader
    this.responseType = responseType
    this.dataOnly = dataOnly
    this.ignoreErrors = ignoreErrors

    this.setTimeout(timeout)
      .setBaseURL(baseURL)
      .setHeaders(headers)
      ._defineService()
  }

  // Create axios instance
  _defineService () {
    this.service = axios.create({
      baseURL: this.baseURL, // url = base url + request url
      responseType: this.responseType,
      timeout: this.timeout // request timeout
    })
    return this
  }

  setBaseURL (baseURL) {
    this.baseURL = baseURL
    return this
  }

  setTimeout (timeout) {
    this.timeout = timeout
    return this
  }

  setHeaders (headers) {
    this.headers = {
      'Accept': 'application/json',
      // TODO getLanguage
      'Accept-Language': 'en',
      ...this.authService.getHeaders(),
      ...headers
    }
    return this
  }

  defineRequestInterceptor () {
    this.service.interceptors.request.use(
      config => {
        config.headers = this.headers
        return config
      },
      error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
      }
    )
    return this
  }

  defineResponseInterceptor () {
    this.service.interceptors.response.use(
      /**
       * If you want to get http information such as headers or status
       * Please return  response => response
       */

      /**
       * Determine the request status by custom code
       * Here is just an example
       * You can also judge the status by HTTP Status Code
       */
      response => {
        if (_.get(response, ['data', 'message'], false)) {
          this.pushMessage(response.data.message)
        }
        return Promise.resolve(this.dataOnly ? response.data : response)
      },
      error => {
        const errorResponse = new ErrorResponse(error)
        if (errorResponse.hasStatus()) {
          switch (errorResponse.getStatus()) {
            case 401:
              this.unauthorizedError()
              break
            case 422:
              this.validationError(errorResponse)
              break
            default:
              this.pushMessage(errorResponse.getMessage(), 'error')
              break
          }
        }
        return Promise.reject(error)
      }
    )
  }

  pushMessage (message, type='success', duration=5000) {
    return message
  }
  validationError (errorResponse) {
    let message = [errorResponse.getMessage()]
    // console.log({ ...error })
    const errors = errorResponse.getErrors()
    if (errors.length) {
      message = []
      for (const error of errors) {
        if (error.length) {
          message.push(error[0])
        }
      }
      this.pushMessage(message.join('<br/>'), 'error')
    } else if (errorResponse.getMessage()) {
      this.pushMessage(errorResponse.getMessage(), 'error')
    }
  }

  unauthorizedError () {
    if (this.reloginOnUnauthorized) {
      return this.authService.reset()
    }
  }
}

export default AxiosWrapper

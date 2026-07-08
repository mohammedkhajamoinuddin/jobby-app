import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({
      username: event.target.value,
      showError: false,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
      showError: false,
    })
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })

    this.setState({
      showError: false,
      errorMsg: '',
    })

    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      showError: true,
      errorMsg,
    })
  }

  submitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const userDetails = {
      username,
      password,
    }

    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {username, password, showError, errorMsg} = this.state

    return (
      <div className="login-bg">
        <form className="login-card" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />

          <label htmlFor="username" className="label">
            USERNAME
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={this.onChangeUsername}
            placeholder="Username"
            className="input"
          />

          <label htmlFor="password" className="label">
            PASSWORD
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Password"
            className="input"
          />

          <button type="submit" className="login-btn">
            Login
          </button>

          {showError && <p className="error">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login

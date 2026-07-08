import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobCard from '../JobCard'

import {employmentTypesList, salaryRangesList} from '../../constants'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profile: {},
    jobs: [],
    profileStatus: apiStatusConstants.initial,
    jobsStatus: apiStatusConstants.initial,
    searchInput: '',
    activeSearch: '',
    employmentTypes: [],
    salaryRange: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({
      profileStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch('https://apis.ccbp.in/profile', options)

    if (response.ok) {
      const data = await response.json()

      const updatedProfile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profile: updatedProfile,
        profileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        profileStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobs = async () => {
    this.setState({
      jobsStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const {employmentTypes, salaryRange, activeSearch} = this.state

    const employmentType = employmentTypes.join(',')

    const url =
      `https://apis.ccbp.in/jobs?employment_type=${employmentType}` +
      `&minimum_package=${salaryRange}` +
      `&search=${activeSearch}`

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      this.setState({
        jobs: data.jobs,
        jobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        jobsStatus: apiStatusConstants.failure,
      })
    }
  }

  renderProfile = () => {
    const {profile, profileStatus} = this.state

    switch (profileStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div data-testid="loader">
            <Loader type="ThreeDots" color="#fff" height={50} width={50} />
          </div>
        )

      case apiStatusConstants.success:
        return (
          <div className="profile-card">
            <img
              src={profile.profileImageUrl}
              alt="profile"
              className="profile-img"
            />

            <h1>{profile.name}</h1>

            <p>{profile.shortBio}</p>
          </div>
        )

      case apiStatusConstants.failure:
        return (
          <div className="profile-failure-container">
            <button
              type="button"
              className="retry-button"
              onClick={this.getProfile}
            >
              Retry
            </button>
          </div>
        )

      default:
        return null
    }
  }

  renderJobs = () => {
    const {jobsStatus, jobs} = this.state

    switch (jobsStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div data-testid="loader">
            <Loader type="ThreeDots" color="#fff" height={50} width={50} />
          </div>
        )

      case apiStatusConstants.success:
        if (jobs.length === 0) {
          return (
            <div className="no-jobs-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                alt="no jobs"
                className="no-jobs-image"
              />

              <h1>No Jobs Found</h1>

              <p>We could not find any jobs. Try other filters.</p>
            </div>
          )
        }

        return (
          <ul className="jobs-list">
            {jobs.map(job => (
              <JobCard key={job.id} jobDetails={job} />
            ))}
          </ul>
        )

      case apiStatusConstants.failure:
        return (
          <div className="failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
              className="failure-image"
            />

            <h1>Oops! Something Went Wrong</h1>

            <p>We cannot seem to find the page you are looking for.</p>

            <button
              type="button"
              className="retry-button"
              onClick={this.getJobs}
            >
              Retry
            </button>
          </div>
        )

      default:
        return null
    }
  }

  onChangeSearch = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onSearch = () => {
    this.setState(
      {
        activeSearch: this.state.searchInput,
      },
      this.getJobs,
    )
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.onSearch()
    }
  }

  onChangeEmployment = id => {
    const {employmentTypes} = this.state

    const updatedList = employmentTypes.includes(id)
      ? employmentTypes.filter(each => each !== id)
      : [...employmentTypes, id]

    this.setState(
      {
        employmentTypes: updatedList,
      },
      this.getJobs,
    )
  }

  onChangeSalary = id => {
    this.setState(
      {
        salaryRange: id,
      },
      this.getJobs,
    )
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />

        <div className="jobs-page">
          <div className="left-panel">
            {this.renderProfile()}

            {/* Employment Filters */}

            <h1>Type of Employment</h1>

            <ul>
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    onChange={() =>
                      this.onChangeEmployment(each.employmentTypeId)
                    }
                  />

                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              ))}
            </ul>

            <hr />

            {/* Salary Filters */}

            <h1>Salary Range</h1>

            <ul>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    type="radio"
                    id={each.salaryRangeId}
                    name="salary"
                    onChange={() => this.onChangeSalary(each.salaryRangeId)}
                  />

                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="right-panel">
            <div className="search-container">
              <input
                type="search"
                value={searchInput}
                onChange={this.onChangeSearch}
                onKeyDown={this.onEnterSearch}
                placeholder="Search"
                className="search-input"
              />

              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onSearch}
                className="search-button"
              >
                🔍
              </button>
            </div>

            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs

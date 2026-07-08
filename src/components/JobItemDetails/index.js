import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'

import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.progress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {id} = match.params

    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const updatedJob = {
        ...data.job_details,
        skills: data.job_details.skills.map(skill => ({
          name: skill.name,
          imageUrl: skill.image_url,
        })),
      }

      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: updatedJob,
        similarJobs: data.similar_jobs,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {jobDetails} = this.state

    return (
      <div className="job-details-card">
        <div className="top-row">
          <img
            src={jobDetails.company_logo_url}
            alt="job details company logo"
            className="company-logo"
          />

          <div>
            <h1>{jobDetails.title}</h1>

            <div className="rating-row">
              <FaStar color="#fbbf24" />
              <p>{jobDetails.rating}</p>
            </div>
          </div>
        </div>

        <div className="middle-row">
          <div className="location-type">
            <div className="icon-text">
              <MdLocationOn />
              <p>{jobDetails.location}</p>
            </div>

            <div className="icon-text">
              <BsBriefcaseFill />
              <p>{jobDetails.employment_type}</p>
            </div>
          </div>

          <p>{jobDetails.package_per_annum}</p>
        </div>

        <hr />

        <div className="description-row">
          <h1>Description</h1>

          <a
            href={jobDetails.company_website_url}
            target="_blank"
            rel="noreferrer"
            className="visit-link"
          >
            Visit
            <FiExternalLink />
          </a>
        </div>

        <p>{jobDetails.job_description}</p>

        <h1 className="skills-heading">Skills</h1>

        <ul className="skills-list">
          {jobDetails.skills &&
            jobDetails.skills.map(eachSkill => (
              <li key={eachSkill.name} className="skill-item">
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-image"
                />

                <p>{eachSkill.name}</p>
              </li>
            ))}
        </ul>

        <h1 className="life-heading">Life at Company</h1>

        <div className="life-container">
          <p className="life-description">
            {jobDetails.life_at_company &&
              jobDetails.life_at_company.description}
          </p>

          {jobDetails.life_at_company && (
            <img
              src={jobDetails.life_at_company.image_url}
              alt="life at company"
              className="life-image"
            />
          )}
        </div>

        <h1 className="similar-heading">Similar Jobs</h1>

        <ul className="similar-list">
          {this.state.similarJobs.map(eachJob => (
            <SimilarJobCard key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />

      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for.</p>

      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.progress:
        return this.renderLoader()

      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />

        <div className="job-details-bg">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default JobItemDetails

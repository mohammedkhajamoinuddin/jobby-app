import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props

  const {
    id,
    title,
    rating,
    company_logo_url,
    employment_type,
    location,
    package_per_annum,
    job_description,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="job-link">
      <li className="job-card">
        <div className="top-row">
          <img
            src={company_logo_url}
            alt="company logo"
            className="company-logo"
          />

          <div>
            <h1 className="job-title">{title}</h1>

            <div className="rating-row">
              <FaStar color="#fbbf24" />
              <p>{rating}</p>
            </div>
          </div>
        </div>

        <div className="middle-row">
          <div className="location-type">
            <div className="icon-text">
              <MdLocationOn />
              <p>{location}</p>
            </div>

            <div className="icon-text">
              <BsBriefcaseFill />
              <p>{employment_type}</p>
            </div>
          </div>

          <p>{package_per_annum}</p>
        </div>

        <hr />

        <h1 className="description-heading">Description</h1>

        <p>{job_description}</p>
      </li>
    </Link>
  )
}

export default JobCard

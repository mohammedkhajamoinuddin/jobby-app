import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobCard = props => {
  const {jobDetails} = props

  const {
    company_logo_url,
    title,
    rating,
    location,
    employment_type,
    job_description,
  } = jobDetails

  return (
    <li className="similar-card">
      <div className="top-row">
        <img
          src={company_logo_url}
          alt="similar job company logo"
          className="company-logo"
        />

        <div>
          <h1>{title}</h1>

          <div className="rating-row">
            <FaStar color="#fbbf24" />
            <p>{rating}</p>
          </div>
        </div>
      </div>

      <h1>Description</h1>

      <p>{job_description}</p>

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
    </li>
  )
}

export default SimilarJobCard

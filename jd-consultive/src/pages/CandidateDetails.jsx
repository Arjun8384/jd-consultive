/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CandidateDetails.css';

export default function CandidateDetails() {

  const { id } = useParams();

  const API_URL =
    process.env.REACT_APP_API_URL;

  const [candidate, setCandidate] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchCandidate();

  }, []);

  const openResume = async (fileId) => {

  try {

    const token =
      localStorage.getItem(
        "adminToken"
      );

    const response =
      await fetch(
        `${API_URL}/api/admin/resume/${fileId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    if (!response.ok) {

      alert("Unable to load resume");

      return;

    }

    const blob =
      await response.blob();

    const url =
      window.URL.createObjectURL(
        blob
      );

    window.open(
      url,
      "_blank"
    );

  }

  catch (error) {

    console.log(error);

  }

};

  async function fetchCandidate() {

    try {

      const token =
        localStorage.getItem(
          'adminToken'
        );

      const res = await fetch(
        `${API_URL}/api/admin/candidates/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await res.json();

      setCandidate(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!candidate) {
    return <h2>Candidate not found</h2>;
  }

  return (

    <div className="candidate-details-page">

      <h1>
        Candidate Profile
      </h1>

      <div className="details-card">

        <h2>{candidate.name}</h2>

        <div className="details-grid">

          <div>
            <label>Email</label>
            <p>{candidate.email}</p>
          </div>

          <div>
            <label>Phone</label>
            <p>{candidate.phone}</p>
          </div>

          <div>
            <label>Experience</label>
            <p>{candidate.experience}</p>
          </div>

          <div>
            <label>Current Title</label>
            <p>{candidate.currentTitle}</p>
          </div>

          <div>
            <label>Current Company</label>
            <p>{candidate.currentCompany}</p>
          </div>

          <div>
            <label>Domain</label>
            <p>
                {candidate.domain
                    ?.replace(
                    /&#x2F;/g,
                    '/'
                    )}
                </p>
          </div>

          <div>
            <label>Current CTC</label>
            <p>{candidate.currentCTC}</p>
          </div>

          <div>
            <label>Expected CTC</label>
            <p>{candidate.expectedCTC}</p>
          </div>

          <div>
            <label>Notice Period</label>
            <p>{candidate.noticePeriod}</p>
          </div>

          <div>
            <label>Preferred Locations</label>
            <p>{candidate.locations}</p>
          </div>

        </div>

        <div className="message-box">

          <label>
            Additional Notes
          </label>

          <p>
            {candidate.message || '-'}
          </p>

        </div>

        {candidate.resumeFileId && (

          <button
            className="resume-btn"
            onClick={() =>
              openResume(candidate.resumeFileId)
            }
          >
            View Resume
          </button>

        )}

      </div>

    </div>

  );

}
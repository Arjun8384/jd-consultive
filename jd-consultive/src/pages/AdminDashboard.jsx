/* eslint-disable react-hooks/exhaustive-deps */
import {
  useEffect,
  useState
} from 'react';

import {
  useNavigate
} from 'react-router-dom';

import '../styles/AdminDashboard.css';

export default function AdminDashboard() {

  const navigate =
    useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL;

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState(null);

  const [clients, setClients] =
    useState([]);

  const [candidates, setCandidates] =
    useState([]);

  const [clientSearch, setClientSearch] = useState('');
  const [candidateSearch, setCandidateSearch] = useState('');

  useEffect(() => {

    const token =
      localStorage.getItem(
        'adminToken'
      );

    if (!token) {

      navigate(
        '/admin-login'
      );

      return;
    }

    loadDashboard();

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

  async function loadDashboard() {

    try {

      const token =
        localStorage.getItem(
          'adminToken'
        );

      const headers = {
        Authorization:
          `Bearer ${token}`,
      };

      const [
        statsRes,
        clientsRes,
        candidatesRes
      ] = await Promise.all([
        fetch(
          `${API_URL}/api/admin/stats`,
          { headers }
        ),
        fetch(
          `${API_URL}/api/admin/clients`,
          { headers }
        ),
        fetch(
          `${API_URL}/api/admin/candidates`,
          { headers }
        )
      ]);

      if (
        statsRes.status === 401 ||
        clientsRes.status === 401 ||
        candidatesRes.status === 401
      ) {

        localStorage.removeItem(
          'adminToken'
        );

        navigate(
          '/admin-login'
        );

        return;
      }

      const statsData =
        await statsRes.json();

      const clientsData =
        await clientsRes.json();

      const candidatesData =
        await candidatesRes.json();

      setStats(statsData);

      setClients(
        clientsData.data || []
      );

      setCandidates(
        candidatesData.data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  const downloadFile = async (
  endpoint,
  filename
) => {

  const token =
    localStorage.getItem(
      'adminToken'
    );

  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  const blob =
    await response.blob();

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement('a');

  link.href = url;

  link.download =
    filename;

  link.click();

  URL.revokeObjectURL(url);

};

  const updateStatus = async (
  type,
  id,
  status
) => {

  try {

    const token =
      localStorage.getItem(
        'adminToken'
      );

    await fetch(
      `${API_URL}/api/admin/${type}/${id}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    loadDashboard();

  } catch (error) {

    console.log(error);

  }

};

const deleteEntry = async (
  type,
  id
) => {

  const confirmDelete =
    window.confirm(
      'Delete this record?'
    );

  if (!confirmDelete)
    return;

  try {

    const token =
      localStorage.getItem(
        'adminToken'
      );

    await fetch(
      `${API_URL}/api/admin/${type}/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    loadDashboard();

  } catch (error) {

    console.log(error);

  }

};

  if (loading) {

    return (
      <div>
        Loading Dashboard...
      </div>
    );
  }

  return (

<div className="dashboard-page">
  <div className='dashboard-header'>

    <div className='dashboard-title'>

      <h1>
        JD Consultive Dashboard
      </h1>

      <p>
        Recruitment Management Portal
      </p>

    </div>

    <div className='dashboard-actions'>
      <button className='settings-btn'
        onClick={() => 
          navigate(
            '/company-settings'
          )
        }
        >Settings</button>

    <button
      className="logout-btn"
      onClick={() => {

        localStorage.removeItem(
          'adminToken'
        );

        navigate(
          '/company-portal'
        );

      }}
    >
      Logout
    </button>
    </div>
    </div>

  {stats && (

    <div className="stats-grid">

      <div className="stat-card">
        <h3>Total Clients</h3>
        <span>
          {stats.clients?.total || 0}
        </span>
      </div>

      <div className="stat-card">
        <h3>New Clients</h3>
        <span>
          {stats.clients?.unread || 0}
        </span>
      </div>

      <div className="stat-card">
        <h3>Total Candidates</h3>
        <span>
          {stats.candidates?.total || 0}
        </span>
      </div>

      <div className="stat-card">
        <h3>New Candidates</h3>
        <span>
          {stats.candidates?.unread || 0}
        </span>
      </div>

    </div>

  )}

  <div className="export-row">

    <button
      className="export-btn"
      onClick={() =>
        downloadFile(
          `/api/admin/export/clients/pdf`,
        'clients.pdf'
      )
      }
    >
      Clients PDF
    </button>

    <button
      className="export-btn"
      onClick={() =>
        downloadFile(
          `/api/admin/export/candidates/pdf`,
          'candidates.pdf'
        )
      }
    >
      Candidates PDF
    </button>

    <button
      className="export-btn"
      onClick={() =>
        downloadFile(
          `/api/admin/export/clients/xls`,
          'clients.xlsx'
        )
      }
    >
      Clients XLS
    </button>

    <button
      className="export-btn"
      onClick={() =>
        downloadFile(
          `/api/admin/export/candidates/xls`,
          'candidates.xlsx'
        )
      }
    >
      Candidates XLS
    </button>

  </div>

  <section className="dashboard-section">

  <div className="section-top">

    <h2>
      Client Enquiries
    </h2>

    <input
      type="text"
      className="search-box"
      placeholder="Search Clients..."
      value={clientSearch}
      onChange={(e) =>
        setClientSearch(
          e.target.value
        )
      }
    />

  </div>

  <div className="table-wrapper">

    <table className="table">

      <thead>

        <tr>

          <th>Name</th>
          <th>Company</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Action</th>

        </tr>

      </thead>

      <tbody>

        {clients
          .filter((client) => {

            const q =
              clientSearch.toLowerCase();

            return (
              client.name
                ?.toLowerCase()
                .includes(q) ||

              client.company
                ?.toLowerCase()
                .includes(q) ||

              client.email
                ?.toLowerCase()
                .includes(q)
            );

          })
          .map((client) => (

            <tr key={client._id}>

              <td>
                {client.name}
              </td>

              <td>
                {client.company}
              </td>

              <td>
                {client.email}
              </td>

              <td>
                {client.phone}
              </td>

              <td>

                <select
                  value={
                    client.status
                  }
                  onChange={(e) =>
                    updateStatus(
                      'clients',
                      client._id,
                      e.target.value
                    )
                  }
                >

                  <option value="new">
                    New
                  </option>

                  <option value="contacted">
                    Contacted
                  </option>

                  <option value="closed">
                    Closed
                  </option>

                </select>

              </td>

              <td>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteEntry(
                      'clients',
                      client._id
                    )
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

        ))}

      </tbody>

    </table>

  </div>

</section>

<section className="dashboard-section">

  <div className="section-top">

    <h2>
      Candidate Enquiries
    </h2>

    <input
      type="text"
      className="search-box"
      placeholder="Search Candidates..."
      value={candidateSearch}
      onChange={(e) =>
        setCandidateSearch(
          e.target.value
        )
      }
    />

  </div>

  <div className="table-wrapper">

    <table className="table">

      <thead>

        <tr>

          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Experience</th>
          <th>Company</th>
          <th>Resume</th>
          <th>Details</th>
          <th>Status</th>
          <th>Action</th>

        </tr>

      </thead>

      <tbody>

        {candidates
          .filter((candidate) => {

            const q =
              candidateSearch.toLowerCase();

            return (
              candidate.name
                ?.toLowerCase()
                .includes(q) ||

              candidate.email
                ?.toLowerCase()
                .includes(q) ||

              candidate.currentCompany
                ?.toLowerCase()
                .includes(q)
            );

          })
          .map((candidate) => {

          console.log(candidate);
          return  (

            <tr
              key={candidate._id}
            >


              <td>
                {candidate.name}
              </td>

              <td>
                {candidate.email}
              </td>

              <td>{candidate.phone}</td>

              <td>
                {candidate.experience}
              </td>

              <td>
                {candidate.currentCompany}
              </td>

<td>

  {
candidate.resumeFileId && (

<button
  className="resume-btn"
  onClick={() =>
    openResume(candidate.resumeFileId)
  }
>
  View Resume
</button>

)
}

</td>

<td>
  <button
    className='view-btn'
    onClick={() =>
          navigate(
            `/candidate/${candidate._id}`
          ) 
    }
    >Details</button>
</td>

              <td>

                <select
                  value={candidate.status}
                  onChange={(e) =>
                    updateStatus(
                      'candidates',
                      candidate._id,
                      e.target.value
                    )
                  }
                >
                  <option value="new">
                    New
                  </option>

                  <option value="reviewed">
                    Reviewed
                  </option>

                  <option value="shortlisted">
                    Shortlisted
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>
                </select>

              </td>

<td>

  <button
    className="delete-btn"
    onClick={() =>
      deleteEntry(
        'candidates',
        candidate._id
      )
    }
  >
    Delete
  </button>

</td>


            </tr>

        );})}

      </tbody>

    </table>

  </div>

</section>



</div>

);

}
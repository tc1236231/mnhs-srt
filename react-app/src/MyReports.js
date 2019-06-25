import React from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'];

const MyReports = ({reports}) => (
  <div>
    <h2>My Site Reports</h2>
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Site Name</th>
          <th>Report Period</th>
          <th>Closed?</th>
          <th>Counts</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {reports.map(r => (
          <tr>
            <td>{r.siteName}</td>
            {r.date && <td>{r.date}</td>}
            {r.year && r.month && <td>{months[r.month] + ", " + r.year}</td>}
            <td>{r.closed && "Yes"}</td>
            <td>
              {Object.keys(r.counts).map((c, i) => (
                <div className="text-nowrap">
                  {c}: {r.counts[c]}
                </div>
              ))}
            </td>
            <td>{r.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MyReports;

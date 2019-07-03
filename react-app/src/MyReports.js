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
          <th>Date Submitted</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {reports.map(r => (
          <tr>
            <td>{r.site.name}</td>
            {r.date && <td>{r.date}</td>}
            {r.year && r.month &&
             <td>{months[r.month - 1] + ", " + r.year}</td>}
            <td>{r.closed && "Yes"}</td>
            <td>
              {r.counts.map(c => (
                c.count !== '' && (
                  <ul className="small list-unstyled">
                    <li className="my-0">
                      <span className="font-italic mr-1">
                        {c.category.name}:
                      </span>
                      <span><strong>{c.count}</strong></span>
                    </li>
                  </ul>
                )
              ))}
            </td>
            <td>{r.submitTS.split('T')[0]}</td>
            <td>{r.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MyReports;

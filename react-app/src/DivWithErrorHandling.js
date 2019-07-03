import React from 'react';
import './DivWithErrorHandling.css';

const withErrorHandling = WrappedComponent => ({ showError, children }) => {
    return (
      <WrappedComponent>
        {showError && <div className="error-message">Oops! Something went wrong please notify BIPI team: {showError.message}</div>}
        {children}
      </WrappedComponent>
    );
  };
  
const DivWithErrorHandling = withErrorHandling(({children}) => <div>{children}</div>);

export default DivWithErrorHandling;
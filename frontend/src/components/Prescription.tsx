import React from 'react';

interface Prescription {
  id: string;
  disease: string;
  medication: string;
  suggestions: string[];
  conversationSummary: string;
  duration: string;
  attendedBy: string;
  attendedAt: string | Date;
  reports: string[];
  testResults: string[];
}

interface PrescriptionProps {
  prescriptions: Prescription[];
}

const Prescription: React.FC<PrescriptionProps> = ({ prescriptions }) => {
  const formatDate = (date: string | Date): string => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleString();
    }
    return date.toLocaleString();
  };

  return (
    <div className="prescription-container">
      <h2>Medical Prescriptions</h2>
      
      {prescriptions.length === 0 ? (
        <p className="no-records">No prescription records found</p>
      ) : (
        prescriptions.map((prescription) => (
          <div key={prescription.id} className="prescription-card">
            <h3>Prescription for {prescription.disease}</h3>
            
            <div className="prescription-details">
              <div className="detail-row">
                <strong>Medication:</strong>
                <span>{prescription.medication}</span>
              </div>
              
              <div className="detail-row">
                <strong>Duration:</strong>
                <span>{prescription.duration}</span>
              </div>
              
              <div className="detail-row">
                <strong>Attended by:</strong>
                <span>{prescription.attendedBy}</span>
              </div>
              
              <div className="detail-row">
                <strong>Attended at:</strong>
                <span>{formatDate(prescription.attendedAt)}</span>
              </div>
              
              <div className="suggestions">
                <strong>Suggestions:</strong>
                <ul>
                  {prescription.suggestions.map((suggestion, i) => (
                    <li key={`${prescription.id}-suggestion-${i}`}>{suggestion}</li>
                  ))}
                </ul>
              </div>
              
              <div className="conversation-summary">
                <strong>Conversation Summary:</strong>
                <p>{prescription.conversationSummary}</p>
              </div>
              
              <div className="reports">
                <strong>Reports:</strong>
                <ul>
                  {prescription.reports.map((report, i) => (
                    <li key={`${prescription.id}-report-${i}`}>{report}</li>
                  ))}
                </ul>
              </div>
              
              <div className="test-results">
                <strong>Test Results:</strong>
                <ul>
                  {prescription.testResults.map((result, i) => (
                    <li key={`${prescription.id}-result-${i}`}>{result}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};


export default Prescription;


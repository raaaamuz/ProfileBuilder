import React from "react";
import { FiLoader } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const PersonalDetails = ({
  formData,
  handleChange,
  handleImproveDescription,
  isImproving,
}) => {
  return (
    <div className="space-y-5">
      {/* Full Name Input */}
      <div>
        <label htmlFor="title">Name</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="Your full name"
        />
      </div>

      {/* Description Textarea with AI Button */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label htmlFor="description" style={{ margin: 0 }}>Resume Objective</label>
          <button
            type="button"
            onClick={handleImproveDescription}
            disabled={isImproving}
            title="Enhance with AI"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '6px',
              border: 'none',
              background: isImproving
                ? '#334155'
                : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
              color: '#ffffff',
              cursor: isImproving ? 'not-allowed' : 'pointer',
              opacity: isImproving ? 0.7 : 1,
              transition: 'all 0.2s ease',
              boxShadow: isImproving ? 'none' : '0 2px 8px rgba(99, 102, 241, 0.3)',
            }}
          >
            {isImproving ? (
              <>
                <FiLoader className="animate-spin" style={{ width: '14px', height: '14px' }} />
                <span>Improving...</span>
              </>
            ) : (
              <>
                <HiSparkles style={{ width: '14px', height: '14px' }} />
                <span>AI Enhance</span>
              </>
            )}
          </button>
        </div>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows="5"
          placeholder="Your resume objective or professional summary..."
          className="resize-none"
        />
      </div>
    </div>
  );
};

export default PersonalDetails;
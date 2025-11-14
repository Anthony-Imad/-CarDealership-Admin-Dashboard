export default function EntityForm({entityData, setEntityData, fields}) {
    
    const handleFileChange = (fieldName, file) => {
        if (file) {
            setEntityData(prev => ({
                ...prev,
                [field.name]: file
            }));
        }
    };
    
    return (    
        
        /*
        <div className="form-grid">
        {fields.map(field => (
            <input 
            key={field.name}
            type={field.type}
            placeholder={field.label}
            value={entityData[field.name] || ''}
            onChange={(e) => setEntityData(prev => ({
                ...prev,
                [field.name]: e.target.value
            }))}
            />
        ))}
        </div>
        */

          <div className="form-grid">
      {fields.map(field => (
        <div key={field.name} className="form-group">
          <label className="form-label">
            {field.label.charAt(0).toUpperCase() + field.label.slice(1)}
          </label>
          
          {field.type === 'file' ? (
            <div className="file-input-wrapper">
              <label className="file-input-label">
                <div className="upload-icon">📷</div>
                <div className="upload-text">Upload {field.label}</div>
                <div className="upload-subtext">Click or drag and drop</div>
                <input
                  type="file"
                  className="file-input"
                  onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                  accept="image/*"
                />
              </label>
              {entityData[field.name] && (
                <div className="image-preview-container">
                  <img 
                    src={URL.createObjectURL(entityData[field.name])} 
                    alt="Preview" 
                    className="image-preview"
                  />
                </div>
              )}
            </div>
          ) : field.type === 'boolean' ? (
            <div className="checkbox-group">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={entityData[field.name] || false}
                onChange={(e) => setEntityData(prev => ({
                  ...prev,
                  [field.name]: e.target.checked
                }))}
              />
              <span className="checkbox-label">Available</span>
            </div>
          ) : (
            <input 
              className="form-input"
              type={field.type}
              placeholder={`Enter ${field.label}`}
              value={entityData[field.name] || ''}
              onChange={(e) => setEntityData(prev => ({
                ...prev,
                [field.name]: e.target.value
              }))}
            />
          )}
        </div>
      ))}
    </div>
    )
}
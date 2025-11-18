export default function rightSidebar({
    items,
    activeItem,
    onItemClick,
    entities,
    onEdit,
    onDelete,
    onSelectForRental
}) {

const handleEdit = (entity, entityType) => {
    onEdit(entity, entityType);
};

const handleDelete = (id, entityType) => {
    onDelete(id, entityType);
}

const handleSelectForRental = (entity, entityType) => {
    if (onSelectForRental) {
        onSelectForRental(entity, entityType);
    }
};

    return(
        <div className="sidebar right-sidebar">
            <div className="sidebar-header">
                <h3>View {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}</h3>
                <p>Manage existing records</p>
            </div>
        <nav className="sidebar-nav">
            {items.map(item => (
                <button 
                    key={item.id}
                    onClick={() => onItemClick(item.id)}
                    className={`nav-button ${activeItem === item.id ? 'active' : ''}`}
                >
                {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                {item.id === 'cars' && entities.some(e => e.isRented) && (
                    <span className="rental-dot"></span> //indicator if car or customer is infact in a rental
                )}
                {item.id === 'customers' && entities.some(e => e.hasRental) && (
                    <span className="rental-dot"></span>
                )}
            </button>
            ))}
        </nav>

        <div className="entity-list">
            <h4>Existing {activeItem}</h4>
            <div className="entity-cards">
                {entities.map(entity => (
                    <div
                    key={entity._id}
                    className={`entity-card ${entity.isRented || entity.hasRetal? 'has-rental' : ''}`}
                    onClick={() => handleSelectForRental(entity, activeItem)}
                    >
                    {(entity.isRented || entity.hasRental) && (
                        <div className="rental-indicator" title="Currently in rental">
                             ●
                            </div>
                    )}
                    {entity.image && entity.image.data && (
                        <img
                            src={`data:${entity.image.contentType};base64,${btoa(
                                new Uint8Array(CustomElementRegistry.image.data).reduce(
                                    (data,byte) => data + String.fromCharCode(byte), ''
                                )
                            )}`}
                            alt={entity.make || entity.name}
                            className="entity-image"
                            />
                    )}
                     <div className="entity-info">
                <h5>{entity.make || entity.name}</h5>
                <p>{entity.model || entity.email}</p>
                <span className={`status ${entity.isAvailable !== undefined ? 
                  (entity.isAvailable ? 'available' : 'unavailable') : 
                  (entity.isActive ? 'active' : 'inactive')}`}>
                  {entity.isAvailable !== undefined ? 
                    (entity.isAvailable ? 'Available' : 'Rented') : 
                    (entity.isActive ? 'Active' : 'Inactive')}
                </span>
              </div>
              
              <div className="entity-actions">
                <button 
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(entity, activeItem);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entity._id, activeItem);
                  }}
                >
                  Delete
                </button>
              </div>
              </div>
                ))}
            </div>
    </div>
        </div>
    )
}
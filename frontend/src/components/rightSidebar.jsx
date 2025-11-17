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
        </div>
    )
}
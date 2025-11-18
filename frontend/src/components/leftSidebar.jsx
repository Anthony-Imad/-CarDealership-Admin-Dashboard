export default function leftSidebar({items, onItemClick, activeItem}) {
return (
    <div className="sidebar left-sidebar">
        <div className="sidebar-header">
            <h3>Create New</h3>
            <p>Add new records to the system</p>
        </div>
    
    <nav className="sidebar-nav">
        {items.map(item => (
            <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`nav-button ${activeItem === item.id ? 'active' : ''}`}
            >
            {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            </button>
        ))}
     </nav>
    </div>
    )
}

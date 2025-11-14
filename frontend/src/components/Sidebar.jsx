
export default function Sidebar({items, onItemClick, activeItem}) {
return (
    <div className="sidebar">
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

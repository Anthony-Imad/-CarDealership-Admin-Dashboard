
export default function Sidebar({items, activeItem, setActiveItem}) {
return (
    <>
    <img src="../images/dealership-logo.png"/>
     
     <nav>
        {items.map(item => (
            <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            >
            {item.label}
            </button>
        ))}
     </nav>
    </>
    )
}

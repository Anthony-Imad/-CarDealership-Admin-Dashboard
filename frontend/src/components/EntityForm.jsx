export default function EntityForm({entityData, setEntityData, fields}) {
    return (
        <>
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
        </>
    )
}
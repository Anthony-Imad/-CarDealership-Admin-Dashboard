export default function EntityForm({entityData, setEntityData, fields}) {
    return (
        <>
        {fields.map(field => (
            <input 
            key={field.name}
            type={}
            />
        ))}
        </>
    )
}
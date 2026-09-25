import { CheckCircle, AlertTriangle } from 'lucide-react';

function PharmacyCard({ pharmacy, isSelected, onSelect }) {
    return (
        <div
            className={`pharmacy-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(pharmacy)}
        >
            <div>
                <div className="pharm-name" style={{ color: isSelected ? 'var(--color-primary)' : '' }}>
                    {pharmacy.name}
                </div>
                <div className="pharm-meta">
                    {pharmacy.available > 3 ? (
                        <CheckCircle size={14} color="var(--color-primary)" />
                    ) : (
                        <AlertTriangle size={14} color="orange" />
                    )}
                    {pharmacy.available} medicines available
                </div>
            </div>
            <div className="pharm-dist">{pharmacy.distance} km</div>
        </div>
    );
}

export default PharmacyCard;

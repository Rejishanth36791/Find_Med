import { Calendar } from 'lucide-react';

function ReservationCard({ reservation, onViewDetails }) {
    return (
        <div className="reservation-card">
            <div className="reservation-card-header">
                <span className="reservation-card-id">Order #{reservation.id}</span>
                <span className={`status-badge status-${reservation.status.toLowerCase().replace(' ', '-')}`}>
                    {reservation.status}
                </span>
            </div>

            <div className="reservation-card-body">
                <h3 className="reservation-card-pharmacy">{reservation.pharmacy}</h3>
                <p className="reservation-card-total">
                    Estimated Total: <span>Rs. {reservation.total.toLocaleString()}</span>
                </p>
            </div>

            <div className="reservation-card-date">
                <Calendar size={14} />
                {reservation.date} • {reservation.time}
            </div>

            <div className="reservation-card-footer">
                <span className={`status-badge status-${reservation.status.toLowerCase().replace(' ', '-')}`}>
                    {reservation.status}
                </span>
                <button className="btn btn-outline" onClick={() => onViewDetails(reservation)}>
                    View Details
                </button>
            </div>
        </div>
    );
}

export default ReservationCard;

function ReservationHistoryItem({ reservation }) {
    return (
        <div className="history-item">
            <div className="history-item-info">
                <span className="history-item-id">Order #{reservation.id}</span>
                <span className="history-item-pharmacy">{reservation.pharmacy}</span>
                <span className="history-item-date">{reservation.date}</span>
            </div>
            <span className={`status-badge status-${reservation.status.toLowerCase()}`}>
                {reservation.status}
            </span>
        </div>
    );
}

export default ReservationHistoryItem;

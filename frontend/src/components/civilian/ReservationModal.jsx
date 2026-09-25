import { X, Check, Clock, Package, Truck, QrCode } from 'lucide-react';

const timelineSteps = [
    { key: 'created', label: 'Created', icon: Clock },
    { key: 'approved', label: 'Approved', icon: Check },
    { key: 'ready', label: 'Ready', icon: Package },
    { key: 'collected', label: 'Collected', icon: Truck },
];

function ReservationModal({ reservation, onClose }) {
    if (!reservation) return null;

    const getStepStatus = (stepKey) => {
        const statusOrder = ['created', 'approved', 'ready', 'collected'];
        const currentIndex = statusOrder.indexOf(reservation.timelineStatus || 'created');
        const stepIndex = statusOrder.indexOf(stepKey);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'active';
        return '';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Reservation Details</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-section">
                        <h3>Order Information</h3>
                        <div className="modal-order-info">
                            <div className="modal-order-info-item">
                                <label>Order Number</label>
                                <span>#{reservation.id}</span>
                            </div>
                            <div className="modal-order-info-item">
                                <label>Status</label>
                                <span className={`status-badge status-${reservation.status.toLowerCase().replace(' ', '-')}`}>
                                    {reservation.status}
                                </span>
                            </div>
                            <div className="modal-order-info-item">
                                <label>Pharmacy</label>
                                <span>{reservation.pharmacy}</span>
                            </div>
                            <div className="modal-order-info-item">
                                <label>Pickup Date</label>
                                <span>{reservation.date}</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-section">
                        <h3>Medicines</h3>
                        <div className="modal-medicines">
                            {reservation.items?.map((item, index) => (
                                <div key={index} className="modal-medicine-item">
                                    <div>
                                        <span className="modal-medicine-name">{item.name}</span>
                                        <span className="modal-medicine-qty"> x{item.quantity}</span>
                                    </div>
                                    <span className="modal-medicine-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-section">
                        <h3>Cost Breakdown</h3>
                        <div className="modal-costs">
                            <div className="modal-cost-row">
                                <span>Subtotal</span>
                                <span>Rs. {(reservation.total - 50).toLocaleString()}</span>
                            </div>
                            <div className="modal-cost-row">
                                <span>Service Fee</span>
                                <span>Rs. 50</span>
                            </div>
                            <div className="modal-cost-row total">
                                <span>Total</span>
                                <span>Rs. {reservation.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-section">
                        <h3>Order Progress</h3>
                        <div className="status-timeline">
                            {timelineSteps.map((step) => (
                                <div key={step.key} className={`timeline-step ${getStepStatus(step.key)}`}>
                                    <div className="timeline-step-icon">
                                        <step.icon size={16} />
                                    </div>
                                    <span className="timeline-step-label">{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {(reservation.status === 'Ready for Pickup' || reservation.status === 'Approved') && (
                        <div className="modal-section">
                            <h3>Pickup Verification</h3>
                            <div className="qr-code-section">
                                <div className="qr-code-placeholder">
                                    <QrCode size={48} />
                                </div>
                                <p>Show this QR code at the pharmacy for verification</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReservationModal;

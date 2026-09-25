import { useState, useRef } from 'react';
import { Upload, FileText, X, Calendar, Edit, Store, Image, ChevronDown } from 'lucide-react';

function ReservationForm({ selectedPharmacy, orderItems, onSubmit }) {
    const [pickupDate, setPickupDate] = useState('');
    const [note, setNote] = useState('');
    const [file, setFile] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const fileInputRef = useRef(null);

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceFee = 200.00; // Rs. 200 service fee
    const total = subtotal + serviceFee;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedPharmacy) {
            alert("Please select a pharmacy first");
            return;
        }

        onSubmit({
            pharmacy: selectedPharmacy,
            items: orderItems,
            pickupDate,
            note,
            prescription: file,
            total
        });
    };

    return (
        <div className="reservation-form-card">
            <span className="section-label">Order Summary</span>
            <div className="order-summary">
                <div className="summary-list">
                    {orderItems.length > 0 ? (
                        orderItems.map((item, index) => (
                            <div key={index} className="order-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: index < orderItems.length - 1 ? '1px solid #eee' : 'none' }}>
                                <span>{item.name}</span>
                                <span>x {item.quantity}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-400 text-sm py-2">No items selected</div>
                    )}
                </div>
            </div>

            <span className="section-label">Reservation Details</span>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label><Calendar size={16} color="var(--color-primary)" /> Pick-up Date</label>
                    <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="form-group">
                    <label><Upload size={16} color="var(--color-primary)" /> Upload Prescription</label>
                    <div
                        className={`file-upload ${file ? 'has-file' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        style={{ position: 'relative', textAlign: 'center', cursor: 'pointer' }}
                    >
                        {file ? (
                            <div className="upload-text">
                                <FileText size={20} style={{ margin: '0 auto', display: 'block' }} />
                                <p>{file.name}</p>
                            </div>
                        ) : (
                            <div className="upload-text">
                                <Image size={24} style={{ margin: '0 auto', display: 'block', color: 'var(--color-primary)', marginBottom: 5 }} />
                                <span>Click to upload or drag image here</span>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label><Store size={16} color="var(--color-primary)" /> Selected Pharmacy</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            value={selectedPharmacy ? `${selectedPharmacy.name} (${selectedPharmacy.distance || 0}km)` : "Select from list..."}
                            readOnly
                            style={{ paddingRight: 35, cursor: 'default' }}
                        />
                        <ChevronDown size={16} style={{ position: 'absolute', right: 15, top: 15, color: '#999', pointerEvents: 'none' }} />
                    </div>
                </div>

                <div className="form-group">
                    <label><Edit size={16} color="var(--color-primary)" /> Note</label>
                    <textarea
                        rows={3}
                        placeholder="Any special instructions for the pharmacist..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        style={{ height: 100 }}
                    />
                </div>

                <div className="billing-section">
                    <span className="section-label" style={{ marginBottom: 10, color: '#64748b' }}>Billing Breakdown (Estimated)</span>
                    {orderItems.map((item, index) => (
                        <div key={index} className="billing-row">
                            <span>{item.name}</span>
                            <span className="price">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="billing-row">
                        <span>Service Fee</span>
                        <span className="price">Rs. {serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="billing-row total">
                        <span>Total</span>
                        <span className="price">Rs. {total.toFixed(2)}</span>
                    </div>
                </div>

                <button type="submit" className="btn-reserve" disabled={!selectedPharmacy}>
                    Confirm Reservation
                </button>
            </form>
        </div>
    );
}

export default ReservationForm;

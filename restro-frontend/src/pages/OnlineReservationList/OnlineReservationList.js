import React, { useEffect, useState} from 'react';
import { Table, Typography, Spin, Alert } from 'antd';
import './OnlineReservationList.css';
import axios from 'axios';
import { client_url } from '../../utils/apiList';
const { Title } = Typography;
;
function formatDateTime(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleString(undefined, options);
}

const OnlineReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`${client_url}/get-all-reservations`);
        setReservations(response.data.data || []);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError('Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const columns = [
    { title: 'Display ID', dataIndex: 'displayId', key: 'displayId', align: 'center' },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName', align: 'center' },
    { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber', align: 'center' },
    { title: 'Number of People', dataIndex: 'numberOfPeople', key: 'numberOfPeople', align: 'center' },
    { title: 'Reservation Date/Time', dataIndex: 'reservationDateTime', key: 'reservationDateTime', align: 'center',
      render: (text) => formatDateTime(text)
    },
  ];

  return (
    <div className="online-reservation-list-container">
      <Title level={2} className="online-reservation-title">Online Reservations</Title>
      {loading && <div className="online-reservation-spin"><Spin size="large" /></div>}
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Table
        columns={columns}
        dataSource={reservations}
        rowKey={record => record._id || record.displayId}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        className="online-reservation-table"
        rowClassName={record => record.status === 'draft' ? 'draft-reservation-row' : ''}
      />
    </div>
  );
} 
export default OnlineReservationList;
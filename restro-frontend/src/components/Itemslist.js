import React, { useState } from 'react';
import { Input, List, Button, Row, Col } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import './Itemslist.css';
import { ItemListData } from '../utils/orderItems';

const ItemList = ({ data, handleAddToPayload, handleRemoveFromPayload }) => {

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };


  const filteredItems = ItemListData.filter((item) =>
   item.itemName.toLowerCase().includes(searchTerm) 
  );

  return (
    <div className="item-list-container">
      {/* Search Bar */}
      <Input
        className="search-bar"
        placeholder="Search by name"
        onChange={handleSearch}
      />

      {/* Item List */}
      <List
        bordered
        dataSource={filteredItems}
        renderItem={(item) => (
          <List.Item>
            <Row style={{ width: '100%' }}>
              <Col span={16}>
                <span className="item-name">{item.itemName}</span>
                <p style={{ margin: 0 }}>{item.category}</p>
                <p style={{ margin: 0, fontStyle: 'italic' }}>{item.price}</p>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                {data.find((p) => p.itemName === item.itemName) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => handleRemoveFromPayload(item)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="default"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddToPayload(item)}
                  >
                    Add
                  </Button>
                )}
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ItemList;
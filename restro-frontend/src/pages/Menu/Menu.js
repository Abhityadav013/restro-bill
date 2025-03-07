import React, { useEffect, useState } from "react";
import "./Menu.css";
import { Button, Table } from "antd";
// import { toast } from "react-toastify";
import axios from "axios";
import { base_url } from "../../utils/apiList";
import { MdAddChart } from "react-icons/md";
import Modal from "../../components/Modal";
import CreateItemForm from "../../components/CreateItemForm"; // Form component for menu items
import { toast } from "react-toastify";


const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const initialValues = {
    itemId: "",
    itemName: "",
    price: "",
    category: "",
  };
  // Fetch reservations data
  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/menu`);
      setMenu(response.data);
    } catch (error) {
      console.error("Error fetching menu", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu(); // Fetch data when the component mounts
  }, []); // Empty dependency array means this runs only on component mount

  // const handleBookingSubmit = async (payload) => {
  //   try {
  //     delete payload.hour;
  //     delete payload.minute;

  //     const response = await axios.post(`${base_url}/reservations`, {
  //       ...payload,
  //     });
  //     if (response?.status === 201) {
  //       toast.success("Order Booking created successfully!", {
  //         position: "top-right",
  //       });
  //       // Trigger re-fetch after successfully creating a booking
  //       fetchReservations();
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message, {
  //       position: "top-right",
  //     });
  //   } finally {
  //     setModalOpen(false); // Close the modal after submission
  //   }
  // };
  const handleFormSubmit = async (values) => {
    try {

      const getresponse = await axios.get(`${base_url}/menu`);
      const existingItem = getresponse.data.find((item) => item.itemId === values.itemId);

      if (existingItem) {
        toast.error(`Item ID ${values.itemId} already exists. Please use a unique ID.`, {
          position: "top-right",
        });
        return; // Exit the function if itemId is not unique
      }
      const payload = {
        menuItems: [values], // Backend expects an array of items
      };
      const response = await axios.post(`${base_url}/menu`, payload);
      if (response?.status === 201) {
        toast.success("Menu item created successfully!", {
          position: "top-right",
        });
        // Trigger re-fetch after successfully creating an item
        fetchMenu();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating menu item", {
        position: "top-right",
      });
    } finally {
      setModalOpen(false); // Close the modal after submission
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this item?");
      if (!confirmDelete) return;

      const response = await axios.delete(`${base_url}/menu/${itemId}`);
      if (response.status === 200) {
        toast.success("Menu item deleted successfully!", {
          position: "top-right",
        });
        fetchMenu();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting menu item", {
        position: "top-right",
      });
    }
  };
  
  const handleMenuItemUpdate = async (updatedItem) => {
    try {
      const response = await axios.put(`${base_url}/menu/${updatedItem.itemId}`, updatedItem);
      if (response?.status === 200) {
        toast.success("Menu item updated successfully!", {
          position: "top-right",
        });
        fetchMenu(); // Refresh the menu list
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating menu item", {
        position: "top-right",
      });
    } finally {
      setModalOpen(false);
      setSelectedItem(null);
    }
  };

  const menuColumns = [
    {
      title: "Item Id",
      dataIndex: "itemId",
      render: (_, record) => record.itemId,
    },
    { title: "Item Name", dataIndex: "itemName" },
    {
      title: "Price",
      dataIndex: "price",
      render: (_, record) => record.price + " €",
    },
    { title: "Category", dataIndex: "category" },
    {
      title: "Actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            onClick={() => handleEdit(record)}
            type="primary"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteItem(record.itemId)}
            danger
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  
  

  // const handleMenuItemSubmit = (payload) => {
  //   console.log('payload....',payload)
  //   setModalOpen(false)
  // };

  return (
    <div className="menu-container">
      <div className="create-menu-button">
        <Button icon={<MdAddChart />}
         onClick={() => setModalOpen(true)}
        block>
          Create Item
        </Button>
      </div>
      <Table
        columns={menuColumns}
        dataSource={menu} // Provide your data source here
        loading={loading}
        rowKey="itemId"
        scroll={{ x: "max-content" }}
        className="menu-table"
      />
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)} size="small">
          <CreateItemForm
            initialValues={initialValues}
            handleFormSubmit={handleFormSubmit}
          />
        </Modal>
      )} 
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)} size="small">
          <CreateItemForm
            initialValues={selectedItem || initialValues} // Pre-fill if editing
            handleFormSubmit={selectedItem ? handleMenuItemUpdate : handleFormSubmit}
          />
        </Modal>
      )}

    </div>
  );
};

export default Menu;

import React, { useState } from "react";
import "../App.css";
import axios from "axios";

const PostData = () => {
  const [pin, setPin] = useState();
  const [details, setDetails] = useState([]);
  const [filterData, setFilterData] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPin(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    if (pin.length !== 6) {
      alert("Pincode must be exactly 6 digits!");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pin}`
      );
      const data = response.data[0];
      console.log(data);
      if (data.Status === "Error") {
        setError(data.Message);
        setLoading(false);
        return;
      }
      if (!data.PostOffice || data.PostOffice.length === 0) {
        setError("No post office data found for the entered pin code.");
        setLoading(false);
        return;
      }
      const extractedData = data.PostOffice.map((postoffice) => ({
        Name: postoffice.Name,
        PinCode: postoffice.Pincode,
        State: postoffice.State,
        District: postoffice.District,
      }));
      setDetails(extractedData);
      setFilteredDetails(extractedData);
      setPin("");
      setShowDetails(true);
      setShowForm(false);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilterData(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    let result = details.filter((post) => {
      return post.Name.toLowerCase().includes(filterData.toLowerCase());
    });
    console.log(result);
    setFilteredDetails(result);
    setFilterData("");
  };

  return (
    <>
      <div className="container">
        {showForm && (
          <form onSubmit={handleSubmit} className="formCard">
            <input
              type="text"
              placeholder="enter pincode"
              value={pin}
              onChange={handleChange}
              // minLength={6}
              // maxLength={6}
              // pattern="[0-9]{6}"
            />
            <button className="btn">Lookup</button>
          </form>
        )}
        {loading && <div className="loader"></div>}
        {error && (
          <p style={{ color: "red" }}>{error}! Please enter a valid pincode</p>
        )}
        {showDetails && (
          <>
            <input
              placeholder="Filter postOffice by name"
              value={filterData}
              onChange={handleFilterChange}
            />
            <button type="submit" onClick={handleFilterSubmit} className="btn">
              Filter
            </button>
            <div className="displayDetails">
              {filteredDetails.map((post, index) => {
                return (
                  <div key={index} className="details">
                    <p>Name: {post.Name}</p>
                    <p>District: {post.District}</p>
                    <p>PinCode: {post.PinCode}</p>
                    <p>State: {post.State}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PostData;

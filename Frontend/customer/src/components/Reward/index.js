import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  TablePagination,
  IconButton,
} from "@mui/material";
import axios from "axios";
import styles from "./styles.module.css";
import Navbar from "../common/Navbar";
import {
  Search,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";

export const formatDate = (dateString) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

function Reward() {
  const [rewards, setRewards] = useState([]);
  const [searchCustomerId, setSearchCustomerId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState(null);

  useEffect(() => {
    const response = localStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${response}`,
      "Content-Type": "application/json",
    };

    axios
      .get("http://localhost:8080/rewards", { headers })
      .then((response) => {
        setRewards(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching reward data:", error);
        setError("Error fetching data. Please try again!");
      });
  }, []);

  const handleSearch = (e) => {
    setSearchCustomerId(e.target.value);
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedRewards = [...rewards].sort((a, b) => {
      const dateA = new Date(a.rewardsDate);
      const dateB = new Date(b.rewardsDate);

      if (newSortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setRewards(sortedRewards);
  };

  const filteredRewards = rewards.filter((reward) =>
    reward.customerId.includes(searchCustomerId)
  );

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - filteredRewards.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getVisibleRewards = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    let filteredAndSortedRewards = [...rewards];

    if (searchCustomerId) {
      filteredAndSortedRewards = filteredAndSortedRewards.filter((reward) =>
        reward.customerId.includes(searchCustomerId)
      );
    } else {
      filteredAndSortedRewards = filteredAndSortedRewards.sort((a, b) => {
        const dateA = new Date(a.rewardsDate);
        const dateB = new Date(b.rewardsDate);

        if (sortOrder === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }

    return filteredAndSortedRewards.slice(startIndex, endIndex);
  };

  return (
    <>
      <Navbar />
      <div className={styles.headerpart}>
        <h3 className={styles.heading}>
          <b>REWARDS INFORMATION</b>
        </h3>
        <div className={styles.search}>
          <label className={styles.label}>Search for a Customer : </label>
          <TextField
            label="Search Customer ID"
            size="small"
            variant="outlined"
            value={searchCustomerId}
            onChange={handleSearch}
            style={{ maxWidth: "250px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <TableContainer component={Paper} className={styles.container}>
        <Table>
          <TableHead style={{ backgroundColor: "#CFE2F3" }}>
            <TableRow>
              <TableCell className={styles.rowheader}>
                <b>Reward ID</b>
              </TableCell>
              <TableCell className={styles.rowheader}>
                <b>Customer Id</b>
              </TableCell>
              <TableCell className={styles.rowheader}>
                <b>Order No</b>
              </TableCell>
              <TableCell
                className={styles.rowheader}
                style={{ textAlign: "left" }}
              >
                <b>Rewards Earned</b>
              </TableCell>
              <TableCell
                className={styles.rowheader}
                style={{ textAlign: "left" }}
              >
                <b>Rewards Redeemed</b>
              </TableCell>
              <TableCell className={styles.rowheader}>
                <b>Date</b>
                <IconButton
                  onClick={handleSort}
                  color="inherit"
                  size="small"
                  aria-label="sort"
                >
                  {sortOrder === "asc" ? (
                    <ArrowUpwardIcon />
                  ) : (
                    <ArrowDownwardIcon />
                  )}
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getVisibleRewards().map((reward) => (
              <TableRow key={reward.rewardsId} className={styles.tableRow}>
                <TableCell>{reward.rewardsId}</TableCell>
                <TableCell>{reward.customerId}</TableCell>
                <TableCell>{reward.orderNo}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {reward.rewardsEarned}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {reward.rewardsRedeemed}
                </TableCell>
                <TableCell>{formatDate(reward.rewardsDate)}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        {error && (
          <h4 style={{ display: "flex", justifyContent: "center" }}>{error}</h4>
        )}
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[
          5,
          10,
          25,
          50,
          { label: "All", value: filteredRewards.length },
        ]}
        component="div"
        count={filteredRewards.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default Reward;

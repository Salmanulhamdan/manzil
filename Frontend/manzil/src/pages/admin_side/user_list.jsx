import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl, blockuser } from '../../utilits/constants';
import { Link } from 'react-router-dom'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from "sweetalert2";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Switch
} from "@material-tailwind/react";



const UserList = ({ users }) => {

  const [trigger, setTrigger] = useState(false)

  const token = localStorage.getItem('jwtTokenAdmin');
  console.log(token)

  // Include the token in the Authorization header
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const handleBlockUser = async (id) => {
    console.log(id, "kkk");
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `${baseUrl}${blockuser}/${id}/`;
        // Send data to indicate the change in is_active status
        const data = {
          is_active: !users.is_active,
        };
        // Update user status using fetch or axios
        axios
          .patch(url, data, config)
          .then((res) => {
            console.log("success");
            setTrigger(true)

            // Handle response if needed
            console.log(responseData);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  };


  const [selectedTab, setSelectedTab] = useState('all');
  const TABS = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Professionals",
      value: "professional",
    },
    {
      label: "Houseowners",
      value: "houseowner",
    },

  ];

  const handleTabChange = (newValue) => {
    console.log(newValue, "valuelllleee");
    setSelectedTab(newValue);
  };
  useEffect(() => {
    // This code will run whenever selectedTab changes
    console.log('Selected tab changed:', selectedTab);
  }, [selectedTab, trigger]);
  const professionals = users.filter(user => user.usertype === 'professional');
  const houseowners = users.filter(user => user.usertype === 'houseowner');

  const TABLE_ROWS = selectedTab === 'professional'
    ? professionals
    : selectedTab === 'houseowner'
      ? houseowners
      : users;

  const TABLE_HEAD = selectedTab === 'professional'
    ? ["Member", "Profession", "Phone", "Status", "Upgrade Status"]
    : selectedTab === 'houseowner'
      ? ["Member", "Profession", "Phone", "Status", "Upgrade Status"]
      : ["Member", "Profession", "Phone", "Status", "Upgrade Status"];
  return (
    <Card className="col-span-5">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Members list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all members
            </Typography>
          </div>
          {/* <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm">
              view all
            </Button>
            <Button className="flex items-center gap-3" size="sm">
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
            </Button>
          </div> */}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs className="w-full md:w-max">
            <TabsHeader>

              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value} onClick={() => handleTabChange(value)}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          {/* <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div> */}
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(
              (user, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={user.email}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar src={baseUrl + user.profile_photo} size="sm" className='w-10' variant="circular" />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            <Link
                              to={`/admin/admin_user/${user.email}`} >
                              {user.username}
                            </Link>
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            {user.email}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user.professional_profile ? user.professional_profile.profession : "HouseOwner"}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          {user.place}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          {user.phonenumber}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={user.is_active ? "online" : "offline"}
                          color={user.is_active ? 'green' : 'blue-gray'}
                        />
                      </div>
                    </td>
                    <td className={classes}>


                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={user.is_upgraded ? "Upgraded" : "Not Upgraded"}
                          color={user.is_upgraded ? 'green' : 'blue-gray'}
                        />
                      </div>


                    </td>
                 
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 of 10
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
export default UserList;

import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layout/MetaData';
import AdminLayout from '../layout/AdminLayout';
import { useDeleteOrderMutation, useGetAdminOrdersQuery } from '../../redux/api/orderApi';
import { useDeleteUserMutation, useGetAdminUsersQuery } from '../../redux/api/userApi';

const ListUsers = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetAdminUsersQuery();

    const [deleteUser, { error: deleteError, isLoading: isDeleteLoading, isSuccess }] = useDeleteUserMutation();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message);
        }

        if (deleteError) {
            toast.error(deleteError?.data?.message);
        }

        if (isSuccess) {
            toast.success("User Deleted Successfully");
            navigate("/admin/orders");
        }


    }, [error]);

    const deleteUserHandler = (id) => {
        deleteUser(id)
    }

    // useMemo prevents the table from regenerating on every tiny render
    const setUsers = useMemo(() => {
        const users = {
            columns: [
                { label: "ID", field: "id", sort: "asc" },
                { label: "Name", field: "name", sort: "asc" },
                { label: "Email", field: "email", sort: "asc" },
                { label: "Role", field: "role", sort: "asc" },
                { label: "Actions", field: "actions", sort: "asc" },
            ],
            rows: [],
        };

        data?.users?.forEach((user) => {
            users.rows.push({
                id: user?._id,
                name: user?.name,
                email: user?.email,
                role: user?.role,
                actions: (
                    <>
                        <Link to={`/admin/users/${user?._id}`} className="btn btn-outline-primary">
                            <i className="fa fa-pencil"></i>
                        </Link>

                        <button className="btn btn-outline-danger ms-2"
                         onClick={() => deleteUserHandler(user?._id)} 
                         disabled={isDeleteLoading}
                        >
                            <i className="fa fa-trash"></i>
                        </button>
                    </>
                ),
            });
        });

        return users;
    }, [data]);

    if (isLoading) return <Loader />;

    return (
        <AdminLayout>
            <MetaData title={'All Users'} />

            <h1 className="my-5">{data?.users?.length || 0} Users</h1>

            <MDBDataTable
                data={setUsers}
                className='px-3'
                bordered
                striped
                hover
            />
        </AdminLayout>
    );
};

export default ListUsers;
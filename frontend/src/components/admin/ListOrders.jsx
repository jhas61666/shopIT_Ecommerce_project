import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layout/MetaData';
import AdminLayout from '../layout/AdminLayout';
import { useGetAdminOrdersQuery } from '../../redux/api/orderApi';

const ListOrders = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetAdminOrdersQuery();



    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message);
        }

        // if (deleteError) {
        //     toast.error(deleteError?.data?.message);
        // }

        // if (isSuccess) {
        //     toast.success("Product Deleted Successfully");
        //     navigate("/admin/products");
        // }


    }, [error]);

    // const deleteProductHandler = (id) => {
    //     deleteProduct(id)
    // }

    // useMemo prevents the table from regenerating on every tiny render
    const setOrders = useMemo(() => {
        const orders = {
            columns: [
                { label: "ID", field: "id", sort: "asc" },
                { label: "Payment Status", field: "paymentStatus", sort: "asc" },
                { label: "Order Status", field: "orderStatus", sort: "asc" },
                { label: "Actions", field: "actions", sort: "asc" },
            ],
            rows: [],
        };

        data?.orders?.forEach((order) => {
            orders.rows.push({
                id: order?._id,
                paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
                orderStatus: order?.orderStatus,
                actions: (
                    <>
                        <Link to={`/admin/products/${order?._id}`} className="btn btn-outline-primary">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        
                        <button className="btn btn-outline-danger ms-2"
                        //  onClick={() => deleteProductHandler(product?._id)} 
                        //  disabled={isDeleteLoading}
                        >
                            <i className="fa fa-trash"></i>
                        </button>
                    </>
                ),
            });
        });

        return orders;
    }, [data]);

    if (isLoading) return <Loader />;

    return (
        <AdminLayout>
            <MetaData title={'All Orders'} />

            <h1 className="my-5">{data?.orders?.length || 0} Orders</h1>

            <MDBDataTable
                data={setOrders}
                className='px-3'
                bordered
                striped
                hover
            />
        </AdminLayout>
    );
};

export default ListOrders;